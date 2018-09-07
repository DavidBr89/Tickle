import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import scrollIntoView from 'scroll-into-view';

const { Provider, Consumer } = React.createContext({
  register: null,
  unregister: null
});

class ScrollView extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  register = (name, ref) => {
    this.elements[name] = ref;
  };

  unregister = name => {
    delete this.elements[name];
  };

  elements = {};

  // const node = ReactDOM.findDOMNode(this.elements[name]);
  // const { left, top } = opts;
  // // node.scrollLeft = 20000;
  // // node.scrollIntoView(false);
  // scrollIntoView(node, {
  //   time: opts.time,
  //   align: { left, top }
  // });

  scrollTo = (name, opts = { time: 500, left: 1 }) => {
    const node = ReactDOM.findDOMNode(this.elements[name]);
    const { time, left } = opts;
    // node.scrollLeft = 20000;
    // node.scrollIntoView(false);
    scrollIntoView(node, {
      time,
      align: {
        left
        // leftOffset: 0
      }
    });
  };

  render() {
    return (
      <Provider
        value={{
          register: this.register.bind(this),
          unregister: this.unregister.bind(this)
        }}
      >
        {React.cloneElement(this.props.children, {
          ref: e => (this.node = e)
        })}
      </Provider>
    );
  }
}

class ScrollConsumer extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.register(this.props.name, this);
  }

  componentWillUnmount() {
    this.props.unregister(this.props.name);
  }

  componenDidUpdate() {
    this.props.register(this.props.name, this);
    return null;
  }

  render() {
    return this.props.children;
  }
}

class ScrollElement extends Component {
  static contextTypes = {
    scroll: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.element,
    name: PropTypes.string
  };

  render() {
    const { name } = this.props;
    return (
      <Consumer>
        {({ register, unregister }) => (
          <ScrollConsumer
            register={register}
            unregister={unregister}
            name={name}
          >
            {this.props.children}
          </ScrollConsumer>
        )}
      </Consumer>
    );
  }
}

export { ScrollView, ScrollElement };
