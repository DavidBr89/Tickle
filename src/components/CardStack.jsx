import React from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';
import Stack from 'Utils/Stack';
import DelayClick from 'Components/utils/DelayClick';

import Dimensions from 'Utils/DimensionsWrapper';

// TODO: do my own
import Swipe from 'react-easy-swipe';

const isPosInt = n => Number.isInteger(n) && n >= 0;

const TouchableCard = ({
  touch, onClick, className, ...d
}) => (touch && !d.selected ? (
  <Swipe onSwipeStart={onClick}>
    <div className="pl-2 pr-2"><PreviewCard {...d} className="h-full" /></div>
  </Swipe>
) : (
  <DelayClick delay={500} onClick={onClick}>
    <div className="pl-2 pr-2"><PreviewCard {...d} clas="h-full" /></div>
  </DelayClick>
));

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
    <Dimensions className={`${className} z-10`}>
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

CardStackWrapper.defaultProps = {
  className: 'ml-1 mr-1',
  cards: [],
  selectedCardId: null,
  width: 0,
  height: 0,
  slotSize: 0,
  onClick: d => d,
  unit: 'px',
  touch: false
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
  touch: PropTypes.bool
};

const CardStackContainer = ({ concealCardStack, ...props }) => {
  const {
    height, width, bottom
  } = props;

  const cardHeight = height / 4;
  return <div className="overflow-hidden">
    <div
      className="mt-24 flex justify-center w-full z-40 pt-2"
      style={{
        transition: 'margin 0.5s',
        pointerEvents: 'none',
        // height: cardHeight,
        marginTop: bottom ? height - cardHeight / 3 : null
        // overflow: bottom ? 'hidden' : null
        // width,
        // opacity: cardPanelVisible ? 1 : 0
      }}
    >
      <CardStackWrapper {...props} />
    </div>
  </div>;
};

export default CardStackContainer;
