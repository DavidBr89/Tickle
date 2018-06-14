const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const apiTokens = require('./api_keys.json');
const alias = require('./alias');

module.exports = {
  entry: [
    './src/index.jsx' // your app's entry point
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias
  },
  module: {
    rules: loaders
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*.*']),
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.EnvironmentPlugin(apiTokens)
  ]
};
