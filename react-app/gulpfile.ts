import gulp from 'gulp'
import webpack from 'webpack-stream'
import webpackConfig from './webpack.config'
import { Configuration } from 'webpack'

const watchWithWebpack = () => {
  const configWithType = webpackConfig as Configuration
  return gulp
    .src('./src/index.tsx')
    .pipe(webpack({ watch: true, ...configWithType }))
}

export const watch = watchWithWebpack
