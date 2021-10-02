const path = require('path');

module.exports = {
  entry: './js/netdrop.tsx',
  output: {
    path: path.resolve(__dirname, '../web/static'),
    filename: 'netdrop.min.js',
  },
  mode: 'production',
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['.tsx', '.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx|json)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              "@babel/react",
              "@babel/modules",
              "@babel/typescript"
            ]
          }
        }
      }
    ]
  }
};
