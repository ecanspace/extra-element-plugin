const path = require('path')
const glob = require('glob')
const nodeExternals = require('webpack-node-externals')
const ALIAS_NAME = 'element-pro'
const NPM_PACKAGE_NAME = 'tzcloud-element-pro'
const externals = {
  vue: 'vue',
}

function componentExternals() {
  const files = glob.sync('packages/!(theme)/index.js')
  files.forEach((file) => {
    const dirname = path.dirname(file)
    externals[ALIAS_NAME + '/' + dirname] = NPM_PACKAGE_NAME + '/' + dirname.replace(/packages/, 'lib')
  })
}

function utilsExternals() {
  const files = glob.sync('src/**/*.js', {
    ignore: ['src/index.js'],
  })
  files.forEach((file) => {
    externals[ALIAS_NAME + '/' + file] = NPM_PACKAGE_NAME + '/' + file.replace(/src/, 'lib')
  })
}

componentExternals()
utilsExternals()

exports.alias = {
  'element-pro': path.resolve(__dirname, '../'),
}

exports.externals = [externals, nodeExternals()]