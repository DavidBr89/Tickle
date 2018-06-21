import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DimWrapper extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;
    this.setState({ width, height });
  }

  componentDidUpdate(prevProps) {
    if (this.props.extended !== prevProps.extended) {
      const width = this.node.offsetWidth;
      const height = this.node.offsetHeight;
      this.setState({ width, height });
    }
  }

  render() {
    const { children } = this.props;
    const { width, height } = this.state;
    return (
      <div
        ref={node => (this.node = node)}
        style={{ height: '100%', width: '100%' }}
      >
        {children(width, height)}
      </div>
    );
  }
}
