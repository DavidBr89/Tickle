import React, { Component } from 'react';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';

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
  state = { expanded: false };
  randomNumber = Math.floor(Math.random() * 5) + 1;

  render() {
    const { expanded } = this.state;
    return (
      <div
        className="card"
        style={{
          transform: expanded ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 500ms',
          zIndex: expanded && 2000
        }}
        onClick={() => {
          this.setState({ expanded: !this.state.expanded });
        }}
      >
        <PreviewCard {...this.props} />
      </div>
    );
  }
}

export default class Grid extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // wrapGrid(this.grid, { easing: 'backOut', stagger: 20, duration: 400 });
  }

  render() {
    const { cards, selectCardType } = this.props;
    return (
      <div
        className="content-block"
        style={{
          height: '100%',
          overflow: 'scroll'
        }}
      >
        <select onChange={e => selectCardType(e.target.value)}>
          <option value={NO_CARD_FILTER}>All cards</option>
          <option value={CHALLENGE_OPEN}>Open Cards</option>
          <option value={CHALLENGE_SUBMITTED}>Submitted Cards</option>
        </select>

        <div className="flex-full">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
              gridTemplateRows: 'minmax(14rem, 1fr)',
              gridAutoRows: '1fr',
              gridGap: '16px',
              gridAutoFlow: 'dense'
              // justifyItems: 'center'
              // justifyItems: 'center'
            }}
            ref={el => (this.grid = el)}
          >
            {cards.map(d => <Cell key={d.id} {...d} />)}
          </div>
        </div>
      </div>
    );
  }
}
