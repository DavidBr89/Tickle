import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { intersection } from 'lodash';

import ZoomCont from '../ZoomContainer';

import floorplanImg from '../floorplan.png';

import FloorCluster from '../FloorCluster';

import Floorplan from './Floorplan';
import PreviewMarker from 'Utils/PreviewMarker';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCardFilter } from 'Reducers/DataView/actions';

function ClusterPlaceholder({
  coords: [x, y],
  colorScale,
  tags,
  centroid: [cx, cy],
  size,
  transition,
  onClick,
  values,
  text
  // ...props
}) {
  return (
    <div
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
        // pointerEvents: 'none',
        background: 'white',
        // zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px #24292e',
        border: '#24292e solid 1px',
        borderRadius: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          zIndex: -1,
          background: 'whitesmoke',
          // pointerEvents: 'all',
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
          // pointerEvents: 'none',
          background: 'whitesmoke',
          // padding: '10.65%',
          // background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
          // flexDirection: 'column'
          // padding: '14.65%'
        }}
      >
        <div>{values.length}</div>
        <div className="ml-1" style={{ width: 25, height: 25 }}>
          <PreviewMarker />
        </div>
      </div>
    </div>
  );
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
      children,
      data
    } = this.props;

    const card = data.filter(n => n.id === selectedCardId).map(children);
    return (
      <React.Fragment>
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
                      // pointerEvents: 'all',
                      // zIndex: 100,
                      transform: `translate(${zHandler.x}px,${
                        zHandler.y
                      }px) scale(${zHandler.k})`,
                      transformOrigin: '0 0'
                    }}
                  />

                  <FloorCluster
                    radius={d =>
                      // console.log('d', d);
                      50
                    }
                    nodes={zn}
                    width={width}
                    height={height}
                    colorScale={colorScale}
                  >
                    {cls => (
                      <React.Fragment>
                        {cls.map(
                          ({ centerPos: [x, y], ...d }) =>
                            d.values.length === 1 ? (
                              <PreviewMarker
                                key={d.id}
                                delay={100}
                                width={25}
                                height={30}
                                x={x}
                                y={y}
                                style={{
                                  transform:
                                    selectedCardId === d.id && 'scale(2)'
                                }}
                                onClick={() => console.log('yeah')}
                              />
                            ) : (
                              <ClusterPlaceholder
                                onClick={() => {
                                  console.log('yeah', d.values);
                                  const commons = intersection(
                                    ...d.values.map(e => e.tags)
                                  );
                                  commons.length > 0 &&
                                    addCardFilter(commons[0]);
                                }}
                                text={intersection(
                                  ...d.values.map(e => e.tags)[0]
                                )}
                                coords={[x, y]}
                                centroid={[x, y]}
                                size={40}
                                colorScale={colorScale}
                                {...d}
                              />
                            )
                        )}
                      </React.Fragment>
                    )}
                  </FloorCluster>
                </div>
              )}
            </ZoomCont>
          )}
        </Floorplan>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addCardFilter
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
