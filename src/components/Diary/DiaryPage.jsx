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
} from 'Constants/cardFields.ts';
import TabMenu from './TabMenu';

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
  tags,
}) => {
  const [visible, setVisible] = useState(false);
  const selected = values.find(v => v.id === selectedId) || null;

  return (
    <div className={`${className} z-10 relative`}>
      <div
        className="flex-grow flex justify-end cursor-pointer"
        tabIndex="-1"
        onClick={() => setVisible(!visible)}
        onBlur={() => setVisible(false)}>
        <div
          className="flex justify-center mr-2"
          tabIndex="-1"
          style={{width: 30, height: 30}}>
          <img src={menuIconSrc} />
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
          <section className="border-b-2 border-black">
            <ul className="text-2xl">
              <li selected={selected === NO_CARD_FILTER} value={NO_CARD_FILTER}>
                All Cards
              </li>
              <li
                selected={selected === CHALLENGE_STARTED}
                value={CHALLENGE_STARTED}>
                Started Cards
              </li>
              <li
                selected={selected === CHALLENGE_SUBMITTED}
                value={CHALLENGE_SUBMITTED}>
                Submitted Cards
              </li>
              <li
                selected={selected === CHALLENGE_SUCCEEDED}
                value={CHALLENGE_SUCCEEDED}>
                Collected Cards
              </li>
            </ul>
          </section>
          <section>
            {tags.map(d => (
              <div className="tag-label">{d.key}</div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default class MyDiary extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // TODO check later
    // this.fg = wrapGrid(this.grid);
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    // this.fg.forceGridAnimation();
  }

  render() {
    const {
      cards,
      selectedCardId,
      selectCard,
      extendCard,
      selectedCard,
      selectedTags,
      relatedTags,
      height,
      cardExtended,
      selectCardType,
      selectedCardType,
      numCollectibleCards,
      numSeenCards,
      tagVocabulary,
      closeCard,
    } = this.props;

    const h = 10;
    // const w = 4;

    const gridStyle = {
      // height: '100%',
      display: 'grid',
      gridGap: 16,
      // gridAutoFlow: 'column dense',
      gridTemplateColumns: 'repeat(auto-fit, minmax(5rem, 2fr))',
      gridAutoRows: `minmax(${h}rem, 2fr)`,
      gridTemplateRows: `minmax(${h}rem, 2fr)`,
    };

    const cardSelected = selectedCardId !== null;
    const flexShrink = ' 0 1000 0%';

    const flexTrans = {
      transition: 'flex 0.5s',
    };

    return (
      <DefaultLayout
        menu={
          <CardMenu
            className="flex-grow"
            selected={selectedCardType}
            tags={tagVocabulary}
          />
        }>
        <BlackModal
          visible={cardExtended !== null}
          background="transparent"
          style={{margin: 'auto'}}>
          {selectedCardId && (
            <ConnectedCard {...selectedCard} onClose={closeCard} />
          )}
        </BlackModal>

        <div className="flex flex-col flex-grow">
          <div className="flex flex-col flex-grow content-margin">
            <section className="text-xl mb-2">
              Your {cardTypeText(selectedCardType)} {numSeenCards}/
              {`${numCollectibleCards} `}
              cards
            </section>
            <section className="overflow-y-auto">
              <div
                className="flex-grow "
                style={gridStyle}
                ref={el => (this.grid = el)}>
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
      </DefaultLayout>
    );
  }
}
