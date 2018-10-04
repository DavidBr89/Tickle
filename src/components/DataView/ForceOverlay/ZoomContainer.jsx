import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { getBoundingBox } from '../utils';

function centerView(props) {
  const { data, width, center, height } = props;
  if (data.length === 1) {
    console.log('start', center);
    const { x, y } = data[0];
    const scale = 1;

    return d3.zoomIdentity
      .translate(width / 2 - x * scale, height / 2 - y * scale)
      .scale(scale);
  }
  // const zoomFactoryCont = this.zoomFactory(props);
  // const bounds = getBoundingBox(data, d => [d.x, d.y]);
  const dx = width;
  const dy = (height * 2) / 3;
  const x = center[0];
  const y = height - center[1]; // height / 3; // center[1] - 100;
  const scale = Math.max(dx / width, dy / height);

  console.log('dx', dx, 'dy', dy, 'x', x, 'y', scale);
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
    data: PropTypes.arrayOf(
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
    center: [50, 50],
    force: false,
    data: [],
    delay: 200,
    selectedId: null,
    maxZoomScale: 4.5
  };

  constructor(props) {
    super(props);

    this.zoomFactory = this.zoomFactory.bind(this);

    // const zoomHandler = this.centerView(props);
    // this.state = { zoomHandler };
    //
    //
  }

  state = {
    zoomHandler: centerView(this.props) // d3.zoomIdentity //
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // return { zoomHandler: centerView(nextProps) };
  // }

  componentDidUpdate(prevProps, prevState) {
    const { width, height, center, data, selectedId } = this.props;
    const scale = 2;
    if (this.props.selectedId && prevProps.selectedId !== selectedId) {
      const { x, y } = data.find(n => n.id === selectedId);
      // const zoomHandler = d3.zoomIdentity
      //   .translate(center[0] - x * scale, center[1] - y * scale)
      //   .scale(scale);
      //
      // d3.select(this.zoomCont).call(
      //   this.zoomFactoryCont.transform,
      //   zoomHandler
      // );
    }
    // this.zoomFactoryCont = this.zoomFactory(this.props);
    // d3.select(this.zoomCont).call(this.zoomFactoryCont);
    // d3.select(this.zoomCont).call(
    //   this.zoomFactoryCont.transform,
    //   this.state.zoomHandler
    // );
    // this.props.onZoom(zoomedNodes);
  }

  componentDidMount() {
    this.zoomFactoryCont = this.zoomFactory(this.props);
    d3.select(this.zoomCont).call(this.zoomFactoryCont);
    //   .on('dblclick.zoom', null)
    // .duration(0);
    // .on('.zoom', null);

    const zoomHandler = centerView(this.props);
    d3.select(this.zoomCont).call(this.zoomFactoryCont.transform, zoomHandler);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { selectedId, width, height, data, center } = nextProps;
  //
  //   // const zoomHandler = this.centerView(this.props);
  //   // this.setState({ zoomHandler });
  //   // const { zoomHandler: oldZoomHandler } = this.state;
  //   // const zoomScale = 1.5;
  //   // // this.forceSim.on('end', null);
  //   //
  //   // if (selectedId !== null) {
  //   //   // const zoomFactoryCont = this.zoomFactory(nextProps);
  //   //   const n = data.find(d => d.id === selectedId);
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
      .duration(-2000)
      .wheelDelta(
        () => (-d3.event.deltaY * (d3.event.deltaMode ? 50 : 1)) / 500
      )
      .scaleExtent([1, maxZoomScale])
      .extent([[0, 0], [width, height]])
      .filter(() => {
        console.log('yeah', d3.event);
        // return !d3.event.target.classList.contains('no-zoom');
        return true;
      })
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
      data,
      onZoom
    } = this.props;
    const { zoomHandler } = this.state;

    const constrainZoom = () => {
      // t[0] = Math.max(0, Math.min(t[0], width - s * 50));
      // t[1] = Math.max(0, Math.min(t[1], height - s * 50));
    };
    const zoomedNodes = data.map(d => {
      const [x, y] = zoomHandler.apply([d.x, d.y]);
      return { ...d, x, y };
    });
    // .filter(({ x, y }) => x > 0 && x < width && y > 0 && y < height);
    //
    // console.log('zoomHandler', zoomHandler.k);

    return (
      <div>
        <div
          className="zoom-target"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            // background: 'wheat',
            width,
            height,
            pointerEvents: 'all',
            zIndex: 10,
            // overflow: 'hidden',
            // zIndex: 0,
            ...style
          }}
          ref={node => (this.zoomCont = node)}
        >
          {children(zoomedNodes, zoomHandler)}
        </div>
      </div>
    );
  }
}

export default ZoomContainer;
