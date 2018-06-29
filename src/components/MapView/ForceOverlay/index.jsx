import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
import ExtendableMarker from 'Utils/ExtendableMarker';

import { dragCard } from 'Reducers/Cards/actions';
// import│ {shallowEqualProps} from'shallow-equal-props';

// import louvain from './jlouvain';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';

import Map from './Map';
import Floorplan from './Floorplan';
import TreeMapCluster from './TreeMapCluster';

import { Card, CardMarker, PreviewCard } from 'Cards';

const PreviewMarker = ({ selected, template, color, r = 25 }) => (
  <div
    className="w-100 h-100"
    style={{
      position: 'relative',
      transform: selected && 'scale(1.5)',
      zIndex: selected && 5000,
      transition: 'transform 1s',
      height: 2 * r,
      width: 2 * r
    }}
  >
    <CardMarker
      color={color}
      style={{
        opacity: 1,
        position: 'absolute',
        transform: `translateX(3px)`,
        // border: 'black 1px solid',
        // zIndex: -100,
        width: r, // '13vw',
        height: r // '13vw',
      }}
    />
  </div>
);

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

  // constructor(props) {
  //   super(props);
  //   const { data } = props;
  //   const { width, height, onMapViewportChange, userLocation } = props;
  //
  //   const initPos = data.map(() => [width / 2, height / 2]);
  //
  //   // data.map(d => ([width/2, height/2]));
  //   const nodes = data.map(d => ({ ...d, x: width / 2, y: height / 2 }));
  // }
  //
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
  selectComp = () => {
    const {
      mode,
      data,
      selectedCardId,
      userLocation,
      className,
      style,
      onViewportChange,
      disabled,
      width,
      height,
      onMapViewportChange,
      children,
      sets,
      filterSet,
      padding,
      colorScale,
      dragCard,
      extCardId,
      isCardDragging
    } = this.props;

    // x={extCardId === c.id ? width / 2 : x}
    // y={extCardId === c.id ? height / 2 : y}
    const draggable = c => (
      <ExtendableMarker
        key={c.id}
        delay={10}
        width={extCardId === c.id ? width : 25}
        height={extCardId === c.id ? height : 30}
        center={[width / 2, height / 2]}
        x={extCardId === c.id ? width / 2 : c.x}
        y={extCardId === c.id ? height / 2 : c.y}
        extended={extCardId === c.id}
        preview={
          <DragSourceCont dragHandler={dragCard} data={c} x={c.x} y={c.y}>
            <PreviewMarker
              selected={selectedCardId === c.id}
              template={c.template}
              color="whitesmoke"
            />
          </DragSourceCont>
        }
      >
        {children(c)}
      </ExtendableMarker>
    );

    const { loc } = data.find(d => d.id === selectedCardId) || {
      loc: userLocation
    };

    switch (mode) {
      case 'geo': {
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
              disabled={disabled}
              {...loc}
              zoom={10}
              nodes={data}
              selectedId={selectedCardId}
            >
              {d => draggable({ ...d })}
            </Map>
          </div>
        );
      }
      case 'floorplan': {
        return (
          <DimWrapper>
            {(w, h) => (
              <Floorplan
                {...this.props}
                width={width}
                height={height}
                nodes={data}
              >
                {draggable}
              </Floorplan>
            )}
          </DimWrapper>
        );
      }
      default: {
        return (
          <div style={{ ...style, height: '86%' }}>
            <DimWrapper>
              {(w, h) => (
                <TreeMapCluster
                  {...this.props}
                  sets={sets}
                  data={data}
                  width={w}
                  height={h}
                  center={[width / 2, (height * 3) / 4]}
                  filterSet={filterSet}
                  selectedId={selectedCardId}
                  colorScale={colorScale}
                  padding={padding}
                />
              )}
            </DimWrapper>
          </div>
        );
      }
    }
  };

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
      // TODO: Remove this check
      disabled,
      data,
      padding,
      filterSet
    } = this.props;

    const comp = this.selectComp();

    return comp;
  }
}

function mapStateToProps({
  Cards: { extCardId, isCardDragging, selectedCardId }
}) {
  return { extCardId, isCardDragging, selectedCardId };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dragCard
    },
    dispatch
  );

const DataOverlay = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForceOverlay);

export default DataOverlay;
