import React, { PureComponent } from 'react';
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
import MapGL from 'react-map-gl';
import * as d3 from 'd3';

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
import { Modal } from '../utils/modal';

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

const PreviewMarker = ({ selected, color, r = 25 }) => (
  <div
    className="w-100 h-100"
    style={{
      position: 'relative'
      // height: 2 * r,
      // width: 2 * r
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
        zIndex: -100
      }}
    />
  </div>
);

class MapView extends PureComponent {
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

    userMoveAction: PropTypes.func.isRequired,
    changeMapViewportAction: PropTypes.func.isRequired,
    selectCardAction: PropTypes.func.isRequired,
    extCardAction: PropTypes.func.isRequired,
    toggleCardChallengeAction: PropTypes.func.isRequired,
    flyToUserAction: PropTypes.func.isRequired,
    screenResizeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // TODO put into container element
    const { screenResizeAction } = props;

    // this._onChangeViewport = this._onChangeViewport.bind(this);
    // this._userMove = this._userMove.bind(this);
    // this.gridSpan = this.gridSpan.bind(this);

    const width = window.innerWidth;
    const height = window.innerHeight;

    window.addEventListener('resize', () => {
      screenResizeAction({
        width: this.cont.offsetWidth || window.innerWidth,
        height: this.cont.offsetHeight || window.innerHeight
      });
    });

    screenResizeAction({
      width,
      height
    });

