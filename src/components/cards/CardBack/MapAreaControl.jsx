import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MapGL from 'Components/utils/Map';

import {WebMercatorViewport, fitBounds} from 'viewport-mercator-project';

// TODO remove
import DimWrapper from 'Utils/DimensionsWrapper';
// import { geoProject } from 'Lib/geo';
import CardMarker from 'Components/cards/CardMarker';

// import MapboxDirections from '@mapbox/mapbox-gl-directions';

import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

const directionService = mbxDirections({
  accessToken: process.env.MapboxAccessToken,
});

// useEffect(() => {
//   const map = mapDOMRef.current.getMap();
//   const directions = new MapboxDirections({
//     accessToken: process.env.MapboxAccessToken,
//     unit: 'metric',
//     profile: 'mapbox/cycling',
//     controls: {
//       inputs: true,
//       instructions: true,
//       profileSwitcher: false,
//     },
//     interactive: true,
//   });
//
//   directions.setOrigin([4.3951525, 50.8209233]);
//   directions.setDestination([loc.longitude, loc.latitude]);
//
//   map.addControl(directions);
//
// }, []);

// mbxDirections.getDirections(),

const addLine = coords => ({
  id: 'route',
  type: 'line',
  source: {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    },
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': 'red',
    'line-width': 8,
  },
});

const MapAreaControl = props => {
  const {
    latitude,
    longitude,
    extended,
    onClose,
    edit,
    markerWidth,
    markerHeight,
    loc,
    width,
    height,
    userLocation,
  } = props;

  const startLoc = [userLocation.longitude, userLocation.latitude];
  const endLoc = [loc.longitude, loc.latitude];

  const conf = {
    profile: 'walking',
    geometries: 'geojson',
    waypoints: [
      {
        coordinates: startLoc,
        approach: 'unrestricted',
      },
      {
        coordinates: endLoc,
        bearing: [100, 60],
      },
    ],
  };

  const mapDOMRef = React.createRef();

  useEffect(() => {
    const map = mapDOMRef.current.getMap();

    directionService
      .getDirections(conf)
      .send()
      .then(response => {
        const {body} = response;
        const {
          routes: [
            {
              geometry: {coordinates},
            },
          ],
        } = body;

        const newMap = map;

        newMap.addLayer(addLine(coordinates));
      });
  }, []);

  const boundVp = fitBounds({
    width,
    height,
    bounds: [startLoc, endLoc],
    padding: 20,
  });

  const mercator = new WebMercatorViewport({...boundVp, width, height});

  const cardPos = mercator.project(endLoc);

  return (
    <div className="relative">
      <div className="absolute p-2 z-50">
        <h2 className="tag-label bg-black">Location</h2>
      </div>
      <MapGL
        forwardedRef={mapDOMRef}
        width={width}
        height={height}
        mapViewport={boundVp}
      />
      <CardMarker
        className="absolute"
        style={{
          transform: 'translate(-50%,-50%)',
          left: cardPos[0],
          top: cardPos[1],
          width: 35,
          height: 45,
        }}
      />
    </div>
  );
};

MapAreaControl.defaultProps = {width: 300, height: 300};

const MapWrapper = props => (
  <div className="absolute w-full h-full">
    <DimWrapper delay={100}>
      {(width, height) => (
        <MapAreaControl
          {...props}
          width={width || 300}
          height={height || 300}
        />
      )}
    </DimWrapper>
  </div>
);

/*
              <DivOverlay {...mapViewport(width, height)} data={[{ loc }]}>
                {(_, [left, top]) => (
                  <div
                    styl, useStatee={{
                      position: 'absolute',
                      left: left - markerWidth / 2,
                      top: top - markerHeight / 2,
                      width: markerWidth,
                      height: markerHeight
                    }}
                  >
                    <CardMarker />
                  </div>
                )}
              </DivOverlay>
              */

export default MapWrapper;
