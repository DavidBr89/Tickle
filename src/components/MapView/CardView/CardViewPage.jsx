import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DropDown } from 'Utils/TagInput';
import { css } from 'aphrodite';
// import { PreviewCard } from 'Components/cards';
import CardStack from '../CardStack';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';

import CardViewOverlay from './CardViewOverlay';

import { calcDataViewHeight, stylesheet } from 'Src/styles/GlobalThemeContext';

// import { StyledButton } from 'Utils/StyledComps';

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
    preSelectCardId();
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
      authEnv,
      previewCardAction,
      selectCard,
      filterCards,
      addCardFilter,
      dataView,
      // setDataView,
      filterSet,
      toggleAuthEnv,
      tagColorScale,
      cardSets,
      selectedTags,
      isSmartphone,
      cardPanelVisible,
      toggleCardPanel
    } = this.props;

    const slotSize = 100 / 3.5;
    const cardStackWidth = 100;
    // slotSize / cards.length < slotSize ? 100 : slotSize * cards.length;
    return (
      <div
        className="w-100 h-100"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div
          className="w-100 h-100"
          style={{
            position: 'absolute'
          }}
        >
          <div className="h-100">
            <div
              className=" m-2"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 100,
                position: 'relative'
              }}
            >
              <DropDown
                className="mr-1"
                key={filterSet.join(',')}
                onChange={filterCards}
                onSelect={() => selectCard(null)}
                style={{
                  display: 'flex',
                  // position: 'absolute',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                  marginRight: 10
                }}
                onClick={addCardFilter}
                data={filterSet}
              />
            </div>
            <div
              className="mb-3 mt-3"
              style={{
                display: 'flex',
                justifyContent: 'center',
                transition: 'opacity 0.5s',
                height: '25%',
                zIndex: 3000,
                opacity: cardPanelVisible ? 1 : 0
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
            <div
              className="mr-2"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 2000
              }}
            >
              <div style={{ position: 'absolute', right: 0, zIndex: 100}}>
                <button
                  onClick={toggleCardPanel}
                  className={`${css(stylesheet.btn)} mr-1`}
                >
                  {cardPanelVisible ? 'Hide Cards' : 'Show Cards'}
                </button>
              </div>
            </div>
            <CardViewOverlay
              {...this.props}
              style={{ height: '60%' }}
              colorScale={tagColorScale}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CardViewPage;
// export default withAuthorization(authCondition)(CardViewPage);

// export default MapView;
