const rules = require('./webpack.rules');
const path = require('path');

rules.push(
  {
    test: /\.json$/,
    loader: "json",
    include: '/src/'
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      }
    ],
  },
  {
    test: /\.jpe?g$|\.gif$|\.png$|\.PNG$|\.svg$|\.woff(2)?$|\.ttf$|\.eot$/,
    include: [
      path.resolve(__dirname, "/src/")
    ],
    use: {
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }
  }
);


module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
