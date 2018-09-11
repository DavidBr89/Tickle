import * as d3 from 'd3';
import React, { Component } from 'react';

import Grid from './Grid';

export interface InterfaceGrid {
  data: any[];
}

interface Istate {
  selected: any;
}

// import Comp from './components/Comp';
// import Comp2 from './components/Comp2';

// selected={selected === i}
// rowSpan={selected === i ? 4 : 2}
// colSpan={selected === i ? 2 : 1}

class CardGrid extends Component<InterfaceGrid, Istate> {
  public state = { ...this.props, selected: null };

  public componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  public render() {
    const { data, selected } = this.state;
    return (
      <div style={{ height: 800 }}>
        <div
          style={{ border: '1px green solid', width: '100%', height: '100%' }}
        >
          <Grid cols={5} colrows={data.length} gap={2}>
            {data.map((d, i) => (
              <div
                style={{
                  border: 'blue 1px solid',
                  height: '100%',
                  width: '100%'
                }}
              >
                {i}
              </div>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

export default CardGrid;
