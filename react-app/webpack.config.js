const path = require('path')

const extensionFolder = path.resolve(__dirname, '..', 'extension')

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { compilerOptions: { noEmit: false } },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: extensionFolder,
    filename: 'popup-script.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
}
