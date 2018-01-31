import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// import HTML5Backend from 'react-dnd-html5-backend';

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';

import MapGL from 'react-map-gl';
import Grid from 'mygrid/dist';
// import update from 'immutability-helper';

import { PreviewCard, Card } from '../cards';
import cxx from './CardCreator.scss';

import {
  DivOverlay,
  CardMarker,
  AnimMarker
} from '../utils/map-layers/DivOverlay';
// import cardIconSrc from '../utils/map-layers/cardIcon.svg';

import CardDragPreview from './DragLayer/CardDragPreview';

import { DragSourceCont, DropTargetCont } from './DragLayer/SourceTargetCont';
import DragLayer from './DragLayer/DragLayer';
import Analytics from './Analytics';
// import { AnimMarker } from '../utils/map-layers/DivOverlay';

// const container = ({}) =>

class CardCreator extends Component {
  static propTypes = {
    mapViewport: PropTypes.object,
    cards: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    tempCards: PropTypes.array,
    selected: PropTypes.string,
    openCardDetails: PropTypes.func,
    selectCard: PropTypes.func,
    createCard: PropTypes.func,
    screenResize: PropTypes.func,
    changeMapViewport: PropTypes.func,
    dragCard: PropTypes.func
  };

  static defaultProps = {
    mapViewport: {
      width: 100,
      height: 100,
      zoom: 10,
      latitude: 0,
      longitude: 0
    },
    cards: [],
    width: 100,
    height: 100,
    tempCards: [],
    selected: null,
    cardTemplateOpen: false,
    openCardDetails: d => d,
    selectedCard: d => d,
    createCard: d => d,
    screenResize: d => d,
    changeMapViewport: d => d,
    dragCard: d => d
  };

  constructor(props) {
    super(props);

    const { screenResize } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth - 4, window.innerHeight];
    screenResize({ width, height });
    console.log('constr');
    // this.state = { newCards: [] };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // scrollTo(5);
    // this._scroller.scrollTo(5);
    console.log('scroller', this._scroller);
  }

  // componentDidUpdate() {}

  // shouldComponentUpdate(nextProps) {
  //   const { mapViewport, tempCards, isDragging } = nextProps;
  //   const newVpStr = JSON.stringify(mapViewport);
  //   const vpStr = JSON.stringify(this.props.mapViewport);
  //   // mapViewport.latitude !== this.props.mapViewport.latitude ||
  //   // mapViewport.longitude !== this.props.mapViewport.longitude;
  //
  //   if (!isDragging) return true;
  //   return false;
  // }

  // scrollTo = name => {
  //
  //   this._scroller.scrollTo(name);
  // };

  // latitude={lat}
  // longitude={long}
  // zoom={zoom}
  // mapboxApiAccessToken={process.env.MapboxAccessToken}
  // onChangeViewport={onChangeViewport}
  // onClick={onClick}
  // isDragging={isDragging}
  // startDragLngLat={startDragLngLat}
  render() {
    const {
      mapViewport,
      cards,
      width,
      height,
      isDragging,
      toggleCardTemplateAction,

      changeMapViewport,
      openCardDetails,

      selectCard,
      selected,
      createCard,
      tempCards,
      dragCard,
      highlighted,
      cardTemplateOpen
    } = this.props;

    const mapState = { width, height, ...mapViewport };
    const [w, h] = [50, 50];

    const selectedCardId = selected ? selected.id : null;
    const selectedExtended = selected ? selected.extended : null;

    return (
      <DragDropContextProvider backend={TouchBackend}>
        <div
          className={`${cxx.base}`}
          style={{
            position: 'relative',
            width: `${width}px`,
            height: `${height}px`
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              visibility: cardTemplateOpen ? 'visible' : 'hidden',
              opacity: cardTemplateOpen ? 1 : 0,
              transition: 'opacity 1s',
              zIndex: 400
            }}
          >
            {cardTemplateOpen && (
              <Card editable onClose={toggleCardTemplateAction} />
            )}
          </div>
          <div style={{ position: 'absolute' }}>
            <DragLayer />
            <DropTargetCont dropHandler={createCard} dragged={isDragging}>
              <MapGL
                {...mapViewport}
                width={width}
                height={height}
                onViewportChange={!isDragging ? changeMapViewport : null}
              >
                {/* TODO: change Key */}
                <DivOverlay {...mapState} data={cards}>
                  {(c, [x, y]) => (
                    <div
                      x={x}
                      y={y}
                      style={{
                        position: 'absolute',
                        width: `${w}px`,
                        height: `${h}px`,
                        left: x,
                        top: y
                      }}
                    >
                      <DragSourceCont
                        key={`${c.title}  ${c.date}`}
                        dragHandler={dragCard}
                        dragged={isDragging}
                      >
                        <CardMarker {...c} />
                      </DragSourceCont>
                    </div>
                  )}
                </DivOverlay>
              </MapGL>
            </DropTargetCont>
          </div>
          <div
            className="row no-gutters"
            style={{
              // zIndex: 1000,
              marginBottom: '20px'
            }}
          >
            <div
              className={`col-12 ${cxx.animHeight}`}
              style={{
                height: `${selected ? height / 2 : 0}px`,
                background: 'white'
              }}
            >
              <Analytics
                width={width}
                height={height / 2}
                closeHandler={() => selectCard(null)}
              />
            </div>
            <div className="input-group mt-3 mb-3 ml-1 mr-1">
              <textarea className="form-control" aria-label="With textarea" />
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  onClick={toggleCardTemplateAction}
                >
                  <i
                    className="fa fa-2x fa-plus"
                    aria-hidden="true"
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      color: 'grey',
                      pointerEvents: 'cursor'
                    }}
                  />
                </span>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                overflowX: 'scroll',
                zIndex: 200
              }}
            >
              <Grid
                cols={cards.length + 1}
                rows={1}
                gap={1}
                style={{
                  transition: 'opacity .25s ease-in-out',
                  opacity: !selected ? 1 : 0,
                  width: '300%'
                  // height: '20%'
                }}
              >
                <DragSourceCont dragHandler={dragCard}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignContent: 'center',
                      alignItems: 'center',
                      background: 'lightgrey',
                      border: '1px dashed grey'
                      // margin: '10%'
                    }}
                    onClick={() => toggleCardTemplateAction()}
                  >
                    <i
                      className="fa fa-4x fa-plus"
                      aria-hidden="true"
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        color: 'grey',
                        pointerEvents: 'cursor'
                      }}
                    />
                  </div>
                </DragSourceCont>
                {cards.map(d => (
                  <div onClick={() => openCardDetails(d.id)}>
                    <PreviewCard {...d} {...this.props} />
                  </div>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default CardCreator;
