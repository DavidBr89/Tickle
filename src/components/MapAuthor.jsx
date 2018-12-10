import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MapGL, {HTMLOverlay} from 'react-map-gl';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// import { UserOverlay } from '../../utils/map-layers/DivOverlay';

import {PerspectiveMercatorViewport} from 'viewport-mercator-project';

import {CardMarker} from 'Cards';

// import ForceCollide from './MiniForceCollide';

import {changeMapViewport, userMove} from 'Reducers/Map/actions';

import 'mapbox-gl/dist/mapbox-gl.css';

import userIcon from './UserMap/user.svg';

// const mapStyleUrl = 'mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l';

const defaultLocation = {
  latitude: 50.85146,
  longitude: 4.315483,
};

const shadowStyle = {
  boxShadow: '3px 3px black',
  border: '1px solid #000',
  // border: '1px solid black'
};

const getShadowStyle = selected => (selected ? shadowStyle : {});

const PreviewMarker = ({
  selected,
  template,
  color,
  size = 25,
  offset = 100,
}) => (
  <CardMarker
    color={color}
    style={{
      transform: selected && 'scale(1.5)',
      zIndex: selected && 50,
      transition: 'transform 1s',
      ...getShadowStyle(selected),
      position: 'absolute',
      width: size,
      height: size, // '13vw',
    }}
  />
);

function ClusterPlaceholder({
  coords: [x, y],
  colorScale,
  tags,
  centroid: [cx, cy],
  size,
  transition,
  // ...props
}) {
  return (
    <div
      key={tags.join('-')}
      style={{
        position: 'absolute',
        transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
        width: size,
        height: size,
        left: x,
        top: y,
        transform: `translate(-50%,-50%)`,
        // background: 'white',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px #24292e',
        border: '#24292e solid 1px',
        borderRadius: '100%',
        // overflow: 'hidden'
      }}>
      <div
        style={{
          zIndex: -1,
          background: 'whitesmoke',
          opacity: 0.8,
          width: '100%',
          height: '100%',
          position: 'absolute',
          borderRadius: '100%',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '10.65%',
          // padding: '14.65%'
        }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          {tags.map(t => (
            <div
              className="mb-1 mr-1"
              style={{
                fontSize: 14,
                background: colorScale(t),
                maxWidth: '100%',
              }}>
              <div
                style={{
                  // width: '150%',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
ClusterPlaceholder.propTypes = {transition: PropTypes.array};
ClusterPlaceholder.defaultProps = {transition: 500};

class Map extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.boolean,
  };

  static defaultProps = {
    disabled: false,
    maxZoom: 16,
    viewport: {...defaultLocation, width: 100, height: 100, zoom: 10},
    nodes: [],
    showUser: false,
  };

  state = {...this.props};

  componentDidMount() {
    // console.log('mapgl', this.mapgl);
    // const map = this.mapgl.getMap();
    // map.on('load', () => {
    //   map.addLayer({
    //     id: 'route',
    //     type: 'line',
    //     source: {
    //       type: 'geojson',
    //       data: {
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
    //       data: {
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
    const {nodes, selectedCardId, maxZoom} = this.props;
    if (
      selectedCardId !== null &&
      prevProps.selectedCardId !== selectedCardId
    ) {
      const selectedNode = nodes.find(n => selectedCardId === n.id);
      const {
        loc: {longitude, latitude},
      } = selectedNode;

      const vp = {...this.state, longitude, latitude, zoom: maxZoom};
      this.props.changeMapViewport({...vp});
    }
  }

  render() {
    const {
      colorScale,
      nodes,
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
    } = this.props;

    const {latitude, longitude, zoom} = viewport;

    const vp = new PerspectiveMercatorViewport({...viewport, width, height});

    const userPos = vp.project([userLocation.longitude, userLocation.latitude]);
    const locNodes = nodes.reduce((acc, n) => {
      const [x, y] = vp.project([n.loc.longitude, n.loc.latitude]);
      if (x > 0 && x < width && y > 0 && y < height) {
        return [{...n, x, y}, ...acc];
      }
      return acc;
    }, []);

    return (
      <MapGL
        width={width}
        height={height}
        onViewportChange={newViewport => {
          if (!isCardDragging) {
            this.props.changeMapViewport({...newViewport});
          }
        }}
        dragPan={!isCardDragging}
        dragRotate={false}
        doubleClickZoom={false}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}>
        <div
          style={{
            position: 'absolute',
            // left: userPos[0],
            // top: userPos[1]
            // zIndex: 5000
          }}>
          {locNodes.map(children)}

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
        </div>
      </MapGL>
    );
  }
}

// TODO: change this later
const mapStateToProps = ({
  MapView: {mapViewport, userLocation, width, height},
  DataView: {selectedCardId},
  Cards: {isCardDragging},
  Screen,
}) => ({
  viewport: {...mapViewport, ...Screen},
  userLocation,
  selectedCardId,
  isCardDragging,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeMapViewport,
      userMove,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map);
