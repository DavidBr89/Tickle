import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

import { UserOverlay } from '../../utils/map-layers/DivOverlay';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

const mapStyleUrl = 'mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l';

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483
};

class Map extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.boolean
  };

  static defaultProps = { disabled: false };

  state = { ...this.props };

  // static getDerivedStateFromProps({ latitude, longitude }, prevState) {
  //   return { latitude, longitude };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { latitude, longitude, selectedId } = this.props;
    if (prevProps.selectedId !== selectedId) {
      this.setState({ latitude, longitude });
    }
  }

  componentDidMount() {
    this.props.onViewportChange({ ...this.state });
  }

  render() {
    const { width, height, latitude, longitude, zoom } = this.state;

    const { userLocation, nodes, disabled, children } = this.props;

    const viewport = new PerspectiveMercatorViewport({ ...this.state });

    return (
      <MapGL
        key="map"
        mapStyle={mapStyleUrl}
        onViewportChange={viewport => {
          if (!disabled) {
            this.setState({ ...viewport });
            this.props.onViewportChange(viewport);
          }
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
