import React from 'react';
import PropTypes from 'prop-types';
import PreviewCard from '~/components/cards/PreviewCard';

const PreviewCardStack = ({values, id, className, onClick, style}) => (
  <div
    style={style}
    className={`cursor-pointer flex flex-col ${className}`}
    onClick={onClick}>
    <div className="flex-grow flex flex-col ">
      <div className="flex-grow relative mt-2 mr-3 mb-3">
        <div
          className="border-2 border-black bg-white h-full w-full absolute"
          style={{transform: 'translate3d(10px,10px,-200px)'}}
        />
        <div
          className="border-2 border-black bg-white h-full w-full absolute"
          style={{transform: 'translate3d(5px,5px,-100px)'}}
        />
        <div
          className="flex flex-col justify-center border-2 border-black bg-white h-full w-full absolute "
          style={{transform: 'translate3d(0,0,-150px)'}}>
          <PreviewCard title={id} className="flex-grow"/>
        </div>
      </div>
    </div>
  </div>
);

PreviewCardStack.defaultProps = {
  cards: [],
  style: {},
};

PreviewCardStack.propTypes = {};

export default PreviewCardStack;
