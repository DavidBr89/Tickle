import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import 'material-icons/css/material-icons.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';

import './bootstrap.scss';
import './index.scss';
// import 'papercss/src/styles.scss';

import { AppContainer } from 'react-hot-loader';

import App from './App';

const render = Component => {
  ReactDOM.render(
    <AppContainer>

      <React.StrictMode>
      <Component />
      </React.StrictMode>
    </AppContainer>,
    document.getElementById('app')
  );
};

console.log('module', module === true);

if (module.hot) {
  module.hot.accept('./App', () => {
    console.log('hot');
    render(App);
  });
}
render(App);
