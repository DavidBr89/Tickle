import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DelayClick extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    delay: PropTypes.number,
    onClick: PropTypes.func
  };

  static defaultProps = {
    children: React.Fragment,
    delay: 500
  };

  constructor(props) {
    super(props);
    this.creationDate = +new Date();
    console.log('CONSTRUCTOR', this.creationDate);
  }

  render() {
    const { delay } = this.props;
    return React.cloneElement(this.props.children, {
      onClick: e => {
        const diff = Math.abs(+new Date() - this.creationDate);

        diff >= delay && this.props.onClick(e);
      }
    });
  }
}

export default DelayClick;
