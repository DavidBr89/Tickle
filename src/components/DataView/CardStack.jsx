import React from 'react';
import PropTypes from 'prop-types';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/Stack';
import DelayClick from 'Components/utils/DelayClick';

//TODO: do my own
import Swipe from 'react-easy-swipe';

const isPosInt = n => Number.isInteger(n) && n >= 0;

const TouchableCard = ({ touch, onClick, ...d }) =>
  touch && !d.selected ? (
    <Swipe onSwipeStart={onClick} style={{ width: '100%', height: '100%' }}>
      <PreviewCard {...d} />
    </Swipe>
  ) : (
    <DelayClick delay={500} onClick={onClick}>
      <PreviewCard {...d} />
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
  cardHeight,
  unit,
  touch,
  ...props
}) {
  const cardIndex = cards.findIndex(c => c.id === selectedCardId);
  return (
    <Stack
      data={cards}
      className={className}
      duration={400}
      centered={isPosInt(cardIndex)}
      selectedIndex={cardIndex}
      width={width}
      height={height}
      slotSize={slotSize}
      unit={unit}
      {...props}
    >
      {d => (
        <TouchableCard
          {...d}
          touch={touch}
          onClick={() => {
            // e.stopPropagation();
            onClick(d);
          }}
          tagColorScale={tagColorScale}
          key={d.id}
          edit={d.template}
          selected={selectedCardId === d.id}
          style={{
            pointerEvents: 'all',
            transition: 'transform 500ms',
            // TODO: change later
            height: '100%',
            // opacity: d.accessible ? 1 : 0.7,
            transform: selectedCardId === d.id && 'scale(1.2)'
            // zIndex: selectedCardId === d.id && 2000,
            // opacity: d.template && 0.8
          }}
        />
      )}
    </Stack>
  );
}

CardStackWrapper.defaultProps = {};

CardStackWrapper.propTypes = {};

export default CardStackWrapper;
