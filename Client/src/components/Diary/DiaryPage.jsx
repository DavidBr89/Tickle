import React, {Component, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {wrapGrid} from 'animate-css-grid';

import menuIconSrc from '~/styles/menu_icons/menuIconStolen.svg';

import PreviewCard from '~/components/cards/PreviewCard';
import ConnectedCard from '~/components/cards/ConnectedCard';

import {BlackModal} from '~/components/utils/Modal';
import DefaultLayout from '~/components/DefaultLayout';

import SlideMenu from '~/components/utils/SlideMenu';

import {
  ACTIVITY_STARTED,
  ACTIVITY_SUBMITTED,
  ACTIVITY_SUCCEEDED,
  NO_ACTIVITY_FILTER,
  activityFilterMap
} from '~/constants/cardFields';

// TODO put into components/utils
import isSubset from '~/lib/isSubset';

const activityFilters = [
  {type: ACTIVITY_STARTED, label: 'Activity Started'},
  {type: ACTIVITY_SUBMITTED, label: 'Activity Submitted'},
  {type: ACTIVITY_SUCCEEDED, label: 'Activity Succeeded'},
  {type: NO_ACTIVITY_FILTER, label: 'All'}
];

const INITIAL_GRID_STATE = {
  colNum: 10,
  rowNum: 10
};

const cardTypeText = cardType => {
  switch (cardType) {
    case ACTIVITY_STARTED:
      return 'started';
    case ACTIVITY_SUBMITTED:
      return 'submitted';
    case ACTIVITY_SUCCEEDED:
      return 'collected';
    case NO_ACTIVITY_FILTER:
      return 'discovered';
  }
};

const ModalWrapper = ({card, onClose}) => {
  const [selectedCard, setCard] = useState(null);
  const [hidden, setHidden] = useState(true);
  const {id} = card || {id: null};

  const delay = 400;

  // console.log('card id', id, 'selectedCard', selectedCard);
  useEffect(() => {
    // close card directly
    if (id === null) {
      setTimeout(() => setCard(card), delay);
      setHidden(true);
    }
    // open card directly when there was no card before
    if (selectedCard === null && id !== null) {
      setCard(card);
      setHidden(false);
    } else if (id !== null && selectedCard !== null) {
      // delay the opening of new card
      setHidden(true);
      setTimeout(() => {
        setCard(card);
        setHidden(false);
      }, delay);
    }
  }, [id]);

  return (
    <BlackModal visible={!hidden}>
      {selectedCard && (
        <ConnectedCard {...selectedCard} onClose={onClose} />
      )}
    </BlackModal>
  );
};

/**
 * This Component displays all the cards the use has interfaced with.
 * This means submitted, rated, and bookmarked cards
 * TODO: filter options and testing in general
 * @param {cards} user cards
 */

const MyDiary = props => {
  const {
    cards,
    selectedCardId,
    selectCard,
    extendCard,
    selectedCard,
    height,
    cardExtended,
    selectCardType,
    numCollectibleCards,
    numSeenCards,
    topicDict,
    closeCard
  } = props;

  const [cardType, setCardType] = useState(NO_ACTIVITY_FILTER);

  const [selectedTags, setSelectedTags] = useState([]);

  const onSetCardType = type => () => setCardType(type);

  const gridDom = React.createRef();
  useEffect(() => {
    wrapGrid(gridDom.current, {
      easing: 'backInOut',
      stagger: 0,
      duration: 400
    });
  }, []);

  const filterByTag = key => {
    setSelectedTags(prevTags =>
      prevTags.includes(key)
        ? prevTags.filter(d => d !== key)
        : [...prevTags, key]
    );
  };

  const filterFn = activityFilterMap[cardType];

  const filteredCards = cards.filter(filterFn).filter(d => {
    const tags = d.tags.value !== null ? d.tags.value : [];
    const s = isSubset(tags, selectedTags);
    return s;
  });

  const h = 10;
  // const w = 4;

  const gridStyle = {
    justifyContent: 'center',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10vh, 125px))',
    gridAutoRows: `minmax(${h}rem, 2fr)`,
    gridTemplateRows: `minmax(${h}rem, 2fr)`
  };

  const tags = topicDict.slice(0, 10);

  const cardGrid = (
    <div ref={gridDom} className="flex-grow w-full" style={gridStyle}>
      {filteredCards.map(d => (
        <div>
          <PreviewCard
            style={{
              transform: `scale(${d.id === selectedCardId ? 1.15 : 1})`,
              transformOrigin: d.id === selectedCardId && null,
              pointerEvents: selectedCardId !== null && 'none',
              transition: 'transform 300ms'
            }}
            className="h-full"
            onClick={() => selectCard(d.id)}
            title={d.title.value}
            img={d.img.value}
            key={d.id}
          />
        </div>
      ))}
    </div>
  );

  return (
    <DefaultLayout
      menu={
        <SlideMenu className="flex-grow">
          <section className="pl-2 border-b-2 border-black">
            <ul className="list-reset text-2xl pb-2">
              {activityFilters.map(({label, type}) => (
                <li
                  className={`cursor-pointer ${type === cardType &&
                    'underline'}`}
                  onClick={onSetCardType(type)}>
                  {label}
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-3 flex flex-wrap">
            {tags.map(d => (
              <div
                className={`cursor-pointer tag-label ${
                  selectedTags.includes(d.key) ? 'bg-black' : 'bg-grey'
                } m-1`}
                onClick={() => filterByTag(d.key)}>
                {d.key}
              </div>
            ))}
          </div>
        </SlideMenu>
      }>
      <ModalWrapper card={selectedCard} onClose={closeCard} />

      <div className="flex flex-col flex-grow">
        <div className="flex flex-col flex-grow content-margin ">
          <div className="flex flex-col flex-grow ">
            <section className="flex-no-shrink text-2xl mb-2">
              Your {cardTypeText(cardType)} {numSeenCards}/
              {`${numCollectibleCards} `}
              cards
            </section>
            <section
              className="flex-grow flex flex-col
              justify-center items-center ">
              {filteredCards.length === 0 && (
                <div className="text-4xl">No Cards</div>
              )}
              {cardGrid}
            </section>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default MyDiary;
