import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {ScrollView, ScrollElement} from '~/components/utils/ScrollView';

export default function CardSlideShow({...props}) {
  const {cards, selectedCardId, cardWidth, onClick, children} = props;

  const width = cardWidth;
  const height = 200;

  const scrollCont = React.createRef();
  const wrapperCont = React.createRef();

  useEffect(() => {
    if (selectedCardId !== null)
      scrollCont.current.scrollTo(selectedCardId, {
        behavior: 'smooth',
        inline: 'center'
      });
  }, [selectedCardId]);


  //TODO find a better way to center scrollContainer
  const bufferCont = (
    <div
      className="flex-none z-10"
      style={{
        width: width / 2,
        height,
        scrollSnapAlign: 'start'
      }}
    />
  );

  return (
    <div
      className="flex flex-col"
      style={{
        height: '38vh',
        maxHeight: 300
      }}
      ref={wrapperCont}>
      <ScrollView ref={scrollCont} boundary={wrapperCont}>
        <div
          id="scrollCont"
          className="flex-grow flex overflow-x-auto overflow-y-hidden
        py-8
        "
          style={{
            transition: 'height 300ms, width 300ms',
            scrollSnapPointsX: `repeat(${width / 3}px)`,
            scrollSnapType: 'x mandatory'
          }}>
          {bufferCont}
          {cards.map(c => (
            <ScrollElement name={c.id}>
              <div
                className={`flex-none mx-4 ${
                  selectedCardId === c.id ? 'z-20' : 'z-10'
                }`}
                style={{
                  transform: `scale(${
                    selectedCardId === c.id ? 1.2 : 1
                  })`,
                  transition: 'transform 300ms',
                  width,
                  scrollSnapAlign: 'start'
                }}
                onClick={() => onClick(c)}>
                {children(c)}
              </div>
            </ScrollElement>
          ))}
          {bufferCont}
        </div>
      </ScrollView>
    </div>
  );
}
