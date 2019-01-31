import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from '~/components/DefaultLayout';
import {BlackModal} from '~/components/utils/Modal';

import PreviewCard from '~/components/cards/PreviewCard';

import EditCard from '~/components/cards/ConnectedEditCard';

import CardSlideShow from '~/components/CardSlideShow';

import CardTagSearch from '../CardTagSearch';


// import { StyledButton } from 'Utils/StyledComps';

//   [
//   '#7fcdbb',
//   '#a1dab4',
//   '#41b6c4',
//   '#a1dab4',
//   '#41b6c4',
//   '#2c7fb8',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#2c7fb8',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#edf8b1',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#edf8b1',
//   '#c7e9b4',
//   '#7fcdbb',
//   '#41b6c4',
//   '#1d91c0',
//   '#225ea8',
//   '#253494'
// ].map(c => chroma(c).alpha(0.1));


function CardAuthorPage(props) {
  const {
    cards,
    selectedCardId,
    height,
    authEnv,
    previewCardAction,
    selectCard,
    filterCards,
    addCardFilter,
    dataView,
    filterSet,
    toggleAuthEnv,
    filterByTag,
    cardSets,
    selectedTags,
    selectedCard,
    isSmartphone,
    topicVocabulary,
    extCardId,
    children,
    selectTemplate,
    templateSelected,
    cardStackBottom,
    width,
    centerTemplatePos,
    fetchCards,
    cardStackExtended
  } = props;

  const slotSize = 100 / 3.5;

  useEffect(() => {
    // TODO: error?
    fetchCards();
  }, []);

  return (
    <DefaultLayout
      className="relative overflow-hidden w-full h-full flex-col"
      menu={
        <div className="flex-grow flex justify-between items-center">
          <button
            type="button"
            className={`btn btn-white ml-3 ${templateSelected &&
              'btn-black'}`}
            onClick={selectTemplate}>
            New Card
          </button>

          <CardTagSearch
            topics={topicVocabulary}
            filterSet={filterSet}
            onClick={filterByTag}
          />
        </div>
      }>
      <BlackModal visible={extCardId !== null}>
        {extCardId !== null && (
          <EditCard
            {...selectedCard}
            centerTemplatePos={centerTemplatePos}
          />
        )}
      </BlackModal>
      <CardSlideShow
        extended={cardStackExtended}
        bottom={cardStackBottom}
        cardWidth={Math.min(200, width / 2.7)}
        height={height}
        cards={cards}
        selectedCardId={selectedCardId}
        onClick={previewCardAction}>
        {c => (
          <PreviewCard
            className="h-full w-full "
            title={c.title.value}
            img={c.img.value}
          />
        )}
      </CardSlideShow>
      {children}
    </DefaultLayout>
  );
}

CardAuthorPage.propTypes = {
  cards: PropTypes.array,
  cardSets: PropTypes.array,
  selectedTags: PropTypes.array,
  selectedCardId: PropTypes.oneOf([PropTypes.string, null]),
  width: PropTypes.number,
  height: PropTypes.number,
  authEnv: PropTypes.boolean,
  dataView: PropTypes.boolean,
  previewCardAction: PropTypes.func,
  selectCard: PropTypes.func,
  filterCards: PropTypes.func,
  addCardFilter: PropTypes.func,
  filterSet: PropTypes.func,
  toggleAuthEnv: PropTypes.func,
  tagColorScale: PropTypes.func,
  screenResize: PropTypes.func,
  fetchCards: PropTypes.func
};

CardAuthorPage.defaultProps = {
  cards: [],
  cardSets: [],
  selectedTags: [],
  selectedCardId: null,
  width: 500,
  height: 500,
  authEnv: false,
  dataView: 'geo',
  previewCardAction: d => d,
  selectCard: d => d,
  filterCards: d => d,
  addCardFilter: d => d,
  filterSet: d => d,
  toggleAuthEnv: d => d,
  tagColorScale: () => 'green',
  screenResize: d => d,
  fetchCards: d => d,
  preSelectCardId: d => d
};

export default CardAuthorPage;
// export default withAuthorization(authCondition)(CardAuthorPage);

// export default MapView;
