import {combineReducers} from 'redux';

import MapView from './Map';
import Cards from './Cards';
import User from './User';
import Session from './Session';
import DataView from './DataView';
import Screen from './Screen';
import Admin from './Admin';
import Account from './Account';
import Diary from './Diary';
import TagTree from './TagTree';
// import Login from './components/Login/reducer';

// TODO: write my own combineReducer
export default combineReducers({
  MapView,
  Cards,
  User,
  Session,
  DataView,
  Admin,
  Screen,
  Account,
  Diary,
  TagTree,
});
// export default MapView;
// export default CardCreator;
