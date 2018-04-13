import React from 'react';
import PropTypes from 'prop-types';
// import { colorScale, shadowStyle } from '../cards/styles';

function Tag({
  children,
  onClick,
  className,
  barWidth,
  style,
  innerStyle,
  innerClassName,
  color
}) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        // padding: '0.25rem',
        borderRadius: '10%',
        zIndex: 2000,
        minWidth: '20vw',
        background: 'white',
        position: 'relative',
        boxShadow: '0.3rem 0.3rem grey',
        border: 'var(--black) 2px solid',
        display: 'inline-flex',
        justifyContent: 'center',
        ...style
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '0',
          width: barWidth,
          transition: 'width 0.5s',
          height: '100%',
          background: color,
          zIndex: -1
        }}
      />
      <div
        className="m-1"
        style={{
          zIndex: 2000
        }}
      >
        <div className={innerClassName} style={innerStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

Tag.defaultProps = {
  children: 'Undefined',
  style: {},
  className: '',
  innerClassName: '',
  barWidth: 0,
  onClick: d => d,
  innerStyle: {},
  color: 'green'
};

Tag.propTypes = {
  style: PropTypes.object,
  innerStyle: PropTypes.object,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  children: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  barWidth: PropTypes.number
};

export default Tag;
