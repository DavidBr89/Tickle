import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
// import * as tf from '@tensorflow/tfjs';
// import * as tsne from '@tensorflow/tfjs-tsne';

import * as d3 from 'd3';

// import tsnejs from 'tsne';
import lap from 'lap-jv/lap.js';
import SOM from 'ml-som';
import MapGL from 'react-map-gl';
// import│ {shallowEqualProps} from'shallow-equal-props';

// import louvain from './jlouvain';

import {
  intersection,
  difference,
  union,
  uniq,
  isEqualWith,
  isEqual
} from 'lodash';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import memoize from 'memoize-one';

import {
  UserOverlay
  // UserMarker,
} from '../../utils/map-layers/DivOverlay';

import ZoomContainer from './ZoomContainer';
import Cluster from './Cluster';
// import AmbientOverlay from './AmbientOverlay';
import dobbyscan from './cluster';

import floorplanImg from './floorplan.png';

// import { setify } from '../utils';

function jaccard(a, b) {
  return a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;
}

function unproject(viewport, [x, y]) {
  const vp = new PerspectiveMercatorViewport(viewport);

  const [lng, lat] = vp.unproject([x, y]);
  return [lng, lat];
}

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

function somFy(data, width, height) {
  const options = {
    fields: data.length,
    torus: true,
    gridType: 'rect',
    learningRate: 0.1
  };

  console.log('data somFy', data);
  // TODO: check later
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // TODO: verify with different data sets
  const som = new SOM(Math.floor(width / 10), Math.floor(width / 20), options);
  som.setTraining(dists);
  // while (som.trainOne()) {
  //   const somPos = som.predict(dists);
  //   callback(somPos);
  // }

  const somPos = som.predict(dists);
  // TODO: verify memoize
  console.log('somFy, somFy', somFy);
  return somPos;
}

function lapFy(data, width, height) {
  const n = data.length;
  const m = Math.ceil(Math.sqrt(n));

  const costs = data.map(d =>
    data.map((_, k) => {
      const i = k % m;
      const j = (k - i) / m;
      const dx = d[0] - i - 0.5;
      const dy = d[1] - j - 0.5;
      return dx * dx + dy * dy;
    })
  );
  const x = d3
    .scaleLinear()
    .domain([0, m - 1])
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, m - 1])
    .range([0, height]);

  const la = lap(n, costs);
  const resLa = [...la.col].map((c, k) => {
    const i = k % m;
    const j = (k - i) / m;
    return { i, j };
  });

  return resLa.map(d => [x(d.i), y(d.j)]);
}

