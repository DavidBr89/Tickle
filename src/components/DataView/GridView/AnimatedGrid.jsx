import React, { Component } from 'react';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';

import './layout.scss';

class Cell extends Component {
  state = { expanded: false };
  randomNumber = Math.floor(Math.random() * 5) + 1;

  render() {
    const { expanded } = this.state;
    return (
      <div
        className={`card ${expanded && 'card-expanded'}`}
        onClick={() => {
          this.setState({ expanded: !this.state.expanded });
        }}
      >
        <PreviewCard />
      </div>
    );
  }
}

export default class Grid extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    wrapGrid(this.grid, { easing: 'backOut', stagger: 20, duration: 400 });
  }

  render() {
    return (
      <div
        className="content-block"
        style={{
          height: '100%',
          overflow: 'scroll'
        }}
      >
        <div className="flex-full">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
              gridTemplateRows: 'minmax(14rem, 1fr)',
              gridAutoRows: '1fr',
              gridGap: '16px',
              gridAutoFlow: 'dense'
            }}
            ref={el => (this.grid = el)}
          >
            {[...Array(10).keys()].map(i => <Cell key={i} />)}
          </div>
        </div>
      </div>
    );
  }
}
