import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {range} from 'd3';

import MetaCard from 'Src/components/cards/';
import PreviewCard from 'Src/components/cards/PreviewCard';

import {ScrollView, ScrollElement} from 'Utils/ScrollView';

export default function CardSlideShow({...props}) {
  const {cards, selectedCardId, cardWidth, onClick, extended} = props;

  // const selectedIndex = cards.findIndex(c => c.id === selectedCardId);
  // console.log('selectedIndex', selectedIndex);
  const width = cardWidth;
  const height = 200;

  const scrollCont = React.createRef();
  const wrapperCont = React.createRef();

  useEffect(
    () => {
      if (selectedCardId !== null)
        scrollCont.current.scrollTo(selectedCardId, {
          behavior: 'smooth',
          // block: 'start',
          inline: 'center'
        });
    },
    [selectedCardId]
  );

  const card = props =>
    extended ? (
      <MetaCard {...props} className="z-50" />
    ) : (
      <PreviewCard
        className="h-full w-full "
        title={props.title.value}
        img={props.img.value}
      />
    );

  const bufferCont = (
    <div
      className="flex-none z-10"
      style={{
        width,
        height,
        scrollSnapAlign: 'start'
      }}
    />
  );

  return (
    <div
      style={
        {
          // width: (cards.length + 2) * width
        }
      }>
      <div
        className="flex flex-col mx-4"
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
              // height,
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
                  onClick={() => {
                    onClick(c);
                  }}>
                  {card(c)}
                </div>
              </ScrollElement>
            ))}

            {bufferCont}
          </div>
        </ScrollView>
      </div>
    </div>
  );
}
