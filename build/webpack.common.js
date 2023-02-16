const {
  merge
} = require('webpack-merge')
const webpackBase = require('./webpack.base')
const config = require('./config')

module.exports = merge(webpackBase, {
  entry: {
    'element-pro.common': './src/index.js',
  },
  output: {
    library: 'ElementPro',
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: false
  },
  externals: config.externals,
})