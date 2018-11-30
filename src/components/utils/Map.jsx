import React from 'react';
import PropTypes from 'prop-types';

import MapGL, {FlyToInterpolator} from 'react-map-gl';

import WebMercatorViewport from 'viewport-mercator-project';

import userIcon from './user.svg';

function Map({
  userLocation,
  preview,
  width,
  height,
  isCardDragging,
  userMove,
  className,
  style,
  mapViewport,
  changeMapViewport,
  children,
}) {
  const {latitude, longitude, zoom} = mapViewport;

  const mercator = new WebMercatorViewport(mapViewport);

  const userPos = mercator.project([
    userLocation.longitude,
    userLocation.latitude,
  ]);

  // mapStyle="mapbox://styles/moerwijk/cjke1d9rnjr4c2spp49b9ib1b"
  return (
    <MapGL
      onClick={({lngLat}) => {
        userMove({longitude: lngLat[0], latitude: lngLat[1]});
      }}
      onViewportChange={newViewport => {
        changeMapViewport({
          ...newViewport,
          transitionDuration: 0,
          transitionInterpolator: null,
        });
      }}
      mapStyle="mapbox://styles/jmaushag/cjp2wizvd00ke2rnpdat5rutg"
      dragPan={!isCardDragging}
      dragRotate={false}
      doubleClickZoom={false}
      zoom={zoom}
      {...mapViewport}
      width={width}
      height={height}>
      {children}
      <div
        style={{
          position: 'absolute',
          left: userPos[0],
          top: userPos[1],
          // zIndex: 2000
        }}>
        <img
          src={userIcon}
          width={50}
          height={50}
          style={{transform: 'translate(-50%,-50%)'}}
        />
      </div>
    </MapGL>
  );
}

Map.defaultProps = {};

Map.propTypes = {};

export default Map;
