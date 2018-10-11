import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

import { BareModal } from 'Utils/Modal';
import DefaultLayout from 'Components/DefaultLayout';

import TabMenu from './TabMenu';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUBMITTED,
  CHALLENGE_SUCCEEDED,
  NO_CARD_FILTER
  // challengeTypeMap
} from 'Constants/cardFields';

// import './layout.scss';

class Cell extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    selected: PropTypes.bool
  };

  static defaultProps = {
    onClick: () => null,
    selected: true
  };

  state = { hovered: false };

  render() {
    const {
      onClick,
      style,
      selected,
      expanded,
      seen,
      ...restProps
    } = this.props;
    const { hovered } = this.state;

    return (
      <div
        style={{
          padding: '5%',
          cursor: 'pointer',
          zIndex: hovered && 2000,
          width: '100%',
          height: '100%',
          transition: 'opacity 500ms',
          // background: selected && 'black',
          ...style
        }}
        onClick={seen ? onClick : null}
      >
        <div
          style={{
            // IMPORTANT FOR ANIMATION
            width: '100%',
            height: '100%'
          }}
        >
          <PreviewCard
            {...this.props}
            accessible={seen}
            key={this.props.id}
            onClick={null}
          />
        </div>
      </div>
    );
  }
}

const INITIAL_GRID_STATE = {
  colNum: 10,
  rowNum: 10
};

const cardTypeText = cardType => {
  switch (cardType) {
    case CHALLENGE_STARTED:
      return 'started';
    case CHALLENGE_SUBMITTED:
      return 'submitted';
    case CHALLENGE_SUCCEEDED:
      return 'collected';
    case NO_CARD_FILTER:
      return 'discovered';
  }
};

export default class MyDiary extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // TODO check later
    // this.fg = wrapGrid(this.grid);
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    // this.fg.forceGridAnimation();
  }

  render() {
    const {
      cards,
      selectedCardId,
      selectCard,
      extendCard,
      selectedCard,
      selectedTags,
      relatedTags,
      height,
      cardExtended,
      selectCardType,
      selectedCardType,
      numCollectibleCards,
      numSeenCards,
      tagVocabulary
    } = this.props;
    const { colNum, rowNum } = this.state;

    // const colWidth = 1;
    // const rowHeight = 1;
    // const colNumber = 3 * colWidth;
    //
    // const rowNumber = rowHeight * 3; // Math.max(6, Math.ceil(Math.sqrt(cards.length)));
    // const centerCol = colWidth + 1; // Math.ceil(colNumber / 2);
    // const centerRow = rowHeight + 1; // Math.floor(rowNumber / 2);
    // const centerWidth = 1;
    // const centerHeight = 1;
    // const cardWidth = 1;
    // const cardHeight = 1;

    const tmpColNum = 3;

    const tmpRowHeight = 140; // height / 4;

    const gridStyle = {
      // height: '100%',
      display: 'grid',
      // gridAutoFlow: 'column dense',
      gridTemplateColumns: `repeat(auto-fill, minmax(120px, 1fr))`,
      gridAutoRows: 150
    };

    const cardSelected = selectedCardId !== null;
    return (
      <DefaultLayout
        menu={
          <React.Fragment>
            <div>
              <select onChange={e => selectCardType(e.target.value)}>
                <option
                  selected={selectedCardType === NO_CARD_FILTER}
                  value={NO_CARD_FILTER}
                >
                  All Cards
                </option>
                <option
                  selected={selectedCardType === CHALLENGE_STARTED}
                  value={CHALLENGE_STARTED}
                >
                  Started Cards
                </option>
                <option
                  selected={selectedCardType === CHALLENGE_SUBMITTED}
                  value={CHALLENGE_SUBMITTED}
                >
                  Submitted Cards
                </option>
                <option
                  selected={selectedCardType === CHALLENGE_SUCCEEDED}
                  value={CHALLENGE_SUCCEEDED}
                >
                  Collected Cards
                </option>
              </select>
            </div>
          </React.Fragment>
        }
      >
        <BareModal
          visible={cardExtended}
          uiColor="grey"
          background="transparent"
          style={{ margin: `auto` }}
        >
          <ConnectedCard {...selectedCard} />
        </BareModal>

        <div
          className="h-full w-full flex flex-col content-block"
          style={{
            position: 'relative'
          }}
        >
          <div>
            Your {cardTypeText(selectedCardType)} {numSeenCards}/{`${numCollectibleCards} `}
            cards
          </div>
          <div className="flex-shrink overflow-y-scroll">
            <div style={gridStyle} ref={el => (this.grid = el)}>
              {cards.map(d => (
                <Cell
                  key={d.id}
                  {...d}
                  style={{
                    transformOrigin: null,
                    transform:
                      selectedCardId === d.id ? 'scale(1.1)' : 'scale(1)',
                    zIndex: selectedCardId === d.id ? 2 : 0,
                    transition: 'transform 500ms'
                  }}
                  onClick={() =>
                    selectedCardId === d.id
                      ? extendCard(d.id)
                      : selectCard(d.id)
                  }
                  expanded={cardSelected}
                />
              ))}
            </div>
          </div>
          <TabMenu
            onHeaderClick={() => selectCard(null)}
            selectedTags={selectedTags}
            relatedTags={relatedTags}
            selectedCard={selectedCard}
            className="flex-grow bg-grey-lighter"
            nestedTags={tagVocabulary}
          />
        </div>
      </DefaultLayout>
    );
  }
}
