const { merge } = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    // open: true,
    // contentBase: path.join(__dirname, './dist'),
    // historyApiFallback: true, //不跳转
    hot: true, // 开启热更新,
    port: 8000
  }
})
