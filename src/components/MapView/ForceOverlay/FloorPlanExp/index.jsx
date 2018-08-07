import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ZoomCont from '../ZoomContainer';

import floorplanImg from '../floorplan.png';

import FloorPlan from './Floorplan';
import ClusteredFloor from './ClusteredFloor';

class FloorWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  zoomable = nn => {
    const { width, height, selectedCardId, children } = this.props;
    return (
      <ZoomCont
        {...this.props}
        data={nn}
        center={[width / 2, height / 2]}
        selectedId={selectedCardId}
      >
        {(zn, zHandler) => (
          <div>
            <img
              width={width}
              height={height}
              src={floorplanImg}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${zHandler.x}px,${zHandler.y}px) scale(${
                  zHandler.k
                })`,
                transformOrigin: '0 0'
              }}
            />

            <div>{zn.map(d => children({ ...d, zhandler: zHandler }))}</div>
          </div>
        )}
      </ZoomCont>
    );
  };

  notZoomable = nn => {
    const { width, height, children } = this.props;
    return (
      <div>
        <img
          width={width}
          height={height}
          src={floorplanImg}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: '0 0'
          }}
        />

        <div>{nn.map(children)}</div>
      </div>
    );
  };

  render() {
    const { width, height, selectedCardId, children, zoom } = this.props;
    return (
      <FloorPlan {...this.props}>
        {nn => (zoom ? this.zoomable(nn) : this.notZoomable(nn))}
      </FloorPlan>
    );
  }
}

function index({ edit, children, ...props }) {
  return edit ? (
    <FloorWrapper {...props}>{children}</FloorWrapper>
  ) : (
    <ClusteredFloor {...props} />
  );
}

index.defaultProps = {};

index.propTypes = {};
export default index;
