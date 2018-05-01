import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
import hull from 'concaveman';
import * as d3 from 'd3';
// import chroma from 'chroma-js';
// import polylabel from '@mapbox/polylabel';

import { getBoundingBox, setify } from '../utils';
import { hexagon, groupPoints } from './utils';

// import throttle from 'react-throttle-render';

import scc from 'connected-components';

import { intersection, union, uniq } from 'lodash';
import TopicAnnotationOverlay from './TopicAnnotationOverlay';

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
  height = Infinity
) {
  // const coms = louvain()
  //   .nodes(nodes.map(d => d.id))
  //   .edges(splitLinks(nodes, width, height))();

  const splitedLinks = links.reduce((acc, l) => {
    const srcNode = nodes.find(n => l.source === n.id);
    const tgtNode = nodes.find(n => l.target === n.id);
    const distX = Math.abs(tgtNode.x - srcNode.x);
    const distY = Math.abs(tgtNode.y - srcNode.y);

    if (distY < height && distX < width)
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
      key: i,
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

function compComps(data, links, maxX = 100, maxY = 100) {
  // const links = generateLinks(data);
  // console.log('links', links);
  const comps = connectedComponents(data, links, maxX, maxY).map(d => {
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

    const data = props.data;
    const links = generateLinks(data);
    const comps = compComps(data, links);
    const sets = setify(data);
    this.state = { comps, links, sets };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const { links, comps: oldComps } = this.state;

    const bbox = getBoundingBox(data, d => [d.x, d.y]);

    const distY = bbox[1][1] - bbox[0][1];
    const distX = bbox[1][0] - bbox[0][0];
    // TODO:
    const [maxX, maxY] = [200, 200];

    clearTimeout(this.id);
    this.id = setTimeout(() => {
      let comps;
      if (distY > maxY || distX > maxX) {
        comps = compComps(data, links, maxX, maxY);
        this.setState({ comps, links });
      }
    }, 50);

    const comps = oldComps.map(c => {
      const values = c.values.map(n => data.find(tn => tn.id === n.id));
      // console.log('c', c.sets);
      const sets = c.sets.map(s => {
        const values = s.values.map(n => data.find(tn => tn.id === n.id));
        return { ...s, values };
      });
      return { ...c, values, sets };
    });

    this.setState({ comps, links });
  }

  render() {
    const { sets, comps } = this.state;
    // console.log('comps', comps);
    const { colorScale, id } = this.props;
    // const s = 50;
    return (
      <g>
        {comps.map(({ key, values, sets, sizeScale }) => (
          <g key={key}>
            <path
              fill="none"
              stroke={'grey'}
              d={d3.line().curve(d3.curveBasis)(
                hull(groupPoints(values.map(d => [d.x, d.y]), 20, 20), 100, 100)
              )}
            />

            <g
              style={
                {
                  // filter: 'url(#fancy-goo)'
                }
              }
            >
              {sets.map(s => (
                <g>
                  <path
                    fill={colorScale(s.key)}
                    stroke={'grey'}
                    d={d3.line().curve(d3.curveLinear)(
                      hull(
                        groupPoints(s.values.map(d => [d.x, d.y]), 30, 30),
                        100,
                        100
                      )
                    )}
                  />
                </g>
              ))}
            </g>
          </g>
        ))}
        <TopicAnnotationOverlay comps={comps} labels colorScale={colorScale} />
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
    const connectedComps = connectedComponents(
      nodes,
      links,
      width / 4,
      height / 4
    );
    this.state = { connectedComps, links };
    console.log('constr');
  }

  componentWillReceiveProps(nextProps) {
    const { nodes, width, height } = nextProps;
    const { connectedComps } = this.state;

    // const ts = new Date().getMilliseconds();
    // const diff = ts - this.timeStamp;
    // clearTimeout(this.id);
    // this.id = setTimeout(() => {
    //   const cc = connectedComponents(nodes, width / 2, height / 2);
    //   this.setState({ connectedComps: cc });
    // }, 1000);

    const newConnectedComps = connectedComps.map(c => {
      const values = c.values.map(n => {
        const on = nodes.find(tn => tn.id === n.id);
        const x = on.x;
        const y = on.y;
        return { ...n, x, y };
      });
      return { ...c, values };
    });

    this.setState({ connectedComps: newConnectedComps });

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

    const { connectedComps } = this.state;

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

    const size = d3
      .scaleLinear()
      .domain([0, 400])
      .range([40, 0.001])
      .clamp(true);

    const Hulls = connectedComps.map(({ id, key, values }) => (
      <Cluster data={values} id={id} colorScale={colorScale} />
    ));

    const blurfactor = 1.9;
    const radius = 20;
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
        <g>{Hulls}</g>
      </svg>
    );
  }
}

export default BubbleOverlay;
