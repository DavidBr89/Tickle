const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const loaders = require('./webpack.loaders');

const apiTokens = require('./api_keys.json');
const alias = require('./alias');

module.exports = {
  entry: [
    // TODO
    // TODO
    // TODO
    // 'babel-polyfill',
    './src/index.jsx', // your app's entry point
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', 'tsx'],
    alias,
  },
  module: {
    rules: loaders,
  },
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       cache: false,
  //       parallel: true,
  //       uglifyOptions: {
  //         compress: false,
  //         ecma: 6,
  //         mangle: {safari10: true},
  //       },
  //       sourceMap: false,
  //     }),
  //   ],
  // },
  plugins: [
    new CleanWebpackPlugin(['dist/*.*']),

    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.EnvironmentPlugin(apiTokens),
  ],
};
