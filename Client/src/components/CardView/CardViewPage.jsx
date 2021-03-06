import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from '~/components/DefaultLayout';

import MetaCard from '~/components/cards/';
import {BlackModal} from '~/components/utils/Modal';

import PreviewCard from '~/components/cards/PreviewCard';

import CardSlideShow from '~/components/CardSlideShow';
import CardTagSearch from '../CardTagSearch';

const LoadingScreen = ({visible, style}) => {
  if (visible) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4000,
          ...style
        }}>
        <h1>...LOADING CARDS</h1>
      </div>
    );
  }
  return null;
};

function CardViewPage(props) {
  const {
    cards,
    selectedCardId,
    // width,
    height,
    previewCardAction,
    filterCards,
    addCardFilter,
    topicVocabulary,
    tagColorScale,
    isSmartphone,
    cardPanelVisible,
    toggleCardPanel,
    filterByChallengeState,
    isLoadingCards,
    extendedCard,
    selectedCard,
    width,
    children,
    concealCardStack,
    cardStackBottom,
    filterSet,
    filterByTag,
    fetchCards,
    extendCardStack,
    cardStackExtended,
    smallScreen
  } = props;

  useEffect(() => {
    fetchCards();
  }, []);
  // const cardStackWidth = width;

  return (
    <DefaultLayout
      className="w-full h-full relative overflow-hidden flex-col-wrapper"
      menu={
        <div className="flex-grow flex justify-end items-center">
          <button
            className="btn btn-white border-2 border-black"
            onClick={() => concealCardStack()}>
            Hide
          </button>
          <button
            className="btn btn-white border-2 border-black"
            style={{display: 'none'}}
            onClick={() => extendCardStack()}>
            Extend
          </button>
          <CardTagSearch
            topics={topicVocabulary}
            filterSet={filterSet}
            onClick={filterByTag}
          />
        </div>
      }>
      <CardSlideShow
        smallScreen={smallScreen}
        extended={cardStackExtended}
        bottom={cardStackBottom}
        cardWidth={Math.min(200, width / 2.7)}
        height={height}
        cards={cards}
        selectedCardId={selectedCardId}
        onClick={previewCardAction}>
        {c => (
          <PreviewCard
            title={c.title.value}
            img={c.img.value}
            className="w-full h-full"
          />
        )}
      </CardSlideShow>

      <BlackModal visible={extendedCard !== null}>
        {selectedCard !== null && <MetaCard {...selectedCard} />}
      </BlackModal>
      {children}
    </DefaultLayout>
  );
}

CardViewPage.propTypes = {
  cards: PropTypes.array,
  cardSets: PropTypes.array,
  selectedTags: PropTypes.array,
  selectedCardId: PropTypes.oneOf([PropTypes.string, null]),
  width: PropTypes.number,
  height: PropTypes.number,
  previewCardAction: PropTypes.func,
  filterCards: PropTypes.func,
  addCardFilter: PropTypes.func,
  setDataView: PropTypes.func,
  filterSet: PropTypes.func,
  toggleAuthEnv: PropTypes.func,
  tagColorScale: PropTypes.func,
  screenResize: PropTypes.func
};

CardViewPage.defaultProps = {
  cards: [],
  cardSets: [],
  selectedTags: [],
  selectedCardId: null,
  width: 500,
  height: 500,
  previewCardAction: d => d,
  filterCards: d => d,
  addCardFilter: d => d,
  setDataView: d => d,
  filterSet: d => d,
  toggleAuthEnv: d => d,
  tagColorScale: () => 'green',
  screenResize: d => d
};

export default CardViewPage;
