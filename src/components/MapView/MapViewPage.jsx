import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';

import 'mapbox-gl/dist/mapbox-gl.css';
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

import { TagInput, DropDown } from 'Utils/TagInput';

import withAuthorization from '../withAuthorization';

import { colorScale, cardTypeColorScale } from '../cards/styles';

import { Card, CardMarker, PreviewCard } from '../cards';
import Accordion from 'Utils/CardStack';
import ForceOverlay from './ForceOverlay';

import PhotoChallenge from '../Challenges/MatchPhotoChallenge';

import { UserOverlay } from '../utils/map-layers/DivOverlay';
import ExtendableMarker from '../utils/ExtendableMarker';
import { Modal, ModalBody } from '../utils/Modal';

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

    // screenResize({
    //   width,
    //   height
    // });

    this.scrollTo = scrollTo.bind(this);
    // this.node = null;
    this.fullscreen = false;
  }

  componentDidMount() {
    const { screenResize, getUserCards } = this.props;
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
      authUser,

      previewCardAction,
      tagColors,
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
      addCardFilter,
      removeCardFilter,
      dataView,
      // toggleTagList,
      toggleTsneView,
      toggleGrid,
      toggleSearch,
      dragCard,
      onCardUpdate,
      changeViewport,
      toggleCardAuthoring,
      setDataView,
      filterSet,
      // cardAuthoring,
      // cardAction,
      onCardDrop,
      cardAction,
      tagColorScale,
      cardSets,
      selectedTags
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

    // const cardSets = setify(cards);
    // const barScales = setify(cards).map(d => ({
    //   key: d.key,
    //   scale: d3
    //     .scaleLinear()
    //     .domain([0, d.count])
    //     .range([10, 100])
    // }));

    // const barScale = d3
    //   .scaleLinear()
    //   .domain(d3.extent(cardSets, d => d.count))
    //   .range([20, 100]);

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
                style={{ display: 'flex', justifyContent: 'flex-end' }}
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
                className="w-100"
                style={{
                  opacity: gridView ? 1 : 0,
                  display: !gridView ? 'none' : null,
                  transition: 'opacity 0.5s',
                  height: '25%',
                  marginTop: 30
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
                    zIndex: dataView === 'geo' && 1000
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
                          onClick={() => previewCardAction(d)}
                          tagColorScale={tagColorScale}
                          key={d.id}
                          edit={d.template}
                          selected={selectedCardId === d.id}
                          style={{
                            transition: `transform 1s`,
                            transform: selectedCardId === d.id && 'scale(1.2)',
                            // zIndex: selectedCardId === d.id && 5000,
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
              </div>

              <DropTargetCont
                dropHandler={onCardDrop}
                dragged={isCardDragging}
                style={{ height: '65%' }}
              >
                <ForceOverlay
                  delay={1}
                  disabled={isCardDragging || extCardId !== null}
                  width={width}
                  height={height}
                  force
                  data={cards}
                  sets={cardSets}
                  selectedTags={selectedTags}
                  selectedCardId={selectedCardId}
                  userLocation={userLocation}
                  mode={dataView}
                  onMapViewportChange={changeMapViewport}
                  padding={{
                    bottom: height / 5,
                    top: height / 5,
                    left: width / 5,
                    right: width / 5
                  }}
                  colorScale={tagColorScale}
                >
                  {({ x, y, ...c }) => (

        <Card
          {...c}
          key={authUser.uid}
          onClose={() => extendSelectedCard(null)}
          edit={authEnv}
          onSubmit={() => {
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
                  )}
                </ForceOverlay>
              </DropTargetCont>
              <div
                className="fixed-bottom-right"
                style={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'flex-end'
                }}
              >
                <button
                  className={`btn mb-3 mr-2 ${dataView === 'geo' &&
                    'btn-active'}`}
                  style={{
                    // position: 'absolute',
                    // zIndex: 1000,
                    background: tsneView && 'whitesmoke'
                  }}
                  onClick={() => setDataView('geo')}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 30,
                      width: 44,
                      fontWeight: 'bold'
                    }}
                  >
                    {'Map'}
                  </div>
                </button>
                <button
                  className={`btn mb-3 ${dataView === 'floorplan' &&
                    'btn-active'}`}
                  style={{
                    // position: 'absolute',
                    // zIndex: 1000,
                    background: tsneView && 'whitesmoke'
                  }}
                  onClick={() => setDataView('floorplan')}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 30,
                      fontWeight: 'bold'
                    }}
                  >
                    {'Floor'}
                  </div>
                </button>

                <div
                  style={{
                    // height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  <button
                    className={`btn mb-3 mr-3 ml-2 ${dataView === 'topic' &&
                      'btn-active'}`}
                    style={
                      {
                        // position: 'absolute',
                        // zIndex: 1000
                        // background: dataView === 'som' && 'grey',
                      }
                    }
                    onClick={() => setDataView('topic')}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>Topic</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(MapViewPage);

// export default MapView;
