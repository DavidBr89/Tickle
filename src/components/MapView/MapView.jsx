import React, { Component, PureComponent } from 'react';
// import * as d3 from 'd3';

import 'mapbox-gl/dist/mapbox-gl.css';

// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';

// TODO: { LinearInterpolator, FlyToInterpolator }
import MapGL from 'react-map-gl';

// import ReactTimeout from 'react-timeout';
// import rasterTileStyle from 'raster-tile-style';
// import ngeohash from 'ngeohash';,
// import cx from './MapView.scss';
import { Card } from '../cards';
import CardGrid from './CardGrid';
// import StartNav from './StartNav';
// import { VisibleView, VisibleElement } from '../utils/MySensor.jsx';

// import { Grid } from '../utils';
// import { ScrollElement, ScrollView } from '../utils/ScrollView';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import {
  DivOverlay,
  UserOverlay,
  UserMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';
import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Modal } from '../utils/modal';

// const TimoutGrid = ReactTimeout(CardGrid);

// import { dummyCards } from '../../dummyData';
//
// // TODO:  change
// dummyCards.forEach((d, i) => {
//   d.id = i;
// });

class MapView extends PureComponent {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    mapZoom: PropTypes.number.isRequired,
    userLocation: PropTypes.array.isRequired,
    selectedCardId: PropTypes.string.isRequired,
    extCardId: PropTypes.string.isRequired,
    centerLocation: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    cardChallengeOpen: PropTypes.bool.isRequired,
    AppOpenFirstTime: PropTypes.bool.isRequired,

    userMoveAction: PropTypes.func.isRequired,
    changeMapViewportAction: PropTypes.func.isRequired,
    selectCardAction: PropTypes.func.isRequired,
    extCardAction: PropTypes.func.isRequired,
    toggleCardChallengeAction: PropTypes.func.isRequired,
    screenResizeAction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // TODO put into container element
    const { screenResizeAction } = props;

    // this._onChangeViewport = this._onChangeViewport.bind(this);
    // this._userMove = this._userMove.bind(this);
    // this.gridSpan = this.gridSpan.bind(this);

    window.addEventListener('resize', () => {
      screenResizeAction({
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    // TODO: respect margins
    screenResizeAction({
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.scrollTo = scrollTo.bind(this);
    this.node = null;
  }

  componentDidMount() {
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
      mapZoom,
      userLocation,
      selectedCardId,
      centerLocation,
      width,
      height,
      extCardId,
      // AppOpenFirstTime,
      // headerPad,

      userMoveAction,
      changeMapViewportAction,
      selectCardAction,
      extCardAction,
      cardChallengeOpen,
      toggleCardChallengeAction
      // navigateFirstTimeAction
    } = this.props;

    // console.log('width', mapDim);
    const mapDim = { width, height };
    // console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    // const gridConfig = this.gridSpan();
    const selectedCard =
      selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null;

    const cardPadding = 15;
    return (
      <div>
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
        <div ref={node => (this.node = node)} style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0
              // pointerEvents: extCardId !== null ? 'none' : null
            }}
          >
            <MapGL
              {...mapViewport}
              onViewportChange={changeMapViewportAction}
              isdragging={false}
              startdraglnglat={null}
              onClick={({ lngLat, deltaTime }) =>
                // TODO: fix later
                deltaTime > 30 && userMoveAction({ lngLat })
              }
            >
              {selectedCard && (
                <MapAreaRadius
                  userLocation={userLocation}
                  mapViewport={mapViewport}
                  cardPosition={{ ...selectedCard.loc }}
                />
              )}
              <DivOverlay {...mapViewport} data={cards}>
                {(c, [x, y]) => (
                  <AnimMarker
                    key={c.id}
                    selected={extCardId === c.id}
                    width={extCardId === c.id ? width - cardPadding : 40}
                    height={extCardId === c.id ? height - cardPadding : 50}
                    offsetX={3}
                    offsetY={3}
                    x={x + 5}
                    y={y + 3}
                    node={this.node}
                  >
                    <Card
                      {...c}
                      onClose={() => extCardAction(null)}
                      onCollect={() =>
                        toggleCardChallengeAction({ cardChallengeOpen: true })
                      }
                    />
                  </AnimMarker>
                )}
              </DivOverlay>
              <DivOverlay {...mapViewport} data={[{ loc: userLocation }]}>
                {(c, [x, y]) => <UserMarker x={x} y={y} />}
              </DivOverlay>
              <UserOverlay {...mapViewport} location={userLocation} />
            </MapGL>
          </div>

          <div style={{ paddingTop: 60 }}>
            <CardGrid
              cards={cards}
              onSelect={selectCardAction}
              selected={selectedCardId}
              onExtend={extCardAction}
              offset={0}
              style={{
                height: '26vh',
                paddingTop: '16px',
                paddingLeft: '35vw',
                paddingRight: '35vw',
                paddingBottom: '15px',
                width: `${cards.length * 40}vw`,
                zIndex: 8000
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default MapView;
