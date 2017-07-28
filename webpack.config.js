const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client');
const APP_DIR = path.resolve(__dirname, 'client/source');
const Dotenv = require('dotenv-webpack');

const config = {
  entry: ['babel-polyfill', `${APP_DIR}/index.jsx`],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    // uncomment "publicPath" line for
    //    npm run webpack
    //    npm run devserver
    // keep it commented for
    //    npm run dev
    // publicPath: '/client',
  },

  target: 'web',
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new Dotenv({
      path: './.env', // if not simply .env
      safe: false, // if true, lets load the .env.example file as well
    }),
    new HtmlWebpackPlugin({
      template: 'client/index-dev.html',
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

module.exports = config;
