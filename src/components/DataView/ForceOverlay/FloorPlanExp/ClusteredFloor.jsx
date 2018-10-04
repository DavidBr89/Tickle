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

const Voronoi = ({ data, children, width, height }) => {
  const vor = d3
    .voronoi()
    .x(d => d.x)
    .y(d => d.y)
    .extent([[-1, -1], [width + 1, height + 1]]);

  const polys = vor.polygons(data);
  console.log('polys', polys);
  return children(polys.map(d3.polygonCentroid));
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
                    radius={() =>
                      // console.log('d', d);
                      40
                    }
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
                              id={id}
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
                        <Voronoi width={width} height={height} data={clusters}>
                          {polygons =>
                            polygons.map(p => (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: p[0],
                                  top: p[1],
                                  background: 'gold',
                                  width: 20,
                                  height: 20
                                }}
                              />
                            ))
                          }
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
