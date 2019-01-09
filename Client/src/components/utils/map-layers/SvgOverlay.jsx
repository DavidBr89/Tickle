import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SVGOverlay from './svg.react';

function round(x, n) {
  const tenN = 10 ** n;
  return Math.round(x * tenN) / tenN;
}

class SvgOverlay extends Component {
  static propTypes = {
    cardClickHandler: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    style: PropTypes.object
  };

  static defaultProps = { style: {}, data: [], children: d => d };

  constructor(props) {
    super(props);
    this.redraw = this.redraw.bind(this);
  }

  redraw(opt) {
    const { data, children } = this.props;
    return data.map(([latitude, longitude], i) => {
      const loc = [latitude, longitude];
      const pixel = opt.project(loc);
      let [nx, ny] = [null, null];
      if (i < data.length - 1) {
        const [latitude1, longitude1] = data[i + 1];
        const pixel2 = opt.project([latitude1, longitude1]);
        [nx, ny] = [round(pixel2[0], 1), round(pixel2[1], 1)];
      }
      const [x, y] = [round(pixel[0], 1), round(pixel[1], 1)];
      return children([x, y], [nx, ny]);
    });
  }

  render() {
    return <SVGOverlay {...this.props} redraw={this.redraw} />;
  }
}

export default SvgOverlay;
