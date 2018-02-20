import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { shallowEqualProps } from 'shallow-equal-props';

const Modal = ({ visible, children, closeHandler }) => (
  <div
    className="modal fade show"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style={{
      display: visible ? 'block' : 'none',
      zIndex: '8000',
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100vh'
    }}
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content" style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            zIndex: '8000',
            right: 10,
            top: 10
          }}
        >
          <button
            type="button"
            className="close "
            style={{ width: '20px', height: '20px' }}
            data-dismiss="modal"
            aria-label="Close"
            onClick={closeHandler}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  visible: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired
};

Modal.defaultProps = {
  id: 'exampleModal',
  children: <div>{'Modal'}</div>,
  closeHandler: d => d
};

class Wrapper extends React.Component {
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

export { Modal, Wrapper };
