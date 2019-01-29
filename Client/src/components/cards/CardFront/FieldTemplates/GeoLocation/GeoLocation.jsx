import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MapGL from 'Components/utils/Map';

import {FlyToInterpolator} from 'react-map-gl';

import {
  TEMP_ID,
  initCardFields,
  extractCardFields
} from 'Constants/cardFields';

import MapAuthor from 'Src/components/CardAuthor/MapAuthor';
import GoToPlace from 'Src/components/CardAuthor/GoToPlace';

import {V2_DRAG} from 'Components/DragAndDrop/';

import {
  WebMercatorViewport,
  fitBounds
} from 'viewport-mercator-project';

// TODO remove
import DimWrapper from 'Utils/DimensionsWrapper';
// import { geoProject } from 'Lib/geo';
import CardMarker from 'Components/cards/CardMarker';

import userIcon from 'Components/utils/user.svg';

// import MapboxDirections from '@mapbox/mapbox-gl-directions';

// import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

const directionService = mbxDirections({
  accessToken: process.env.MapboxAccessToken
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
        coordinates: coords
      }
    }
  },
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': 'tomato',
    'line-width': 6
  }
});

const MapAreaView = props => {
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
    userLocation
  } = props;

  const startLoc = [userLocation.longitude, userLocation.latitude];
  const endLoc = [loc.longitude, loc.latitude];

  const conf = {
    profile: 'walking',
    geometries: 'geojson',
    waypoints: [
      {
        coordinates: startLoc,
        approach: 'unrestricted'
      },
      {
        coordinates: endLoc,
        bearing: [100, 60]
      }
    ]
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
              geometry: {coordinates}
            }
          ]
        } = body;

        const newMap = map;

        newMap.addLayer(addLine(coordinates));
      });
  }, []);

  const boundVp =
    startLoc[0] !== endLoc[0] && startLoc[1] !== endLoc[1]
      ? fitBounds({
        // it crashes otherwise
        width: Math.max(100, width),
        height: Math.max(100, height),
        bounds: [startLoc, endLoc],
        padding: 30,
        offset: [0, 40]
      })
      : {...userLocation, zoom: 14};

  const mercator = new WebMercatorViewport({...boundVp, width, height});

  const cardPos = mercator.project(endLoc);
  const userPos = mercator.project(startLoc);

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
      <img
        src={userIcon}
        width={50}
        height={50}
        className="absolute"
        style={{
          transform: 'translate(-50%,-50%)',
          left: userPos[0],
          top: userPos[1]
        }}
      />

      <CardMarker
        className="absolute"
        style={{
          transform: 'translate(-50%,-50%)',
          left: cardPos[0],
          top: cardPos[1],
          width: 35,
          height: 45
        }}
      />
    </div>
  );
};

MapAreaView.defaultProps = {width: 300, height: 300};

const MapWrapper = props => (
  <div className="absolute w-full h-full">
    <DimWrapper delay={100}>
      {(width, height) => (
        <MapAreaView
          {...props}
          width={Math.max(width, 200)}
          height={Math.max(height, 200)}
        />
      )}
    </DimWrapper>
  </div>
);

const MapDragAndDrop = props => {
  const {
    loc,
    id,
    asyncUpdateCard,
    updateCardTemplate,
    className,
    onChange,
    goToPlace
  } = props;

  const [mapViewport, setMapViewport] = useState({
    zoom: 14,
    ...loc.value
  });

  const mercator = new WebMercatorViewport(mapViewport);

  const cardDrop = cardData => {
    const {x, y} = cardData;
    const [longitude, latitude] = mercator.unproject([x, y]);
    onChange({longitude, latitude});
  };

  return (
    <>
      <div className="z-10 absolute w-full flex justify-center mt-3">
        <GoToPlace
          onChange={l => {
            onChange(l);
            setMapViewport({
              ...mapViewport,
              transitionDuration: 2000,
              transitionInterpolator: new FlyToInterpolator(),
              ...l
            });
          }}
        />
      </div>
      <MapAuthor
        {...props}
        key={V2_DRAG}
        dragId={V2_DRAG}
        mapViewport={mapViewport}
        selectedCardId={id}
        onCardDrop={cardDrop}
        cards={[{...props}]}
        changeMapViewport={setMapViewport}
        className={className}
      />
    </>
  );
};

MapDragAndDrop.defaultProps = initCardFields;

// const MapAuthorWrapper = props => (
//   <div className="absolute w-full h-full">
//     <DimWrapper delay={100}>
//       {(width, height) => (
//         <MapDragAndDrop
//           {...props}
//           width={Math.max(width, 200)}
//           height={Math.max(height, 200)}
//         />
//       )}
//     </DimWrapper>
//   </div>
// );

const MapAreaWrapper = ({
  edit,
  visible,
  centerTemplatePos,
  ...props
}) => {
  const [dim, setDim] = useState([200, 200]);

  const ref = React.createRef();

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const width = ref.current.offsetWidth;
        const height = ref.current.offsetHeight;
        setDim([Math.max(width, 100), Math.max(height, 100)]);
      }
    }, 100);
  }, dim);

  return (
    <div ref={ref} className="relative flex-grow w-full flex flex-col">
      <MapDragAndDrop
        {...props}
        className="flex-grow"
        width={dim[0]}
        height={dim[1]}
      />
    </div>
  );
};

export default MapAreaWrapper;
