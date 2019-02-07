import React from 'react';
import {render} from 'react-dom';

import './styles/tailwind.css';
import './styles/index.scss';
import './styles/layout.scss';
import './styles/comps.scss';

//import * as serviceWorker from '../firebase-messaging-sw';

import App from './App';
/**
 * render the whole app to the DOM
 */
render(<App />, document.getElementById('app'));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('firebase-messaging-sw.js', { scope: '.'}).then(registration => {
            console.log('SW is registered: ', registration)
        }).catch(registrationError => {
            console.log('SW registration failed:', registrationError);
        });
    });
}

//serviceWorker.register();
