import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
// import chroma from 'chroma-js';
import polylabel from '@mapbox/polylabel';

import { getBoundingBox, bounds, setify } from '../utils';
import { hexagon, groupPoints } from './utils';

// import throttle from 'react-throttle-render';

import scc from 'connected-components';

import { intersection, union, uniq } from 'lodash';
import TopicAnnotationOverlay from './TopicAnnotationOverlay';

const AppContext = React.createContext();
function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function relax(points, width, height) {
  const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);

  const polygons = voronoi.polygons(points);
  console.log('polygons', polygons);
  const centroids = polygons.map(d3.polygonCentroid);
  const converged = points.every(
    (point, i) => distance(point, centroids[i]) < 1
  );

  if (converged) {
    return points;
  }
  relax(centroids);
}

function rects(quadtree) {
  const nodes = [];
  quadtree.visit((node, x0, y0, x1, y1) => {
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    nodes.push({ x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 });
  });
  return nodes;
}

function splitLinks(nodes, width = Infinity, height = Infinity) {
  const links = [];
  nodes.forEach(s => {
    nodes.forEach(t => {
      const interSet = intersection(s.tags, t.tags);
      // const euclDist = (x1, y1, x2, y2) =>
      //   Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const distX = Math.abs(t.x - s.x);
      const distY = Math.abs(t.y - s.y);
      // const weight = euclDist(t.x, t.y, s.x, s.y);

      if (
        s.id !== t.id &&
        interSet.length > 0 &&
        distY < height / 2 &&
        distX < width / 2
        // &&
        // s.x > 0 && s.x < width &&
        // t.x > 0 &&
        // t.x < width &&
        // s.y > 0 &&
        // s.y < height &&
        // t.y > 0 &&
        // t.y < height
      ) {
        links.push({
          source: s.id,
          target: t.id,
          interSet
          // weight
        });
      }
    });
  });
  return links;
}

// function shapeBounds(coordinates) {
//   let left = [Infinity, 0];
//   let right = [-Infinity, 0];
//   let top = [0, Infinity];
//   let bottom = [0, -Infinity];
//   coordinates.forEach(d => {
//     left = d[0] < left[0] ? d : left;
//     right = d[0] > right[0] ? d : right;
//     bottom = d[1] > bottom[1] ? d : bottom;
//     top = d[1] < top[1] ? d : top;
//   });
//   return { center: polylabel([coordinates]), top, left, right, bottom };
// }

function generateLinks(nodes) {
  const links = [];
  nodes.forEach(s => {
    nodes.forEach(t => {
      const interSet = intersection(s.tags, t.tags);
      // const euclDist = (x1, y1, x2, y2) =>
      //   Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      // const weight = euclDist(t.x, t.y, s.x, s.y);
      const notInserted = (src, tgt) =>
        links.find(
          l =>
            (l.source === src.id && l.target === tgt.id) ||
            (l.source === tgt.id && l.target === src.id)
        ) === undefined;

      if (s.id !== t.id && interSet.length > 0 && notInserted(s, t)) {
        links.push({
          source: s.id,
          target: t.id,
          sourceNode: s,
          targetNode: t,
          interSet
          // weight
        });
      }
    });
  });
  return links;
}

function connectedComponents(
  nodes,
  links,
  width = Infinity,
  height = Infinity,
  scale = 2
) {
  // const coms = louvain()
  //   .nodes(nodes.map(d => d.id))
  //   .edges(splitLinks(nodes, width, height))();

  const splitedLinks = links.reduce((acc, l) => {
    const srcNode = nodes.find(n => l.source === n.id);
    const tgtNode = nodes.find(n => l.target === n.id);
    const distX = Math.abs(tgtNode.x - srcNode.x);
    const distY = Math.abs(tgtNode.y - srcNode.y);

    if (distY < height && distX < width && scale !== 1)
      return [...acc, { ...l, srcNode, tgtNode }];
    return acc;
  }, []);

  // console.log('splitedLinks', splitedLinks);

  const adjList = nodes.map(n =>
    uniq(
      splitedLinks
        .reduce((acc, { source, target }) => {
          if (n.id === source) return [...acc, target];
          if (n.id === target) return [...acc, source];
          return acc;
        }, [])
        .map(id => nodes.findIndex(d => d.id === id))
    )
  );
  const comps = scc(adjList);
  return comps.map((d, i) => {
    const values = d.map(e => nodes[e]);
    const tags = d3
      .nest()
      .key(e => e)
      .entries(values.reduce((acc, v) => [...acc, ...v.tags], []))
      .sort((a, b) => b.values.length - a.values.length);

    return {
      id: i,
      values,
      tags
    };
  });

  // const communities = d3
  //   .nest()
  //   .key(d => d.cluster)
  //   .entries(
  //     Object.values(coms).map((cluster, i) => ({
  //       ...nodes[i],
  //       cluster
  //     }))
  //   );
}

