/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const commonConfig = require("../main/common/common-webpack-config");

const buildFolder = path.resolve(__dirname, "../build");

module.exports = {
  ...commonConfig,
  entry: "./popup/src/index.tsx",
  output: {
    path: buildFolder,
    filename: "popup-script.js",
  },
  resolve: {
    extensions: [...commonConfig.resolve.extensions, ".js", ".tsx"],
  },
};
