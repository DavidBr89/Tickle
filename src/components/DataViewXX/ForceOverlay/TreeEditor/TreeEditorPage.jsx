import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { differenceWith } from 'lodash';

import NodeForce from '../NodeForce';

class TreeEditorPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array
  };

  static defaultProps = {
    children: d => d,
    width: 400,
    height: 400,
    data: []
  };

  render() {
    const { children } = this.props;
    return (
      <NodeForce {...this.props}>{nodes => nodes.map(children)}</NodeForce>
    );
  }
}

export default TreeEditorPage;
