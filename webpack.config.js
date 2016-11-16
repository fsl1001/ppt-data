'use strict';

let path = require('path'),
    devServerHost = '127.0.0.1',
    devServerPort = 9091,
    node_modules = path.resolve(__dirname + '/node_modules'),
    srcPath = path.resolve(__dirname + '/public/static/datappt');  
    
module.exports = {
  context: path.resolve(__dirname + '/public/static/datappt/'),
  entry: {
    'datappt/main': './js/main.js',
    'datappt/webgl': './js/webgl.js'

  },
  output: {
    publicPath: 'http://' + devServerHost + ':' + devServerPort + '/',
    path: path.resolve(__dirname + '/public/static/build'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: [srcPath],
      exclude: [node_modules]
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }, {
      test: /\.jade$/,
      loader: 'jade'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'file',
      query: {
        limit: 0,
        name: 'images/[name].[ext]',
      }
    }]
  },
  babel: {
    'presets': ['es2015'],
    'plugins': ['transform-runtime']
  },
  devServer: {
    historyApiFallback: false,
    noInfo: true,
    host: devServerHost,
    port: devServerPort
  },
  plugins: []
};
