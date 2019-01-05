const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/index.ts'),
    background: Path.resolve(__dirname, '../src/background/index.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  target: 'web',
  plugins: [
    new CopyWebpackPlugin([
      {from: Path.resolve(__dirname, '../public'), to: '.'},
    ]),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new Webpack.optimize.ModuleConcatenationPlugin()
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.js', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
      {
        test: /\.s?css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
    ],
  },
};
