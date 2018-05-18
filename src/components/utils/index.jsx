import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class DimWrapper extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    this.setState({ width, height });
  }

  componentDidUpdate(prevProps) {
    if (this.props.extended !== prevProps.extended) {
      const width = this.node.offsetWidth;
      const height = this.node.offsetHeight;
      console.log(
        'change prevProps',
        prevProps,
        'props',
        this.props,
        width,
        height
      );
      this.setState({ width, height });
    }
  }
  // TODO: update prop check in wrapper
  componentWillUpdate(nextProps) {
    if (this.props.extended !== nextProps.extended) {
      // const node = ReactDOM.findDOMNode(this);
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

export { DimWrapper };
