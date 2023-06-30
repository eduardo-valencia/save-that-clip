import gulp, { parallel } from "gulp";
import webpack from "webpack-stream";
import open from "open";
import { Configuration } from "webpack";
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

// todo: Create a watcher that can also build the entire extension. This makes
// development easier when we modify the extension's source code.
const buildPopupFromConfig = (
  config: Configuration = {},
  buildCallback?: () => unknown
): ReadWriteStream => {
  const configWithType = webpackConfig as Configuration;
  return gulp
    .src("./popup/src/index.tsx")
    .pipe(webpack({ ...configWithType, ...config }, undefined, buildCallback))
    .pipe(gulp.dest(buildFolder));
};

/**
 * We separate this from the other watcher because it helps with performance.
 */
export const watchPopup = (): ReadWriteStream => {
  return buildPopupFromConfig({ watch: true }, reloadExtension);
};

/**
 * Main build
 */
const buildPopup = (): ReadWriteStream => {
  return buildPopupFromConfig();
};

const buildContentScript = (): ReadWriteStream => {
  const configWithType = commonWebpackConfig as Configuration;
  return gulp
    .src(`./${mainFolder}/content-script.ts`)
    .pipe(
      webpack({ ...configWithType, output: { filename: "content-script.js" } })
    )
    .pipe(gulp.dest(buildFolder));
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
