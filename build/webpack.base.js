const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('./config')

module.exports = {
  mode: 'production',
  entry: {},
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    }]
  },
  resolve: {
    alias: config.alias,
    extensions: ['.js', '.json', '.vue'],
    modules: ['node_modules'],
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
  ],
  externals: {
    vue: 'vue',
  },
  stats: {
    children: false
  },
}