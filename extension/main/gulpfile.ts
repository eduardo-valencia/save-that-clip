import gulp, { parallel } from "gulp";
import webpack from "webpack-stream";
import open from "open";
import { Configuration as Config } from "webpack";
import { ChildProcess } from "child_process";
import path from "path";

import popupWebpackConfig from "../popup/webpack.config";
import commonWebpackConfig from "./common/common-webpack-config";
import { FSWatcher } from "fs";

const buildFolder = "build";
const mainFolder = "main";

/**
 * * Popups
 */

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

const buildPopupFromConfig = getWebpackBuilder("./popup/src/index.tsx");

/**
 * We separate this from the other watcher because it helps with performance.
 */
export const watchPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({
    config: { ...(popupWebpackConfig as Config), watch: true },
    buildCallback: reloadExtension,
  });
};

const buildPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({ config: popupWebpackConfig as Config });
};

/**
 * * Content scripts
 */

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

const buildContentScript = (): ReadWriteStream => {
  const fullConfig: Config = createContentScriptWebpackConfig();
  return buildContentScriptFromConfig({ config: fullConfig });
};

const watchContentScript = (): ReadWriteStream => {
  return buildContentScriptFromConfig({
    config: createContentScriptWebpackConfig({ watch: true }),
    buildCallback: reloadExtension,
  });
};

/**
 * * Other extension main files
 */
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

const copyFilesAndReload = gulp.series(copyOtherMainFiles, reloadExtension);

const watchOtherMainFiles = (): FSWatcher => {
  const filesToCopy: Paths = getMainFilesToCopy();
  return gulp.watch(filesToCopy, copyFilesAndReload);
};

/**
 * * Other
 */
export const build = parallel(
  buildPopup,
  buildContentScript,
  copyOtherMainFiles
);

export const watch = parallel(
  watchContentScript,
  watchPopup,
  watchOtherMainFiles
);
