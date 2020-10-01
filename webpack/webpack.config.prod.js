const Path = require('path');
const Webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = merge(common, {
  entry: {
    'hot-reload': Path.resolve(__dirname,
        '../src/background/hot-reload.prod.js'),
  },
  mode: 'production',
  devtool: false,
  stats: 'errors-only',
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // new CleanWebpackPlugin(['build'], {root: Path.resolve(__dirname, '..')}),
  ],
});
