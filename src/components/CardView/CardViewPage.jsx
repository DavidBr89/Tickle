import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardStack from '../CardStack';

import DefaultLayout from 'Components/DefaultLayout';

import CardTagSearch from '../CardTagSearch';

import ConnectedCard from 'Cards/ConnectedCard';
import {
  Modal,
  BareModal,
  ModalBody,
  ConnectedResponsiveModal
} from 'Utils/Modal';

// import { StyledButton } from 'Utils/StyledComps';

const LoadingScreen = ({ visible, style }) => {
  if (visible) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 4000,
          ...style
        }}
      >
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
    authEnv: PropTypes.boolean,
    dataView: PropTypes.boolean,
    previewCardAction: PropTypes.func,
    selectCard: PropTypes.func,
    filterCards: PropTypes.func,
    addCardFilter: PropTypes.func,
    setDataView: PropTypes.func,
    filterSet: PropTypes.func,
    toggleAuthEnv: PropTypes.func,
    tagColorScale: PropTypes.func,
    screenResize: PropTypes.func,
    fetchCards: PropTypes.func
  };

  static defaultProps = {
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
    setDataView: d => d,
    filterSet: d => d,
    toggleAuthEnv: d => d,
    tagColorScale: () => 'green',
    screenResize: d => d
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
      selectCard,
      filterCards,
      addCardFilter,
      tagVocabulary,
      // setDataView,
      filterSet,
      toggleAuthEnv,
      tagColorScale,
      isSmartphone,
      cardPanelVisible,
      toggleCardPanel,
      filterByChallengeState,
      challengeStateFilter,
      isLoadingCards,
      seeCard,
      extendedCard,
      selectedCard,
      width,
      children
    } = this.props;

    // const slotSize = width / 3;
    // const cardStackWidth = width;
    const slotSize = Math.min(width / 3.5, 200);
    // const cardStackWidth = width;

    // TODO change later
    cards.map(c => !c.seen && seeCard(c.id));

    return (
      <DefaultLayout
        className="w-full h-full flex-col"
        style={{ position: 'relative', overflow: 'hidden' }}
        menu={
          <div className="flex-grow flex justify-end items-center">
            <div>mini</div>
            <CardTagSearch
              allTags={tagVocabulary}
              key={filterSet.join(',')}
              onChange={filterCards}
              onClick={addCardFilter}
              data={filterSet}
              height={height / 2 - 50}
            />
          </div>
        }
      >
        <div
          className="mt-16 flex justify-center"
          style={{
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
            height: height / 5,
            opacity: cardPanelVisible ? 1 : 0
          }}
        >
          <CardStack
            cards={cards}
            touch={isSmartphone}
            selectedCardId={selectedCardId}
            duration={600}
            className="ml-1 mr-2"
            width={width}
            height={height / 4}
            onClick={previewCardAction}
            tagColorScale={tagColorScale}
            slotSize={slotSize}
            className="z-10"
            style={
              {
                // zIndex: 1000
              }
            }
          />
        </div>
        <LoadingScreen style={{ marginTop: 25 }} visible={isLoadingCards} />

        <BareModal
          visible={extendedCard !== null}
          style={{ margin: `${!isSmartphone ? '2.5rem' : ''} auto` }}
        >
          <ConnectedCard {...selectedCard} />
        </BareModal>

        {children(this.props)}
      </DefaultLayout>
    );
  }
}

export default CardViewPage;
// export default withAuthorization(authCondition)(CardViewPage);

// export default MapView;
