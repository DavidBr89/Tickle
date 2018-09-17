import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

import DimWrapper from 'Utils/DimensionsWrapper';
// TODO: change
import ExtendableMarker from 'Utils/ExtendableMarker';

// import { dragCard } from 'Reducers/Cards/actions';
import { changeMapViewport } from 'Reducers/Map/actions';
import { GEO, TAGS, FLOORPLAN } from 'Constants/dataViews';

import { Modal, InlineModal, BareModal, ModalBody } from 'Utils/Modal';

// import ZoomCont from './ZoomContainer';

// import│ {shallowEqualProps} from'shallow-equal-props';

// import louvain from './jlouvain';

import Map from './Map';
import Floorplan from './FloorPlanExp';
import TreeMapCluster from './TreeMapCluster';

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
      author,
      // isCardDragging,
      preview,
      showUserLocation
    } = this.props;

    // TODO: join
    const draggable = c =>
      extCardId === c.id ? (
        <BareModal visible>{children({ ...c })}</BareModal>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y,
            transform: 'translate(-50%, -50%)',
            zIndex: selectedCardId === c.id ? 10 : 0
          }}
        >
          {preview(c)}
        </div>
      );

    // TODO: remove
    const noPreview = c =>
      extCardId === c.id ? (
        <BareModal visible>{children({ ...c })}</BareModal>
      ) : null;

    // const noPointerEvents = extCardId !== null;
    switch (mode) {
      case GEO: {
        return (
          <Map
            width={width}
            height={height}
            disabled={disabled}
            showUser={showUserLocation}
            nodes={data}
            colorScale={colorScale}
            preview={noPreview}
          >
            {draggable}
          </Map>
        );
      }
      case FLOORPLAN: {
        return (
          <div ref={zc => (this.zoomCont = zc)}>
            <Floorplan
              {...this.props}
              width={width}
              height={height}
              data={data}
              edit={author}
              colorScale={colorScale}
              zoom
              noPreview={noPreview}
            >
              {author ? draggable : noPreview}
            </Floorplan>
          </div>
        );
      }
      case TAGS: {
        return (
          <div
            style={{
              ...style,
              height: '100%'
              // TODO: check later
              // paddingLeft: 7,
              // paddingRight: 15
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
                  {noPreview}
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
    return (
      <div className={className} style={{ ...style }}>
        {' '}
        {comp}{' '}
      </div>
    );
  }
}

export default DataOverlay;
