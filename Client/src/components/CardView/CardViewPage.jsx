import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {range} from 'd3';

import DefaultLayout from 'Components/DefaultLayout';

import ConnectedCard from 'Cards/ConnectedCard';
import {BlackModal, ConnectedResponsiveModal} from 'Utils/Modal';
import PreviewCard from 'Components/cards/PreviewCard';
import {ScrollView, ScrollElement} from 'Utils/ScrollView';
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

const CardSlideShow = ({smallScreen, ...props}) => {
  const {cards, selectedCardId, cardWidth, onClick, extended} = props;

  const width = cardWidth;
  const height = 200;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isScrolling, toggleScrolling] = useState(false);

  const scrollCont = React.createRef();
  useEffect(
    () => {
      if (selectedIndex !== null)
        scrollCont.current.scrollTo(selectedIndex, {
          behavior: 'smooth',
          // block: 'start',
          inline: 'center'
        });
    },
    [selectedIndex]
  );

  const card = props =>
    extended ? (
      <ConnectedCard {...props} className="z-50" />
    ) : (
      <PreviewCard
        className="h-full w-full "
        title={props.title.value}
        img={props.img.value}
      />
    );
  return (
    <div
      className="flex flex-col mx-4"
      style={{height: '38vh', maxHeight: 300}}>
      <ScrollView ref={scrollCont}>
        <div
          className="flex-grow flex overflow-x-auto overflow-y-hidden
          py-8
          "
          style={{
            // height,
            transition: 'height 300ms, width 300ms',
            scrollSnapPointsX: `repeat(${width}px)`,
            scrollSnapType: 'x mandatory'
          }}>
          {cards.map((c, i) => (
            <ScrollElement name={i}>
              <div
                className={`mx-4 ${
                  selectedCardId === c.id ? 'z-50' : 'z-10'
                }`}
                style={{
                  transform: `scale(${
                    selectedCardId === c.id ? 1.2 : 1
                  })`,
                  transition: 'transform 300ms',
                  width,
                  scrollSnapAlign: 'start'
                  // marginLeft: '2%',
                  // marginRight: '2%'
                }}
                onClick={() => {
                  setSelectedIndex(i);
                  onClick(c);
                }}>
                {card(c)}
              </div>
            </ScrollElement>
          ))}
        </div>
      </ScrollView>
    </div>
  );
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
    tagVocabulary,
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
            className="hidden btn btn-white border-2 border-black"
            onClick={() => extendCardStack()}>
            Extend
          </button>
          <CardTagSearch
            tags={tagVocabulary}
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
        onClick={previewCardAction}
      />

      <BlackModal
        visible={extendedCard !== null}
        style={{margin: `${!isSmartphone ? '2.5rem' : ''} auto`}}>
        {selectedCard !== null && <ConnectedCard {...selectedCard} />}
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
