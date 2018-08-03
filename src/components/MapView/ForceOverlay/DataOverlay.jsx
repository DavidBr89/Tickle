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

import { Modal, BareModal, ModalBody } from 'Utils/Modal';

// import│ {shallowEqualProps} from'shallow-equal-props';

// import louvain from './jlouvain';

import Map from './Map';
import Floorplan from './Floorplan';
import TreeMapCluster from './TreeMapCluster';

// const offsetMapViewport = ({
//   width,
//   height,
//   zoom,
//   latitude,
//   longitude,
//   offset: [offsetX = 0, offsetY = 0]
// }) => {
//   const vp = new PerspectiveMercatorViewport({
//     width,
//     height,
//     zoom,
//     latitude,
//     longitude
//   });
//
//   const [offsetLng, offsetLat] = vp.unproject([
//     offsetX ? width / 2 - offsetX : width / 2,
//     offsetY ? height / 2 - offsetY : height / 2
//   ]);
//
//   const ret = new PerspectiveMercatorViewport({
//     width,
//     height,
//     zoom,
//     latitude: offsetLat,
//     longitude: offsetLng
//   });
//   // console.log('return', longitude, latitude, offsetLng, offsetLat);
//   return ret;
// };

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

    // TODO: join
    const draggable = c => (
      <ExtendableMarker
        key={c.id}
        delay={100}
        width={25}
        height={30}
        x={c.x || width / 2}
        y={c.y || height / 2}
        extended={false}
        preview={preview(c)}
      >
        {null}
      </ExtendableMarker>
    );

    // TODO: remove
    const noPreview = c => (
      <ExtendableMarker
        key={c.id}
        delay={100}
        width={25}
        height={30}
        center={[width / 2, height / 2]}
        preview={null}
        x={width / 2}
        y={height / 2}
      >
        {children(c)}
      </ExtendableMarker>
    );

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
              ...style
            }}
          >
            <Map
              width={width}
              height={height}
              disabled={disabled}
              nodes={data}
              colorScale={colorScale}
              preview={noPreview}
            >
              {draggable}
            </Map>
          </div>
        );
      }
      case FLOORPLAN: {
        return (
          <Floorplan {...this.props} width={width} height={height} data={data}>
            {draggable}
          </Floorplan>
        );
      }
      case TAGS: {
        return (
          <div
            style={{
              ...style,
              height: '100%',
              // TODO: check later
              paddingLeft: 7,
              paddingRight: 15
            }}
          >
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
                  {d => null}
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
      extCardId,
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
    const selected =
      extCardId && selectedCardId && extCardId === selectedCardId;

    const cardData = data.find(d => d.id === selectedCardId);
    console.log('cardData', cardData);
    return (
      <React.Fragment>
        <BareModal visible={selected}>
          {selected && children(cardData)}
        </BareModal>
        {comp}
      </React.Fragment>
    );
  }
}

export default DataOverlay;
