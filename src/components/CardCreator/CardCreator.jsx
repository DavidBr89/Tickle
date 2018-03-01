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

import { PreviewCard, Card, PlaceholderCard, CardMarker } from '../cards';
import { ScrollView, ScrollElement } from '../utils/ScrollView';
import cxx from './CardCreator.scss';

import { DivOverlay, AnimMarker } from '../utils/map-layers/DivOverlay';
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
    selected: PropTypes.string,
    openCardDetails: PropTypes.func,
    selectCardAction: PropTypes.func.isRequired,
    createCardAction: PropTypes.func,
    screenResizeAction: PropTypes.func,
    changeMapViewport: PropTypes.func,
    dragCard: PropTypes.func,
    challenges: PropTypes.array
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
    selected: null,
    cardTemplateOpen: false,
    openCardDetails: d => d,
    selectedCard: d => d,
    createCardAction: d => d,
    screenResizeAction: d => d,
    changeMapViewport: d => d,
    dragCard: d => d,
    selectCard: d => d,
    challenges: []
  };

  constructor(props) {
    super(props);

    const { screenResizeAction } = this.props;
    // TODO: fix later;
    const [width, height] = [window.innerWidth, window.innerHeight];
    screenResizeAction({ width, height });
    window.addEventListener('resize', () => {
      screenResizeAction({
        width: window.innerWidth,
        height: window.innerHeight
      });
    });
    console.log('constr');
    // this.state = { newCards: [] };
  }

  componentDidMount() {
    // const el = ReactDOM.findDOMNode(this);
    // scrollTo(5);
    // this._scroller.scrollTo(5);
    // console.log('scroller', this._scroller);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.selectedCardId !== this.props.selectedCardId)
      this._scroller.scrollTo(this.props.selectedCardId);
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
      createCardAction,
      dragCardAction,
      updateCardTemplateAction,
      updateCardLocationAction,
      updateCardAttrsAction,
      cardTemplateOpen,
      cardTemplate,
      extended,
      throttle,
      challenges
    } = this.props;

    const mapState = { width, height, ...mapViewport };
    const [w, h] = [50, 50];

    const selectedCardId = selected ? selected.id : null;
    const extCardId = extended ? extended.id : null;
    const cardPadding = 15;
    const cardIds = cards.map(d => d.id);
    const transitionStyle = d => ({
      transform: selectedCardId === d.id ? 'scale(1.2)' : null,
      transition: 'transform 1s'
    });

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
          <div style={{ position: 'absolute' }}>
            <DragLayer />
            <DropTargetCont
              dropHandler={c =>
                cardIds.includes(c.id)
                  ? updateCardLocationAction(c)
                  : createCardAction(c)
              }
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
                      width={extCardId === c.id ? width - cardPadding : 40}
                      height={extCardId === c.id ? height - cardPadding : 50}
                      offsetX={3}
                      offsetY={3}
                      x={x + 5}
                      y={y + 3}
                      node={this.node}
                      preview={
                        <DragSourceCont
                          key={`${c.title} ${c.date}`}
                          dragHandler={dragCardAction}
                          dragged={isDragging}
                          dropHandler={createCardAction}
                          id={c.id}
                        >
                          <CardMarker {...c} edit={false} />
                        </DragSourceCont>
                      }
                    >
                      <Card
                        edit
                        {...c}
                        allChallenges={challenges}
                        onClose={() => selectCardAction()}
                        onAttrUpdate={updateCardAttrsAction}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </AnimMarker>
                  )}
                </DivOverlay>

                <DivOverlay {...mapState} data={cardTemplate}>
                  {c => (
                    <AnimMarker
                      key={c.id}
                      selected={extCardId === c.id}
                      width={extCardId === c.id ? width - cardPadding : 150}
                      height={extCardId === c.id ? height - cardPadding : 0}
                      offsetX={0}
                      offsetY={0}
                      x={width / 2}
                      y={height / 2}
                      node={this.node}
                      preview={
                        selectedCardId === c.id ? (
                          <div
                            className="p-3 shadow rounded"
                            style={{
                              border: '1px dashed var(--black)',
                              background: 'whitesmoke',
                              opacity: 0.7,
                              transition: 'opacity 1s',
                              width: 150,
                              textAlign: 'center',
                              pointerEvents: 'none'
                            }}
                          >
                            <h3>{`${
                              isDragging ? 'drop' : 'drag'
                            } card here`}</h3>
                          </div>
                        ) : null
                      }
                    >
                      <Card
                        edit
                        {...c}
                        allChallenges={challenges}
                        onClose={() => selectCardAction()}
                        onAttrUpdate={updateCardTemplateAction}
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
              className="pl-3 pr-3 mt-3 ml-3"
              style={{
                width: '100%',
                height: '27vh',
                overflowX: 'scroll',
                paddingTop: '20px',
                paddingBottom: '20px',
                zIndex: 200
              }}
            >
              <ScrollView ref={scroller => (this._scroller = scroller)}>
                <Grid
                  cols={cards.length + 1}
                  rows={1}
                  gap={1.5}
                  style={{ width: `${cards.length * 40}%`, height: '100%' }}
                >
                  <DragSourceCont
                    dragHandler={dragCardAction}
                    id={cardTemplate.id}
                  >
                    <PreviewCard
                      {...cardTemplate}
                      onClick={() => selectCardAction(cardTemplate)}
                      edit
                      style={transitionStyle(cardTemplate)}
                    />
                  </DragSourceCont>
                  {cards.map(d => (
                    <ScrollElement name={d.id}>
                      <div key={d.id} onClick={() => selectCardAction(d)}>
                        <PreviewCard
                          {...d}
                          {...this.props}
                          style={transitionStyle(d)}
                        />
                      </div>
                    </ScrollElement>
                  ))}
                </Grid>
              </ScrollView>
            </div>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default CardCreator;
