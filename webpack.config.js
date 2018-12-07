let path = require('path');

module.exports = {
  entry: './src/main',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
    library: 'EntryPoint'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [{
      // Include ts, tsx, js, and jsx files.
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  }
};