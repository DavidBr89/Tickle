import { combineReducers } from 'redux';
import MapView from './components/MapView/reducer';
import CardCreator from './components/CardCreator/reducer';
import Login from './components/Login/reducer';

export default combineReducers({ MapView, CardCreator, Login});
// export default MapView;
// export default CardCreator;
