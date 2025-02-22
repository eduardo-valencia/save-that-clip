import gulp, { parallel } from "gulp";
import webpack from "webpack-stream";
import open from "open";
import { Configuration as Config } from "webpack";
import { ChildProcess } from "child_process";
import path from "path";
import { FSWatcher } from "fs";

import popupWebpackConfig from "../popup/webpack.config";
import commonWebpackConfig from "./common/common-webpack-config";

const buildFolder = "build";
const mainFolder = "main";

/**
 * Must install
 * https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
 * for this to work.
 *
 * Note that this func shouldn't be debounced because there is only a high risk
 * of this being called frequently the first time we run the dev cmd. So,
 * debouncing likely won't help us prevent excessive calls after the watcher
 * already started. If you want to prevent this being called multiple times at
 * startup, find another way. Otherwise, it will slow down the watcher.
 */
const reloadExtension = (): Promise<ChildProcess> => {
  console.info("Extension reloaded.");
  return open("http://reload.extensions");
};

const beginReloadingExtension = async (): Promise<void> => {
  console.info("Reloading extension...");
  await reloadExtension();
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

/**
 * * Popups
 */

const buildPopupFromConfig = getWebpackBuilder("./popup/src/index.tsx");

/**
 * We separate this from the other watcher because it helps with performance.
 */
export const buildAndWatchPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({
    config: { ...(popupWebpackConfig as Config), watch: true },
    buildCallback: beginReloadingExtension,
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
    /**
     * We must disable devtool. Otherwise, we'll get an error when we load the
     * content script.
     */
    devtool: false,
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

const buildAndWatchContentScript = (): ReadWriteStream => {
  return buildContentScriptFromConfig({
    config: createContentScriptWebpackConfig({ watch: true }),
    buildCallback: beginReloadingExtension,
  });
};

/**
 * * Other extension main files
 */
type Glob = string;
type Globs = Glob[];

const createMainFilePath = (relativeGlob: Glob): Glob => {
  return path.join(mainFolder, relativeGlob);
};

const getMainFilesToCopy = (): Globs => {
  const relativeGlobs: Globs = [
    "background.js",
    "manifest.json",
    "popup.html",
    "icons/*",
  ];
  return relativeGlobs.map(createMainFilePath);
};

const copyOtherMainFiles = (): ReadWriteStream => {
  const filesToCopy: Globs = getMainFilesToCopy();
  return gulp
    .src(filesToCopy, { base: mainFolder })
    .pipe(gulp.dest(buildFolder));
};

const copyFilesAndReload = gulp.series(
  copyOtherMainFiles,
  beginReloadingExtension
);

const watchOtherMainFiles = (): FSWatcher => {
  const filesToCopy: Globs = getMainFilesToCopy();
  return gulp.watch(filesToCopy, copyFilesAndReload);
};

/**
 * We are legally required to do this.
 */
const copyLicense = (): ReadWriteStream => {
  return gulp.src("./docs/used-licenses.md").pipe(gulp.dest(buildFolder));
};

/**
 * * Other
 */
/**
 * Note that if we decide to set the NODE_ENV here programmatically, we should
 * ensure it will never accidentally apply to other Gulp tasks.
 */
export const build = parallel(
  buildPopup,
  buildContentScript,
  copyOtherMainFiles,
  copyLicense
);

export const dev = parallel(
  buildAndWatchContentScript,
  buildAndWatchPopup,
  copyFilesAndReload,
  watchOtherMainFiles
);
