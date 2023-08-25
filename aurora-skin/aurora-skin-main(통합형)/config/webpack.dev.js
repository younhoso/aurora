const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isAnalyze = process.argv.includes('--analyze');

module.exports = merge(common, {
  mode: 'dev',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
    new CopyWebpackPlugin({
      patterns: ['public/mockServiceWorker.js', 'public/environment.json'],
    }),
  ],
});
