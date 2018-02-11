import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function isElementVisible(el) {
  const rect = el.getBoundingClientRect();
  const vWidth = window.innerWidth;
  const vHeight = window.innerHeight;
  const efp = (x, y) => document.elementFromPoint(x, y);

  // Return false if it's not in the viewport
  if (
    rect.right < 0 ||
    rect.bottom < 0 ||
    rect.left > vWidth ||
    rect.top > vHeight
  )
    return false;

  // Return true if any of its four corners are visible
  return (
    el.contains(efp(rect.left, rect.top)) ||
    el.contains(efp(rect.right, rect.top)) ||
    el.contains(efp(rect.right, rect.bottom)) ||
    el.contains(efp(rect.left, rect.bottom))
  );
}

class VisibleView extends Component {
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

  componentDidMount() {
    console.log('visible', this.elements.map(d => isElementVisible(d)));
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

class VisibleElement extends Component {
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

  componentWillUnmount() {
    this.context.scroll.unregister(this.props.name);
  }

  render() {
    return this.props.children;
  }
}

export { VisibleView, VisibleElement };
