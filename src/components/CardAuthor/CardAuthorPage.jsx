import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DefaultLayout from 'Components/DefaultLayout';
import { Modal, BareModal, ModalBody } from 'Utils/Modal';

import EditCard from 'Components/cards/ConnectedEditCard';

import { DropDown } from 'Utils/TagInput';
import CardStack from '../CardStack';

// import CardDragAuthorOverlay from './CardDragAuthorOverlay';

import CardTagSearch from '../CardTagSearch';
// import DragLayer from './DragAndDrop/DragLayer';

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

// const TimoutGrid = ReactTimeout(CardStack);

function SpeechBubble({ ...props }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -130%)',
        // zIndex: 6000,
        background: 'whitesmoke'
      }}
    >
      <div
        className="m-1"
        style={{
          width: 270,
          // position: 'relative',
          // zIndex: 4000,
          border: '2px dashed grey'
        }}
      >
        <div className="m-1">
          <h3>drag and drop Card to change position</h3>
        </div>
      </div>
    </div>
  );
}

SpeechBubble.defaultProps = {};

SpeechBubble.propTypes = {};

class CardAuthorPage extends Component {
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
    filterSet: d => d,
    toggleAuthEnv: d => d,
    tagColorScale: () => 'green',
    screenResize: d => d,
    fetchCards: d => d,
    preSelectCardId: d => d
  };

  componentDidMount() {
    const {
      screenResize,
      fetchCards,
      preSelectCardId,
      userMove,
      changeMapViewport
    } = this.props;

    console.log('DID MOUNT');
    fetchCards();
    // screenResize({
    //   width: this.cont.offsetWidth,
    //   height: this.cont.offsetHeight
    // });
    // preSelectCardId();
  }

  componentWillUnmount() {}

  render() {
    const {
      cards,
      selectedCardId,
      // width,
      height,
      authEnv,
      previewCardAction,
      selectCard,
      filterCards,
      addCardFilter,
      dataView,
      filterSet,
      toggleAuthEnv,
      tagColorScale,
      cardSets,
      selectedTags,
      selectedCard,
      isSmartphone,
      tagVocabularyCreated,
      extCardId,
      children
    } = this.props;

    const slotSize = 100 / 3.5;
    const cardStackWidth = 100;
    // slotSize / cards.length < slotSize ? 100 : slotSize * cards.length;

    return (
      <DefaultLayout
        className="w-full h-full flex-col"
        style={{ position: 'relative', overflow: 'hidden' }}
        menu={
          <div className="flex-grow flex justify-end items-center">
            <CardTagSearch
              allTags={tagVocabularyCreated}
              key={filterSet.join(',')}
              onChange={filterCards}
              onClick={addCardFilter}
              data={filterSet}
              height={height / 2 - 50}
            />
          </div>
        }
      >
        <BareModal visible={extCardId !== null}>
          <EditCard {...selectedCard} />
        </BareModal>
        <div
          className="mt-16 flex justify-center"
          style={{
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
            height: height / 5
            // opacity: cardPanelVisible ? 1 : 0
          }}
        >
          <CardStack
            cards={cards}
            selectedCardId={selectedCardId}
            touch={isSmartphone}
            duration={600}
            width={cardStackWidth}
            height={100}
            cardHeight={height / 4}
            unit="%"
            onClick={previewCardAction}
            tagColorScale={tagColorScale}
            slotSize={slotSize}
            style={{
              zIndex: 1000
            }}
          />
        </div>
        {children(this.props)}
      </DefaultLayout>
    );
  }
}

export default CardAuthorPage;
// export default withAuthorization(authCondition)(CardAuthorPage);

// export default MapView;
