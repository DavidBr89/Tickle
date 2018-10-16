import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// import ReactDOM from 'react-dom';

import { intersection } from 'lodash';

import ZoomCont from 'Components/DataView/ForceOverlay/ZoomContainer';

import floorplanImg from 'Components/DataView/ForceOverlay/floorplan.png';

import FloorCluster from 'Components/DataView/ForceOverlay/FloorCluster';

import NodeForce from 'Components/DataView/ForceOverlay/NodeForce';
import PreviewMarker from 'Utils/PreviewMarker';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCardFilter, removeCardFilter } from 'Reducers/DataView/actions';

import CardCluster from 'Components/DataView/ForceOverlay/CardCluster';
import Cluster from 'Components/DataView/ForceOverlay/Cluster';

import ArrayPipe from 'Components/utils/ArrayPipe';

function offsetPoint({ x0, y0, x1, y1, angle, distance }) {
  const distX = x1 - x0;
  const distY = y1 - y0;
  const mX = distX < 0 ? -1 : 1;
  const mY = distY < 0 ? -1 : 1;
  const midX = x0 + distX * 0.2 + mX * 20;
  const midY = y0 + distY * 0.2 + mY * 20;
  return [midX, midY];
}

const Links = ({ data }) => data.map(d => <div />);

export default class TopicMapAuthor extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { width, height, selectedCardId, children, data } = this.props;

    return (
      <NodeForce {...this.props}>
        {nn => (
          <ZoomCont
            {...this.props}
            data={nn}
            center={[width / 2, (height * 2) / 3]}
            selectedId={selectedCardId}
          >
            {(zn, zHandler) => (
              <div>
                <img
                  width={width}
                  height={(height * 2) / 3}
                  src={floorplanImg}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    pointerEvents: 'none',
                    // zIndexx: 4000,
                    transform: `translate(${zHandler.x}px,${
                      zHandler.y
                    }px) scale(${zHandler.k})`,
                    transformOrigin: '0 0'
                  }}
                />
                {zn.map(children)}
              </div>
            )}
          </ZoomCont>
        )}
      </NodeForce>
    );
  }
}
