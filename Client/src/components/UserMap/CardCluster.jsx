import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CardMarker from '~/components/cards/CardMarker';

function CardCluster({
  coords: [x, y],
  colorScale,
  data,
  // centroid: [cx, cy],
  size,
  transition,
  id,
  onClick,
  children
  // ...props
}) {
  // TODO: fix
  // if (data.values.length === 1) return children(data.values[0]);

  return (
    <div
      onClick={onClick}
      key={id}
      className="cluster flex absolute items-center justify-center "
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: 'translate(-50%,-50%)'
      }}>
      <div className="w-full h-full" style={{padding: '10.65%'}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
          {children(data)}
          <div className="ml-1">{data.values.length}</div>
        </div>
      </div>
    </div>
  );
}

CardCluster.propTypes = {transition: PropTypes.array};
CardCluster.defaultProps = {transition: 500};

export default CardCluster;
