const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'dev',
  devtool: 'cheap-module-source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['public/mockServiceWorker.js', 'public/environment.json'],
    })
  ],
});
