const path = require('path')

const extensionFolder = path.resolve(__dirname, '..', 'extension')

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
    exclude: /node_modules/,
  },
  output: {
    path: extensionFolder,
    filename: 'content-script.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
}
