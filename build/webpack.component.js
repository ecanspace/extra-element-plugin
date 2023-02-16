const {
  merge
} = require('webpack-merge')
const glob = require('glob')
const webpackBase = require('./webpack.base')
const config = require('./config')

function getEntries() {
  const files = glob.sync('packages/!(theme)/index.js')
  return files.reduce((entries, file) => {
    const componentName = file.match(/packages[\/]+([^\/]+)/)[1]
    entries[componentName] = './' + file
    return entries
  }, {})
}

module.exports = merge(webpackBase, {
  entry: getEntries(),
  optimization: {
    minimize: false
  },
  externals: config.externals,
})