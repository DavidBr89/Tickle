import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';

import { SvgOverlay, DivOverlay } from './DivOverlay';

const metersPerPixel = function(latitude, zoomLevel) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) / 2 ** (zoomLevel + 8)
  );
};

const geometricRadius = function(latitude, meters, zoomLevel) {
  return meters / metersPerPixel(latitude, zoomLevel);
};

function overlap(e, o) {
  // dx and dy are the vertical and horizontal distances
  const dx = o.x - e.x;
  const dy = o.y - e.y;

  // Determine the straight-line distance between centers.
  const d = Math.sqrt(dy * dy + dx * dx);

  // Check Intersections
  if (d > e.r + o.r) {
    // No Solution. Circles do not intersect
    return false;
  }
  return true;
}

class MapAreaRadius extends Component {
  static propTypes = {
    mapViewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    userLocation: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    radius: PropTypes.number
  };
  static defaultProps = {
    mapViewport: { width: 200, height: 200, latitude: 0, longitude: 0 },
    userLocation: { latitude: 0, longitude: 0 },
    radius: 500
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { mapViewport, userLocation, cardPosition, radius } = this.props;

    const { zoom } = mapViewport;
    const { latitude, longitude } = userLocation;
    const r = geometricRadius(latitude, radius, zoom);

    const mercator = new WebMercatorViewport(mapViewport);
    const [x, y] = mercator.project([longitude, latitude]);
    const [x1, y1] = mercator.project([
      cardPosition.longitude,
      cardPosition.latitude
    ]);
    console.log('CircleOverlay', [x1, y1]);

    const accessible = overlap({ x, y, r: 20 }, { x: x1, y: y1, r });

    return (
      <DivOverlay {...mapViewport} data={[{ loc: cardPosition }]}>
        {() => (
          <div
            style={{
              position: 'absolute',
              left: x1 - r,
              top: y1 - r,
              border: '2px solid grey',
              borderRadius: '50%',
              transition: 'width 0.2s, height 0.2s, left 0.2s, top 0.2s',
              width: r * 2,
              height: r * 2,
              background: accessible ? 'green' : 'tomato',
              opacity: 0.3
            }}
          />
        )}
      </DivOverlay>
    );
  }
}

export default MapAreaRadius;
