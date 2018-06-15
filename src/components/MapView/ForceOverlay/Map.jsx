import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

import { UserOverlay } from '../../utils/map-layers/DivOverlay';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

const mapStyleUrl = 'mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l';

class MapWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      width,
      height,
      latitude,
      longitude,
      zoom,
      onViewportChange,
      children
    } = this.props;

    return (
      <MapGL
        mapStyle={mapStyleUrl}
        onViewportChange={onViewportChange}
        height={height}
        width={width}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
      >
        {children}
      </MapGL>
    );
  }
}
class Map extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { ...this.props };

  // static getDerivedStateFromProps({ latitude, longitude }, prevState) {
  //   return { latitude, longitude };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { latitude, longitude, selectedCardId } = this.props;
    if (prevProps.selectedCardId !== selectedCardId) {
      this.setState({ latitude, longitude });
    }
  }

  render() {
    const { width, height, latitude, longitude, zoom } = this.state;

    const { userLocation, nodes, children } = this.props;

    const viewport = new PerspectiveMercatorViewport({ ...this.state });

    return (
      <MapGL
        key="map"
        mapStyle={mapStyleUrl}
        onViewportChange={viewport => {
          console.log('viewport', viewport);
          this.setState({ ...viewport });
          this.props.onViewportChange(viewport);
        }}
        height={height}
        width={width}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
      >
        <UserOverlay {...this.props} location={userLocation} />
        {nodes.map(n => {
          const [x, y] = viewport.project([n.loc.longitude, n.loc.latitude]);
          return children({ ...n, x, y });
        })}
      </MapGL>
    );
  }
}

export default Map;
