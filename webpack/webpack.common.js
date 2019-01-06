const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const argv = require('yargs').argv;

let buildDirectory = '../build';
if (argv.versionUpgrade) {
  buildDirectory = '../dist';
}

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/index.ts'),
    background: Path.resolve(__dirname, '../src/background/index.js'),
  },
  output: {
    path: Path.join(__dirname, buildDirectory),
    filename: './[name].js',
  },
  bail: true,
  target: 'web',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: Path.resolve(__dirname, '../public'),
        to: '.',
        transform(content, path) {
          if (path.endsWith('manifest.json')) {
            const json = JSON.parse(content.toString('utf8'));
            json.version = require('../package').version;

            return Buffer.from(JSON.stringify(json, null, 2))
          }
          return content;
        },
      },
    ]),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin([Path.join(__dirname, buildDirectory)],
        {root: Path.resolve(__dirname, '..')}),
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
    ],
  },
};
