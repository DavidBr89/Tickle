const path = require('path');

module.exports = {
  // 'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
  Src: path.resolve(__dirname, './src'),
  Reducers: path.resolve(__dirname, './src/reducers'),
  DummyData: path.resolve(__dirname, './src/DummyData.js'),
  Cards: path.resolve(__dirname, 'src/components/cards'),
  Firebase: path.resolve(__dirname, 'src/firebase/index.js'),
  Utils: path.resolve(__dirname, 'src/components/utils'),
  Components: path.resolve(__dirname, 'src/components'),
  Constants: path.resolve(__dirname, 'src/constants')
};
