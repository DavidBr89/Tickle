import React from 'react';
import {render} from 'react-dom';

import './styles/tailwind.css';
import './styles/index.scss';
import './styles/layout.scss';
import './styles/comps.scss';

import App from './App';
/**
 * render the whole app to the DOM
 */
render(<App />, document.getElementById('app'));
