import React, { Component } from 'react';
// import * as d3 from 'd3';

import 'mapbox-gl/dist/mapbox-gl.css';
// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import Spinner from 'react-loader-spinner';
import * as chromatic from 'd3-scale-chromatic';

// TODO: { LinearInterpolator, FlyToInterpolator }
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import * as d3 from 'd3';

// TODO: move
import WindowContext from 'Src/WindowContext';

import withAuthorization from '../withAuthorization';

import { colorScale, cardTypeColorScale } from '../cards/styles';

// import ReactTimeout from 'react-timeout';
// import rasterTileStyle from 'raster-tile-style';
// import ngeohash from 'ngeohash';,
// import cx from './MapView.scss';
import { Card, CardMarker, PreviewCard } from '../cards';
// import SvgOverlay from '../utils/map-layers/SvgOverlay';
import Accordion from './CardGrid';
// import ContextView from './ContextView';
import ForceOverlay from './ForceOverlay';
import Title from './Title';
import TagBar from './TagBar';
import TagList from './TagList';
import { setify } from './utils';

import PhotoChallenge from '../Challenges/MatchPhotoChallenge';

// import StartNav from './StartNav';
// import { VisibleView, VisibleElement } from '../utils/MySensor.jsx';

// import { Grid } from '../utils';
// import { ScrollElement, ScrollView } from '../utils/ScrollView';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import {
  UserOverlay
  // UserMarker,
} from '../utils/map-layers/DivOverlay';

import ExtendableMarker from '../utils/ExtendableMarker';
// import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
import chroma from 'chroma-js';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Modal, ModalBody } from '../utils/Modal';

import { DragSourceCont, DropTargetCont } from './DragAndDrop/DragSourceTarget';
import DragLayer from './DragAndDrop/DragLayer';

function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

// TODO: adapt colors
const tagColors = chromatic.schemeAccent
  .reverse()
  .map(c => chroma(c).alpha(0.04));

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

// const TimoutGrid = ReactTimeout(Accordion);

const CardMetaControl = ({ action }) => (
  <div
    key={action.key}
    className="w-100"
    style={{ display: 'flex', alignContent: 'center', marginBottom: 30 }}
  >
    <button
      className="btn w-100"
      style={{
        background: 'whitesmoke',
        fontWeight: 'bold',
        transition: 'opacity 1s'
        // position: 'absolute',
        // top: -100
      }}
      onClick={action.func}
    >
      {(() => {
        switch (action.key) {
          case 'route':
            return <Icon.Map />;
          case 'selectCard':
            return <Icon.MapPin />;
          case 'flyToUser':
            return <Icon.User />;
          default:
            return <Spinner type="ThreeDots" color="grey" height={24} />;
        }
      })()}
    </button>
  </div>
);

CardMetaControl.propTypes = {
  action: PropTypes.shape({ key: PropTypes.string, func: PropTypes.func })
    .isRequired
};

