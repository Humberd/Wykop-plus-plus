const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    'hot-reload': Path.resolve(__dirname,
        '../src/background/hot-reload.prod.js'),
  },
  mode: 'production',
  devtool: false,
  stats: 'errors-only',
  bail: true,
  output: {
    filename: './[name].js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ],
});
