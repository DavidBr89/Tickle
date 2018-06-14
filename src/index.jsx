import React from 'react';
import { render } from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import 'material-icons/css/material-icons.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';

import './bootstrap.scss';
import './index.scss';

import App from './App';

render(
    <App />,
  document.getElementById('app')
);
