import React, {Component} from 'react';
import PropTypes from 'prop-types';

import WebMercatorViewport from 'viewport-mercator-project';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MapPin from 'react-feather/dist/icons/map-pin';

import {geoProject} from '~/lib/geo';

import CardMarker from '~/components/cards/CardMarker';

import Map from '~/components/utils/Map';

// import { UserOverlay } from '../../utils/map-layers/DivOverlay';

import * as mapActions from '~/reducers/Map/actions';
import ArrayPipe from '~/components/utils/ArrayPipe';

import Cluster from './Cluster';
import CardCluster from './CardCluster';
// import ForceCollide from '../ForceOverlay/MiniForceCollide';

import 'mapbox-gl/dist/mapbox-gl.css';

import userIcon from './user.svg';

// TODO: constant
const mapStyleUrl =
  'mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l';

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483
};

const shadowStyle = {
  boxShadow: '3px 3px black',
  border: '1px solid #000'
  // border: '1px solid black'
};

const metersPerPixel = function(latitude, zoomLevel) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    (earthCircumference * Math.cos(latitudeRadians)) /
    2 ** (zoomLevel + 8)
  );
};

const geometricRadius = function(latitude, meters, zoomLevel) {
  return meters / metersPerPixel(latitude, zoomLevel);
};

class UserMap extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.boolean
  };

  static defaultProps = {
    disabled: false,
    maxZoom: 16,
    viewport: {
      ...defaultLocation,
      width: 100,
      height: 100,
      zoom: 10
    },
    cards: [],
    showUser: false
  };

  render() {
    const {
      cards,
      children,
      userLocation,
      previewCardAction,
      width,
      height,
      isCardDragging,
      userMove,
      className,
      style,
      mapViewport,
      selectedCardId,
      changeMapViewport
    } = this.props;

    const {latitude, longitude, zoom} = mapViewport;

    const mercator = new WebMercatorViewport(mapViewport);
    const locNodes = geoProject({viewport: mercator, data: cards});

    const userPos = mercator.project([
      userLocation.longitude,
      userLocation.latitude
    ]);

    const accessibleRadius = geometricRadius(latitude, 50, zoom);

    console.log('selectedCardId', selectedCardId);
    const isSelected = c => {
      console.log('XXX cluster', c);
      return c.values.map(e => e.id).includes(selectedCardId);
    };

    return (
      <div className={className} style={style}>
        <Map {...this.props}>
          <Cluster
            radius={() => 40}
            nodes={locNodes}
            width={width}
            height={height}>
            {clusters => (
              <ArrayPipe array={clusters}>
                {({id, x, y, data: d}) => (
                  <CardCluster
                    id={id}
                    coords={[x, y]}
                    centroid={[x, y]}
                    size={65}
                    data={d}
                    onClick={() => {
                      const firstCard = d.values[0];
                      previewCardAction(firstCard);
                    }}>
                    {c => (
                      <CardMarker {...c} selected={isSelected(c)} />
                    )}
                  </CardCluster>
                )}
              </ArrayPipe>
            )}
          </Cluster>

          <div
            style={{
              position: 'absolute',
              left: userPos[0],
              top: userPos[1]
            }}>
            <img
              src={userIcon}
              width={50}
              height={50}
              style={{transform: 'translate(-50%,-50%)'}}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: userPos[0],
              top: userPos[1]
              // zIndex: 2000
            }}>
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%,-50%)',
                // left: x1 - r,
                // top: y1 - r,
                border: '2px solid grey',
                borderRadius: '50%',
                transition:
                  'width 0.5s, height 0.5s, left 0.5s, top 0.5s',
                width: accessibleRadius * 2,
                height: accessibleRadius * 2
                // background: 'green',
                // opacity: 0.3
              }}
            />
          </div>
          <div
            className="z-20 absolute"
            style={{position: 'absolute', bottom: 0, right: 0}}>
            <button
              className="p-3 m-2 rounded-full btn "
              onClick={() =>
                this.props.changeMapViewport({
                  width,
                  height,
                  zoom,
                  ...userLocation
                })
              }>
              <MapPin />
            </button>
          </div>
        </Map>
      </div>
    );
  }
}

// TODO: change this later
const mapStateToProps = ({
  MapView: {mapViewport, userLocation, width, height, accessibleRadius},
  DataView: {selectedCardId},
  Cards: {isCardDragging},
  Screen
}) => ({
  viewport: {...mapViewport, ...Screen},
  userLocation,
  accessibleRadius,
  selectedCardId,
  isCardDragging
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(mapActions, dispatch);

const mergeProps = (state, dispatcherProps, ownProps) => ({
  ...state,
  ...dispatcherProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UserMap);
