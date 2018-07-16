import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
import ExtendableMarker from 'Utils/ExtendableMarker';

// import { dragCard } from 'Reducers/Cards/actions';
import { changeMapViewport } from 'Reducers/Map/actions';
import { GEO, TAGS, FLOORPLAN } from 'Constants/dataViews';

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

class DataOverlay extends Component {
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
    mode: PropTypes.oneOf([GEO, TAGS, FLOORPLAN]),
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
  componentWillUnmount() {
    // clearTimeout(this.id);
    // this.ids.map(clearTimeout);
  }

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
      // dragCard,
      extCardId,
      // isCardDragging,
      preview
    } = this.props;

    // x={extCardId === c.id ? width / 2 : x}
    // y={extCardId === c.id ? height / 2 : y}
    const draggable = c => (
      <ExtendableMarker
        key={c.id}
        delay={100}
        width={extCardId === c.id ? width : 25}
        height={extCardId === c.id ? height : 30}
        center={[width / 2, height / 2]}
        x={extCardId === c.id ? width / 2 : c.x}
        y={extCardId === c.id ? height / 2 : c.y}
        extended={extCardId === c.id}
        preview={preview(c)}
        style={{ zIndex: selectedCardId === c.id ? 5000 : null }}
      >
        {children(c)}
      </ExtendableMarker>
    );

    const nonDraggable = c => (
      <ExtendableMarker
        key={c.id}
        delay={10}
        width={extCardId === c.id ? width : 25}
        height={extCardId === c.id ? height : 30}
        center={[width / 2, height / 2]}
        x={extCardId === c.id ? width / 2 : c.x}
        y={extCardId === c.id ? height / 2 : c.y}
        extended={extCardId === c.id}
        preview={null}
      >
        {children(c)}
      </ExtendableMarker>
    );

    const { loc } = data.find(d => d.id === selectedCardId) || {
      loc: userLocation
    };

    switch (mode) {
      case GEO: {
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
              disabled={disabled}
              nodes={data}
              colorScale={colorScale}
              preview={nonDraggable}
            >
              {draggable}
            </Map>
          </div>
        );
      }
      case FLOORPLAN: {
        return (
          <DimWrapper>
            {(w, h) => (
              <Floorplan
                {...this.props}
                width={width}
                height={height}
                data={data}
              >
                {draggable}
              </Floorplan>
            )}
          </DimWrapper>
        );
      }
      case TAGS: {
        return (
          <div style={{ ...style, height: '100%' }}>
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
                >
                  {nonDraggable}
                </TreeMapCluster>
              )}
            </DimWrapper>
          </div>
        );
      }
      default: {
        return <div>Unknown dataView {mode}</div>;
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
      changeMapViewport,
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
  // Cards: { isCardDragging },
  DataView: { extCardId, selectedCardId, authEnv }
}) {
  return { extCardId, selectedCardId };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // dragCard,
      changeMapViewport
    },
    dispatch
  );

const ConnectedDataOverlay = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataOverlay);

export default ConnectedDataOverlay;
