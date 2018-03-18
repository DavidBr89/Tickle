import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class ForceOverlay extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        loc: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
          tags: PropTypes.arrayOf(PropTypes.string)
        })
      })
    ),
    delay: PropTypes.number
  };

  static defaultProps = {
    children: d => d,
    className: null,
    style: {},
    viewport: { width: 100, height: 100, longitude: 0, latitude: 0 },
    force: false,
    data: [],
    delay: 200
  };

  constructor(props) {
    super(props);
    this.state = {
      transEvent: d3.zoomIdentity
    };
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

  // componentWillReceiveProps(nextProps) {
  //   const { selectedCardId, viewport } = nextProps;
  //   const { height, width } = viewport;
  //   const { nodes } = this.state;
  //   // this.forceSim.on('end', null);
  //
  //   // if (selectedCardId !== null) {
  //   //   const n = nodes.find(d => d.id === selectedCardId);
  //   //   console.log('n', n.y, height);
  //   //   this.setState({
  //   //     transEvent: d3.zoomIdentity.translate(width / 2 - n.x, height / 2 - n.y)
  //   //   });
  //   // }
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
  // //       transEvent: d3.zoomIdentity.translate(width / 2, height / 2)
  // //     });
  // //   }
  // // }

  componentDidMount() {
    const zoomFactory = d3
      .zoom()
      .wheelDelta(() => -d3.event.deltaY * (d3.event.deltaMode ? 50 : 1) / 500)
      .scaleExtent([1, 3])
      .on('zoom', () => {
        console.log('zoom');
        this.setState({
          transEvent: d3.event.transform || d3.zoomIdentity
        });
      });
    d3.select(this.zoomCont).call(zoomFactory);
  }

  render() {
    const { children, width, height, style, className, nodes } = this.props;
    const { transEvent } = this.state;
    const bubbleRadius = 50;
    const newNodes = nodes.map(d => {
      const [x, y] = transEvent.apply([d.x, d.y]);
      return { ...d, x, y };
    });

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
          {children(newNodes)}
        </div>
      </div>
    );
  }
}

export default ForceOverlay;
