import React from 'react';
import PropTypes from 'prop-types';

const PreviewCardStack = ({ values, name, style }) => (
  <div style={style} className="flex flex-col">
    <div className="flex-grow flex flex-col p-1">
      <div className="flex-grow relative mt-2 mr-3 mb-3">
        <div
          className="border border-black bg-white h-full w-full absolute"
          style={{ transform: 'translate3d(10px,10px,-200px)' }}
        />
        <div
          className="border border-black bg-white h-full w-full absolute"
          style={{ transform: 'translate3d(5px,5px,-100px)' }}
        />
        <div
          className="flex flex-col justify-center border border-black bg-white h-full w-full absolute p-2"
          style={{ transform: 'translate3d(0,0,-150px)' }}
        >
          <h4 style={{ wordBreak: 'break-all' }}>{name}</h4>
          <div className="flex-grow flex justify-center items-center">
            <div className="rounded-full h-10 w-10 flex items-center justify-center bg-grey-light">
              {values.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

PreviewCardStack.defaultProps = {
  cards: [],
  style: {}
};

PreviewCardStack.propTypes = {};

export default PreviewCardStack;
