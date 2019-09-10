const path = require('path');

module.exports = (env) => {

  const isProduction = env === 'production';

  if(isProduction) {
    return {
      entry: './src/index.js',
      output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js'
      }
    }
  } else {
    return {
      entry: './src/index.js',
      output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js'
      },
      devtool:  'inline-source-map',
      devServer: {
        contentBase: path.join(__dirname, 'public'),
        publicPath: '/dist/'
      }
    }
  }
  
};