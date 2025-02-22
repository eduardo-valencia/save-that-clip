/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");

dotenv.config();

console.log("NODE_ENV", process.env.NODE_ENV);

const env = process.env.NODE_ENV || "development";

module.exports = {
  mode: env,
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
  resolve: {
    extensions: [".ts"],
  },
  optimization: {
    minimize: env === "production",
  },
};
