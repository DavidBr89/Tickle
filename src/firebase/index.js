import * as firebase from './firebase';
import * as auth from './auth';
// import {store} from 'Src/App';

import DB from './db';

// TODO: remove
const db = new DB('staging');

const createDbEnv = ({Session: {userEnvSelectedId}}) => DB(userEnvSelectedId);

export {auth, firebase, DB, db, createDbEnv};
