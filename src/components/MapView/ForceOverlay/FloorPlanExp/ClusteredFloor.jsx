import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ZoomCont from '../ZoomContainer';

import floorplanImg from '../floorplan.png';

import FloorCluster from '../FloorCluster';

import Floorplan from './Floorplan';
import PreviewMarker from 'Utils/PreviewMarker';

function ClusterPlaceholder({
  coords: [x, y],
  colorScale,
  tags,
  centroid: [cx, cy],
  size,
  transition,
  onClick
  // ...props
}) {
  return (
    <div
      key={tags.join('-')}
      onClick={onClick}
      style={{
        position: 'absolute',
        transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
        width: size,
        height: size,
        left: x,
        top: y,
        transform: `translate(-50%,-50%)`,
        // background: 'white',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px #24292e',
        border: '#24292e solid 1px',
        borderRadius: '100%'
        // overflow: 'hidden'
      }}
    >
      <div
        style={{
          zIndex: -1,
          background: 'whitesmoke',
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
          padding: '10.65%'
          // padding: '14.65%'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {tags.map(t => (
            <div
              className="mb-1 mr-1"
              style={{
                fontSize: 14,
                background: colorScale(t),
                maxWidth: '100%'
              }}
            >
              <div
                style={{
                  // width: '150%',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {t}
              </div>
            </div>
          ))}
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
    const { width, height, selectedCardId, colorScale } = this.props;
    return (
      <Floorplan {...this.props}>
        {nn => (
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
                    transform: `translate(${zHandler.x}px,${
                      zHandler.y
                    }px) scale(${zHandler.k})`,
                    transformOrigin: '0 0'
                  }}
                />

                <FloorCluster
                  radius={d =>
                    // console.log('d', d);
                    60
                  }
                  nodes={zn}
                  width={width}
                  height={height}
                  colorScale={colorScale}
                >
                  {cls =>
                    cls.map(
                      ({ centerPos: [x, y], ...d }) =>
                        zHandler.k > 3 ? (
                          <PreviewMarker
                            key={d.id}
                            delay={100}
                            width={25}
                            height={30}
                            x={x}
                            y={y}
                            onClick={() => console.log('yeah')}
                          />
                        ) : (
                          <ClusterPlaceholder
                            onClick={d => console.log('click')}
                            coords={[x, y]}
                            centroid={[x, y]}
                            size={Math.min(
                              160,
                              Math.max(40, 30 + d.tags.length * 9)
                            )}
                            colorScale={colorScale}
                            tags={d.tags}
                          />
                        )
                    )
                  }
                </FloorCluster>
              </div>
            )}
          </ZoomCont>
        )}
      </Floorplan>
    );
  }
}

export default ClusteredFloor;
