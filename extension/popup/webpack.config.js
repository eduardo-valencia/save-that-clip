/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const commonConfig = require("../main/common/common-webpack-config");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, NODE_ENV } = process.env;

const getSentryPlugin = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return sentryWebpackPlugin({
    org: SENTRY_ORG,
    project: SENTRY_PROJECT,
    authToken: SENTRY_AUTH_TOKEN,
  });
};

const getPlugins = () => {
  if (NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [getSentryPlugin()];
  }
  return [];
};

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
  devtool: "source-map",
  plugins: getPlugins(),
};
