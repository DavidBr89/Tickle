import React, { Component, Fragment } from 'react';
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
import dobbyscan from './cluster';

const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
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

function generateLinks(nodes, maxDist = 100) {
  const links = [];
  nodes.forEach(s => {
    nodes.forEach(t => {
      const interSet = intersection(s.tags, t.tags);
      const weight = euclDist(t.x, t.y, s.x, s.y);
      const notInserted = (src, tgt) =>
        links.find(
          l =>
            (l.source === src.id && l.target === tgt.id) ||
            (l.source === tgt.id && l.target === src.id)
        ) === undefined;

      if (
        (s.id !== t.id &&
          // TODO: check
          // interSet.length > 0 &&
          notInserted(s, t) &&
          weight < maxDist) ||
        (interSet.length === s.tags.length && interSet.length === t.tags.length)
      ) {
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

function connectedComponents(nodes, links, maxDist = Infinity) {
  // const coms = louvain()
  //   .nodes(nodes.map(d => d.id))
  //   .edges(splitLinks(nodes, width, height))();

  const splitedLinks = links.reduce((acc, l) => {
    const srcNode = nodes.find(n => l.source === n.id);
    const tgtNode = nodes.find(n => l.target === n.id);
    // const distX = Math.abs(tgtNode.x - srcNode.x);
    // const distY = Math.abs(tgtNode.y - srcNode.y);

    const weight = euclDist(tgtNode.x, tgtNode.y, srcNode.x, srcNode.y);
    // console.log('weight', weight);

    if (weight < maxDist) return [...acc, { ...l, srcNode, tgtNode }];
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

function compComps(data, maxDist = 100) {
  // const links = generateLinks(data);
  // console.log('links', links);
  const links = generateLinks(data, maxDist);
  const comps = connectedComponents(data, links).map(d => {
    const sets = setify(d.values).sort(
      (a, b) => b.values.length - a.values.length
    ); // .filter(d => d.values.length > 1);
    const ext = d3.extent(sets, s => s.values.length);
    const sizeScale = d3
      .scaleLinear()
      .domain(ext)
      .range([25, 55]);

    const ids = d.values.map(e => e.id);
    const tagKeys = d.tags.map(e => e.key);

    return { ...d, sets, sizeScale, ids, tagKeys };
  });
  return comps;
}

class Cluster extends Component {
  static propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.func
  };

  static defaultProps = { data: [], children: d => d };

  constructor(props) {
    super(props);

    // const data = props.data;
    // const links = generateLinks(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data, scale } = nextProps;
  }

  render() {
    // console.log('comps', comps);
    const { centerPos, centroid, tags, values, children, r } = this.props;

    // <div style={{ position: 'relative' }}>
    //   {values.map((d, i) => children({ ...d, x: r + i, y: r + i }))}
    // </div>
    return (
      <div>
        <div
          style={{
            position: 'absolute',
            width: r * 2,
            height: r * 2,
            left: centerPos[0] - r,
            top: centerPos[1] - r,
            border: 'black solid 2px',
            borderRadius: '100%',
            textAlign: 'center',
            lineHeight: `${2 * r}px`
            // overflow: 'hidden'
          }}
        >
          <div
            style={{
              verticalAlign: 'middle',
              lineHeight: 'normal',
              display: 'inline-block'
            }}
          />
        </div>
      </div>
    );
  }
}
function findCenterPos(values) {
  const bbox = getBoundingBox(values, d => [d.x, d.y]);
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
  const centerPos = d3.polygonCentroid(poly);
  return centerPos;
}

class BubbleOverlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    scale: PropTypes.number
  };

  static getDerivedStateFromProps(nextProps) {
    const { width, height, nodes, scale } = nextProps;

    // const comps = compComps(nodes, 100);
    const r = 20 / scale;
    const clusters = dobbyscan([...nodes], r, n => n.x, n => n.y).map(
      (vals, i) => ({ id: i, values: vals })
    );

    const subComps = clusters.map(c => {
      const centerPos = findCenterPos(c.values);
      const pad = 50;
      const boundedCenterPos = [
        Math.min(Math.max(pad, centerPos[0]), width - pad),
        Math.min(Math.max(pad, centerPos[1]), height - pad)
      ];

      const sets = setify(c.values).sort(
        (a, b) => b.values.length - a.values.length
      ); // .filter(d => d.values.length > 1);
      const ext = d3.extent(sets, s => s.values.length);
      const sizeScale = d3
        .scaleLinear()
        .domain(ext)
        .range([25, 55]);

      const tags = d3
        .nest()
        .key(e => e)
        .entries(c.values.reduce((acc, v) => [...acc, ...v.tags], []))
        .sort((a, b) => b.values.length - a.values.length);

      const ids = c.values.map(e => e.id);
      const tagKeys = tags.map(e => e.key);

      const dist = 10; // Math.max(relatedComp.r, 4);
      const values = c.values.map(v => ({
        ...v,
        x: centerPos[0], // Math.min(Math.max(v.x, centerPos[0] + dist), v.x),
        y: centerPos[1] // Math.min(Math.max(v.y, centerPos[1] + dist), v.y)
      }));
      //
      return {
        ...c,
        values,
        centerPos,
        sets,
        tagKeys,
        sizeScale,
        ids
      };
    });
    return { subComps };
  }

  state = {
    subComps: [],
    links: []
  };

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
      labels,
      children
    } = this.props;

    const { subComps } = this.state;

    const blurFactor = 2;
    const bubbleRadius = 25;

    const voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);
    // .x(d => d.centerPos[0])
    // .y(d => d.centerPos[1]);

    const relaxedVoronoi = (points, counter = 1) => {
      const polygons = voronoi.polygons(points.map(d => d.centerPos));
      const centroids = polygons.map(d3.polygonCentroid);
      // const converged = points.every(
      //   (point, i) => distance(point.centerPos, centroids[i] || 0) < 1
      // );

      // const newPoints = points.reduce((acc, p, i) => {
      //   const centerPos = centroids[i];
      //   if (centroids[i]) return [{ ...p, centerPos }, ...acc];
      //   return acc;
      // }, []);
      //
      // const newPolygons = voronoi.polygons(newPoints.map(d => d.centerPos));
      // const newCentroids = polygons.map(
      //   (d, i) => d3.polygonCentroid(d) || centroids[i]
      // );
      // if (!converged && counter > 0) {
      //   return relaxedVoronoi(
      //     points.map((p, i) => {
      //       p.centerPos = centroids[i] || 0;
      //       return p;
      //     }),
      //     counter - 1
      //   );
      // }
      return polygons;
    };

    const ns = relaxedVoronoi(subComps);
    // const vs = voronoi.polygons(subComps.map(d => d.centerPos));
    // console.log('ns', ns, 'vs', vs);

    const size = d3
      .scaleLinear()
      .domain([0, 400])
      .range([40, 0.001])
      .clamp(true);

    const baseSize = 20;

    const polyData = ns.map((arrObj, i) => {
      const polygon = arrObj.slice(0, arrObj.length - 1);
      const centroid = d3.polygonCentroid(polygon);
      const data = subComps[i];
      // const { data } = arrObj;
      return { ...data, centroid, polygon };
    });

    // const bbs = bounds(values.map(d => [d.x, d.y]));

    // const circle = d3.packEnclose(
    //   values.map(d => ({ x: d.x, y: d.y, r: baseSize }))
    // );

    const clusteredNodes = polyData.reduce((acc, d) => {
      const ns = d.values.map((n, i) => {
        const [x, y] = d.centerPos.map(e => e + i * 9);
        return { ...n, x, y };
      });
      return [...acc, ...ns];
    }, []);

    return (
      <Fragment>
        <svg
          style={{
            position: 'absolute',
            width,
            height
          }}
        >
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="20"
                colorInterpolationFilters="sRGB"
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
            <filter id="gooeyCodeFilter">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                colorInterpolationFilters="sRGB"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="gooey"
              />
            </filter>
          </defs>
          <g filter="url(#gooeyCodeFilter)">
            {clusteredNodes.map(d => (
              <rect
                x={d.x - 35}
                y={d.y - 35}
                width={100}
                height={100}
                fill="lightgrey"
              />
            ))}
          </g>
          {polyData.map(d => (
            <path
              fill="none"
              stroke="grey"
              strokeLinecap="round"
              strokeDasharray="5,10,5"
              d={d3.line().curve(d3.curveLinear)(d.polygon)}
            />
          ))}
          {polyData.map(d => (
            <path
              fill="none"
              stroke="black"
              d={`M${d.centroid}L${d.centerPos}`}
            />
          ))}
        </svg>
        {polyData.map(({ centroid: [cx, cy], centerPos: [x, y], ...d }) => {
          const angle = Math.round((Math.atan2(cy - y, cx - x) / Math.PI) * 2);
          // const trans = angle === 0 ? 100
          //     : angle === -1 ? orient.top
          //     : angle === 1 ? orient.bottom
          //     : orient.left);
          return (
            <div
              style={{
                position: 'absolute',
                left: cx,
                top: cy,
                transform: `translate(${angle === 0 ? -100 : 0}%, -50%)`,
                background: 'white',
                zIndex: 5000
              }}
            >
              {d.tagKeys.map(t => <div>{t}</div>)}
            </div>
          );
        })}
        {clusteredNodes.map(children)}
      </Fragment>
    );
  }
}

export default BubbleOverlay;
