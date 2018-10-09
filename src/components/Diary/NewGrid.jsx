import React from 'react';
import ReactDOM from 'react-dom';
import { VariableSizeGrid as Grid } from 'react-window';

import PreviewCard from 'Components/cards/PreviewCard';

// These cell sizes are arbitrary.
// Yours should be based on the content of the cell.
const columnWidths = new Array(1000)
  .fill(true)
  .map(() => 75 + Math.round(Math.random() * 50));
const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));

class NewGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cards, width, height } = this.props;
    return (
      <Grid
        className="Grid"
        columnCount={1000}
        columnWidth={index => columnWidths[index]}
        height={height}
        rowCount={1000}
        rowHeight={index => rowHeights[index]}
        width={width}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div style={style}>
            <PreviewCard />
          </div>
        )}
      </Grid>
    );
  }
}

export default NewGrid;
