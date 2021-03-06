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
    'react-dom': 'ReactDOM',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
    'highlight.js': 'hljs',
    '@popperjs/core': "Popper"
  },
  resolve: {
    extensions: ['.tsx', '.js', '.ts', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
      },
      {
        test: /\.css$/i,
        loader: "css-loader"
      },
    ]
  }
};
