import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';
import ConnectedCard from 'Components/cards/ConnectedCard';

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
              showImg={false}
              style={{
                transform: hovered ? 'scale(1.15)' : 'scale(1)',
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
    this.fg = wrapGrid(this.grid, {
      easing: 'easein',
      stagger: 0,
      duration: 800
    });
  }

  state = INITIAL_GRID_STATE;

  componentDidUpdate(prevProps, prevState) {
    this.fg.forceGridAnimation();
  }

  render() {
    const {
      cards,
      selectCard,
      selectedCardId,
      selectCardType,
      isSelectedCardType,
      cardAction,
      selectedCard
    } = this.props;
    const { colNum, rowNum } = this.state;

    const cn = Math.max(6, Math.floor(Math.sqrt(cards.length)));
    const rn = Math.max(6, Math.ceil(Math.sqrt(cards.length)));
    const centerC = Math.floor(cn / 2);
    const centerR = Math.floor(rn / 2);
    console.log('cn', cn, 'rn', rn);

    const gridModeStyle =
      selectedCardId === null
        ? {
          gridAutoColumns: `${100 / colNum}%`,
          // gridTemplateRows: `repeat(${defRowNum}, ${100 / defRowNum}%)`,
          gridAutoRows: `${100 / rowNum}%`
          // gridGap: '16px'
        }
        : {
          gridTemplateColumns: `repeat(${cn}, ${100 / cn}%)`,
          // gridTemplateRows: `repeat(${rowNum}, ${100 / rowNum}%)`,
          gridAutoRows: `${100 / rn}%`
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

    // const indices = cards.map((d, i) => i);
    const mapCell = d => {
      const cardExpanded = d.id === selectedCardId;

      // col={i % cn}
      // row={Math.ceil(i / cn)}
      const selStyle = cardExpanded
        ? {
          gridColumn: `${centerC} / span 2`,
          gridRow: `${centerR} / span 2`
        }
        : { gridColumn: 'span 1', gridRow: 'span 1' };

      // const onClick = () =>
      //   d.id === selectedCardId ? selectCard(null) : selectCard(d.id);

      return (
        <Cell
          key={d.id}
          {...d}
          style={selStyle}
          onClick={() => cardAction(d)}
          selected={isSelectedCardType(d)}
          expanded={cardExpanded}
        />
      );
    };

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
            <button onClick={() => this.setState({ ...INITIAL_GRID_STATE })}>
              b
            </button>
            <button onClick={() => this.setState({ colNum: 20, rowNum: 20 })}>
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
