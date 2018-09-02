import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite/no-important';

import { GEO, TAGS, FLOORPLAN } from 'Constants/dataViews';
// import { PreviewCard } from 'Components/cards';
import CardStack from '../CardStack';

import { calcDataViewHeight, stylesheet } from 'Src/styles/GlobalThemeContext';

import {
  CHALLENGE_STARTED,
  CHALLENGE_NOT_SUBMITTED
} from 'Constants/cardFields';

import ToggleSwitch from 'Utils/ToggleSwitch';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';

import CardTagSearch from '../CardTagSearch';

import CardViewOverlay from './CardViewOverlay';

// import { StyledButton } from 'Utils/StyledComps';

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
  constructor(props) {
    super(props);

    // TODO put into container element
    const { screenResize } = props;

    // this._onChangeViewport = this._onChangeViewport.bind(this);
    // this._userMove = this._userMove.bind(this);
    // this.gridSpan = this.gridSpan.bind(this);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // screenResize({
    //   width: this.cont.offsetWidth || window.innerWidth,
    //   height: this.cont.offsetHeight || window.innerHeight
    // });
    // window.addEventListener('resize', () => {
    //   screenResize({
    //     width: this.cont.offsetWidth || window.innerWidth,
    //     height: this.cont.offsetHeight || window.innerHeight
    //   });
    // });

    // screenResize({
    //   width,
    //   height
    // });
  }

  componentDidMount() {
    const {
      screenResize,
      getUserCards,
      fetchCards,
      preSelectCardId
    } = this.props;

    fetchCards();
    // screenResize({
    //   width: this.cont.offsetWidth,
    //   height: this.cont.offsetHeight
    // });
    // preSelectCardId();
  }

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
      allTagsCollectible,
      // setDataView,
      filterSet,
      toggleAuthEnv,
      tagColorScale,
      isSmartphone,
      cardPanelVisible,
      toggleCardPanel,
      filterByChallengeState,
      challengeStateFilter
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
          allTags={allTagsCollectible}
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
            zIndex: 3000,
            flexBasis: '25%',
            opacity: cardPanelVisible ? 1 : 0, marginBottom: 25
          }}
        >
          <CardStack
            cards={cards}
            edit={false}
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
        <CardViewOverlay
          {...this.props}
          className="mb-1"
          style={{
            flex: '1 1 60%',
            position:
              this.props.dataView === FLOORPLAN || this.props.dataView === GEO
                ? 'absolute'
                : null
          }}
          colorScale={tagColorScale}
        />
      </div>
    );
  }
}

export default CardViewPage;
// export default withAuthorization(authCondition)(CardViewPage);

// export default MapView;
