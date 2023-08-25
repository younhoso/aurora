const { ProvidePlugin } = require('webpack');
const DotenvPlugin = require('dotenv-webpack');
const { resolve } = require('path');
const { NODE_ENV } = process.env;
const dotenv = require('dotenv');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isAnalyze = process.argv.includes('--analyze');
const { PUBLIC_PATH } = dotenv.config({ path: resolve(__dirname, `../config/.env.${NODE_ENV}`) }).parsed;

const { entryDirectory, outputDirectory } = require('./util.js');

module.exports = {
  mode: NODE_ENV,
  entry: {
    index: resolve(__dirname, `../src/${entryDirectory}/index.js`)
  },
  output: {
    filename: `${outputDirectory}[name].[chunkhash].bundle.js`,
    clean: {
      keep: (cachedFile) => {
        const fileName = cachedFile.split('.')[0];
        return !cachedFile.includes(fileName);
      },
    },
    publicPath: PUBLIC_PATH,
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|mp4)$/,
        type: 'asset/resource',
        generator: {
          filename: `${outputDirectory}[name].[ext]?[hash]`,
        },
      },
      {
        test: /\.(ico)$/,
        type: 'asset/resource',
        generator: {
          filename: `${outputDirectory}[name].[ext]`,
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${outputDirectory}index.html`,
      template: resolve(__dirname, `../public/index.html`),
      env: process.env,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: resolve(__dirname, `../public/favicon.ico`), to: `${entryDirectory}favicon.ico` }
      ],
    }),
    new DotenvPlugin({ path: resolve(__dirname, `../config/.env.${NODE_ENV}`) }),
    new ProvidePlugin({
      React: 'react',
    }),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],
};
