import React from 'react';
import WebFont from 'webfontloader';
import { render } from 'react-dom';

import 'event-propagation-path';
// import 'font-awesome/css/font-awesome.css';
// import 'material-icons/css/material-icons.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
// import 'mapbox-gl/dist/mapbox-gl.css';

// import './bootstrap.scss';
import './styles/tailwind.css';
import './styles/index.scss';
import './styles/layout.scss';

import App from './App';

WebFont.load({
  google: {
    families: ['Droid Sans', 'Permanent Marker']
  }
});

render(<App />, document.getElementById('app'));
