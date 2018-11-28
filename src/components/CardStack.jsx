import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';
import Stack from 'Utils/Stack';
import DelayClick from 'Components/utils/DelayClick';

import Dimensions from 'Utils/DimensionsWrapper';

// TODO: do my own
import Swipe from 'react-easy-swipe';

const isPosInt = n => Number.isInteger(n) && n >= 0;

const TouchableCard = ({touch, onClick, className, ...d}) =>
  touch && !d.selected ? (
    <Swipe onSwipeStart={onClick} className={className}>
      <PreviewCard {...d} />
    </Swipe>
  ) : (
    <DelayClick delay={500} onClick={onClick}>
      <PreviewCard {...d} className={className} />
    </DelayClick>
  );

function CardStackWrapper({
  className,
  cards,
  selectedCardId,
  tagColorScale,
  width,
  height,
  slotSize,
  onClick,
  unit,
  touch,
  style,
  cardWidth,
  cardHeight,
  ...props
}) {
  const cardIndex = cards.findIndex(c => c.id === selectedCardId);

  // const cardStackWidth = width;

  return (
    <Stack
      style={style}
      className={className}
      data={cards}
      duration={400}
      centered={isPosInt(cardIndex)}
      selectedIndex={cardIndex}
      width={width}
      slotSize={cardWidth}
      {...props}>
      {d => (
        <div className="p-2 w-full h-full">
          <TouchableCard
            className="w-full h-full"
            {...d}
            touch={touch}
            onClick={() => {
              // e.stopPropagation();
              onClick(d);
            }}
            key={d.id}
            edit={d.template}
            selected={selectedCardId === d.id}
            style={{
              pointerEvents: 'all',
              transition: 'transform 500ms',
              // TODO: change later
              height: '100%',
              // opacity: d.accessible ? 1 : 0.7,
              transform: selectedCardId === d.id && 'scale(1.2)',
              zIndex: selectedCardId === d.id && 2000,
              // opacity: d.template && 0.8
            }}
          />
        </div>
      )}
    </Stack>
  );
}

CardStackWrapper.defaultProps = {
  className: 'ml-1 mr-1',
  cards: [],
  selectedCardId: null,
  width: 0,
  height: 0,
  slotSize: 0,
  onClick: d => d,
  unit: 'px',
  touch: false,
};

CardStackWrapper.propTypes = {
  className: PropTypes.string,
  cards: PropTypes.array,
  selectedCardId: PropTypes.oneOf([null, PropTypes.number]),
  width: PropTypes.number,
  height: PropTypes.number,
  slotSize: PropTypes.number,
  onClick: PropTypes.func,
  unit: PropTypes.string,
  touch: PropTypes.bool,
};

const CardStackContainer = ({
  concealCardStack,
  cardMinHeight = 200,
  cardMinWidth = 180,
  ...props
}) => {
  const {height, width, bottom} = props;

  const cardHeight = Math.min(height / 4, cardMinHeight);
  const cardWidth = Math.min(width / 3, cardMinWidth);

  return (
    <CardStackWrapper
      {...props}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
      className="mt-24 flex justify-center pl-4 pr-4  z-40 pt-2"
      style={{
        flex: `0 0 ${cardHeight}px`,
        transition: 'margin 0.5s',
        pointerEvents: 'none',
        marginTop: bottom ? height - cardHeight / 3 : null,
      }}
    />
  );
};

export default CardStackContainer;
