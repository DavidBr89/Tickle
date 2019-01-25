const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// console.log('path', path);
// console.log('path', path.join(__dirname, 'node_modules/font-awesome'));
// const replace = path.join(__dirname, 'node_modules/font-awesome');
const src = path.join(__dirname, 'src');
const p = `(node_modules/font-awesome|${src})`;
// const po = p.replace(/xxx/, replace);
const re = new RegExp(p);
// console.log('po', re);

module.exports = [
  // {
  //   test: /\.css$/,
  //   use: [
  //     { loader: 'css-loader', options: { importLoaders: 1 } },
  //     'postcss-loader'
  //   ]
  // },
  {
    // node modules css
    test: /\.css$/,
    include: /[/\\]node_modules[/\\]/,
    // exclude: /(node_modules|bower_components|public)/,
    // include: /[\/\\](globalStyles)[\/\\]/,
    loaders: ['style-loader', 'css-loader']
  },
  {
    // global css
    test: /\.css$/,
    exclude: /(node_modules|bower_components|public)/,
    // include: /[\/\\](globalStyles)[\/\\]/,
    loaders: ['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.scss$/,
    exclude: /[/\\]components[/\\]/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  },
  {
    test: /\.scss$/,
    include: /[/\\](components)[/\\]/,
    exclude: /[/\\](node_modules)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader?modules&importLoaders=true&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader'
    ]
  },
  {
    // enforce: 'pre',
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components|public)/
  },
  {
    test: /\.jsx$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components|public)/
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    // exclude: /(node_modules|bower_components)/,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'file-loader'
  },
  {
    test: /\.(woff|woff2)$/,
    // exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'url-loader?prefix=font/&limit=5000'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    // exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    // exclude: /(node_modules|bower_components)/,
    // include: re,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
  },
  {
    test: /\.gif/,
    exclude: /(node_modules|bower_components)/,
    // include: `${path.dirname()}/node_modules/font-awesome`,
    include: path.join(__dirname, 'node_modules/font-awesome'),
    loader: 'url-loader?limit=10000&mimetype=image/gif'
  },
  {
    test: /\.jpg/,
    exclude: /(node_modules|bower_components)/,
    loader: 'url-loader?limit=10000&mimetype=image/jpg'
  },
  {
    test: /\.png/,
    exclude: /(node_modules|bower_components)/,
    loader: 'url-loader?limit=10000&mimetype=image/png'
  },
  {
    test: /\.csv/,
    exclude: /(node_modules|bower_components)/,
    loader: 'dsv-loader'
  }
];
