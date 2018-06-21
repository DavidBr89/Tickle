import React from 'react';
import PropTypes from 'prop-types';

class DimensionsWrapper extends React.Component {
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
    console.log('DIM', width, height);
    this.setState({ width, height });
  }

  componentDidUpdate(prevProps, prevState) {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;

    console.log('UPDATE DIM', width, height);
    if (prevState.width !== width || prevState.height !== height) {
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

export default DimensionsWrapper;
