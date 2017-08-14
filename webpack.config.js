const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'client/source');

const config = {
  entry: ['babel-polyfill', `${APP_DIR}/index.jsx`],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },

  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index-template.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['*', '.js', '.jsx', '.json'],
  },

  // Following section is needed to parse Cloudant package with webpack
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    __filename: true,
    __dirname: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true,
      },
      sourceMap: true,
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
  );
  config.devtool= 'cheap-module-source-map';
} else {
  config.devtool= 'eval-source-map';
}

module.exports = config;
