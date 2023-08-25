const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const dotenv = require('dotenv');
const { resolve } = require('path');
const { NODE_ENV } = process.env;
const { PUBLIC_PATH } = dotenv.config({ path: resolve(__dirname, `../config/.env.${NODE_ENV}`) }).parsed;

module.exports = {
  mode: NODE_ENV,
  entry: {
    index: resolve(__dirname, '../src/index.js'),
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    open: false,
    static: {
      directory: './dist',
    },
  },
  output: {
    filename: '[name].[chunkhash].bundle.js',
    clean: {
      keep: (cachedFile) => {
        const fileName = cachedFile.split('.')[0];
        return !cachedFile.includes(fileName);
      },
    },
    publicPath: PUBLIC_PATH,
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      sys: false,
      http: false,
      stream: false,
      zlib: false,
      https: require.resolve('https-browserify'),
      timers: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|mp4)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(ico)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, '../public/index.html'),
      env: process.env,
    }),
    new CopyPlugin({
      patterns: [{ from: `${__dirname}/../public/favicon.ico`, to: 'favicon.ico' }],
    }),
    new DotenvPlugin({ path: resolve(__dirname, `../config/.env.${NODE_ENV}`) }),
    new ProvidePlugin({
      React: 'react',
    }),
  ],
};
