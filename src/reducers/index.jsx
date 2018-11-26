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
// import TagTree from './TagTree';
// import Login from './components/Login/reducer';
export default combineReducers({
  MapView,
  Cards,
  Session,
  DataView,
  Admin,
  Screen,
  Account,
  Diary,
});
// export default MapView;
// export default CardCreator;