    this.scrollTo = scrollTo.bind(this);
    // this.node = null;
    this.fullscreen = false;
  }

  componentDidMount() {
    // const map = this.map.getMap();

    const { screenResizeAction } = this.props;
    screenResizeAction({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight
    });
    // map._refreshExpiredTiles = false;

    // const {
    //   computeTopicMapAction,
    //   width,
    //   height,
    //   longitude,
    //   latitude,
    //   zoom,
    //   cards
    // } = this.props;
    //
    // window.addEventListener('resize', () => {
    //   computeTopicMapAction({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //     latitude,
    //     longitude,
    //     zoom,
    //     cards
    //   });
    // });

    // computeTopicMapAction({
    //   width,
    //   height,
    //   latitude,
    //   longitude,
    //   zoom,
    //   cards
    // });
    // const { screenResize } = this.props;
    // window.addEventListener('resize', () => {
    //   this.setState({
    //     mapHeight: {
    //       width: window.innerWidth,
    //       height: window.innerHeight
    //     }
    //   });
    // });

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
      defaultCards,
      zoom,
      userLocation,
      selectedCardId,
      latitude,
      longitude,
      width,
      height,
      extCardId,
      selectedCard,
      direction,
      mapViewport,
      // setCardOpacity,
      userSelected,
      userChangedMapViewport,
      compass,
      birdsEyeView,
      gridView,
      tsneView,
      tagListView,
      isSearching,
      isCardDragging,
      authEnvCards,
      authEnv,
      cardTemplate,
      // AppOpenFirstTime,
      // headerPad,

      userMoveAction,
      changeMapViewportAction,
      selectCardAction,
      extCardAction,
      cardChallengeOpen,
      toggleCardChallengeAction,
      fetchDirectionAction,
      filterCardsAction,
      // flyToUserAction,
      nextCardControlAction,
      toggleTagListAction,
      toggleTsneViewAction,
      toggleGridAction,
      toggleSearchAction,
      dragCardAction,
      createOrUpdateCardAction,
      changeViewportAction,
      toggleCardAuthoringAction,
      cardAuthoring,
      createCardAction
      // navigateFirstTimeAction
    } = this.props;

    // const vp = new PerspectiveMercatorViewport({
    //   width,
    //   height,
    //   zoom,
    //   latitude,
    //   longitude
    // });

    const cardSets = setify(cards).filter(d => d.count > 0);
    const barScales = setify(defaultCards).map(d => ({
      key: d.key,
      scale: d3
        .scaleLinear()
        .domain([0, d.count])
        .range([10, 100])
    }));

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

    // TODO: move to index.jsx

    return (
      <div className="w-100 h-100">
        <DragDropContextProvider backend={HTML5Backend}>
          <div
            className="w-100 h-100"
            ref={cont => (this.cont = cont)}
            style={{
              position: 'relative'
            }}
          >
            <DragLayer />
            <nav
              className="navbar navbar-light"
              style={{
                zIndex: 4000
                // filter: 'blur(10px)',

                // display: 'flex'
              }}
            >
              <button
                style={{ background: 'whitesmoke' }}
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#submenu"
                aria-controls="submenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <input
                className="btn"
                placeholder="Search Cards"
                type="text"
                onChange={evt => filterCardsAction(evt.target.value)}
                onFocus={() => toggleSearchAction(true)}
                onBlur={() => toggleSearchAction(false)}
                style={{
                  background: 'whitesmoke',
                  textAlign: 'left'
                }}
              />
            </nav>

            <div
              className="collapse"
              id="submenu"
              style={{ position: 'relative', zIndex: 4000 }}
            >
              <div
                className="p-3"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <button
                  className="btn"
                  style={{
                    zIndex: 3000,
                    background: tagListView ? 'whitesmoke' : null
                  }}
                  onClick={toggleTagListAction}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      zIndex: 3000,
                      transform: 'rotate(90deg)'
                    }}
                  >
                    <Icon.BarChart size={30} />
                  </div>
                </button>
                <button
                  className="mt-3 btn"
                  style={{
                    // position: 'absolute',
                    zIndex: 3000,
                    background: gridView ? 'whitesmoke' : null
                  }}
                  onClick={toggleGridAction}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>{'Card grid'}</div>
                    <Icon.Grid className="ml-1" size={30} />
                  </div>
                </button>
                <button
                  className="mt-3 btn"
                  style={{
                    // position: 'absolute',
                    zIndex: 3000,
                    background: gridView ? 'whitesmoke' : null
                  }}
                  onClick={() => {
                    !this.fullscreen
                      ? launchIntoFullscreen(this.cont)
                      : exitFullscreen(this.cont);
                    this.fullscreen = !this.fullscreen;
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>{'Full screen'}</div>
                    <Icon.Monitor className="ml-1" size={20} />
                  </div>
                </button>
                <button
                  className="mt-3 btn"
                  style={{
                    // position: 'absolute',
                    zIndex: 3000,
                    background: gridView ? 'whitesmoke' : null
                  }}
                  onClick={toggleCardAuthoringAction}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>{'Author Cards'}</div>
                    <div className="ml-1">
                      <Icon.Clipboard size={20} />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-100 h-100">
              <DragLayer />
              <Modal
                visible={cardChallengeOpen}
                onClose={() =>
                  toggleCardChallengeAction({ cardChallengeOpen: false })
                }
              >
                {/* TODO: put in real challenge */}
                <iframe
                  title="emperors"
                  src="http://thescalli.com/emperors/"
                  style={{ border: 'none', width: '100%', height: '90vh' }}
                />
              </Modal>

              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  filter: tsneView && 'blur(4px)'
                }}
              />
              <div
                className="w-100"
                style={{
                  opacity: gridView ? 1 : 0,
                  display: !gridView ? 'none' : null,
                  transition: 'opacity 0.5s',
                  height: '25%'
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
                  unit={'%'}
                  slotSize={100 / 3.5}
                  style={{
                    // width: '100%',
                    zIndex: 2000,
                    marginTop: 30
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
                      <DragSourceCont
                        dragHandler={dragCardAction}
                        id={d.id}
                        x={100}
                        y={100}
                      >
                        <div style={{ width: '100%', height: '100%' }}>
                          <PreviewCard
                            {...d}
                            onClick={() =>
                              selectedCardId === d.id
                                ? extCardAction(d.id)
                                : selectCardAction(d.id)
                            }
                            tagColorScale={tagColorScale}
                            key={d.id}
                            edit={d.template}
                            selected={selectedCardId === d.id}
                            style={{
                              transition: `transform 1s`,
                              transform: selectedCardId === d.id && 'scale(1.2)'
                              // width: '100%',
                              // height: '100%',
                              // width: '100%'
                              // maxWidth: '200px'
                            }}
                          />
                        </div>
                      </DragSourceCont>
                    </div>
                  )}
                </Accordion>
              </div>
              <div
                style={{
                  opacity: tagListView ? 1 : 0,
                  transition: 'opacity 0.5s',
                  display: !tagListView ? 'none' : null,
                  zIndex: tagListView ? 5000 : null
                }}
              >
                {
                  // <TagList
                  // data={cardSets}
                  // scale={barScale}
                  // barScales={barScales}
                  // colorScale={tagColorScale}
                  // />
                }
              </div>

              <div
                style={{
                  fontSize: 100,
                  position: 'relative',
                  zIndex: 3000,
                }}
              >
                {'drag and drop'}
              </div>
              <DropTargetCont
                dropHandler={
                  selectedCardId === 'temp'
                    ? createCardAction
                    : createOrUpdateCardAction
                }
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
                  delay={2000}
                  width={width}
                  height={height}
                  force
                  data={cards}
                  sets={cardSets}
                  selectedCardId={selectedCardId}
                  extCardId={extCardId}
                  userLocation={userLocation}
                  mode={!tsneView ? 'geo' : 'som'}
                  labels={!gridView}
                  onMapViewportChange={changeMapViewportAction}
                  padding={{
                    bottom: !gridView && !tagListView ? height * 1 / 6 : 50,
                    top:
                      gridView || tagListView
                        ? height * 1 / 1.7
                        : height * 1 / 6,
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
                        <DragSourceCont
                          dragHandler={dragCardAction}
                          id={c.id}
                          x={x}
                          y={y}
                        >
                          <PreviewMarker
                            selected={selectedCardId === c.id}
                            color={'whitesmoke'}
                          />
                        </DragSourceCont>
                      }
                    >
                      <Card
                        {...c}
                        onClose={() => extCardAction(null)}
                        onCollect={() =>
                          toggleCardChallengeAction({ cardChallengeOpen: true })
                        }
                        tagColorScale={tagColorScale}
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
                onClick={toggleTsneViewAction}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Icon.Eye size={30} />
                </div>
              </button>
            </div>
          </div>
        </DragDropContextProvider>
      </div>
    );
  }
}
export default MapView;
// export default MapView;
