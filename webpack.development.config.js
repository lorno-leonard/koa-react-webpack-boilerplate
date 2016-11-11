var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home:'./app/home/index.js',
  },
  output: {
    path: __dirname + '/public_dev',
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /(\.js|\.jsx)$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel']
    }, {
      test: /(\.scss|\.css)$/,
      loader: 'style!css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'
    }]
  },
  resolve: {
    extensions: ['', '.scss', '.css', '.js', '.jsx', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  postcss: [autoprefixer],
  devServer: {
    port: 3001,
    contentBase: './public_dev',
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    proxy: {
      '/' : {
        target: process.env.BASE_URL
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
    new ExtractTextPlugin('[name].bundle.css', {allChunks: true}),
    new HtmlWebpackPlugin({
      template: 'public_dev/template.html',
      title: 'Home',
      filename: 'index.html',
      chunks: ['home'],
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};