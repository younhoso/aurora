const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

const { outputDirectory, platformType } = require('./util.js');

module.exports = merge(common, {
  mode: 'prod',
  output: {
    clean: {
      keep: cachedFile => !cachedFile.includes(platformType)
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      linkType: false,
      filename: `${outputDirectory}[name].[contenthash].css`,
      chunkFilename: `${outputDirectory}[id].[contenthash].css`,
    }),
  ]
});


