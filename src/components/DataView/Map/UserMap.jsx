import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapGL, { HTMLOverlay } from 'react-map-gl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MapPin } from 'react-feather';

import CardPin from './CardPin';

import CardMarker from 'Components/cards/CardMarker';

// import { UserOverlay } from '../../utils/map-layers/DivOverlay';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import Cluster from '../ForceOverlay/Cluster';
import CardCluster from '../ForceOverlay/CardCluster';
// import ForceCollide from '../ForceOverlay/MiniForceCollide';

import { changeMapViewport, userMove } from 'Reducers/Map/actions';

import { stylesheet } from 'Src/styles/GlobalThemeContext';

import ArrayPipe from 'Components/utils/ArrayPipe';

import 'mapbox-gl/dist/mapbox-gl.css';

import userIcon from '../ForceOverlay/user.svg';

const mapStyleUrl = 'mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l';

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
    (earthCircumference * Math.cos(latitudeRadians)) / 2 ** (zoomLevel + 8)
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
    viewport: { ...defaultLocation, width: 100, height: 100, zoom: 10 },
    cards: [],
    showUser: false
  };

  state = { ...this.props };

  componentDidMount() {
    console.log('mapgl', this.mapgl);
    const map = this.mapgl.getMap();
    //
    // // TODO: START END 4.989203,51.314682;5.013693,51.311366
    // map.on('load', () => {
    //   map.addLayer({
    //     id: 'route',
    //     type: 'line',
    //     source: {
    //       type: 'geojson',
    //       cards: {
    //         type: 'Feature',
    //         properties: {},
    //         geometry: {
    //           type: 'LineString',
    //           coordinates: [
    //             [4.991218, 51.31484],
    //             [4.99684, 51.314709],
    //             [4.997494, 51.314592],
    //             [4.999943, 51.31378],
    //             [5.002289, 51.313371],
    //             [5.00321, 51.313367],
    //             [5.00878, 51.313932],
    //             [5.009547, 51.313655],
    //             [5.013749, 51.311311]
    //           ]
    //         }
    //       }
    //     },
    //     layout: {
    //       'line-join': 'round',
    //       'line-cap': 'round'
    //     },
    //     paint: {
    //       'line-color': 'red',
    //       'line-width': 8,
    //       'line-opacity': 0.4
    //     }
    //   });
    //
    //   map.addLayer({
    //     id: 'points',
    //     type: 'symbol',
    //     source: {
    //       type: 'geojson',
    //       cards: {
    //         type: 'FeatureCollection',
    //         features: [
    //           {
    //             type: 'Feature',
    //             geometry: {
    //               type: 'Point',
    //               coordinates: [4.989203, 51.314682]
    //             },
    //             properties: {
    //               title: 'START',
    //               icon: 'marker'
    //             }
    //           },
    //           {
    //             type: 'Feature',
    //             geometry: {
    //               type: 'Point',
    //               coordinates: [5.013693, 51.311366]
    //             },
    //             properties: {
    //               title: 'END',
    //               icon: 'marker'
    //             }
    //           }
    //         ]
    //       }
    //     },
    //     layout: {
    //       'icon-image': '{icon}-15',
    //       'text-field': '{title}',
    //       'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //       'text-offset': [0, 0.6],
    //       'text-anchor': 'top'
    //     }
    //   });
    // });
  }

  // static getDerivedStateFromProps({ latitude, longitude }, prevState) {
  //   return { latitude, longitude };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { nodes, selectedCardId, maxZoom } = this.props;
    // if ( selectedCardId !== null && prevProps.selectedCardId !== selectedCardId
    // ) {
    //   const selectedNode = nodes.find(n => selectedCardId === n.id);
    //   const {
    //     loc: { longitude, latitude }
    //   } = selectedNode;
    //
    //   const vp = { ...this.state, longitude, latitude };
    //   this.props.changeMapViewport({ ...vp });
    // }
  }

  render() {
    const {
      colorScale,
      cards,
      disabled,
      children,
      maxZoom,
      viewport,
      userLocation,
      preview,
      width,
      height,
      isCardDragging,
      showUser,
      userMove,
      routeSelectCard,
      selectedCardId,
      className,
      style
    } = this.props;

    const { latitude, longitude, zoom } = viewport;

    const vp = new PerspectiveMercatorViewport({ ...viewport, width, height });

    const locNodes = cards.reduce((acc, n) => {
      const [x, y] = vp.project([n.loc.longitude, n.loc.latitude]);
      if (x > 0 && x < width && y > 0 && y < height) {
        return [{ ...n, x, y }, ...acc];
      }
      return acc;
    }, []);

    const userPos = vp.project([userLocation.longitude, userLocation.latitude]);

    const accessibleRadius = geometricRadius(latitude, 50, zoom);

    return (
      <div className={className} style={style}>
        <MapGL
          ref={m => (this.mapgl = m)}
          onClick={({ lngLat }) => {
            userMove({ longitude: lngLat[0], latitude: lngLat[1] });
          }}
          width={width}
          height={height}
          onViewportChange={newViewport => {
            // if (!isCardDragging) {
            this.props.changeMapViewport({ ...newViewport });
            if (selectedCardId !== null) routeSelectCard(null);
            // }
          }}
          dragPan={!isCardDragging}
          dragRotate={false}
          doubleClickZoom={false}
          latitude={latitude}
          longitude={longitude}
          zoom={zoom}
        >
          <Cluster
            radius={() =>
              // console.log('d', d);
              40
            }
            nodes={locNodes}
            width={width}
            height={height}
            colorScale={colorScale}
          >
            {clusters => (
              <ArrayPipe array={clusters}>
                {({ id, x, y, data: d }) => (
                  <CardCluster
                    id={id}
                    coords={[x, y]}
                    centroid={[x, y]}
                    size={65}
                    data={d}
                    onClick={() => {
                      preview(d.values[0]);
                    }}
                  >
                    {c => <CardMarker {...c} />}
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
              // zIndex: 2000
            }}
          >
            <img
              src={userIcon}
              width={50}
              height={50}
              style={{ transform: 'translate(-50%,-50%)' }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: userPos[0],
              top: userPos[1]
              // zIndex: 2000
            }}
          >
            <div
              style={{
                position: 'absolute',
                transform: 'translate(-50%,-50%)',
                // left: x1 - r,
                // top: y1 - r,
                border: '2px solid grey',
                borderRadius: '50%',
                transition: 'width 0.5s, height 0.5s, left 0.5s, top 0.5s',
                width: accessibleRadius * 2,
                height: accessibleRadius * 2
                // background: 'green',
                // opacity: 0.3
              }}
            />
          </div>
          <div
            style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 4000 }}
          >
            <button
              className="btn"
              onClick={() =>
                this.props.changeMapViewport({
                  width,
                  height,
                  zoom,
                  ...userLocation
                })
              }
              className="p-3 m-2"
              style={{
                border: null,
                background: 'lightgrey',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin />
            </button>
          </div>
        </MapGL>
      </div>
    );
  }
}

// TODO: change this later
const mapStateToProps = ({
  MapView: { mapViewport, userLocation, width, height, accessibleRadius },
  DataView: { selectedCardId },
  Cards: { isCardDragging },
  Screen
}) => ({
  viewport: { ...mapViewport, ...Screen },
  userLocation,
  accessibleRadius,
  selectedCardId,
  isCardDragging
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeMapViewport,
      userMove
    },
    dispatch
  );

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
