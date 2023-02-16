const {
  merge
} = require('webpack-merge')
const webpackBase = require('./webpack.base')

module.exports = merge(webpackBase, {
  entry: {
    index: './src/index.js',
  },
  output: {
    library: 'ElementPro',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
})