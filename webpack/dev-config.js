const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const vars = require('postcss-simple-vars');
const autoprefixer = require('autoprefixer');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration'))
  .development();

const sharedVars = require('../src/style/variables');

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
    'webpack/hot/only-dev-server',
    './src',
  ],
  output: {
    path: path.join(__dirname, '../public/static'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3001/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css', { allChunks: true }),
    webpackIsomorphicToolsPlugin
  ],
  module: {
    loaders: require('./loaders-config.js')
  },
  postcss: function () {
    return [ vars({ variables: () => sharedVars }), autoprefixer ];
  }
};
