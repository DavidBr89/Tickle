import React from 'react';
import PropTypes from 'prop-types';

class DimWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  static defaultProps = { style: {} };

  componentDidMount() {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;
    console.log('DIM', width, height);
    this.setState({ width, height });
  }

  componentDidUpdate(prevProps, prevState) {
    const width = this.node.offsetWidth;
    const height = this.node.offsetHeight;

    if (prevState.width !== width || prevState.height !== height) {
      this.setState({ width, height });
    }
  }

  render() {
    const { children, style } = this.props;
    const { width, height } = this.state;
    return (
      <div
        ref={node => (this.node = node)}
        style={{ height: 500, width: '100%', ...style }}
      >
        {children(width, height)}
      </div>
    );
  }
}

export { DimWrapper };
