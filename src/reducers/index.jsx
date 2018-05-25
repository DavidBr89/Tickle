import { combineReducers } from 'redux';

import MapView from './Map';
import Cards from './Cards';
import User from './User';
import Session from './Session';
// import Login from './components/Login/reducer';

// TODO: write my own combineReducer
export default combineReducers({ MapView, Cards, User, Session });
// export default MapView;
// export default CardCreator;
