const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
// To generate a manifest file
const WebpackPwaManifest = require('webpack-pwa-manifest');
// To create service workers and notifications and so on
const WorkboxPlugin = require('workbox-webpack-plugin');
const loaders = require('./webpack.loaders');
// const { CheckerPlugin } = require('awesome-typescript-loader')

const apiTokens = require('./api_keys.json');
const alias = require('./alias');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000';

module.exports = {
  entry: [
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    // 'babel-polyfill',
    './src/index.jsx' // your app's entry point
  ],
  // TODO: change for production
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    pathinfo: false,
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias
  },
  module: {
    rules: loaders
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './public',
    overlay: true,
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    disableHostCheck: true,
    https: false,
    progress: true

    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers':
    //     'X-Requested-With, content-type, Authorization'
    // }
    // proxy: {
    //   '**': {
    //     target: 'http://localhost:8000/',
    //     secure: false
    //   }
    // }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new webpack.EnvironmentPlugin(apiTokens),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
      // 'process.env.BABEL_ENV': JSON.stringify('development')
    }),
    new ErrorOverlayPlugin(),
    new WebpackPwaManifest({
      short_name: 'Tickle',
      name: 'Tickle',
      start_url: '.',
      display: 'standalone',
      gcm_sender_id: '103953800507',
      inject: true,
      icons: [
        {
          src: path.resolve('src/styles/tickle.png'),
          sizes: [36, 48, 72, 96, 144, 192, 512],
          destination: path.join('icons', 'android')
        },
        {
          src: path.resolve('src/styles/tickle.png'),
          size: 144
        }
      ],
      scope: '.',
      background_color: '#231F20',
      theme_color: '#231F20'
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: path.join('src', 'firebase-messaging-sw.js'),
      globPatterns: ['dist/*.{js,png,html,css}']
    })
  ]
};
