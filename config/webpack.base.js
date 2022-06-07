
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { setEntry, setHtmlPlugin } = require('./webpack.util')
const path = require('path')
const srcRoot = path.resolve(__dirname, 'src');
module.exports = {
  entry: setEntry,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          'resolve-url-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: 'url-loader?limit=8192&name=./images/[name].[hash].[ext]'
      }
    ]
  },
  plugins: [
    ...setHtmlPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]/index.css',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ],
  resolve: {
    alias: {
      component: path.resolve(srcRoot, 'component'),
      '@': path.resolve('src'),
    },
    extensions: ['.js', '.jsx', '.json']
  }
}
