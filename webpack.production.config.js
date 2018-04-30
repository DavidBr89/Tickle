const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const apiTokens = require('./api_keys.json');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// TODO: exclude css
loaders.push(
  {
    // global css
    test: /\.css$/,
    include: /[/\\]node_modules[/\\]/,
    // include: /[\/\\](globalStyles)[\/\\]/,
    loaders: ['style-loader?sourceMap', 'css-loader']
  },
  // // global scss
  // {
  //   test: /\variables.scss$/,
  //   exclude: /[/\\]components[/\\]/,
  //   // include: /[/\\](styles/variables.scss)[/\\]/,
  //   loaders: ['sass-variable-loader']
  // },
  // global scss
  {
    test: /\.scss$/,
    exclude: /[/\\]components[/\\]/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.resolve(__dirname, 'node_modules/bootstrap')]
        }
      }
    ]
  },
  // local scss modules
  {
    test: /\.scss$/,
    include: /[/\\](components)[/\\]/,
    exclude: /[/\\](node_modules)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader'
    ]
  }
  // TODO: production
  // {
  //   test: /\.scss$/,
  //   include: /[/\\](components)[/\\]/,
  //   exclude: /[/\\](global)[/\\]/,
  //   loaders: [
  //     'style-loader?sourceMap',
  //     'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
  //     'postcss-loader',
  //     'sass-loader'
  //   ]
  // },
  // local scss modules
  // {
  //   test: /\.css$/,
  //   include: /[/\\](components)[/\\]/,
  //   loaders: [
  //     'style-loader?sourceMap',
  //     'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
  //     'postcss-loader'
  //   ]
  // },
  // {
  //   test: /bootstrap\/dist\/js\/umd\//,
  //   loader: 'imports-loader?jQuery=jquery'
  // }
);

// local css modules
// loaders.push({
//   test: /\.css$/,
//   exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
//   loaders: [
//     'style?sourceMap',
//     'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
//   ]
// });

module.exports = {
  entry: [
    './src/index.jsx' // your app's entry point
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // 'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      src$: './src',
      DummyData: path.resolve(__dirname, './src/DummyData.js'),
      Cards: path.resolve(__dirname, 'src/components/cards'),
      DB: path.resolve(__dirname, 'src/db/firestore.js')
    }
  },
  module: {
    rules: loaders
  },
  plugins: [
    new CleanWebpackPlugin(['public/*.*']),
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.EnvironmentPlugin(apiTokens)
  ]
};
