import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TopicTree extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return <div>tree</div>;
  }
}

export default TopicTree;
