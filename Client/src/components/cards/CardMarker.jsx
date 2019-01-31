import React, {useState} from 'react';
// import PropTypes from 'prop-types';

import IcAk from '~/styles/alphabet_icons/ic_ak.svg';

export default function CardMarker(props) {
  const {
    challenge,
    center,
    style,
    edit,
    onClick,
    width,
    height,
    color,
    shadow,
    // tags,
    className,
    selected
  } = props;

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`cardmarker bg-white ${className}`}
      style={{
        transform: `scale(${hovered || selected ? 1.4 : 1})`,
        transition: 'transform 300ms',
        width: 25,
        height: 30,
        ...style
      }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={onClick}>
      <div
        className="border-2 border-black flex-col-wrapper"
        style={{padding: 2}}>
        <div className="flex-grow flex-col-wrapper relative justify-center bg-yellow-dark">
          <img src={IcAk} className="p-1" alt="card icon" />
        </div>
      </div>
    </div>
  );
}
