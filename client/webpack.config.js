
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ["babel-polyfill", './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader'
  }, {
      test: /\.jsx?$/, //if is js or jsx use babel
      loader: 'babel-loader',
      exclude: /{node_modules}/,
      query: {
          presets: ['latest-minimal', 'react']
      }
  },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader?modules'})
  }]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  target: 'web',
  plugins: [new ExtractTextPlugin('./statics/styles.css')]
};
