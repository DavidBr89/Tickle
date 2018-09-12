import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FLOORPLAN, GEO } from 'Constants/dataViews';

// import * as d3 from 'd3';

// import { Motion, spring } from 'react-motion';
// import * as Icon from 'react-feather';
// import Spinner from 'react-loader-spinner';
// import * as d3 from 'd3';
// import { intersection, union } from 'lodash';

// TODO: { LinearInterpolator, FlyToInterpolator }
// import { default as TouchBackend } from 'react-dnd-touch-backend';
// import HTML5Backend from 'react-dnd-html5-backend';
// import { DragDropContextProvider } from 'react-dnd';

// import PreviewMarker from 'Components/utils/PreviewMarker';

// import { colorScale, cardTypeColorScale } from 'Cards/styles';

// import { Card, CardMarker, PreviewCard } from 'Cards';
import CardStack from '../CardStack';
// import ExtendableMarker from 'Utils/ExtendableMarker';
// import { Modal, ModalBody } from 'Utils/Modal';

import { DropDown } from 'Utils/TagInput';
import { calcDataViewHeight } from 'Src/styles/GlobalThemeContext';

import CardDragAuthorOverlay from './CardDragAuthorOverlay';

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
      isSmartphone,
      allTagsCreated,
      extCardId
    } = this.props;

    const slotSize = 100 / 3.5;
    const cardStackWidth = 100;
    // slotSize / cards.length < slotSize ? 100 : slotSize * cards.length;

    return (
      <div
        className="w-100 h-100 flexCol"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <CardTagSearch
          allTags={allTagsCreated}
          key={filterSet.join(',')}
          onChange={filterCards}
          onSelect={() => selectCard(null)}
          onClick={addCardFilter}
          data={filterSet}
        />

        <div
          className="mt-3"
          style={{
            display: 'flex',
            justifyContent: 'center',
            transition: 'opacity 0.5s',
            marginBottom: 25,
            // TODO: fix later
            zIndex: 20000,
            // height: '25%'
            flexBasis: '25%'
          }}
        >
          <CardStack
            cards={cards}
            selectedCardId={selectedCardId}
            duration={600}
            className="ml-1 mr-2"
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
        <CardDragAuthorOverlay
          dataView={dataView}
          cards={cards}
          cardSets={cardSets}
          selectedTags={selectedTags}
          tagColorScale={tagColorScale}
          selectedCardId={selectedCardId}
          extCardId={extCardId}
          previewCardAction={previewCardAction}
          style={{
            // TODO: remvoe for topic map
            flex: '1 1 70%',
            position:
              dataView === FLOORPLAN || dataView === GEO ? 'absolute' : null
          }}
          className="flexCol"
        />
      </div>
    );
  }
}

export default CardAuthorPage;
// export default withAuthorization(authCondition)(CardAuthorPage);

// export default MapView;
