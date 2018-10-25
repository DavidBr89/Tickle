import * as firebase from './firebase';
import * as auth from './auth';
// import {store} from 'Src/App';

import DB from './db';

// TODO: remove
const db = new DB('staging');

const createDbEnv = ({Session: {dbEnv}}) => DB(dbEnv);

export {auth, firebase, DB, db, createDbEnv};
