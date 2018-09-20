import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

import { BareModal, ModalBody } from 'Utils/Modal';
import DefaultLayout from 'Components/Layout';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUBMITTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_OPEN,
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
    const { onClick, style, selected, expanded, ...restProps } = this.props;
    const { hovered } = this.state;

    return (
      <div
        style={{
          padding: '10%',
          cursor: 'pointer',
          zIndex: hovered && 2000,
          width: '100%',
          height: '100%',
          opacity: selected ? 1 : 0.5,
          transition: 'opacity 500ms',
          ...style
        }}
        onClick={onClick}
      >
        <div
          style={{
            // IMPORTANT FOR ANIMATION
            width: '100%',
            height: '100%'
          }}
        >
          {expanded ? (
            <PreviewCard {...this.props} />
          ) : (
            <PreviewCard
              style={{
                transition: 'transform 200ms',
                transformOrigin: hovered && null
              }}
              {...restProps}
            />
          )}
        </div>
      </div>
    );
  }
}

const INITIAL_GRID_STATE = {
  colNum: 10,
  rowNum: 10
};

export default class MyDiary extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // TODO check later
    // this.fg = wrapGrid(this.grid, {
    //   easing: 'easein',
    //   stagger: 0,
    //   duration: 800
    // });
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    // this.fg.forceGridAnimation();
  }

  render() {
    const {
      cards,
      selectCard,
      selectedCardId,
      selectCardType,
      isSelectedCardType,
      cardAction,
      selectedCard,
      selectedTags,
      height,
      cardExtended
    } = this.props;
    const { colNum, rowNum } = this.state;

    const colWidth = 1;
    const rowHeight = 1;
    const colNumber = 3 * colWidth;

    const rowNumber = rowHeight * 3; // Math.max(6, Math.ceil(Math.sqrt(cards.length)));
    const centerCol = colWidth + 1; // Math.ceil(colNumber / 2);
    const centerRow = rowHeight + 1; // Math.floor(rowNumber / 2);
    const centerWidth = 1;
    const centerHeight = 1;
    const cardWidth = 1;
    const cardHeight = 1;

    const gridStyle = {
      height: '100%',
      display: 'grid',
      // gridAutoFlow: 'column dense',
      gridTemplateColumns: `repeat(${4}, ${100 / 4}%)`,
      gridTemplateRows: `repeat(${Math.ceil(cards.length / 4)}, ${height /
        6}px)`
    };

    // const nonSelStyle = cards
    //   .filter(c => c.id !== selectedCardId)
    //   .reduce((acc, d, i) => {
    //     acc[d.id] = findCellStyle(d, i);
    //     return acc;
    //   }, {});

    const mapCell = d => {
      const cardSelected = d.id === selectedCardId;

      const style = {
        transformOrigin: null,
        transform: cardSelected ? 'scale(1.2)' : 'scale(1)',
        zIndex: cardSelected && 5000,
        transition: 'transform 500ms'
      };

      return (
        <Cell
          key={d.id}
          {...d}
          style={style}
          onClick={() => cardAction(d)}
          selected={isSelectedCardType(d)}
          expanded={cardSelected}
        />
      );
    };

    // const indices = cards.map((d, i) => i);
    // const mapSelectedCell = (d, i) => {
    //   const cardSelected = d.id === selectedCardId;
    //   const selStyle = {
    //     gridColumn: `${centerCol} / span 3`,
    //     gridRow: `${centerRow} / span 3`
    //   };
    //   return (
    //     <Cell
    //       key={d.id}
    //       {...d}
    //       style={selStyle}
    //       onClick={() => cardAction(d)}
    //       selected={isSelectedCardType(d)}
    //       expanded={cardSelected}
    //     />
    //   );
    // };

    return (
      <DefaultLayout
        menu={
          <React.Fragment>
            <div>
              <select onChange={e => selectCardType(e.target.value)}>
                <option value={NO_CARD_FILTER}>All cards</option>
                <option value={CHALLENGE_OPEN}>Open Cards</option>
                <option value={CHALLENGE_SUBMITTED}>Submitted Cards</option>
              </select>
            </div>
          </React.Fragment>
        }
      >
        <BareModal
          visible={cardExtended}
          uiColor="grey"
          background="transparent"
        >
          <ConnectedCard {...selectedCard} />
        </BareModal>
        <div
          className="content-block flexCol"
          style={{
            height: '100%',
            overflow: 'scroll'
          }}
        >
          <div>
            {selectedCard !== null && (
              <div>{selectedCard.tags.map(d => <div>{d}</div>)}</div>
            )}
          </div>
          <div className="flex-full">
            <div style={gridStyle} ref={el => (this.grid = el)}>
              {cards.map(mapCell)}
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}
