import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { getBoundingBox } from '../utils';

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
    selectedId: PropTypes.oneOf([PropTypes.number, null]),
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
    this.state = {
      zoomHandler: d3.zoomIdentity.scale(0.5)
    };

    this.zoomFactory = this.zoomFactory.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { viewport: vp1 } = nextProps;
  //   const { viewport: vp2 } = this.props;
  //   return (
  //     vp1.latitude !== vp2.latitude ||
  //     vp1.longitude !== vp2.longitude ||
  //     vp1.width !== vp2.width ||
  //     vp1.height !== vp2.height ||
  //     vp1.zoom !== vp2.zoom
  //   );
  // }

  // //
  // // componentDidUpdate() {
  // //   const { selectedCardId, width, height } = this.props;
  // //   const { nodes } = this.state;
  // //   // this.forceSim.on('end', null);
  // //   clearTimeout(this.id);
  // //   // this.layout(nextProps);
  // //
  // //   if (selectedCardId !== null) {
  // //     const n = nodes.find(d => d.id === selectedCardId);
  // //     this.setState({
  // //       zoomHandler: d3.zoomIdentity.translate(width / 2, height / 2)
  // //     });
  // //   }
  // // }
  //
  componentDidUpdate(prevProps, prevState) {
    // this.props.onZoom(newNodes);
  }

  componentDidMount() {
    const zoomFactoryCont = this.zoomFactory();
    d3.select(this.zoomCont).call(zoomFactoryCont);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedId, width, height, nodes, center } = nextProps;
    // const { zoomHandler: oldZoomHandler } = this.state;
    const zoomScale = 1.5;
    // this.forceSim.on('end', null);

    const zoomFactoryCont = this.zoomFactory();

    if (selectedId !== null) {
      const n = nodes.find(d => d.id === selectedId);
      const zoomHandler = d3.zoomIdentity
        .translate(center[0] - n.x * zoomScale, center[1] - n.y * zoomScale)
        .scale(zoomScale);

      // recalibrate zoomCont
      d3.select(this.zoomCont).call(zoomFactoryCont.transform, zoomHandler);

      this.setState({ zoomHandler });
    } else {
      const bounds = getBoundingBox(nodes, d => [d.x, d.y]);
      const offsetX = 50;
      const offsetY = 200;
      const dx = bounds[1][0] - bounds[0][0] + offsetX;
      const dy = bounds[1][1] - bounds[0][1] + offsetY;
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = Math.max(
        1,
        Math.min(8, 0.9 / Math.max(dx / width, dy / height))
      );
      // const translate = [width / 2 - scale * x, height / 2 - scale * y];

      const initScale = 0.5
      const zoomHandler = d3.zoomIdentity
        .translate(width / 2 - x * initScale, height / 2 - y * initScale)
        .scale(initScale);

      d3.select(this.zoomCont).call(zoomFactoryCont.transform, zoomHandler);

      this.setState({ zoomHandler });
    }

    // else {
    //   // TODO: zoom bounding box
    //   this.setState({
    //     zoomHandler: d3.zoomIdentity.translate(0, 0).scale(1)
    //   });
    // }
  }

  zoomFactory() {
    const { width, height, maxZoomScale } = this.props;
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
    onZoom(newNodes);

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
