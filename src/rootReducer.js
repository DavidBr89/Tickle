import { combineReducers } from 'redux';
import MapView from './components/MapView/reducer';
import CardCreator from './components/CardCreator/reducer';
import Login from './components/Login/reducer';

//TODO: write my own combineReducer
export default combineReducers({ MapView});
// export default MapView;
// export default CardCreator;
