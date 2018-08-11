import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { differenceWith } from 'lodash';

import floorplanImg from './floorplan.png';

class MiniForce extends Component {
  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array,
    targetPos: PropTypes.func
  };

  static defaultProps = {
    children: d => d,
    width: 400,
    height: 400,
    data: [],
    targetPos: [0, 0]
  };

  state = {
    nodes: []
  };

  force = d3.forceSimulation();

  posCache = (d, acc = e => [e.x, e.y]) => {
    const { nodes } = this.state;
    const cn = nodes.find(e => e.id === d.id);
    if (cn !== undefined) {
      return acc(cn);
    }
    return acc(d);
  };

  forceLayout = () => {
    const { data, targetPos } = this.props;
    const forceNodes = [...data].map(d => {
      const [wantedX, wantedY] = targetPos; // this.posCache(d);
      return {
        tx: wantedX,
        ty: wantedY,
        x: wantedX,
        y: wantedY
      };
    });

    const tmpNodes = forceNodes.map(({ tx, ty }, i) => ({
      x: tx,
      y: ty
    }));

    this.setState({ nodes: tmpNodes });

    this.force = this.force
      .nodes(forceNodes)
      .stop()
      .restart()
      .alpha(1)
      .alphaMin(0.7)
      .force('x', d3.forceX(d => d.tx).strength(0.5))
      .force('y', d3.forceY(d => d.ty).strength(0.5))
      .force('coll', d3.forceCollide(40))
      .on('end', () => {
        const nodes = forceNodes.map(({ x, y }) => ({ x, y }));
        this.setState({
          nodes
        });
      });
  };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { targetPos: oldTargetPos, data: oldData } = prevProps;
    const { data, targetPos } = this.props;

    if (
      oldData.length !== data.length ||
      targetPos[0] !== oldTargetPos[0] ||
      targetPos[1] !== oldTargetPos[1]
    ) {
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
    const { children, data } = this.props;
    const { nodes } = this.state;
    return (
      <React.Fragment>
        {nodes.map((n, i) => children({ ...data[i], ...n }))}
      </React.Fragment>
    );
  }
}

export default MiniForce;
