import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import menuIconSrc from 'Src/styles/menu_icons/menuIconStolen.svg';
// import {wrapGrid} from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

import {BlackModal} from 'Utils/Modal';
import DefaultLayout from 'Components/DefaultLayout';
// import BookWidget from 'Components/BookWidgets';

import SlideMenu from 'Components/utils/SlideMenu';

import {
  ACTIVITY_STARTED,
  ACTIVITY_SUBMITTED,
  ACTIVITY_SUCCEEDED,
  NO_ACTIVITY_FILTER,
  activityFilterMap,
} from 'Constants/cardFields';
import isSubset from 'Src/lib/isSubset';
// import TabMenu from './TabMenu';

// import './layout.scss';

/*
          <div
            className={`absolute h-full w-full flex flex-col justify-end z-50`}>
            <TabMenu
              className={`p-2 flex flex-col overflow-y-auto bg-grey-lighter ${
                tabExtended ? 'flex-grow' : 'flex-shrink'
              } `}
              style={{...flexTrans}}
              extended={tabExtended}
              onToggle={extendTab}
              onHeaderClick={() => selectCard(null)}
              selectedTags={selectedTags}
              relatedTags={relatedTags}
              selectedCard={selectedCard}
              nestedTags={tagVocabulary}
            />
          </div>
      */

const INITIAL_GRID_STATE = {
  colNum: 10,
  rowNum: 10,
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

const MyDiary = props => {
  const {
    cards,
    selectedCardId,
    selectCard,
    extendCard,
    selectedCard,
    relatedTags,
    height,
    cardExtended,
    selectCardType,
    numCollectibleCards,
    numSeenCards,
    tagVocabulary,
    closeCard,
  } = props;

  const [cardType, setCardType] = useState(NO_ACTIVITY_FILTER);
  const onSetCardType = type => () => setCardType(type);

  const [selectedTags, setSelectedTags] = useState([]);
  const filterByTag = key => {
    setSelectedTags(prevTags => {
      return prevTags.includes(key)
        ? prevTags.filter(d => d !== key)
        : [...prevTags, key];
    });
  };

  const filterFn = activityFilterMap[cardType];
  const filteredCards = cards.filter(filterFn).filter(d => {
    console.log('d', d);
    const tags = d.tags.value !== null ? d.tags.value : [];
    console.log('tags', tags, 'selectedTags', selectedTags);
    const s = isSubset(tags, selectedTags);
    console.log('subset', s);
    return s;
  });

  const h = 10;
  // const w = 4;

  const gridStyle = {
    // height: '100%',
    display: 'grid',
    gridGap: 16,
    // gridAutoFlow: 'column dense',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10vh, 125px))',
    gridAutoRows: `minmax(${h}rem, 2fr)`,
    gridTemplateRows: `minmax(${h}rem, 2fr)`,
  };

  const tags = tagVocabulary.slice(0, 10);

  return (
    <DefaultLayout
      menu={
        <SlideMenu className="flex-grow">
          <section className="border-b-2 border-black">
            <ul className="reset-list text-2xl pb-2">
              <li className="" onClick={onSetCardType(NO_ACTIVITY_FILTER)}>
                All Cards
              </li>
              <li className="" onClick={onSetCardType(ACTIVITY_STARTED)}>
                Started Cards
              </li>
              <li className="" onClick={onSetCardType(ACTIVITY_SUBMITTED)}>
                Submitted Cards
              </li>
              <li className="" onClick={onSetCardType(ACTIVITY_SUCCEEDED)}>
                Collected Cards
              </li>
            </ul>
          </section>
          <div className="mt-3 flex flex-wrap">
            {tags.map(d => (
              <div
                className="cursor-pointer tag-label m-1"
                onClick={() => filterByTag(d.key)}>
                {d.key}
              </div>
            ))}
          </div>
        </SlideMenu>
      }>
      <BlackModal visible={cardExtended !== null}>
        {selectedCard && (
          <ConnectedCard {...selectedCard} onClose={closeCard} />
        )}
      </BlackModal>

      <div className="flex flex-col flex-grow">
        <div className="flex flex-col flex-grow content-margin ">
          <div className="overflow-y-auto">
            <section className="text-2xl mb-2">
              Your {cardTypeText(cardType)} {numSeenCards}/
              {`${numCollectibleCards} `}
              cards
            </section>
            <section className="">
              <div className="flex-grow " style={gridStyle}>
                {filteredCards.map(d => (
                  <PreviewCard
                    onClick={() => selectCard(d.id)}
                    title={d.title.value}
                    img={d.img.value}
                    key={d.id}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default MyDiary;
