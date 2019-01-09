const path = require('path');

module.exports = {
  Src: path.resolve(__dirname, './src'),
  '~': path.resolve(__dirname, './src'),
  Styles: path.resolve(__dirname, './src/styles'),
  Reducers: path.resolve(__dirname, './src/reducers'),
  Cards: path.resolve(__dirname, 'src/components/cards'),
  Firebase: path.resolve(__dirname, 'src/firebase'),
  Utils: path.resolve(__dirname, 'src/components/utils'),
  Components: path.resolve(__dirname, 'src/components'),
  Constants: path.resolve(__dirname, 'src/constants'),
  Lib: path.resolve(__dirname, 'src/lib'),
};
