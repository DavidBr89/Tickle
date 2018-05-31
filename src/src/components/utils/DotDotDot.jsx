import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {range} from 'd3';

class DotDotDot extends Component {
  static propTypes = {
    stop: PropTypes.bool
  };

  static defaultProps = {
    stop: false
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.state = { dots: ['.', '.', '.'] };
  }

  componentDidMount() {
    this.id = setInterval(
      () =>
        this.setState(({ dots }) => ({
          dots:
            range(0, (dots.length + 1) % 4).reduce(acc => acc.concat('.'), [])
        })),
      500
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stop) clearInterval(this.id);
  }

  componentWillUnmount() {
    clearInterval(this.id);
  }

  render() {
    return <div>{this.state.dots.map(d => <span>{d}</span>)}</div>;
  }
}

export default DotDotDot;
