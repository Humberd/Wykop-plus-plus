const Path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/index.js'),
    background: Path.resolve(__dirname, '../src/background/index.js'),
  },
  output: {
    path: Path.join(__dirname, '../build'),
    filename: 'js/[name].js',
  },
  target: 'web',
  plugins: [
    new CleanWebpackPlugin(['build'], {root: Path.resolve(__dirname, '..')}),
    new CopyWebpackPlugin([
      {from: Path.resolve(__dirname, '../public'), to: '.'},
    ]),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new CheckerPlugin()
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.js']
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
        test: /\.([tj])s?$/,
        loader: ['awesome-typescript-loader'],
        exclude: [/node_modules/],
      }
    ],
  },
};
