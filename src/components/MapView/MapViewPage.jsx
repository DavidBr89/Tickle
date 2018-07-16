import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';

// import { Motion, spring } from 'react-motion';
import * as Icon from 'react-feather';
import Spinner from 'react-loader-spinner';
import * as d3 from 'd3';
import { intersection, union } from 'lodash';

// TODO: { LinearInterpolator, FlyToInterpolator }
// import { default as TouchBackend } from 'react-dnd-touch-backend';
// import HTML5Backend from 'react-dnd-html5-backend';
// import { DragDropContextProvider } from 'react-dnd';

import {
  DragSourceCont,
  DropTargetCont,
  DragDropContextProvider
} from './DragAndDrop/DragSourceTarget';

import PreviewMarker from './PreviewMarker';

import { TagInput, DropDown } from 'Utils/TagInput';

import withAuthorization from '../withAuthorization';

import { colorScale, cardTypeColorScale } from '../cards/styles';

import { Card, CardMarker, PreviewCard } from '../cards';
import CardStack from 'Utils/CardStack';
import CardDataOverlay from './CardDataOverlay';

import PhotoChallenge from '../Challenges/MatchPhotoChallenge';

import { UserOverlay } from '../utils/map-layers/DivOverlay';
import ExtendableMarker from '../utils/ExtendableMarker';
import { Modal, ModalBody } from 'Utils/Modal';

import DragLayer from './DragAndDrop/DragLayer';

import { StyledButton } from 'Utils/StyledComps';

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

@DragDropContextProvider
class MapViewPage extends Component {
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

    window.addEventListener('resize', () => {
      screenResize({
        width: this.cont.offsetWidth || window.innerWidth,
        height: this.cont.offsetHeight || window.innerHeight
      });
    });

    // screenResize({
    //   width,
    //   height
    // });

    this.scrollTo = scrollTo.bind(this);
    // this.node = null;
    this.fullscreen = false;
  }

  componentDidMount() {
    const { screenResize, getUserCards, fetchCards } = this.props;

    fetchCards();
    screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight
    });

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
    window.addEventListener('resize', () => {});
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
    return (
      <React.Fragment>
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
                <button
                  className="btn mr-2"
                  style={{ background: 'whitesmoke', fontWeight: 'bold' }}
                  onClick={toggleAuthEnv}
                >
                  <span>{authEnv ? 'View Cards' : 'Author Card'}</span>
                </button>

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
                  // opacity: gridView ? 1 : 0,
                  // display: !gridView ? 'none' : null,
                  transition: 'opacity 0.5s',
                  height: '25%'
                  // marginTop: 30
                }}
              >
                <CardStack
                  data={cards}
                  className="ml-1 mr-2"
                  duration={600}
                  centered={selectedCardId !== null}
                  selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
                  width={cardStackWidth}
                  height={100}
                  unit="%"
                  slotSize={cardStackWidth < 100 ? 100 : slotSize}
                  style={{
                    // width: '100%',
                    zIndex: 1000
                  }}
                >
                  {d => (
                    <PreviewCard
                      {...d}
                      onClick={() => previewCardAction(d)}
                      tagColorScale={tagColorScale}
                      key={d.id}
                      edit={d.template}
                      selected={selectedCardId === d.id}
                      style={{
                        transition: `transform 1s`,
                        // TODO: change later
                        height: height / 4,
                        // TODO
                        // TODO
                        // TODO
                        // TODO
                        // TODO
                        // height: '100%',
                        transform: selectedCardId === d.id && 'scale(1.2)',
                        // zIndex: selectedCardId === d.id && 5000,
                        opacity: d.template && 0.8

                        // width: '100%',
                        // height: '100%',
                        // width: '100%'
                        // maxWidth: '200px'
                      }}
                    />
                  )}
                </CardStack>
              </div>

              <CardDataOverlay
                dataView={dataView}
                authEnv={authEnv}
                cards={cards}
                cardSets={cardSets}
                selectedTags={selectedTags}
                style={{ height: '65%' }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MapViewPage;
// export default withAuthorization(authCondition)(MapViewPage);

// export default MapView;
