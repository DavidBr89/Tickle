import firebase from '@firebase/app';
import '@firebase/firestore';
// TODO: rename
//
// Add additional services you want to use
import '@firebase/auth';
import '@firebase/storage';
// require("firebase/database");
// require("firebase/firestore");
// require("firebase/messaging");
// require("firebase/functions");
// import * as fb from 'firebase';

// import 'firebase-auth';

import config from './firebase_api_keys.json';

const app = firebase.initializeApp(config);
const firestore = firebase.firestore(app);
const { Timestamp } = firebase.firestore;
console.log('Timestamp', Timestamp);
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

const auth = firebase.auth();

const storageRef = firebase.storage().ref();

export {
  firestore, Timestamp, auth, storageRef
};
