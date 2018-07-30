import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DropDown } from 'Utils/TagInput';
import { PreviewCard } from 'Components/cards';
import CardStack from '../CardStack';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from '../DragAndDrop/DragSourceTarget';
import CardDataOverlay from './CardDataOverlay';

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

@DragDropContextProvider
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
    screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight
    });
    preSelectCardId();

    // TODO: update
    navigator.geolocation.watchPosition(
      pos => {
        const userLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        // TODO:
        // const centerLocation = { ...userLocation };
      },
      // 50.846749, 4.352349
      d => console.log('error watch pos', d),
      { timeout: 1000000 }
    );
  }

  componentWillUnmount() {
    // window.addEventListener('resize', () => {});
    navigator.geolocation.watchPosition(() => {}, () => {}, { timeout: 1 });
    navigator.geolocation.getCurrentPosition(() => {}, () => {}, {
      timeout: 1
    });
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
      selectedTags
    } = this.props;

    const slotSize = 100 / 3.5;
    const cardStackWidth =
      slotSize / cards.length < slotSize ? 100 : slotSize * cards.length;
    console.log('cardStackWidth', cardStackWidth);
    return (
      <div
        className="w-100 h-100"
        style={{ position: 'relative', overflow: 'hidden' }}
        ref={node => (this.domCont = node)}
      >
        <div
          className="w-100 h-100"
          ref={cont => (this.cont = cont)}
          style={{
            position: 'absolute'
          }}
        >
          <div className="h-100">
            <div
              className="input-group mt-2"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                zIndex: 100
              }}
            >
              <DropDown
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
                height: '25%'
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
                slotSize={cardStackWidth < 100 ? 100 : slotSize}
                style={{
                  zIndex: 1000
                }}
              />
            </div>
            <CardDataOverlay
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
