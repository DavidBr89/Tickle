import React from 'react';
import PropTypes from 'prop-types';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/Stack';
import DelayClick from 'Components/utils/DelayClick';

import Dimensions from 'Utils/DimensionsWrapper';

// TODO: do my own
import Swipe from 'react-easy-swipe';

const isPosInt = n => Number.isInteger(n) && n >= 0;

const TouchableCard = ({ touch, onClick, className, ...d }) =>
  touch && !d.selected ? (
    <Swipe
      className={className}
      onSwipeStart={onClick}
      style={{ width: '100%', height: '100%' }}
    >
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
  unit,
  touch,
  ...props
}) {
  const cardIndex = cards.findIndex(c => c.id === selectedCardId);

  // const cardStackWidth = width;
  const cardWidth = Math.min(width / 3.5, 200);
  const cardHeight = Math.min(height, 250);

  return (
    <Dimensions className={className}>
      {(w, h) => (
        <Stack
          data={cards}
          duration={400}
          centered={isPosInt(cardIndex)}
          selectedIndex={cardIndex}
          width={w}
          height={h}
          slotSize={Math.min(w / 3.5, 200)}
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
                transform: selectedCardId === d.id && 'scale(1.2)',
                zIndex: selectedCardId === d.id && 2000
                // opacity: d.template && 0.8
              }}
            />
          )}
        </Stack>
      )}
    </Dimensions>
  );
}

CardStackWrapper.defaultProps = {};

CardStackWrapper.propTypes = {};

export default CardStackWrapper;
