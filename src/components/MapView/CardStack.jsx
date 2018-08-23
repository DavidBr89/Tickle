import React from 'react';
import PropTypes from 'prop-types';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/CardStack';

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
  return (
    <Stack
      data={cards}
      className={className}
      duration={600}
      centered={selectedCardId !== null}
      selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
      width={width}
      height={height}
      slotSize={slotSize}
      unit={unit}
      style={{
        zIndex: 1000
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
            height: cardHeight,
            transform: selectedCardId === d.id && 'scale(1.2)',
            // zIndex: selectedCardId === d.id && 2000,
            opacity: d.template && 0.8
          }}
        />
      )}
    </Stack>
  );
}

CardStack.defaultProps = {};

CardStack.propTypes = {};

export default CardStack;