class ForceOverlay extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    viewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      zoom: PropTypes.number
    }),
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
    viewport: { width: 300, height: 400, longitude: 0, latitude: 0 },
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

  cache = [];
  oldData = [];

  myMemoizer({ data, width, height }) {
    if (data.length !== this.oldData.length) {
      this.cache = somFy([...data], width, height);
      this.oldData = data;
      return this.cache;
    }

    const arrayIsEqual = data.every(a => {
      const oldItem = this.oldData.find(b => a.id === b.id);
      // console.log('oldItem', oldItem);
      if (!oldItem) return false;
      // console.log(
      //   'oldItem',
      //   oldItem.tags,
      //   'newItem',
      //   a.tags,
      //   difference(oldItem.tags, a.tags)
      // );
      return (
        difference(a.tags, oldItem.tags).length === 0 &&
        difference(oldItem.tags, a.tags).length === 0
      );
    });

    console.log('arrayIsEqual', arrayIsEqual);
    if (arrayIsEqual) return this.cache;

    const timeStamp = new Date().getMilliseconds();
    this.timeStamp = timeStamp;
    this.cache = somFy([...data], width, height);
    this.oldData = [...data.map(d => ({ ...d }))];
    return this.cache;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const arrayIsEqual = nextProps.data.every(a => {
  //     const oldItem = this.props.data.find(b => a.id === b.id);
  //     // console.log('oldItem', oldItem);
  //     if (!oldItem) return false;
  //     console.log('oldItem', oldItem.tags, 'newItem', a.tags);
  //     return a.tags.length === oldItem.tags.length;
  //   });
  //   return (
  //     !arrayIsEqual ||
  //     this.props.selectedCardId !== nextProps.selectedCardId ||
  //     this.props.extCardId !== nextProps.extCardId
  //   );
  // }

  // makeCluster = memoize(
  //   ({ data, width, height }) => somFy(data, width, height),
  //   // lapFy(somFy(data, width, height), width, height),
  //   (argA, argB) =>
  //     // isEqualWith(argA.data, argB.data, (a, b) => {
  //     // console.log('a', a, 'b', b);
  //     // return a.every(
  //     //   aa =>
  //     //     b.find(
  //     //       bb =>
  //     //         aa.id === bb.id &&
  //     //         aa.tags &&
  //     //         bb.tags &&
  //     //         aa.tags.length === bb.tags.length
  //     //     ) !== undefined
  //     // );
  //     // });
  //     (
  //       argA.width === argB.width && argA.height === argB.height && arrayIsEqual
  //     // TODO: when u update stuff
  // );

  constructor(props) {
    super(props);
    const { data } = props;
    const { width, height, onMapViewportChange } = props;

    const initPos = data.map(() => [width / 2, height / 2]);

    // data.map(d => ([width/2, height/2]));
    const nodes = data.map(d => ({ ...d, x: width / 2, y: height / 2 }));

    const defaultLocation = {
      latitude: 50.85146,
      longitude: 4.315483
    };

    const viewport = new PerspectiveMercatorViewport({
      width,
      height,
      zoom: 10,
      ...defaultLocation
    });

    // TODO: rename
    onMapViewportChange(viewport);

    // const dataX = tf.randomUniform([200, 10]);
    // const tsneOpt = tsne.tsne(dataX);
    // tsneOpt.compute(1).then(() => {
    //   // tsne.coordinate returns a *tensor* with x, y coordinates of
    //   // the embedded data.
    //   const coordinates = tsneOpt.coordinates();
    //   coordinates.print();
    // });

    this.state = {
      nodes,
      tsnePos: initPos,
      viewport
    };

    // this.layout = this.layout.bind(this);

    this.forceSim = d3.forceSimulation();
  }

  componentDidUpdate() {
    //
  }

  componentWillUnmount() {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
  }

  layout() {
    const { mode, delay, data, padding, force, width, height } = this.props; // this.props;
    const { viewport } = this.state;

    console.log('render mem');
    const somPos = this.myMemoizer({ data, width, height });
    console.log('somPos', somPos);
    // Create some data
    // const data000 = tf.randomUniform([2000, 10]);
    // console.log('tsne', tsne);

    // Initialize the tsne optimizer
    //
    const geoPos = data.map(({ loc }) =>
      viewport.project([loc.longitude, loc.latitude])
    );

    const pos = (() => {
      switch (mode) {
        // case 'tsne':
        //   return tsnePos;
        case 'topic':
          return somPos;
        // case 'grid':
        //   return gridPos;
        default:
          return geoPos;
      }
    })();

    const xScale =
      mode !== 'geo'
        ? d3
          .scaleLinear()
          .domain(d3.extent(pos.map(d => d[0])))
          .range([padding.left, width - padding.right])
        : x => x;

    const yScale =
      mode !== 'geo'
        ? d3
          .scaleLinear()
          .domain(d3.extent(pos.map(d => d[1])))
          .range([padding.top, height - padding.bottom])
        : y => y;
    // const tsnePos = runTsne(data, 300);

    // prevent stretching of similiarities
    // const padY = height / 7;

    const nodes = data.map(({ id, x, y, tags, ...c }, i) => {
      const tx = xScale(pos[i][0]);
      const ty = yScale(pos[i][1]);
      // const oldNode = oldNodes.find(n => n.id === id) || { x: tx, y: ty };
      return {
        id,
        // ...oldNode,
        x: tx,
        y: ty,
        tx,
        ty,
        tags,
        ...c
      };
    });

    return nodes;
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const {}
  //   if (nextProps.selectedCardId !== null) {
  //
  //   const { loc } = data.find(n => n.id === selectedCardId) || {};
  //     const viewport = offsetMapViewport({
  //       width,
  //       height,
  //       zoom,
  //       offset: [0, height / 4],
  //       ...loc
  //     });
  //   }
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
      dragged,
      data,
      padding
    } = this.props;

    const { viewport } = this.state;

    // const somPos = data.map(d => [width / 2, height / 2]); // somFy(data, width, height);

    const nodes = this.layout();

    // const newPos = nodes.map(d => transEvent.apply([d.x, d.y]));
    // TODO: change later
    // const selectedTags = selectedCardId ? tagNode && tagNode.tags : [];

    if (mode === 'geo') {
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
          <MapGL
            mapStyle="mapbox://styles/jmaushag/cjesg6aqogwum2rp1f9hdhb8l"
            onViewportChange={viewport => {
              onMapViewportChange(viewport);
              this.setState({
                viewport: new PerspectiveMercatorViewport(viewport)
              });
            }}
            height={height}
            width={width}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
          >
            <UserOverlay {...viewport} location={userLocation} />
          </MapGL>
          {nodes.map(attr => children({ ...attr, selectedCardId }))}
        </div>
      );
    }

    if (mode === 'floorplan') {
      const xFloorScale = d3
        .scaleLinear()
        .domain(d3.extent(nodes, d => d.floorLoc.x))
        .range([0, width]);

      const yFloorScale = d3
        .scaleLinear()
        .domain(d3.extent(nodes, d => d.floorLoc.y))
        .range([0, height]);

      return (
        <div
          style={{
            backgroundImage: `url(${floorplanImg})`,
            // backgroundRepeat: 'round',
            backgroundSize: 'cover',
            width,
            height
          }}
        >
          {children}
          {nodes.map(n =>
            children({
              ...n,
              x: xFloorScale(n.floorLoc ? n.floorLoc.x : width / 2),
              y: yFloorScale(n.floorLoc ? n.floorLoc.y : height / 2)
            })
          )}
        </div>
      );
    }

    return (
      <div>
        <div style={{ zIndex: 10000, marginTop: 30, display: 'none' }}>
          <label htmlFor="fader">Volume</label>
          <input type="range" min="0" max="5" value="3" id="fader" />
        </div>
        <ZoomContainer
          width={width}
          height={height}
          center={[width / 2, height / 2 + padding.top]}
          nodes={nodes}
          selectedId={selectedCardId}
          onZoom={() => null}
        >
          {(zoomedNodes, transform) => (
            <Cluster
              sets={sets}
              scale={transform.k}
              nodes={zoomedNodes}
              width={width}
              height={height}
              colorScale={colorScale}
              labels={labels}
            >
              {children}
            </Cluster>
          )}
        </ZoomContainer>
      </div>
    );
  }
}

export default ForceOverlay;
