// import { flyToUser } from './actions';
import fetchJsonp from 'fetch-jsonp';
import Mapbox from 'mapbox';

import {
  // WebMercatorViewport,
  PerspectiveMercatorViewport
} from 'viewport-mercator-project';
import * as d3 from 'd3';

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

export const LOAD_DIRECTION = 'LOAD_DIRECTION';
export function loadDirection() {
  return { type: LOAD_DIRECTION };
}

// const url = `https://api.mapbox.com/directions/v5/mapbox/driving/13.4301,52.5109;13.4265,52.5080;13.4194,52.5072?radiuses=40;;100&geometries=polyline&access_token=${
//   process.env.MapboxAccessToken
// }`;

export function fetchDirection({ startCoords, destCoords }) {
  return function(dispatch) {
    dispatch(loadDirection());
    console.log('test', startCoords, destCoords);
    client.getDirections(
      [
        { latitude: startCoords.latitude, longitude: startCoords.longitude },
        { latitude: destCoords.latitude, longitude: destCoords.longitude }
      ],
      {
        profile: 'walking',
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

export const GET_TOPIC_MAP = 'GET_TOPIC_MAP';
export function getTopicMap(options) {
  return { type: GET_TOPIC_MAP, options };
}

export function computeTopicMap({
  cards,
  width,
  height,
  longitude,
  latitude,
  zoom
}) {
  console.log(
    'width',
    width,
    'height',
    height,
    'longitude',
    longitude,
    'latitude',
    latitude,
    'zoom',
    zoom
  );
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  const vp = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude,
    longitude
  });

  const cardNodes = cards.map(c => {
    const [tx, ty] = vp.project([c.loc.longitude, c.loc.latitude]);
    return { id: c.id, tx, ty };
  });

  return function(dispatch) {
    // return new Promise(resolve => {
    d3
      .forceSimulation(cardNodes)
      .force('x', d3.forceX(d => d.tx).strength(0.1))
      .force('y', d3.forceY(d => d.ty).strength(0.1))
      .force(
        'collide',
        d3.forceCollide(15).strength(1)
        // .iterations(10)
      )
      .on('end', () => {
        dispatch(getTopicMap(cardNodes));
      });
  };

  // .force(
  //   'cont',
  //   forceSurface()
  //     .surfaces([
  //       { from: { x: 0, y: 0 }, to: { x: 0, y: h } },
  //       { from: { x: 0, y: h }, to: { x: w, y: h } },
  //       { from: { x: w, y: h }, to: { x: w, y: 0 } },
  //       { from: { x: w, y: 0 }, to: { x: 0, y: 0 } }
  //     ])
  //     .oneWay(true)
  //     .elasticity(1)
  //     .radius(r)
  // )
  // .force(
  //   'collide',
  //   d3.forceCollide(r).strength(1)
  //   // .iterations(10)
  // )
  // return fetch('http://thescalli.com/root/index.php/scheduleREST1/schedules')
  //   .then(
  //     response => response.json(),
  //     // Do not use catch, because that will also catch
  //     // any errors in the dispatch and resulting render,
  //     // causing a loop of 'Unexpected batch number' errors.
  //     // https://github.com/facebook/react/issues/6895
  //     error => console.log('An error occurred.', error)
  //   )
  //   .then(json =>
  //     // We can dispatch many times!
  //     // Here, we update the app state with the results of the API call.
  //     dispatch(receiveCards(json))
  //   );
  // };
}
