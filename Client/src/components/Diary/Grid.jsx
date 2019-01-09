import React, { PureComponent, Component } from 'react';
// import ReactDOM from 'react-dom';
import { range } from 'd3';
import PropTypes from 'prop-types';

// import { ScrollView, ScrollElement } from './ScrollView';
// import cx from './index.scss';

// function getCol(n) {
//   // return  (3 + (-1) ** n - 2 * n)/ 4 * 3;
//   return -3 * (3 + (-1) ** n - 2 * n) / 4;
// }

function getCol(i, n, span) {
  // const a = d3.range(0, n, span);
  // return d3.range(0, n).map(d => a[Math.floor(d / 2)]);
  // return [1, 1, 4, 4, 7, 7, 10, 10, 13, 13, 16, 16, 19, 19, 22, 22];
  const cols = range(1, n * span, span);
  return cols[Math.floor(i / 2)]; // Math.floor(i / 2) + 1;
}

class Grid extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number,
    clickHandler: PropTypes.func,
    span: PropTypes.number,
    colWidth: PropTypes.number,
    fix: PropTypes.number,
    style: PropTypes.object
  };

  static defaultProps = { selected: null };

  constructor(props) {
    super(props);
    // this.scrollTo = this.scrollTo.bind(this);
  }

  // componentDidUpdate() {
  //   const { children } = this.props;
  //   const selectedIndex = children.findIndex(d => d.props.selected);
  //   if (selectedIndex) this.scrollTo(selectedIndex);
  // }
  //
  // // scrollTo = name => {
  //   this._scroller.scrollTo(name);
  // };
  // shouldComponentUpdate(nextProps) {
  //   console.log('nextProps', nextProps);
  //   return this.props.children.length !== nextProps.children.length;
  // }
  //
  // shouldComponentUpdate(nextProps, nextState) {
  //
  // }

  render() {
    const {
      children,
      colWidth,
      rowHeight,
      cols,
      colSpan,
      rowSpan,
      rows,
      gap,
      style
    } = this.props;

    const gridTemplateColumns = `repeat(${cols}, ${colWidth || 100 / cols}%)`;

    const gridTemplateRows = `repeat(${rows}, ${rowHeight || 100 / rows})`;

    return (
      <div
        style={{
          display: 'grid',
          height: '100%',
          width: '100%',
          gridGap: `${gap}%`,
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          // gridTemplateRows: 'minmax(14rem, 1fr)',
          // gridAutoFlow: 'column dense',
          ...style
        }}
      >
        {React.Children.map(children, (comp, i) => {
          const col = getCol(i, children.length, colSpan); // Math.floor(i / 2) + 1;
          const row = getCol(i, children.length, rowSpan); // Math.floor(i / 2) + 1;
          const { colSpan: cspan, rowSpan: rspan, selected } = comp.props;
          const props = {
            colSpan: cspan || colSpan,
            rowSpan: rspan || rowSpan
          };
          return (
            <Cell {...props} index={i} col={col} row={row}>
              {comp}
            </Cell>
          );
        })}
      </div>
    );
  }
}

Grid.defaultProps = {
  colSpan: 1,
  rowSpan: 1,
  data: [],
  children: () => <div>test</div>,
  span: 1,
  colWidth: null,
  colHeight: null,
  cols: null,
  rows: null,
  gap: 0,
  style: {}
};

class Cell extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    rowSpan: PropTypes.number,
    colSpan: PropTypes.number,
    opacity: PropTypes.number,
    clickHandler: PropTypes.func,
    col: PropTypes.oneOf([PropTypes.number, null]),
    row: PropTypes.oneOf([PropTypes.number, null])
  };

  static defaultProps = {
    clickHandler: d => d
  };

  render() {
    const {
      children,
      index,
      selected,
      colSpan,
      rowSpan,
      col,
      row
    } = this.props;

    const styleProps = {
      style: {
        ...children.props.style,
        // gridColumn: `span ${colSpan}`,
        gridColumn: selected ? `${col} / span ${colSpan}` : `span ${colSpan}`,
        gridRow: selected ? `${row} / span ${rowSpan}` : `span ${rowSpan}`
      }
    };
    return React.cloneElement(children, styleProps);
    // return (
    //   <div
    //     style={{
    //       // overflow: 'hidden',
    //       gridColumn: col ? `${col} / span ${colSpan}` : `span ${colSpan}`,
    //       gridRowEnd: `span ${rowSpan}`
    //     }}
    //   >
    //     {children}
    //   </div>
    // );
  }
}

Cell.defaultProps = {
  clicked: false,
  opacity: 0.56,
  colSpan: 1,
  rowSpan: 1,
  clickHandler: d => d,
  selected: false
};

export default Grid;
