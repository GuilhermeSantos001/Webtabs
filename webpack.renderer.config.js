const rules = require('./webpack.rules');

rules.push(
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
    test: /\.(png|jp(e*)g|svg)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: 'images/[hash]-[name].[ext]'
        }
      }
    ]
  }
);


module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
