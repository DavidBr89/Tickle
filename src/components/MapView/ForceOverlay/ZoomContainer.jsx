import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { getBoundingBox } from '../utils';

function centerView(props) {
  const { nodes, width, center, height } = props;
  // const zoomFactoryCont = this.zoomFactory(props);
  const bounds = getBoundingBox(nodes, d => [d.x, d.y]);
  const offsetX = 0;
  const offsetY = 0;
  const dx = bounds[1][0] - bounds[0][0] + offsetX;
  const dy = bounds[1][1] - bounds[0][1] + offsetY;
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;
  const scale = Math.max(dx / width, dy / height);
  // const translate = [width / 2 - scale * x, height / 2 - scale * y];

  const zoomHandler = d3.zoomIdentity
    .translate(width / 2 - x * scale, center[1] - y * scale)
    .scale(scale);

  return zoomHandler;
}
class ZoomContainer extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      })
    ),
    selectedId: PropTypes.oneOf(PropTypes.number, null),
    delay: PropTypes.number
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    width: 100,
    height: 100,
    force: false,
    nodes: [],
    delay: 200,
    selectedId: null,
    maxZoomScale: 5
  };

  constructor(props) {
    super(props);

    this.zoomFactory = this.zoomFactory.bind(this);
    this.centerView = centerView.bind(this);

    // const zoomHandler = this.centerView(props);
    // this.state = { zoomHandler };
    //
    //
    this.state = {
      zoomHandler: props.nodes.length > 1 ? centerView(props) : d3.zoomIdentity
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.nodes.length > prevProps.nodes.length) {
      const zoomHandler = centerView(this.props);
      d3.select(this.zoomCont).call(
        this.zoomFactoryCont.transform,
        zoomHandler
      );
    }
    // this.zoomFactoryCont = this.zoomFactory(this.props);
    // d3.select(this.zoomCont).call(this.zoomFactoryCont);
    // d3.select(this.zoomCont).call(
    //   this.zoomFactoryCont.transform,
    //   this.state.zoomHandler
    // );
    // this.props.onZoom(newNodes);
  }

  componentDidMount() {
    this.zoomFactoryCont = this.zoomFactory(this.props);
    d3.select(this.zoomCont).call(this.zoomFactory(this.props));
    d3.select(this.zoomCont).call(
      this.zoomFactoryCont.transform,
      this.state.zoomHandler
    );
    // d3.select(this.zoomCont).call(this.zoomFactoryCont);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { selectedId, width, height, nodes, center } = nextProps;
  //
  //   // const zoomHandler = this.centerView(this.props);
  //   // this.setState({ zoomHandler });
  //   // const { zoomHandler: oldZoomHandler } = this.state;
  //   // const zoomScale = 1.5;
  //   // // this.forceSim.on('end', null);
  //   //
  //   // if (selectedId !== null) {
  //   //   // const zoomFactoryCont = this.zoomFactory(nextProps);
  //   //   const n = nodes.find(d => d.id === selectedId);
  //   //   const zoomHandler = d3.zoomIdentity
  //   //     .translate(center[0] - n.x * zoomScale, center[1] - n.y * zoomScale)
  //   //     .scale(zoomScale);
  //   //
  //   //   d3.select(this.zoomCont).call(
  //   //     this.zoomFactoryCont.transform,
  //   //     zoomHandler
  //   //   );
  //   //
  //   // this.setState({ zoomHandler });
  //   // } else {
  //   //   // const zoomHandler = this.centerView(this.props);
  //   //   // this.setState({ zoomHandler });
  //   // }
  // }

  zoomFactory(props) {
    const { width, height, maxZoomScale } = props;
    return d3
      .zoom()
      .wheelDelta(
        () => (-d3.event.deltaY * (d3.event.deltaMode ? 50 : 1)) / 500
      )
      .scaleExtent([0, maxZoomScale])
      .extent([[0, 0], [width, height]])
      .on('zoom', () => {
        this.setState({
          zoomHandler: d3.event.transform || d3.zoomIdentity
        });
      });
  }

  render() {
    const {
      children,
      width,
      height,
      style,
      className,
      nodes,
      onZoom
    } = this.props;
    const { zoomHandler } = this.state;
    const newNodes = nodes.map(d => {
      const [x, y] = zoomHandler.apply([d.x, d.y]);
      return { ...d, x, y };
    });
    // .filter(({ x, y }) => x > 0 && x < width && y > 0 && y < height);

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          // background: 'wheat',
          width,
          height,
          // pointerEvents: 'none',
          overflow: 'hidden',
          // zIndex: 2000
          ...style
        }}
        ref={node => (this.zoomCont = node)}
      >
        <div
          style={{
            // width,
            // height,
            position: 'absolute'
            // overflow: 'hidden',
            // left: 0,
            // top: 0
          }}
        >
          {children(newNodes, zoomHandler)}
        </div>
      </div>
    );
  }
}

export default ZoomContainer;
