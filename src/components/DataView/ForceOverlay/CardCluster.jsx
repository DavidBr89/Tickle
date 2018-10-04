import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardMarker from 'Components/cards/CardMarker';

function CardCluster({
  coords: [x, y],
  colorScale,
  data,
  centroid: [cx, cy],
  size,
  transition,
  id,
  onClick,
  children
  // ...props
}) {
  // TODO: fix
  if (data.values.length === 1) return children(data.values[0]);

  return (
    <div
      onClick={onClick}
      className="cluster"
      style={{
        position: 'absolute',
        transition: `left ${transition}ms, top ${transition}ms, width ${transition}ms, height ${transition}ms`,
        width: size,
        height: size,
        left: x,
        top: y,
        transform: `translate(-50%,-50%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '3px 3px #24292e',
        border: '#24292e solid 1px',
        borderRadius: '100%'
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
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div className="mr-1">{data.values.length}</div>
          <CardMarker style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </div>
  );
}

CardCluster.propTypes = { transition: PropTypes.array };
CardCluster.defaultProps = { transition: 500 };

export default CardCluster;
