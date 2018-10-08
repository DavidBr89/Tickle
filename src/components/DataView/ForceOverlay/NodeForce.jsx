import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { differenceWith } from 'lodash';

class NodeForce extends Component {
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

  state = {
    nodes: []
  };

  force = d3.forceSimulation();

  posCache = d => {
    const { width, height } = this.props;
    const { nodes } = this.state;
    const cn = nodes.find(e => e.id === d.id);
    if (cn !== undefined) {
      return [
        cn.floorX !== d.floorX ? d.floorX * width : cn.x,
        cn.floorY !== d.floorY ? d.floorY * height : cn.y
      ];
    }
    return [d.floorX * width, d.floorY * height];
  };

  forceLayout = () => {
    // TODO: untangle nodes from DATA
    const { width, height, data } = this.props;
    const forceNodes = [...data].map(d => {
      const [wantedX, wantedY] = this.posCache(d);
      // TODO: check later
      return {
        tx: wantedX,
        ty: wantedY,
        x: wantedX,
        y: wantedY
      };
    });

    const tmpNodes = forceNodes.map(({ tx, ty }, i) => ({
      ...data[i],
      x: tx,
      y: ty
    }));

    this.setState({ nodes: tmpNodes });

    this.force = this.force
      .nodes(forceNodes)
      .restart()
      .alpha(1)
      .alphaMin(0.97)
      .force('x', d3.forceX(d => d.tx).strength(1))
      .force('y', d3.forceY(d => d.ty).strength(1))
      .force('coll', d3.forceCollide(10).strength(0.1))
      .on('end', () => {
        const nodes = forceNodes.map(({ x, y }) => ({ x, y }));
        this.setState({
          nodes
        });
      });
  };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { data: oldData } = prevProps;
    const oldNodes = oldData.map(d => ({
      ...d,
      floorX: d.floorX,
      floorY: d.floorY
    }));
    const { data } = this.props;
    // TODO create real compare Function
    const compare = (a, b) => a.floorX === b.floorX && a.floorY === b.floorY;

    const diffList = differenceWith(data, oldNodes, compare);
    // console.log('data', data, 'oldData', oldData, diffList);
    if (oldData.length !== data.length || diffList.length > 0) {
      this.forceLayout();
    }
  }

  componentDidMount() {
    this.forceLayout();

    // this.forceLayout();
    // this.forceLayout();
    // const { width, height, onMapViewportChange } = this.props;
    // onMapViewportChange({ width, height });
  }
  // }

  render() {
    const { width, data, height, children } = this.props;
    const { nodes } = this.state;
    const nn = nodes.map((n, i) => ({
      ...data[i],
      ...n
    }));
    return (
      <div
        style={{
          width,
          height
          // position: 'relative'
        }}
      >
        {children(nn)}
      </div>
    );
  }
}

export default NodeForce;
