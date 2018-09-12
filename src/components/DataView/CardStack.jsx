import React from 'react';
import PropTypes from 'prop-types';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/CardStack';

const isPosInt = n => Number.isInteger(n) && n >= 0;

function CardStack({
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
  ...props
}) {
  const cardIndex = cards.findIndex(c => c.id === selectedCardId);
  return (
    <Stack
      data={cards}
      className={className}
      duration={600}
      centered={isPosInt(cardIndex)}
      selectedIndex={cardIndex}
      width={width}
      height={height}
      slotSize={slotSize}
      unit={unit}
      style={{
        zIndex: 3000
      }}
      {...props}
    >
      {d => (
        <PreviewCard
          {...d}
          onClick={() => onClick(d)}
          tagColorScale={tagColorScale}
          key={d.id}
          edit={d.template}
          selected={selectedCardId === d.id}
          style={{
            transition: `transform 1s`,
            // TODO: change later
            height: '100%',
            transform: selectedCardId === d.id && 'scale(1.2)'
            // zIndex: selectedCardId === d.id && 2000,
            // opacity: d.template && 0.8
          }}
        />
      )}
    </Stack>
  );
}

CardStack.defaultProps = {};

CardStack.propTypes = {};

export default CardStack;
