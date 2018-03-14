import React, { PureComponent } from 'react';
// import * as d3 from 'd3';

import 'mapbox-gl/dist/mapbox-gl.css';
// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';
import Spinner from 'react-loader-spinner';

// TODO: { LinearInterpolator, FlyToInterpolator }
import MapGL, { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3';
import * as d3 from 'd3';
import { colorScale, brighterColorScale } from '../cards/styles';

// import ReactTimeout from 'react-timeout';
// import rasterTileStyle from 'raster-tile-style';
// import ngeohash from 'ngeohash';,
// import cx from './MapView.scss';
import { Card, CardMarker } from '../cards';
import SvgOverlay from '../utils/map-layers/SvgOverlay';
import CardGrid from './CardGrid';
import ContextView from './ContextView';
import ForceOverlay from './ForceOverlay';
// import StartNav from './StartNav';
// import { VisibleView, VisibleElement } from '../utils/MySensor.jsx';

// import { Grid } from '../utils';
// import { ScrollElement, ScrollView } from '../utils/ScrollView';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import {
  DivOverlay,
  UserOverlay,
  // UserMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';
import MapAreaRadius from '../utils/map-layers/MapAreaRadius';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Modal } from '../utils/modal';

const line = d3.line();
// const TimoutGrid = ReactTimeout(CardGrid);

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

class MapView extends PureComponent {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    mapZoom: PropTypes.number.isRequired,
    userLocation: PropTypes.array.isRequired,
    selectedCardId: PropTypes.string.isRequired,
    selectedCard: PropTypes.object.isRequired,
    extCardId: PropTypes.string.isRequired,
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
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    // TODO: respect margins
    screenResizeAction({
      width,
      height
    });

    this.scrollTo = scrollTo.bind(this);
    this.node = null;
  }

  componentDidMount() {
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
      setCardOpacity,
      userSelected,
      userChangedMapViewport,
      compass,
      birdsEyeView,
      gridView,
      tsneView,
      // AppOpenFirstTime,
      // headerPad,

      userMoveAction,
      changeMapViewportAction,
      selectCardAction,
      extCardAction,
      cardChallengeOpen,
      toggleCardChallengeAction,
      fetchDirectionAction,
      flyToUserAction,
      nextCardControlAction,
      enableCompassAction,
      toggleTsneViewAction,
      toggleGridAction
      // navigateFirstTimeAction
    } = this.props;

    console.log('nextCardControlAction', nextCardControlAction);
    console.log('userLocation', userLocation);

    const cardPadding = 15;

    return (
      <div className="w-100 h-100">
        <div style={{ display: 'flex', width: '200px', position: 'absolute' }}>
          <button
            className="mt-3 ml-3 btn"
            style={{
              // position: 'absolute',
              zIndex: 4000,
              background: compass || birdsEyeView ? 'whitesmoke' : null
            }}
            onClick={birdsEyeView ? toggleTsneViewAction : enableCompassAction}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {birdsEyeView ? (
                <Icon.Eye size={30} />
              ) : (
                <Icon.Compass size={30} />
              )}
            </div>
          </button>
          <button
            className="mt-3 ml-3 btn"
            style={{
              // position: 'absolute',
              zIndex: 4000,
              background: selectedCardId ? 'whitesmoke' : null
            }}
            onClick={toggleGridAction}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Icon.Grid size={30} />
            </div>
          </button>
        </div>
        <div ref={node => (this.node = node)} style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0
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
              <UserOverlay {...mapViewport} location={userLocation} />
              <SvgOverlay
                {...mapViewport}
                data={
                  direction !== null
                    ? [
                      Object.values(userLocation).reverse(),
                      ...direction.routes[0].geometry.coordinates
                    ]
                    : []
                }
              >
                {([x, y], [nx, ny]) =>
                  nx !== null &&
                  ny !== null && (
                      <g>
                        <circle
                        r={3}
                        cx={x}
                        cy={y}
                        fill={colorScale(
                            selectedCard.challenge
                              ? selectedCard.challenge.type
                              : 'quiz'
                          )}
                      />
                        <path
                        d={line([[x, y], [nx, ny]])}
                        style={{
                            stroke: colorScale(selectedCard.challenge.type),
                            strokeWidth: 8
                          }}
                      />
                    </g>
                    )
                }
              </SvgOverlay>
            </MapGL>
          </div>
          <div
            style={{
              opacity: gridView ? 0 : 1,
              transition: 'opacity 1s'
            }}
          >
            <CardGrid
              cards={cards}
              onSelect={selectCardAction}
              selected={selectedCardId}
              onExtend={extCardAction}
              offset={0}
              reset={selectedCardId === null}
              selectedCard={selectedCardId}
              setCardOpacity={setCardOpacity}
              controls={
                <CardMetaControl
                  key={nextCardControlAction.key}
                  action={nextCardControlAction}
                />
              }
              style={{
                height: '26vh',
                paddingTop: '16px',
                paddingLeft: '100px',
                paddingRight: '100px',
                paddingBottom: '15px',
                // width: `${cards.length * 40}vw`,
                zIndex: 8000
              }}
            />
          </div>
        </div>
        <ForceOverlay
          viewport={mapViewport}
          data={cards}
          force
          mode={tsneView ? 'tsne' : 'location'}
          style={{
            background: tsneView ? 'wheat' : null
            // width: tsneView ? width : null,
            // height: tsneView ? height : null
          }}
        >
          {({ x, y, ...c }) => (
            <AnimMarker
              key={c.id}
              selected={extCardId === c.id}
              width={extCardId === c.id ? width - cardPadding : 40}
              height={extCardId === c.id ? height - cardPadding : 50}
              offsetX={extCardId === c.id ? 3 : 0}
              offsetY={3}
              x={x + 5}
              y={y + 3}
              preview={
                <div style={{ position: 'relative' }}>
                  <CardMarker
                    {...c}
                    style={{
                      opacity: setCardOpacity(c),
                      position: 'absolute',
                      zIndex: -100
                    }}
                  />
                  {selectedCardId === c.id &&
                    !direction && (
                      <ContextView
                        radius={70}
                        width={12}
                        delay={1000}
                        background={brighterColorScale(
                          selectedCard.challenge.type
                        )}
                        mapViewport={mapViewport}
                        visible={compass}
                        node={this.node}
                      >
                        {cards.slice(-5).map(cc => (
                          <CardMarker
                            key={cc.id}
                            {...cc}
                            center={false}
                            shadow={false}
                            width={5}
                            height={6}
                            node={this.node}
                            onClick={() => {
                              selectCardAction(cc.id);
                            }}
                          />
                        ))}
                      </ContextView>
                    )}
                </div>
              }
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
        </ForceOverlay>
      </div>
    );
  }
}
export default MapView;
// export default MapView;
