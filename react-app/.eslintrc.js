module.exports = {
  root: true,
  overrides: [
    {
      extends: ["./.eslintrc.mainTsconfig.js"],
      files: [
        "src/**/*.tsx",
        "gulpfile.ts",
        "jest.config.ts",
        "webpack.config.js",
        ".eslintrc.mainTsconfig.js",
      ],
    },
  ],
};
