import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import scrollIntoView from 'scroll-into-view';

class ScrollView extends Component {
  static propTypes = {
    children: PropTypes.node
  };
  static childContextTypes = {
    scroll: PropTypes.object
  };
  register = (name, ref) => {
    this.elements[name] = ref;
  };
  unregister = name => {
    delete this.elements[name];
  };
  getChildContext() {
    return {
      scroll: {
        register: this.register,
        unregister: this.unregister
      }
    };
  }
  elements = {};
  scrollTo = name => {
    const node = ReactDOM.findDOMNode(this.elements[name]);
    scrollIntoView(node, {
      time: 500
      // align: {
      //   top: 0
      // }
    });
  };

  componentDidMount() {
    // const domNode = ReactDOM.findDOMNode(this.props.children);
    console.log('ref node', this.node);
    // console.log('domNode', domNode);
    this.node.addEventListener('scroll', this.props.onScroll);
  }

  // componentDidUpdate() {
  //   // const domNode = ReactDOM.findDOMNode(this.props.children);
  //   console.log('ref node', this.node);
  //   // console.log('domNode', domNode);
  //   // domNode.addEventListener('scroll', () => console.log('scroll'));
  // }

  render() {
    return React.cloneElement(this.props.children, {
      ref: e => (this.node = e)
    });
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

  componentDidMount() {
    this.context.scroll.register(this.props.name, this);
  }
  componentWillReceiveProps(nextProps) {
    this.context.scroll.register(nextProps.name, this);
  }
  componentWillUnmount() {
    this.context.scroll.unregister(this.props.name);
  }

  render() {
    return this.props.children;
  }
}

export { ScrollView, ScrollElement };