function compComps(data, links, maxX = 100, maxY = 100, scale) {
  // const links = generateLinks(data);
  // console.log('links', links);
  const comps = connectedComponents(data, links, maxX, maxY, scale).map(d => {
    const sets = setify(d.values).sort(
      (a, b) => b.values.length - a.values.length
    ); // .filter(d => d.values.length > 1);
    const ext = d3.extent(sets, s => s.values.length);
    const sizeScale = d3
      .scaleLinear()
      .domain(ext)
      .range([25, 55]);

    return { ...d, sets, sizeScale };
  });
  return comps;
}

class Cluster extends Component {
  static propTypes = {
    data: PropTypes.array,
    className: PropTypes.string
  };

  static defaultProps = { data: [] };

  constructor(props) {
    super(props);

    // const data = props.data;
    // const links = generateLinks(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data, scale } = nextProps;
    // const { links, comps: oldComps } = this.state;

    // const bbox = getBoundingBox(data, d => [d.x, d.y]);
    //
    // const distY = bbox[1][1] - bbox[0][1];
    // const distX = bbox[1][0] - bbox[0][0];
    // // TODO:
    // const [maxX, maxY] = [100, 100];
    //
    // clearTimeout(this.id);
    // this.id = setTimeout(() => {
    //   let comps;
    //   if (distY > maxY || distX > maxX) {
    //     comps = compComps(data, links, maxX, maxY, scale);
    //     this.setState({ comps, links });
    //   }
    // }, 50);
    //
    // const comps = oldComps.map(c => {
    //   const values = c.values.map(n => data.find(tn => tn.id === n.id));
    //   // console.log('c', c.sets);
    //   const sets = c.sets.map(s => {
    //     const values = s.values.map(n => data.find(tn => tn.id === n.id));
    //     return { ...s, values };
    //   });
    //   return { ...c, values, sets };
    // });
    //
    // this.setState({ comps, links });
  }

  render() {
    // console.log('comps', comps);
    const { colorScale, width, height, data } = this.props;
    // const s = 50;
    const baseSize = 20;

    // const vors = d3
    //   .voronoi()
    //   .x(d => d.x)
    //   .y(d => d.y)
    //   .extent([[-1, -1], [width + 1, height + 1]])
    //   .polygons(nodes);
    //
    // console.log('vors', vors);
    //
    // const Cells = vors.map(v => (
    //   <path
    //     id={`cell${v.data.id}`}
    //     d={d3.line().curve(d3.curveLinear)(v)}
    //     stroke={'none'}
    //     fill="none"
    //   />
    //
    // ));
    const bbox = getBoundingBox(data, d => [d.x, d.y]);

    // const bbs = bounds(values.map(d => [d.x, d.y]));

    const distY = bbox[1][1] - bbox[0][1];
    const distX = bbox[1][0] - bbox[0][0];
    const offset = 0;
    const r = Math.max(Math.min(distX, distY) / 2 - offset, 15);

    // const circle = d3.packEnclose(
    //   values.map(d => ({ x: d.x, y: d.y, r: baseSize }))
    // );
    const poly = hull(
      groupPoints(
        [
          bbox[2].leftTop,
          bbox[2].leftBottom,
          bbox[2].rightTop,
          bbox[2].rightBottom
        ],
        // values.map(d => [d.x, d.y]),
        20,
        20
      ),
      Infinity,
      Infinity
    );
    const centroid = d3.polygonCentroid(poly);
    return (
      <g>
        <g
          style={
            {
              // filter: 'url(#fancy-goo)'
            }
          }
        >
          <path d={d3.line()(poly)} stroke={'green'} fill={'none'} />
          <circle
            r={r}
            stroke={'red'}
            strokeWidth={1}
            cx={centroid[0]}
            cy={centroid[1]}
            fill="none"
          />
        </g>
      </g>
    );
  }
}

class BubbleOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    const { nodes, width, height } = props;

    const links = generateLinks(nodes);
    this.connectedComps = connectedComponents(
      nodes,
      links,
      width / 4,
      height / 4
    );

    // this.comps = connectedComps.reduce((acc, c) => {
    //   acc[c.id] = [c];
    //   return acc;
    // }, {});

    const subComps = this.connectedComps.reduce((acc, c, i) => {
      const subLinks = generateLinks(c.values);
      return [...acc, ...compComps(c.values, subLinks, 100, 100, 3)];
    }, []);
    // console.log('this.comps', this.comps);

    this.state = {
      subComps,
      links
    };
  }

  componentWillReceiveProps(nextProps) {
    const { nodes, width, height } = nextProps;

    // const ts = new Date().getMilliseconds();
    // const diff = ts - this.timeStamp;
    // clearTimeout(this.id);
    // this.id = setTimeout(() => {
    //   const cc = connectedComponents(nodes, width / 2, height / 2);
    //   this.setState({ connectedComps: cc });
    // }, 1000);

    // const links = generateLinks(nodes);
    const comps = this.connectedComps.map(c => {
      const values = c.values.map(v => nodes.find(n => n.id === v.id));
      const bbox = getBoundingBox(c.values, d => [d.x, d.y]);
      const distY = bbox[1][1] - bbox[0][1];
      const distX = bbox[1][0] - bbox[0][0];
      const offset = 0;
      const poly = hull(
        groupPoints(
          [
            bbox[2].leftTop,
            bbox[2].leftBottom,
            bbox[2].rightTop,
            bbox[2].rightBottom
          ],
          // values.map(d => [d.x, d.y]),
          20,
          20
        ),
        Infinity,
        Infinity
      );
      const centroid = d3.polygonCentroid(poly);
      return { ...c, values, centroid };
    });

    const subComps = comps.reduce((acc, c) => {
      const subLinks = generateLinks(c.values);
      return [...acc, ...compComps(c.values, subLinks, 100, 100, 3)];
    }, []);

    const points = subComps.map(c => c.centroid);
    console.log('points', points);

    // this.forceSim = d3
    //   .forceSimulation()
    //   .nodes(subComps)
    //   .restart()
    //   // TODO: proper reheat
    //   .alpha(1)
    //   .alphaMin(0.8)
    //   .force('coll', d3.forceCollide(20))
    //   // .force('center', d3.forceCenter(width / 2, height / 2))
    //   .on('end', () => {
    //     this.setState({
    //       compNodes: this.forceSim.nodes()
    //     });
    //   });

    this.setState({ subComps });

    // this.timeStamp = ts;
  }

  render() {
    const {
      data,
      width,
      height,
      zoom,
      selectedTags,
      colorScale,
      comps,
      links,
      nodes,
      labels
    } = this.props;

    const { subComps } = this.state;
    console.log('subComps', subComps);

    const blurFactor = 2;
    const bubbleRadius = 25;

    // const colorScale = d3
    //   .scaleOrdinal()
    //   .domain(data.map(s => s.key))
    //   .range(chromatic.schemeAccent);

    // const offsetScale = d3
    //   .scaleLinear()
    //   .domain(d3.extent(data, d => d.values.length))
    //   // .range(d3.range(30, 90, 15))
    //   .range([15, 40])
    //   .nice();
    //
    // const dashScale = d3
    //   .scaleQuantize()
    //   .domain(d3.extent(data, d => d.values.length))
    //   .range([7, 4, 3, 2])
    //   .nice();

    // TODO: make contour

    // const newLinks = [];
    // const newNodes = [];
    // links.forEach(link => {
    //   const s = link.source;
    //   const t = link.target;
    //   const srcNode = nodes.find(n => n.id === link.source);
    //   const tgtNode = nodes.find(n => n.id === link.target);
    //
    //   newNodes.push({
    //     id: `${link.source}${link.target}`,
    //     tags: link.interSet,
    //     source: s,
    //     target: t,
    //     x: (srcNode.x + tgtNode.x) * 1 / 2,
    //     y: (srcNode.y + tgtNode.y) * 1 / 2
    //   });
    //   // if (
    //   //   links.find(
    //   //     l =>
    //   //       (l.source === link.source && l.target === link.target) ||
    //   //       (l.source === link.target && l.target === link.source)
    //   //   ) === undefined
    //   // )
    //   // newLinks.push({ source: s, target: i }, { source: i, target: t });
    //   // bilinks.push([s, i, t]);
    // });

    // console.log('links', newLinks, newNodes);

    // const bubbleData = data
    //   .filter(d => d.values.length > 1)
    //   .sort((a, b) => b.values.length - a.values.length);

    const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);
    // points.x(d => d.x)
    // .y(d => d.y);

    const size = d3
      .scaleLinear()
      .domain([0, 400])
      .range([40, 0.001])
      .clamp(true);

    const baseSize = 20;

    // const vors = d3
    //   .voronoi()
    //   .x(d => d.x)
    //   .y(d => d.y)
    //   .extent([[-1, -1], [width + 1, height + 1]])
    //   .polygons(nodes);
    //
    // console.log('vors', vors);
    //
    // const Cells = vors.map(v => (
    //   <path
    //     id={`cell${v.data.id}`}
    //     d={d3.line().curve(d3.curveLinear)(v)}
    //     stroke={'none'}
    //     fill="none"
    //   />
    //
    // ));
    const points = subComps.map(c => {
      const bbox = getBoundingBox(c.values, d => [d.x, d.y]);
      const distY = bbox[1][1] - bbox[0][1];
      const distX = bbox[1][0] - bbox[0][0];
      const offset = 0;
      const poly = hull(
        groupPoints(
          [
            bbox[2].leftTop,
            bbox[2].leftBottom,
            bbox[2].rightTop,
            bbox[2].rightBottom
          ],
          // values.map(d => [d.x, d.y]),
          20,
          20
        ),
        Infinity,
        Infinity
      );
      const centroid = d3.polygonCentroid(poly);
      return centroid;
    });

    // const bbs = bounds(values.map(d => [d.x, d.y]));

    // const circle = d3.packEnclose(
    //   values.map(d => ({ x: d.x, y: d.y, r: baseSize }))
    // );

    const Clusters = subComps.map(({ key, values }) => (
      <Cluster data={values} colorScale={colorScale} />
    ));

    const blurfactor = 1.9;
    const radius = 20;
    // const cs = Object.values(this.comps).reduce((acc, c) => [...acc, ...c], []);
    // console.log('cs', cs);

    const polyData = voronoi.polygons(points);
      // relax(points, width, height);
    // const tree = d3.quadtree().addAll(points);
    // const rectPoints = rects(tree);
    // console.log('polyData', polyData);

    return (
      <svg
        style={{
          position: 'absolute',
          width,
          height
        }}
      >
        <defs>
          <filter id="fancy-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        {
        //   rectPoints.map(d => (
        //   <rect
        //     x={d.x0}
        //     y={d.y0}
        //     width={d.width}
        //     height={d.height}
        //     fill="none"
        //     stroke="black"
        //     d={d3.line().curve(d3.curveBasis)(d)}
        //   />
        // ))
        }
        {polyData.map(d => (
          <path
            fill="none"
            stroke="grey"
            d={d3.line().curve(d3.curveLinear)(d)}
          />
        ))}
        {Clusters}
      </svg>
    );
  }
}

export default BubbleOverlay;
