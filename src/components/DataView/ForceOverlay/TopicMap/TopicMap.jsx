import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// import ReactDOM from 'react-dom';

import { intersection } from 'lodash';

import ZoomCont from '../ZoomContainer';

import floorplanImg from '../floorplan.png';

import FloorCluster from '../FloorCluster';

import Floorplan from './Floorplan';
import PreviewMarker from 'Utils/PreviewMarker';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCardFilter, removeCardFilter } from 'Reducers/DataView/actions';

import CardCluster from '../CardCluster';
import Cluster from '../Cluster';

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

const ToolTip = ({ x, y, cx, cy, px, py, angle, data }) => {
  const { tags } = data;

  const tagsLabel = (
    <div className="flex border border-grey-dark flex-wrap">
      {tags.slice(0, 3).map(d => <div className="m-1">{d}</div>)}
    </div>
  );

  // console.log('tags', tags.slice(0, 3), 'angle', angle);
  const offset = angle => {
    const xOffset = () => {
      const pad = 20;
      if (x - cx > pad) return '-100%'; // orient.right

      if (x - cx < pad) return '0%'; // orient.bottom

      return '50%';
    };

    const yOffset = () => {
      if (y - cy > 0) return '-100%'; // orient.right

      if (y - cy < 0) return '0%'; // orient.bottom
    };

    return `${xOffset()},${yOffset()}`;
  };
  return (
    <React.Fragment>
      <div
        style={{
          maxWidth: 100,
          position: 'absolute',
          left: px,
          top: py,
          background: 'whitesmoke',
          // width: 20,
          // height: 20,
          // borderRadius: '50%',
          transform: `translate(${offset(angle)})`
        }}
      >
        {tagsLabel}
      </div>
      <div
        className="z-50"
        style={{
          position: 'absolute',
          // display: 'none',
          left: cx,
          top: cy,
          width: 20,
          height: 20,
          // background: 'blue',
          transform: 'translate(50%,50%)'
        }}
      />
    </React.Fragment>
  );
};

const Voronoi = ({ data, children, width, height }) => {
  const vor = d3
    .voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([[-1, -1], [width + 1, height + 1]]);

  const polys = vor.polygons(data).map(p => {
    const [cx, cy] = d3.polygonCentroid(p);
    const { x, y } = p.data;
    const angle = Math.round((Math.atan2(cy - y, cx - x) / Math.PI) * 2);
    const [px, py] = offsetPoint({
      x0: x,
      y0: y,
      x1: cx,
      y1: cy,
      angle,
      distance: -10
    });
    return { ...p.data, x, y, cx, cy, angle, px, py };
  });
  return polys.map(children);
};

function ClusterPlaceholder({
  coords: [x, y],
  colorScale,
  tags,
  centroid: [cx, cy],
  size,
  transition,
  onClick,
  values,
  text,
  domNode
  // ...props
}) {
  const content = (
    <button
      className="no-zoom"
      key={tags.join('-')}
      onClick={onClick}
      style={{
        position: 'absolute',
        transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
        width: 80,
        height: 80,
        left: x,
        top: y,
        transform: `translate(-50%,-50%)`,
        cursor: 'pointer',
        pointerEvents: 'all',
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px #24292e',
        border: '#24292e solid 1px',
        borderRadius: '100%',
        overflow: 'hidden',
        zIndex: 100
      }}
    >
      <div
        style={{
          zIndex: -1,
          background: 'whitesmoke',
          pointerEvents: 'none',
          opacity: 0.8,
          width: '100%',
          height: '100%',
          position: 'absolute',
          borderRadius: '100%'
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'whitesmoke',
          pointerEvents: 'none',
          // padding: '10.65%',
          // background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'

          // flexDirection: 'column'
          // padding: '14.65%'
        }}
      >
        <div
          style={{
            pointerEvents: 'none'
          }}
        >
          {values.length}
        </div>
        <div
          className="ml-1"
          style={{
            pointerEvents: 'none'
          }}
          style={{ width: 25, height: 25 }}
        >
          <PreviewMarker style={{ pointerEvents: 'none' }} />
        </div>
      </div>
    </button>
  );

  return content;
  // return ReactDOM.createPortal(content, domNode);
}
ClusterPlaceholder.propTypes = { transition: PropTypes.array };
ClusterPlaceholder.defaultProps = { transition: 500 };

class ClusteredFloor extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      width,
      height,
      selectedCardId,
      colorScale,
      noPreview,
      addCardFilter,
      removeCardFilter,
      children,
      data,
      filterSet
    } = this.props;

    const card = data.filter(n => n.id === selectedCardId).map(children);
    return (
      <div ref={e => (this.container = e)}>
        {card}
        <Floorplan {...this.props}>
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
                  <Cluster
                    radius={() => 50}
                    nodes={zn}
                    width={width}
                    height={height}
                    colorScale={colorScale}
                  >
                    {clusters => (
                      <React.Fragment>
                        <ArrayPipe array={clusters}>
                          {({ id, x, y, data: d }) => (
                            <CardCluster
                              id={`${x}${y}`}
                              coords={[x, y]}
                              centroid={[x, y]}
                              size={65}
                              data={d}
                              onClick={() => {
                                // TODO
                                // preview(d.values[0]);
                              }}
                            >
                              {children}
                            </CardCluster>
                          )}
                        </ArrayPipe>

                        <Links data={clusters} />
                        <Voronoi width={width} height={height} data={clusters}>
                          {p => <ToolTip {...p} />}
                        </Voronoi>
                      </React.Fragment>
                    )}
                  </Cluster>
                </div>
              )}
            </ZoomCont>
          )}
        </Floorplan>
      </div>
    );
  }
}

const mapStateToProps = state => ({ filterSet: state.DataView.filterSet });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCardFilter,
      removeCardFilter
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...dispatchProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ClusteredFloor);
