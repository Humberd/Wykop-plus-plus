const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    'hot-reload': Path.resolve(__dirname, '../src/background/hot-reload.js'),
  },
  mode: 'production',
  devtool: 'source-map',
  stats: 'normal',
  bail: true,
  output: {
    filename: './[name].js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
    }),
  ],
  module: {
    rules: [
        /* Linting should only occur on dev, on pred we have a separate command */
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: { /* Loader options go here */ }
          }
        ]
      }
    ]
  }
});
