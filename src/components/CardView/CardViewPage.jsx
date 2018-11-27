import React, {Component} from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from 'Components/DefaultLayout';

import ConnectedCard from 'Cards/ConnectedCard';
import {BlackModal, ConnectedResponsiveModal} from 'Utils/Modal';
import CardTagSearch from '../CardTagSearch';
import CardStackContainer from '../CardStack';

// import { StyledButton } from 'Utils/StyledComps';

const LoadingScreen = ({visible, style}) => {
  if (visible) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4000,
          ...style,
        }}>
        <h1>...LOADING CARDS</h1>
      </div>
    );
  }
  return null;
};

class CardViewPage extends Component {
  static propTypes = {
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
    screenResize: PropTypes.func,
  };

  static defaultProps = {
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
    screenResize: d => d,
  };

  // componentDidMount() {
  //   const {
  //     screenResize,
  //     getUserCards,
  //     fetchCards,
  //     preSelectCardId
  //   } = this.props;
  //
  //   // fetchCards();
  //   // screenResize({
  //   //   width: this.cont.offsetWidth,
  //   //   height: this.cont.offsetHeight
  //   // });
  //   // preSelectCardId();
  // }

  componentWillUnmount() {
    // window.addEventListener('resize', () => {});
  }

  render() {
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
    } = this.props;

    // const cardStackWidth = width;
    const slotSize = Math.min(width / 3.5, 200);
    // const cardStackWidth = width;

    return (
      <DefaultLayout
        className="w-full h-full relative overflow-hidden flex-col-wrapper"
        menu={
          <div className="flex-grow flex justify-end items-center">
            <button className="btn" onClick={() => concealCardStack()}>
              Hide
            </button>
            <CardTagSearch
              allTags={tagVocabulary}
              key={filterSet.join(',')}
              onChange={filterCards}
              onClick={addCardFilter}
              data={filterSet}
              height={height / 2 - 50}
            />
          </div>
        }>
        <CardStackContainer
          onConceal={concealCardStack}
          bottom={cardStackBottom}
          width={width}
          height={height}
          cards={cards}
          touch={isSmartphone}
          selectedCardId={selectedCardId}
          duration={600}
          onClick={previewCardAction}
          tagColorScale={tagColorScale}
          slotSize={slotSize}
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
}

export default CardViewPage;
