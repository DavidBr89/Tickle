import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';

import DefaultLayout from 'Components/Layout';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUBMITTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_OPEN,
  NO_CARD_FILTER
  // challengeTypeMap
} from 'Constants/cardFields';

import './layout.scss';

class Cell extends Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => null
  };

  state = { hovered: false };

  render() {
    const { onClick, style, ...restProps } = this.props;
    const { hovered } = this.state;
    return (
      <div
        style={{
          padding: '5%',
          cursor: 'pointer',
          zIndex: hovered && 2000,
          width: '100%',
          height: '100%',
          ...style
        }}
        onClick={onClick}
      >
        <PreviewCard
          style={{
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 200ms',
            transformOrigin: hovered && null
          }}
          {...restProps}
        />
      </div>
    );
  }
}

const INITIAL_GRID_STATE = { colWidth: '35%', rowWidth: '35' };

export default class MyDiary extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // TODO check later
    this.fg = wrapGrid(this.grid, {
      easing: 'backInOut',
      stagger: 0,
      duration: 200
    });
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    this.fg.forceGridAnimation();
  }
  render() {
    const { cards, selectCardID, selectedCardID, selectCardType } = this.props;
    const { colWidth, rowWidth } = this.state;

    const defColNum = 6;
    const defRowNum = 6;
    const colNum = 10;
    const rowNum = 10;
    const gridModeStyle =
      selectedCardID === null
        ? {
          // gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}, 1fr))`,
          // gridTemplateRows: `minmax(${rowWidth}, 1fr)`,
          //   gridAutoRows: '1fr',
          gridTemplateColumns: `repeat(${defColNum}, ${100 / defColNum}%)`,
          // gridTemplateRows: `repeat(${defRowNum}, ${100 / defRowNum}%)`,
          gridAutoRows: `${100 / rowNum}%`
          // gridGap: '16px'
        }
        : {
          gridTemplateColumns: `repeat(${colNum}, ${100 / colNum}%)`,
          // gridTemplateRows: `repeat(${rowNum}, ${100 / rowNum}%)`,
          gridAutoRows: `${100 / rowNum}%`
          // gridGap: '10%'
            // gridTemplateColumns: '33%',
            // gridTemplateRows: '33%'
            // gridTemplateAreas: '"header" "main main main" "footer"'
        };

    const gridStyle = {
      height: '100%',
      display: 'grid',
      gridAutoFlow: 'dense',
      ...gridModeStyle
    };

    const selectedCard =
      selectedCardID !== null ? cards.find(c => c.id === selectedCardID) : null;
    // const indices = cards.map((d, i) => i);
    const mapCell = d => {
      const selStyle =
        d.id === selectedCardID
          ? {
            gridColumn: '1 / span 8',
            gridRow: '1 / span 8'
          }
          : { gridColumn: 'span 2', gridRow: 'span 2' };

      const onClick = () =>
        d.id === selectedCardID ? selectCardID(null) : selectCardID(d.id);

      return <Cell key={d.id} {...d} style={selStyle} onClick={onClick} />;
    };

    console.log('selectedCard', selectedCard);
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
            <button onClick={() => this.setState(INITIAL_GRID_STATE)}>a</button>
            <button
              onClick={() =>
                this.setState({ colWidth: '25%', rowWidth: '25%' })
              }
            >
              b
            </button>
            <button
              onClick={() =>
                this.setState({ colWidth: '10%', rowWidth: '10%' })
              }
            >
              c
            </button>
          </React.Fragment>
        }
      >
        <div
          className="content-block flexCol"
          style={{
            height: '100%',
            overflow: 'scroll'
          }}
        >
          {selectedCard !== null && (
            <div>{selectedCard.tags.map(d => <div>{d}</div>)}</div>
          )}
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
