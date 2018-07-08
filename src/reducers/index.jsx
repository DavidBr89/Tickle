import { combineReducers } from 'redux';

import MapView from './Map';
import Cards from './Cards';
import User from './User';
import Session from './Session';
import DataView from './DataView';
import Admin from './Admin';
// import Login from './components/Login/reducer';

// TODO: write my own combineReducer
export default combineReducers({
  MapView,
  Cards,
  User,
  Session,
  DataView,
  Admin
});
// export default MapView;
// export default CardCreator;
