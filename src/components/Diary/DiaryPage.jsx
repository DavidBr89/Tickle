import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import menuIconSrc from 'Src/styles/menu_icons/menuIconStolen.svg';
// import {wrapGrid} from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

import {BlackModal} from 'Utils/Modal';
import DefaultLayout from 'Components/DefaultLayout';
// import BookWidget from 'Components/BookWidgets';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUBMITTED,
  CHALLENGE_SUCCEEDED,
  NO_CARD_FILTER,
  // challengeTypeMap
} from 'Constants/cardFields';
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
    case CHALLENGE_STARTED:
      return 'started';
    case CHALLENGE_SUBMITTED:
      return 'submitted';
    case CHALLENGE_SUCCEEDED:
      return 'collected';
    case NO_CARD_FILTER:
      return 'discovered';
  }
};

const CardMenu = ({
  className,
  selectedClassName,
  optionClassName,
  style,
  onChange,
  values = [],
  children,
  selectedId,
  onSelectCardType,
  tags,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`${className} z-10 relative`}>
      <div className="flex-grow flex justify-end cursor-pointer">
        <div
          tabIndex="-1"
          onBlur={() => setTimeout(() => setVisible(false), 100)}
          onClick={() => setVisible(!visible)}
          className="flex justify-center mr-2"
          style={{width: 30, height: 30}}>
          <img src={menuIconSrc} alt="nav" />
        </div>
      </div>
      <div
        className="mt-2 absolute w-full"
        style={{
          right: visible ? 0 : '-100vw',
          maxWidth: 250,
          transition: 'right 200ms',
        }}>
        <div className="ml-2 p-2 border-2 border-black shadow bg-white">
          {children}
        </div>
      </div>
    </div>
  );
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

  const [cardType, setCardType] = useState(NO_CARD_FILTER);

  const [selectedTags, setSelectedTags] = useState([]);

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
        <CardMenu className="flex-grow">
          <section className="border-b-2 border-black">
            <ul className="reset-list text-2xl pb-2">
              <li className="">All Cards</li>
              <li className="">Started Cards</li>
              <li className="">Submitted Cards</li>
              <li className="">Collected Cards</li>
            </ul>
          </section>
          <div className="mt-3 flex flex-wrap">
            {tags.map(d => (
              <div
                className="cursor-pointer tag-label m-1"
                onClick={() => {
                  console.log('click');
                  setSelectedTags(prevTags => [...prevTags, d.key]);
                }}>
                {d.key}
              </div>
            ))}
          </div>
        </CardMenu>
      }>
      <BlackModal visible={cardExtended !== null}>
        {selectedCardId && (
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
                {cards.map(d => (
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
