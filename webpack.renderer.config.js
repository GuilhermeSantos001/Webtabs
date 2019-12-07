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
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      }
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)$/,
    loader: 'file-loader',
    options: {
      limit: 10000,
      name: '[name].[hash:7].[ext]'
    }
  }
);


module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
