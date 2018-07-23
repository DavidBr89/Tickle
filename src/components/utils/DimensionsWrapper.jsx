import React from 'react';
import PropTypes from 'prop-types';

class DimensionsWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    delay: PropTypes.oneOf([null, PropTypes.number])
  };
  static defaultProps = {
    delay: null
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const { delay } = this.props;
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;
    console.log('INITIAL DIM', width, height);

    if (delay !== null) {
      setTimeout(() => this.updateDim(), delay);
    } else {
      this.updateDim();
    }
  }

  updateDim = (prevState = { width: 0, height: 0 }) => {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;

    console.log('UPDATE DIM', width, height);
    if (prevState.width !== width || prevState.height !== height) {
      this.setState({ width, height });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { delay } = this.props;

    if (delay !== null) {
      setTimeout(() => this.updateDim(prevState), delay);
    } else {
      this.updateDim(prevState);
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
