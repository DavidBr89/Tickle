import { flyToUser } from './actions';
import fetchJsonp from 'fetch-jsonp';
import Mapbox from 'mapbox';

console.log('mapbox', Mapbox);
const client = new Mapbox(process.env.MapboxAccessToken);

export const RETRIEVE_DIRECTION = 'RETRIEVE_DIRECTION';
export function retrieveDirection(options) {
  return { type: RETRIEVE_DIRECTION, options };
  // export function toggleTodo(index) {
  //   return { type: TOGGLE_TODO, index };
  // }
  //
  // export function setVisibilityFilter(filter) {
  //   return { type: SET_VISIBILITY_FILTER, filter };
  // }
}

// const url = `https://api.mapbox.com/directions/v5/mapbox/driving/13.4301,52.5109;13.4265,52.5080;13.4194,52.5072?radiuses=40;;100&geometries=polyline&access_token=${
//   process.env.MapboxAccessToken
// }`;

export function fetchDirection({ startCoords, destCoords }) {
  console.log('test', startCoords, destCoords);
  return function(dispatch) {
    dispatch(flyToUser());
    client.getDirections(
      [
        { latitude: startCoords.latitude, longitude: startCoords.longitude },
        { latitude: destCoords.latitude, longitude: destCoords.longitude }
      ],
      {
        profile: 'driving-traffic',
        instructions: 'html',
        alternatives: false,
        geometries: 'geojson'
      },
      (err, results) => {
        console.log('err', err);
        dispatch(retrieveDirection(results), error =>
          console.log('err', error)
        );
      }
    );
  };
}
