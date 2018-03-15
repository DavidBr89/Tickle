import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tsnejs from 'tsne';
import * as d3 from 'd3';
import { intersection, union, flattenDeep, uniq, flatten } from 'lodash';
import { PerspectiveMercatorViewport } from 'viewport-mercator-project';
import * as chromatic from 'd3-scale-chromatic';

import Hull from './Hull';

function setify(data) {
  const spreadData = [...data].map(({ id, tags }) =>
    tags.map(t => ({ id: t, ref: id }))
  );
  return d3
    .nest()
    .key(d => d.id)
    .entries(flatten([...spreadData]))
    .map(d => {
      d.count = d.values.length;
      d.tags = uniq(flatten(intersection(d.values.map(e => e.tags))));
      // d.tags = i % 2 ? ['hallo'] : ['test'];
      return d;
    })
    .sort((a, b) => b.count - a.count);
}

const jaccard = (a, b) =>
  a.length !== 0 && b.length !== 0
    ? 1 - intersection(a, b).length / union(a, b).length
    : 1;

function runTsne(data, iter = 400) {
  const dists = data.map(a => data.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 10,
    epsilon: 50
  });

  // initialize data with pairwise distances
  model.initDataDist(dists);

  for (let i = 0; i < iter; ++i) model.step();

  // Y is an array of 2-D points that you can plot
  return model.getSolution();
}

function transform(t) {
  return function(d) {
    const s = t.apply(d);
    console.log('s', s);
    return `translate(${t.apply(d)})`;
  };
}

function forceTsne({ width, height, nodes }) {
  const centerX = d3.scaleLinear().range([0, width]);
  const centerY = d3.scaleLinear().range([0, height]);
  const dists = nodes.map(a => nodes.map(b => jaccard(a.tags, b.tags)));

  // eslint-disable-next-line new-cap
  const model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 50,
    epsilon: 20
  });

  model.initDataDist(dists);
  // every time you call this, solution gets better
  return function(alpha) {
    model.step();
    // console.log('this', this);

    // Y is an array of 2-D points that you can plot
    const pos = model.getSolution();

    centerX.domain(d3.extent(pos.map(d => d[0])));
    centerY.domain(d3.extent(pos.map(d => d[1])));

    nodes.forEach((d, i) => {
      d.x += alpha * (centerX(pos[i][0]) - d.x);
      d.y += alpha * (centerY(pos[i][1]) - d.y);
    });
  };
}

