import React, { Component, PureComponent } from 'react';
import * as d3 from 'd3';
import VisibilitySensor from 'react-visibility-sensor';
import WebMercatorViewport from 'viewport-mercator-project';
import Grid from 'mygrid/dist';

import 'mapbox-gl/dist/mapbox-gl.css';

// import { Motion, spring } from 'react-motion';
import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import _ from 'lodash';
// import request from 'superagent';
// import jsonp from 'superagent-jsonp';

import MapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';

import ReactTimeout from 'react-timeout';
// import rasterTileStyle from 'raster-tile-style';
// import ngeohash from 'ngeohash';,
import cx from './MapView.scss';
import { Card, PreviewCard } from '../cards';

// console.log('grid', Grid);
// import { Grid } from '../utils';
// import { ScrollElement, ScrollView } from '../utils/ScrollView';

// import Modal from './components/utils/Modal';

// import CardOverlay from '../utils/map-layers/CardOverlay';
import {
  DivOverlay,
  SlowDivOverlay,
  UserOverlay,
  SvgOverlay,
  UserMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';
import { Modal } from '../utils';

const metersPerPixel = function(latitude, zoomLevel) {
  const earthCircumference = 40075017;
  const latitudeRadians = latitude * (Math.PI / 180);
  return (
    earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoomLevel + 8)
  );
};

const geometricRadius = function(latitude, meters, zoomLevel) {
  return meters / metersPerPixel(latitude, zoomLevel);
};

function overlap(e, o) {
  // dx and dy are the vertical and horizontal distances
  const dx = o.x - e.x;
  const dy = o.y - e.y;

  // Determine the straight-line distance between centers.
  const d = Math.sqrt(dy * dy + dx * dx);

  // Check Intersections
  if (d > e.r + o.r) {
    // No Solution. Circles do not intersect
    return false;
  } else if (d < Math.abs(e.r - o.r)) {
    // No Solution. one circle is contained in the other
    return true;
  }
  return true;
}

@ReactTimeout
class CardGrid extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    setTimeout: PropTypes.func.isRequired,
    clearTimeout: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.id = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('upd');
  // }

  render() {
    const {
      cards,
      onSelect,
      onExtend,
      offset
      // setTimeout,
      // clearTimeout
    } = this.props;

    const onChange = d => visible => {
      // console.log('id', this.id);
      const { setTimeout, clearTimeout } = this.props;
      if (visible) {
        clearTimeout(this.id);
        this.id = setTimeout(() => onSelect(d.id), 1000);
        // onSelect(d.id);
      }
    };

    // TODO: isVisible
    return (
      <Grid
        rows={1}
        cols={Math.floor(cards.length) * 2}
        colSpan={2}
        rowSpan={1}
        gap={2}
        style={{
          width: `${cards.length * 40}%`,
          overflow: 'visible',
          zIndex: 2000
        }}
      >
        {cards.map(d => (
          <div>
            <VisibilitySensor
              offset={{ left: offset, right: offset }}
              onChange={onChange(d)}
            >
              {({ isVisible }) => (
                <PreviewCard
                  {...d}
                  onClick={() => isVisible && onExtend(d.id)}
                  selected={isVisible}
                  style={{
                    opacity: !isVisible ? 0.56 : null,
                    transform: isVisible ? 'scale(1.2)' : null,
                    transition: 'transform 1s',
                    height: '100%'
                  }}
                />
              )}
            </VisibilitySensor>
          </div>
        ))}
      </Grid>
    );
  }
}

// const TimoutGrid = ReactTimeout(CardGrid);

// import { dummyCards } from '../../dummyData';
//
// // TODO:  change
// dummyCards.forEach((d, i) => {
//   d.id = i;
// });

const CircleOverlay = ({ mapViewport, userLocation, selectedCard }) => {
  const { zoom } = mapViewport;
  const { latitude, longitude } = userLocation;
  const r = geometricRadius(latitude, 500, zoom);

  const mercator = new WebMercatorViewport(mapViewport);
  const [x, y] = mercator.project([longitude, latitude]);
  const [x1, y1] = mercator.project([
    selectedCard.loc.longitude,
    selectedCard.loc.latitude
  ]);
  // console.log('CircleOverlay', [x1, y1]);

  const accessible = overlap({ x, y, r: 40 }, { x: x1, y: y1, r });
  // TODO: change SvgOverlay
  return (
    <SvgOverlay {...mapViewport} data={[selectedCard]}>
      {() => (
        <circle
          r={r}
          cx={x1}
          cy={y1}
          stroke="black"
          fill={accessible && zoom > 11 ? 'green' : 'red'}
          opacity={0.3}
        />
      )}
    </SvgOverlay>
  );
};

CircleOverlay.propTypes = {
  mapViewport: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number
  })
};

CircleOverlay.defaultProps = {
  mapViewport: { width: 200, height: 200, latitude: 0, longitude: 0 }
};

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
      headerPad,

      userMoveAction,
      changeMapViewportAction,
      selectCardAction,
      extCardAction,
      cardChallengeOpen,
      toggleCardChallengeAction
    } = this.props;

    // console.log('width', mapDim);
    const mapDim = { width, height };
    // console.log('userLocation', userLocation, 'centerLocation', centerLocation);
    const mapViewport = { ...mapDim, ...centerLocation, zoom: mapZoom };
    // const gridConfig = this.gridSpan();
    const selectedCard =
      selectedCardId !== null ? cards.find(d => d.id === selectedCardId) : null;

    return (
      <div>
        <Modal
          id="modal"
          content={selectedCard}
          visible={cardChallengeOpen}
          closeHandler={() =>
            toggleCardChallengeAction({ cardChallengeOpen: false })
          }
        >
          <iframe
            title="emperors"
            src="http://thescalli.com/emperors/"
            style={{ border: 'none', width: '100%', height: height + 20 }}
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
              onClick={userMoveAction}
            >
              {selectedCard && (
                <CircleOverlay
                  userLocation={userLocation}
                  mapViewport={mapViewport}
                  selectedCard={selectedCard}
                />
              )}
              <SlowDivOverlay {...mapViewport} data={cards}>
                {(c, [x, y]) => (
                  <AnimMarker
                    key={c.id}
                    selected={extCardId === c.id}
                    width={extCardId === c.id ? width - 10 : 40}
                    height={extCardId === c.id ? height - 5 : 50}
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
              </SlowDivOverlay>
              <DivOverlay {...mapViewport} data={[{ loc: userLocation }]}>
                {(c, [x, y]) => <UserMarker x={x} y={y} />}
              </DivOverlay>
              <UserOverlay {...mapViewport} location={userLocation} />
            </MapGL>
          </div>

          <div
            className={`${cx.cardGridCont}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              paddingTop: '20px'
            }}
          >
            <CardGrid
              cards={cards}
              onSelect={selectCardAction}
              onExtend={extCardAction}
              offset={width / 4}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default MapView;
