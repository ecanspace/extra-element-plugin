// const { merge } = require('webpack-merge')
// const webpackBaseConfig = require('./webpack.base.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('./config')

// const proxyConfig = require('../example/config/proxy')
const isProd = process.env.NODE_ENV === 'production'
const publicPath = isProd ? 'https://element-pro.github.io/' : '/'
const filename = isProd ? 'js/[name].[chunkhash:7].js' : '[name].js'

const webpackExample = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, '../example'),
  entry: {
    app: './main.js',
  },
  output: {
    path: path.resolve(process.cwd(), './example/dist'),
    publicPath: publicPath,
    filename: filename,
    chunkFilename: filename,
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.md$/,
      use: [{
        loader: 'vue-loader',
      }, {
        loader: path.resolve(__dirname, './markdown-vue-loader/index.js')
      }]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.css$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
      ],
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: isProd ? 'imgs/[name].[chunkhash:7].[ext]' : '[name].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: isProd ? 'font/[name].[ext]' : '[name].[ext]'
      }
    }]
  },
  devServer: {
    clientLogLevel: 'warning',
    host: 'localhost',
    port: 8080,
    historyApiFallback: true,
    hot: true,
    contentBase: path.resolve(process.cwd(), './example', 'static'),
    compress: true,
    quiet: true, // necessary for FriendlyErrorsPlugin
    publicPath: '/',
    // proxy: proxyConfig,
    watchOptions: {
      poll: true,
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      ...config.alias,
      '@': path.resolve(__dirname, '../example'),
    }
  },
  stats: {
    children: false
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        commons: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./${isProd ? 'index.prod' : 'index'}.html`,
      filename: './index.html',
    }),
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ]
}

if (isProd) {
  const plugins = webpackExample.plugins
  Array.prototype.push.apply(plugins, [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:7].css',
    }),
    new CopyWebpackPlugin([{ from: 'static/vendor', to: 'vendor' }]),
  ])

  webpackExample.externals = {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'highlight.js': 'hljs',
  }

  webpackExample.devtool = false
}

module.exports = webpackExample