function SpeechBubble({ ...props }) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -130%)',
        background: 'whitesmoke'
      }}
    >
      <div
        className="m-1"
        style={{
          width: 270,
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

const PreviewMarker = ({ selected, template, color, r = 25 }) => (
  <div
    className="w-100 h-100"
    style={{
      position: 'relative',
      height: 2 * r,
      width: 2 * r
    }}
  >
    {selected && (
      <div
        className="m-3"
        style={{
          position: 'absolute',
          width: r * 2, // '13vw',
          height: r * 2, // '13vw',
          transform: `translate(${-r}px,${-r}px)`,
          opacity: 0.5,
          zIndex: 1000,
          borderRadius: '50%',
          border: '3px black solid'
        }}
      />
    )}
    <CardMarker
      color={color}
      style={{
        opacity: 1,
        position: 'absolute',
        transform: `translateX(3px)`,
        zIndex: -100,
        width: r, // '13vw',
        height: r // '13vw',
      }}
    />
  </div>
);

class MapView extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    defaultCards: PropTypes.array.isRequired,
    mapZoom: PropTypes.number.isRequired,
    userLocation: PropTypes.array.isRequired,
    selectedCardId: PropTypes.string.isRequired,
    selectedCard: PropTypes.object.isRequired,
    extCardId: PropTypes.string.isRequired,
    tagListView: PropTypes.bool.isRequired,
    tsneView: PropTypes.bool.isRequired,
    // centerLocation: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    cardChallengeOpen: PropTypes.bool.isRequired,
    AppOpenFirstTime: PropTypes.bool.isRequired,
    mapViewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      zoom: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }).isRequired,

    userMove: PropTypes.func.isRequired,
    changeMapViewport: PropTypes.func.isRequired,
    selectCard: PropTypes.func.isRequired,
    extCard: PropTypes.func.isRequired,
    toggleCardChallenge: PropTypes.func.isRequired,
    flyToUserAction: PropTypes.func.isRequired,
    screenResize: PropTypes.func.isRequired
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

    screenResize({
      width,
      height
    });

    this.scrollTo = scrollTo.bind(this);
    // this.node = null;
    this.fullscreen = false;
  }

  componentDidMount() {
    // const map = this.map.getMap();

    const { screenResize, getUserCards } = this.props;
    screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight
    });

    navigator.geolocation.watchPosition(
      pos => {
        const userLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        // TODO:
        const centerLocation = { ...userLocation };
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

    // navigator.geolocation.clearWatch(this.state.watchPosId);
  }

  render() {
    const {
      cards,
      // defaultCards,
      zoom,
      userLocation,
      selectedCardId,
      // latitude,
      // longitude,
      width,
      height,
      extCardId,
      selectedCard,
      // direction,
      // mapViewport,
      // setCardOpacity,
      // userSelected,
      // userChangedMapViewport,
      // compass,
      // birdsEyeView,
      gridView,
      tsneView,
      tagListView,
      isSearching,
      isCardDragging,
      // authEnvCards,
      authEnv,
      // cardTemplate,
      // AppOpenFirstTime,
      // headerPad,

      // nextCardControl,
      cardChallengeOpen,

      // userMove,
      changeMapViewport,
      selectCard,
      extendSelectedCard,
      toggleCardChallenge,
      fetchDirection,
      filterCards,
      dataView,
      // toggleTagList,
      toggleTsneView,
      toggleGrid,
      toggleSearch,
      dragCard,
      onCardUpdate,
      changeViewport,
      toggleCardAuthoring,
      toggleDataView,
      // cardAuthoring,
      // cardAction,
      onCardDrop,
      cardAction
      // getUserCards
      // navigateFirstTimeAction
    } = this.props;

    // const vp = new PerspectiveMercatorViewport({
    //   width,
    //   height,
    //   zoom,
    //   latitude,
    //   longitude
    // });

    const cardSets = []; // setify(cards).filter(d => d.count > 0);
    // const barScales = setify(cards).map(d => ({
    //   key: d.key,
    //   scale: d3
    //     .scaleLinear()
    //     .domain([0, d.count])
    //     .range([10, 100])
    // }));

    const tagColorScale = d3
      .scaleOrdinal()
      .domain(
        cardSets
          .sort((a, b) => a.values.length - b.values.length)
          .map(s => s.key)
      )
      .range(tagColors);

    const selectedTags = selectedCard ? selectedCard.tags : [];

    const barScale = d3
      .scaleLinear()
      .domain(d3.extent(cardSets, d => d.count))
      .range([20, 100]);

    return (
      <React.Fragment>
        <Modal
          visible={cardChallengeOpen}
          onClose={() => toggleCardChallenge({ cardChallengeOpen: false })}
        >
          <ModalBody>
            <PhotoChallenge />
          </ModalBody>
        </Modal>
        <DragDropContextProvider
          backend={width < 500 ? TouchBackend : HTML5Backend}
        >
          <div className="w-100 h-100" style={{ position: 'relative' }}>
            <div
              className="w-100 h-100"
              ref={cont => (this.cont = cont)}
              style={{
                position: 'absolute'
              }}
            >
              <DragLayer />

              <div
                style={{
                  display: 'flex',
                  position: 'absolute',
                  justifyContent: 'flex-end',
                  marginTop: 10,
                  marginRight: 10,
                  width: '100%'
                }}
              >
                <button
                  className="btn mr-3"
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    background: 'whitesmoke'
                  }}
                  onClick={() => toggleCardAuthoring(userLocation)}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon.Clipboard size={30} />
                  </div>
                </button>
                <input
                  className="btn mr-3"
                  placeholder="Search Cards"
                  type="text"
                  onChange={evt => filterCards(evt.target.value)}
                  onFocus={() => toggleSearch(true)}
                  onBlur={() => toggleSearch(false)}
                  style={{
                    background: 'whitesmoke',
                    textAlign: 'left',
                    position: 'relative',
                    // right: 0,
                    zIndex: 4000
                  }}
                />
              </div>

              <div
                className="w-100"
                style={{
                  opacity: gridView ? 1 : 0,
                  display: !gridView ? 'none' : null,
                  transition: 'opacity 0.5s',
                  height: '25%',
                  marginTop: 90
                }}
              >
                <Accordion
                  data={cards}
                  className="ml-1 mr-2"
                  duration={600}
                  centered={selectedCardId !== null}
                  selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
                  width={100}
                  height={100}
                  unit="%"
                  slotSize={100 / 3.5}
                  style={{
                    // width: '100%',
                    zIndex: 2000
                  }}
                >
                  {d => (
                    <div
                      className="w-100 h-100"
                      key={d.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'center'
                        // border: 'black 5px solid'
                        // pointerEvents: 'none'
                      }}
                    >
                      <div style={{ width: '100%', height: '100%' }}>
                        <PreviewCard
                          {...d}
                          onClick={() =>
                            selectedCardId === d.id
                              ? extendSelectedCard(d.id)
                              : selectCard(d.id)
                          }
                          tagColorScale={tagColorScale}
                          key={d.id}
                          edit={d.template}
                          selected={selectedCardId === d.id}
                          style={{
                            transition: `transform 1s`,
                            transform: selectedCardId === d.id && 'scale(1.2)',
                            opacity: d.template && 0.8

                            // width: '100%',
                            // height: '100%',
                            // width: '100%'
                            // maxWidth: '200px'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Accordion>

                <div
                  className="w-100 h-100"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0
                    // filter: tsneView && 'blur(4px)'
                  }}
                />
                <DropTargetCont
                  dropHandler={onCardDrop}
                  dragged={isCardDragging}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    // position: 'relative',
                    // background: 'white',
                    zIndex: 1000
                  }}
                >
                  <ForceOverlay
                    delay={1}
                    width={width}
                    height={height}
                    force
                    data={cards}
                    sets={cardSets}
                    selectedCardId={selectedCardId}
                    extCardId={extCardId}
                    userLocation={userLocation}
                    mode={dataView}
                    labels={!gridView}
                    onMapViewportChange={changeMapViewport}
                    padding={{
                      bottom: !gridView && !tagListView ? (height * 1) / 6 : 50,
                      top:
                        gridView || tagListView
                          ? (height * 1) / 1.7
                          : (height * 1) / 6,
                      left: 70,
                      right: 70
                    }}
                    colorScale={tagColorScale}
                  >
                    {({ x, y, ...c }) => (
                      <ExtendableMarker
                        key={c.id}
                        width={extCardId === c.id ? width : 25}
                        height={extCardId === c.id ? height : 30}
                        x={extCardId === c.id ? width / 2 : x}
                        y={extCardId === c.id ? height / 2 : y}
                        extended={extCardId === c.id}
                        preview={
                          <div>
                            {selectedCardId === c.id &&
                              !isCardDragging && <SpeechBubble />}
                            <DragSourceCont
                              dragHandler={dragCard}
                              data={c}
                              x={x}
                              y={y}
                            >
                              <PreviewMarker
                                selected={selectedCardId === c.id}
                                template={c.template}
                                color="whitesmoke"
                              />
                            </DragSourceCont>
                          </div>
                        }
                      >
                        <Card
                          {...c}
                          onClose={() => extendSelectedCard(null)}
                          edit={authEnv}
                          onSubmit={() => {
                            console.log('cardAction', c);
                            cardAction({ ...c, x, y });
                          }}
                          onCollect={() =>
                            toggleCardChallenge({
                              cardChallengeOpen: true
                            })
                          }
                          tagColorScale={tagColorScale}
                          onUpdate={d => onCardUpdate({ ...d, x, y })}
                          style={{ zIndex: 4000 }}
                        />
                      </ExtendableMarker>
                    )}
                  </ForceOverlay>
                </DropTargetCont>
                <button
                  className="fixed-bottom-right btn m-3"
                  style={{
                    // position: 'absolute',
                    zIndex: 1000,
                    background: tsneView && 'whitesmoke'
                  }}
                  onClick={() => toggleDataView(dataView === 'som' : 'geo')}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon.Eye size={30} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </DragDropContextProvider>
      </React.Fragment>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(MapView);

// export default MapView;
