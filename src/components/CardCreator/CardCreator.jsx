import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// import {parseTime} from 'd3';

// import HTML5Backend from 'react-dnd-html5-backend';

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';

import MapGL from 'react-map-gl';
import Grid from 'mygrid/dist';
// import update from 'immutability-helper';

import { PreviewCard, Card, PlaceholderCard } from '../cards';
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
// import Analytics from './Analytics';
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
    selectCardAction: PropTypes.func.isRequired,
    createUpdateCardAction: PropTypes.func,
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
    createUpdateCardAction: d => d,
    screenResize: d => d,
    changeMapViewport: d => d,
    dragCard: d => d,
    selectCard: d => d
  };

  constructor(props) {
    super(props);

    const { screenResize } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth, window.innerHeight];
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
  render() {
    const {
      mapViewport,
      cards,
      width,
      height,
      isDragging,
      toggleCardTemplateAction,

      changeMapViewport,
      // openCardDetails,

      selectCardAction,
      selected,
      createUpdateCardAction,
      // tempCards,
      dragCardAction,
      updateCardTemplateAction,
      // highlighted,
      cardTemplateOpen,
      cardTemplate,
      extended
    } = this.props;

    const mapState = { width, height, ...mapViewport };
    const [w, h] = [50, 50];

    const selectedCardId = selected ? selected.id : null;
    const extCardId = extended ? extended.id : null;

    return (
      <DragDropContextProvider backend={TouchBackend}>
        <div
          ref={node => (this.node = node)}
          className={`${cxx.base}`}
          style={{
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`
          }}
        >
          {cardTemplateOpen &&
            ReactDOM.createPortal(
              <Card
                edit
                onClose={toggleCardTemplateAction}
                onAttrUpdate={updateCardTemplateAction}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  // padding: '5px',
                  zIndex: 3000
                }}
              />,
              document.querySelector('body')
            )}
          <div style={{ position: 'absolute' }}>
            <DragLayer />
            <DropTargetCont
              dropHandler={createUpdateCardAction}
              dragged={isDragging}
            >
              <MapGL
                {...mapViewport}
                width={width}
                height={height}
                onViewportChange={!isDragging ? changeMapViewport : null}
              >
                <DivOverlay {...mapState} data={cards}>
                  {(c, [x, y]) => (
                    <AnimMarker
                      key={c.id}
                      selected={extCardId === c.id}
                      width={extCardId === c.id ? width : 40}
                      height={extCardId === c.id ? height : 50}
                      x={x + 5}
                      y={y + 3}
                      node={document.querySelector('body')}
                      preview={
                        <DragSourceCont
                          key={`${c.title}  ${c.date}`}
                          dragHandler={dragCardAction}
                          dragged={isDragging}
                          dropHandler={createUpdateCardAction}
                          id={c.id}
                        >
                          <CardMarker />
                        </DragSourceCont>
                      }
                    >
                      <Card
                        edit
                        {...c}
                        onClose={() => selectCardAction()}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </AnimMarker>
                  )}
                </DivOverlay>
              </MapGL>
            </DropTargetCont>
          </div>
          <div
            className="row no-gutters"
            style={{
              // zIndex: 1000,
              marginTop: '50px',
              marginBottom: '20px'
            }}
          >
            <div
              className="ml-3 mr-3"
              style={{
                width: '100%',
                overflowX: 'scroll',
                paddingTop: '20px',
                paddingBottom: '20px',
                zIndex: 200
                // border: 'black 1px solid',
                // borderRadius: '20%'
              }}
            >
              <Grid
                cols={cards.length + 1}
                rows={1}
                gap={1}
                style={{ width: `${cards.length * 40}%`, height: '30%' }}
              >
                <DragSourceCont dragHandler={dragCardAction} id={cards.length}>
                  <PlaceholderCard
                    {...cardTemplate}
                    onClick={toggleCardTemplateAction}
                  />
                </DragSourceCont>
                {cards.map(d => (
                  <div key={d.id} onClick={() => selectCardAction(d)}>
                    <PreviewCard
                      {...d}
                      {...this.props}
                      style={{
                        transform: selectedCardId === d.id ? 'scale(1.2)' : null
                      }}
                    />
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
