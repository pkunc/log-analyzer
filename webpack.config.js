// const webpack = require('webpack');
const path = require('path');
// let nodeExternals = require('webpack-node-externals');
const BUILD_DIR = path.resolve(__dirname, 'client/build');
// const BUILD_DIR = path.resolve(__dirname + '/client/build');
const APP_DIR = path.resolve(__dirname, 'client/source');
// const APP_DIR = path.resolve(__dirname + '/client/source');
const Dotenv = require('dotenv-webpack');

const config = {
  // entry: ['babel-polyfill', APP_DIR + '/index.jsx'],
  entry: ['babel-polyfill', `${APP_DIR}/index.jsx`],
  // entry: [APP_DIR + '/index.jsx'],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/client/build',
  },

  target: 'web',
  // externals: [nodeExternals()],
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'eval-source-map',
  module: {
    loaders: [
      {
        // test: /\/app\/.+\.jsx$/,
        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        // Skip any files outside of your project's source directory
        // include: [APP_DIR],

        exclude: /node_modules/,
        loader: 'babel-loader',
        // query: { presets: ['react', 'es2015'] },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },

  plugins: [
    new Dotenv({
      path: './.env', // if not simply .env
      safe: false, // if true, lets load the .env.example file as well
    }),
  ],

  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.jsx', '.json'],
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
