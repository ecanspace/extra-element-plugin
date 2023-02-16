const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    theme: './packages/theme/index.css'
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'theme/index.css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }],
      },
      canPrint: true
    })
  ],
  stats: {
    children: false
  },
}