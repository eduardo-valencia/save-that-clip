/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const buildFolder = path.resolve(__dirname, "../build");

module.exports = {
  entry: "./popup/src/index.tsx",
  mode: process.env.NODE_ENV || "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: { compilerOptions: { noEmit: false } },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: buildFolder,
    filename: "popup-script.js",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
};