class ForceOverlay extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.oneOf([null, PropTypes.string]),
    style: PropTypes.object,
    viewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      zoom: PropTypes.number
    }),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        loc: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
          tags: PropTypes.arrayOf(PropTypes.string)
        })
      })
    ),
    delay: PropTypes.number,
    mode: PropTypes.oneOf(['location', 'tsne'])
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
    const { width, height, data } = props;
    const sets = setify(data).filter(d => d.values.length > 2);
    this.state = {
      nodes: [],
      tsnePos: runTsne(data, 400),
      translate: transform(d3.zoomIdentity),
      transEvent: d3.zoomIdentity,
      sets
    };
    this.layout = this.layout.bind(this);
    this.forceSim = d3.forceSimulation();
    // this.zoom = this.zoom.bind(this);
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

  componentWillReceiveProps(nextProps) {
    const { selectedCardId, viewport } = nextProps;
    const { height, width } = viewport;
    const { nodes } = this.state;
    // this.forceSim.on('end', null);
    clearTimeout(this.id);
    // this.layout(nextProps);

    if (selectedCardId !== null) {
      const n = nodes.find(d => d.id === selectedCardId);
      console.log('n', n.y, height);
      this.setState({
        transEvent: d3.zoomIdentity.translate(width / 2 - n.x, height / 2 - n.y)
      });
    }
  }
  //
  // componentDidUpdate() {
  //   const { selectedCardId, width, height } = this.props;
  //   const { nodes } = this.state;
  //   // this.forceSim.on('end', null);
  //   clearTimeout(this.id);
  //   // this.layout(nextProps);
  //
  //   if (selectedCardId !== null) {
  //     const n = nodes.find(d => d.id === selectedCardId);
  //     this.setState({
  //       transEvent: d3.zoomIdentity.translate(width / 2, height / 2)
  //     });
  //   }
  // }

  componentDidMount() {
    const { width, height } = this.props.viewport;
    const zoomFactory = d3
      .zoom()
      .wheelDelta(() => -d3.event.deltaY * (d3.event.deltaMode ? 50 : 1) / 500)
      .scaleExtent([1, 3])
      // .translateExtent([[-Infinity, -Infinity], [Infinity, Infinity]])
      // .extent([[-Infinity, -Infinity], [Infinity, Infinity]])
      .on('zoom', () => {
        // const { x, y } = d3.event.sourceEvent;
        // const translate = `translate(${width / 2 - x * scale}px,${height / 2 -
        //   y * scale}px)scale(${scale})`;
        // const { k: scale, x, y } = d3.event.transform;

        this.setState({
          transEvent: d3.event.transform || d3.zoomIdentity
          // nodes: nodes.map(d => {
          //   const [x, y] = d3.event.transform.apply([d.x, d.y]);
          //   return { x, y, id: d.id };
          //   // return d;
          // })
        });
      });
    d3.select(this.zoomCont).call(zoomFactory);

    this.layout(this.props);
    // }
  }

  layout(nextProps = null) {
    const data = (() => {
      if (nextProps !== null) {
        const { nodes } = this.state;
        const { data: newData } = nextProps;
        return newData.map(d => {
          const oldNode = nodes.find(n => n.id === d.id);
          d.x = oldNode && oldNode.x;
          d.y = oldNode && oldNode.y;
          return d;
        });
      }
      return this.props.data;
    })();

    const { viewport, force, mode, delay } = nextProps;
    const { width, height, zoom, latitude, longitude } = viewport;
    const { tsnePos } = this.state;
    // const tsnePos = runTsne(data, 300);

    // prevent stretching of similiarities
    const padY = height / 7;
    const padX = 30;
    const tsneX = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[0])))
      .range([padX, width - padX]);

    const tsneY = d3
      .scaleLinear()
      .domain(d3.extent(tsnePos.map(d => d[1])))
      .range([padY, height - padY]);

    const vp = new PerspectiveMercatorViewport({
      width,
      height,
      zoom,
      latitude,
      longitude
    });

    const nodes = data
      .map(({ id, x, y, loc, tags }, i) => {
        const [lx, ly] = vp.project([loc.longitude, loc.latitude]);
        return {
          id,
          lx,
          ly,
          x: lx,
          y: ly,
          tx: tsneX(tsnePos[i][0]),
          ty: tsneY(tsnePos[i][1]),
          tags
        };
      })
      // .filter(n => n.x > 0 && n.x < width && n.y > 0 && n.y < height);

    const isTsne = mode === 'tsne';
    if (force) {
      this.forceSim = this.forceSim
        .nodes(nodes)
        .restart()
        .alpha(1)
        // .alphaMin(0.6)
        .force('x', d3.forceX(d => (isTsne ? d.tx : d.lx)).strength(0.8))
        .force('y', d3.forceY(d => (isTsne ? d.ty : d.ly)).strength(0.8))
        // .force(
        //   'tsne',
        //    forceTsne({ width, height, nodes }) : null
        // )
        .force(
          'collide',
          d3.forceCollide(10).strength(1)
          // .iterations(10)
        )
        .on('end', () => {
          this.id = setTimeout(
            () =>
              this.setState({
                nodes: this.forceSim.nodes()

                // .map(d => {
                //   const [x, y] = transEvent.apply([d.x, d.y]);
                //   return { x, y, id: d.id };
                // })
              }),
            delay
          );

          // this.setState({
          //   nodes: this.forceSim.nodes()
          // });
          this.forceSim.on('end', null);
        });
    }

    this.setState({
      nodes
    });
  }

  render() {
    const { children, viewport, style, className, mode } = this.props;
    const { transEvent, sets } = this.state;
    const { width, height } = viewport;
    const { nodes } = this.state;
    const bubbleRadius = 50;

    // need to run here to be always synchron, state updates asynchron
    const zoomedNodes = nodes.map(d => {
      const { x, y } = { ...d };
      const [x1, y1] = transEvent.apply([x, y]);
      return { id: d.id, x: x1, y: y1 };
    });

    const zoomedPos = nodes.map(d => transEvent.apply([d.x, d.y]));

    const color = d3
      .scaleOrdinal()
      .domain(sets.map(s => s.key))
      .range(chromatic.schemeAccent);
    // .interpolator(chromatic.interpolateYlGnBu)
    // .clamp(true);

    const bubbles = sets.map(({ id, key, values }) => (
      <g
        key={id}
        style={{
          // filter: `url( "#gooeyCodeFilter-${key}")`,
          filter: `url("#gooey2")`
        }}
      >
        {values.map(d => {
          const n = zoomedNodes.find(e => e.id === d.ref) || { x: 0, y: 0 };
          return (
            <circle
              fill={color(key)}
              opacity={0.2}
              r={bubbleRadius}
              cx={n.x}
              cy={n.y}
            />
          );
        })}
      </g>
    ));

    const blurFactor = 0;

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
          <svg
            style={{
              position: 'absolute',
              // left: 0,
              // top: 0,
              // pointerEvents: 'none',
              width,
              height
              // border: '1px black dashed'
              // transform: transform(transEvent)
              // transform
            }}
          >
            <defs>
              {sets.map(s => (
                <filter id={`gooeyCodeFilter-${s.key}`}>
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation={blurFactor}
                    colorInterpolationFilters="sRGB"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    type="saturate"
                    values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -6`}
                    result="gooey"
                  />
                </filter>
              ))}
              <filter id="gooey2">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -7`}
                  result="gooey"
                />
                <feBlend in="SourceGraphic" in2="gooey" />
              </filter>

              <filter id="gooey">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={blurFactor}
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${bubbleRadius} -7`}
                  result="gooey"
                />
                <feBlend in="SourceGraphic" in2="gooey" />
              </filter>
            </defs>
            <g>
              {sets.map(s => (
                <Hull
                  data={s.values}
                  tags={s.tags}
                  offset={10}
                  zoomHandler={d => d}
                  onHighlight={d => d}
                  onMouseEnter={d => d}
                  onMouseLeave={d => d}
                />
              ))}
            </g>
            {bubbles}
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0
              // width,
              // height,
            }}
          >
            {zoomedNodes.map(({ x, y }) => children({ x, y }))}
          </div>
        </div>
      </div>
    );
  }
}

export default ForceOverlay;
