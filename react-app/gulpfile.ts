import gulp from 'gulp'
import webpack from 'webpack-stream'
import open from 'open'
import { Configuration } from 'webpack'

import webpackConfig from './webpack.config'

/**
 * Must install
 * https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
 * for this to work.
 */
const reloadExtension = () => {
  open('http://reload.extensions')
}

/**
 * We separate this from the other watcher because it helps with performance.
 */
const watchWithWebpack = (): NodeJS.ReadWriteStream => {
  const configWithType = webpackConfig as Configuration
  return gulp
    .src('./src/index.tsx')
    .pipe(
      webpack({ watch: true, ...configWithType }, undefined, reloadExtension)
    )
    .pipe(gulp.dest('../extension'))
}

export const watch = watchWithWebpack
