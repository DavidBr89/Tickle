import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
// import * as tf from '@tensorflow/tfjs';
// import * as tsne from '@tensorflow/tfjs-tsne';

// import tsnejs from 'tsne';
import lap from 'lap-jv/lap.js';
import SOM from 'ml-som';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
// import│ {shallowEqualProps} from'shallow-equal-props';

// import louvain from './jlouvain';

import Map from './Map';
import Floorplan from './Floorplan';
import TopicMap from './TopicMap';

const offsetMapViewport = ({
  width,
  height,
  zoom,
  latitude,
  longitude,
  offset: [offsetX = 0, offsetY = 0]
}) => {
  const vp = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude,
    longitude
  });

  const [offsetLng, offsetLat] = vp.unproject([
    offsetX ? width / 2 - offsetX : width / 2,
    offsetY ? height / 2 - offsetY : height / 2
  ]);

  const ret = new PerspectiveMercatorViewport({
    width,
    height,
    zoom,
    latitude: offsetLat,
    longitude: offsetLng
  });
  // console.log('return', longitude, latitude, offsetLng, offsetLat);
  return ret;
};

class ForceOverlay extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        loc: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        }),
        tags: PropTypes.arrayOf(PropTypes.string)
      })
    ),
    delay: PropTypes.number,
    selectionDelay: PropTypes.number,
    padding: PropTypes.shape({
      right: PropTypes.number,
      left: PropTypes.number,
      top: PropTypes.number,
      bottom: PropTypes.number
    }),
    mode: PropTypes.oneOf(['geo', 'tsne', 'som', 'grid', 'floorplan']),
    colorScale: PropTypes.func,
    labels: PropTypes.bool
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    padding: {
      right: 0,
      left: 0,
      bottom: 0,
      top: 0
    },
    force: false,
    data: [],
    delay: 100,
    selectionDelay: 10,
    mode: 'floorplan',
    colorScale: () => 'green',
    labels: false
  };

  constructor(props) {
    super(props);
    const { data } = props;
    const { width, height, onMapViewportChange, userLocation } = props;

    const initPos = data.map(() => [width / 2, height / 2]);

    // data.map(d => ([width/2, height/2]));
    const nodes = data.map(d => ({ ...d, x: width / 2, y: height / 2 }));
  }

  componentWillUnmount() {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { width, height, userLocation } = nextProps;
  //   const { viewport } = prevState;
  //   // if (nextProps.selectedCardId !== null) {
  //   //
  //   // const { loc } = data.find(n => n.id === selectedCardId) || {};
  //   const newVp = offsetMapViewport({
  //     ...viewport,
  //     ...userLocation,
  //     zoom: 8,
  //     width,
  //     height,
  //     offset: [0, height / 4]
  //   });
  //   // }
  //   return { viewport: newVp };
  // }

  render() {
    const {
      children,
      style,
      className,
      mode,
      selectedCardId,
      // center,
      sets,
      colorScale,
      labels,
      onViewportChange,
      onMapViewportChange,
      userLocation,
      width,
      height,
      onDrop,
      // TODO: Remove this check
      dragging,
      data,
      padding
    } = this.props;

    // const somPos = data.map(d => [width / 2, height / 2]); // somFy(data, width, height);

    const nodes = data;

    // const newPos = nodes.map(d => transEvent.apply([d.x, d.y]));
    // TODO: change later
    // const selectedTags = selectedCardId ? tagNode && tagNode.tags : [];

    if (mode === 'geo') {
      const { loc } = nodes.find(d => d.id === selectedCardId) || {
        loc: userLocation
      };
      return (
        <div
          className={className}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            left: 0,
            top: 0,
            // pointerEvents: 'none',
            ...style
          }}
        >
          <Map
            height={height}
            width={width}
            onViewportChange={onMapViewportChange}
            dragging={dragging}
            {...loc}
            zoom={10}
            nodes={nodes}
            selectedId={selectedCardId}
          >
            {d => children({ ...d })}
          </Map>
        </div>
      );
    }

    if (mode === 'floorplan') {
      return (
        <Floorplan width={width} height={height} nodes={nodes}>
          {d => children({ ...d })}
        </Floorplan>
      );
    }

    return (
      <TopicMap
        sets={sets}
        width={width}
        height={height}
        nodes={nodes}
        selectedId={selectedCardId}
        colorScale={colorScale}
        padding={padding}
      >
        {children}
      </TopicMap>
    );
  }
}

export default ForceOverlay;
