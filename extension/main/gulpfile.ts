import gulp, { parallel } from "gulp";
import webpack from "webpack-stream";
import open from "open";
import { Configuration as Config } from "webpack";
import { ChildProcess } from "child_process";
import path from "path";

import webpackConfig from "../popup/webpack.config";
import commonWebpackConfig from "./common/common-webpack-config";

const buildFolder = "build";
const mainFolder = "main";

/**
 * Must install
 * https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
 * for this to work.
 */
const reloadExtension = (): Promise<ChildProcess> => {
  return open("http://reload.extensions");
};

type ReadWriteStream = NodeJS.ReadWriteStream;

interface FieldsToBuildPopup {
  config: Config;
  buildCallback?: () => unknown;
}

const getWebpackBuilder = (src: string) => {
  return ({ config, buildCallback }: FieldsToBuildPopup): ReadWriteStream => {
    return gulp
      .src(src)
      .pipe(webpack(config, undefined, buildCallback))
      .pipe(gulp.dest(buildFolder));
  };
};

// todo: Create a watcher that can also build the entire extension. This makes
// development easier when we modify the extension's source code.
// We can set up 2 watchers: one for popup and another for main files.
// The watcher for the main files will build the app almost exactly like the one
// for the popup does.
// We will reload the extension when either webpack instance is done building
const buildPopupFromConfig = getWebpackBuilder("./popup/src/index.tsx");

/**
 * We separate this from the other watcher because it helps with performance.
 */
export const watchPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({
    config: { watch: true },
    buildCallback: reloadExtension,
  });
};

/**
 * Main build
 */
const buildPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({ config: webpackConfig as Config });
};

const createContentScriptWebpackConfig = (
  extraFields: Partial<Config> = {}
): Config => {
  const configWithType = commonWebpackConfig as Config;
  return {
    ...configWithType,
    output: { filename: "content-script.js" },
    ...extraFields,
  };
};

const buildContentScriptFromConfig = getWebpackBuilder(
  `./${mainFolder}/content-script.ts`
);

const buildContentScript = ({
  config,
  buildCallback,
}: Partial<FieldsToBuildPopup> = {}): ReadWriteStream => {
  const fullConfig: Config = createContentScriptWebpackConfig(config);
  return buildContentScriptFromConfig({ config: fullConfig, buildCallback });
};

type Path = string;
type Paths = Path[];

const createMainFilePath = (relativePath: Path): Path => {
  return path.join(mainFolder, relativePath);
};

const getMainFilesToCopy = (): Paths => {
  const relativePaths: Paths = ["background.js", "manifest.json", "popup.html"];
  return relativePaths.map(createMainFilePath);
};

const copyOtherMainFiles = (): ReadWriteStream => {
  const filesToCopy: Paths = getMainFilesToCopy();
  return gulp
    .src(filesToCopy, { base: mainFolder })
    .pipe(gulp.dest(buildFolder));
};

export const build = parallel(
  buildPopup,
  buildContentScript,
  copyOtherMainFiles
);
