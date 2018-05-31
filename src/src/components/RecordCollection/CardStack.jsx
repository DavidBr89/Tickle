import React from 'react';
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import _ from 'lodash';
// import $ from 'jquery';

import TagCloud from '../Bookmarks/TagCloud';

import { CardMini } from './Card';
// import d3Sketchy from '../../lib/d3.sketchy';
// import SketchyCircle from './SketchyCircle';

import cxx from './CardStack.scss';

function delay(milliseconds) {
  return function(result) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(result);
      }, milliseconds);
    });
  };
}

// wait(100000).then(() => console.log('four', 4));

function makeTreemap({ data, width, height, padX, padY }) {
  const ratio = 4;
  const sorted = data.sort((a, b) => b.count - a.count);
  const treemap = d3
    .treemap()
    .size([width / ratio, height])
    .paddingInner(0)
    .round(true)
    .tile(d3.treemapSquarify.ratio(1));

  const size = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.count))
    .range([20, 50]);

  const first = { name: 'root', children: sorted };
  const root = d3.hierarchy(first).sum(d => size(d.count));
  treemap(root);
  if (!root.children) return [];
  root.children.forEach(d => {
    d.left = padX / 2 + Math.round(d.x0 * ratio);
    d.top = padY / 2 + Math.round(d.y0);

    d.width = Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - padX / 2;
    d.height = Math.round(d.y1) - Math.round(d.y0) - padY / 2;
  });

  return root.children;
  // const padY = 10;
  // const padX = 20;
}

// function link(d) {
//   return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d
//     .source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d
//     .target.x}`;
// }

// function diagonal(d) {
//   return `M ${d.source.x} ${d.source.y}
//             C ${(d.source.x + d.target.x) / 2} ${d.source.y},
//               ${(d.source.x + d.target.x) / 2} ${d.target.y},
//               ${d.target.x} ${d.target.y}`;
// }
const drawPath = d3.line().curve(d3.curveStepAfter);

// function getData(rawData) {
//   const data = rawData.map((d, i) => {
//     d.tags = d.cxx || [];
//     d.key = i;
//     d.id = i;
//     return d;
//   });
//   const len = data.length;
//   return {
//     data0: data.slice(0, len / 2),
//     data1: data.slice(len / 2),
//     focussedframe: null
//   };
// }

// function pseries(list) {
//   const p = Promise.resolve();
//   return list.reduce((pacc, fn) => (pacc = pacc.then(wait(1000)).then(fn)), p);
// }

function resetState({ tags, firstItems, secItems }) {
  return {
    tags: tags.map(d => {
      d.hover = false;
      return d;
    }),
    firstItems: firstItems.map(d => {
      d.highlighted = true;
      d.hovered = false;
      return d;
    }),
    secItems: secItems.map(d => {
      d.highlighted = true;
      d.hovered = false;
      return d;
    })
  };
}

function aggregateByTags(data) {
  const spreadData = _.flatten(
    data.map(d =>
      d.tags.map(t => {
        const copy = _.cloneDeep(d);
        copy.key = t;
        return copy;
      })
    )
  );
  return d3
    .nest()
    .key(d => d.key)
    .entries(spreadData)
    .map(d => {
      d.count = d.values.length;
      return d;
    });
}

const Frame = ({
  highlighted,
  hovered,
  position,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  children
}) => (
  <div
    style={{
      opacity: highlighted ? 1 : 0.1,
      pointerEvents: 'auto',
      position: 'absolute',
      zIndex: hovered ? 1000 : null,
      transition: `0.2s left, 0.2s background-position, 0.1s border-color, 0.2s opacity, 0.5s transform`,
      transform: hovered ? 'scale(1.2)' : null,

      ...position
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

Frame.propTypes = {
  position: PropTypes.string,
  // hoverHandler: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  highlighted: PropTypes.bool,
  hovered: PropTypes.bool
  // index: PropTypes.number.isRequired
};

Frame.defaultProps = {
  hovered: false,
  position: null,
  pos: 0,
  highlighted: false,
  children: <CardMini />
};

function layout({ index = null, data, frameOffset, width }) {
  console.log('indx', index);
  const scale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width - frameOffset / 2]);

  if (index === null || index < 0) {
    return data.map((c, i) => ({ ...c, hovered: false, pos: scale(i) }));
  }

  const xFirstLeft = d3
    .scaleLinear()
    .domain([0, index - 1])
    .range([0, d3.max([scale(index) - frameOffset / 2, 0])]);

  const xFirstRight = d3
    .scaleLinear()
    .domain([index + 1, data.length - 1])
    .range([
      d3.min([scale(index) + frameOffset / 2, width - frameOffset / 2]),
      width - frameOffset / 2
    ]);

  return data.map((c, i) => {
    if (index < i) {
      return { ...c, hovered: false, pos: xFirstRight(i) };
    }
    if (index > i) {
      return { ...c, hovered: false, pos: xFirstLeft(i) };
    }
    if (index === i) {
      c.hovered = true;
      c.pos = scale(i);
      return { ...c, hovered: true, pos: scale(i) };
    }
    return c;
  });
}

function init({ data, frameOffset, width }) {
  const firstItems = layout({
    data: data.slice(0, data.length / 2),
    frameOffset,
    width
  }).map(d => {
    d.first = true;
    d.highlighted = true;
    return d;
  });
  const secItems = layout({
    data: data.slice(data.length / 2),
    frameOffset,
    width
  }).map(d => {
    d.first = false;
    d.highlighted = true;
    return d;
  });
  return { firstItems, secItems };
}

class Stack extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array.isRequired,
    frameOffset: PropTypes.number,
    cardWidth: PropTypes.number
  };
  static defaultProps = {
    width: 800,
    height: 600,
    cardWidth: 150,
    cardHeight: 150,
    frameOffset: 200,
    offsetY: 20
  };

  constructor(props) {
    super(props);

    const { data: [], width, height, cardWidth, cardHeight, pad, data } = props;

    this.enterTag = ::this.enterTag;

    this.leaveTag = ::this.leaveTag;
    this.hoverHandler = ::this.hoverHandler;
    this.labels = {};

    const tags = aggregateByTags(data).map(d => {
      // TODO: check;
      d.r = 25 + d.values.length;
      d.width = d.r * 2;
      d.height = d.r * 2;
      d.highlighted = false;
      d.x = (width - d.r) / 2;
      d.y = height / 2;
      return d;
    });

    // console.log('tags', tags);
    // const fontScale = d3
    //   .scaleLinear()
    //   .domain([1, d3.max(tags, d => d.values.length)])
    //   .range([15, 25]);

    const { firstItems, secItems } = init({
      data,
      frameOffset: 2 * cardWidth,
      width
    });
    const cloudHeight = height - 2 * cardHeight - 2 * pad;
    const treemapData = makeTreemap({
      data: tags,
      width,
      height: cloudHeight,
      padX: 20,
      padY: 20
    });

    this.state = {
      firstItems,
      secItems,
      tags,
      fontScale: d3.scaleLinear(),
      focussedFrame: null,
      treemapData,
      cloudHeight
    };
  }

  hoverHandler(focussedFrame) {
    const { data, cardWidth, width } = this.props;
    const { treemapData: oldTreemapData } = this.state;
    const frameOffset = cardWidth * 2;

    const highlight = d => {
      d.highlighted = _.intersection(d.tags, focussedFrame.tags).length > 0;
      return d;
    };

    if (focussedFrame === null) {
      const treemapData = oldTreemapData.map(t => {
        t.highlighted = false;
        return t;
      });
      this.setState({ ...init({ data, frameOffset, width }), treemapData });
      return;
    }
    //
    // const treemapData = oldTreemapData.map(t => {
    //   t.highlighted = focussedFrame.tags.includes(t.data.key);
    //   return t;
    // });

    const treemapData = oldTreemapData.map(t => {
      t.highlighted = focussedFrame.tags.includes(t.data.key);
      return t;
    });

    const index = data.findIndex(d => d.uri === focussedFrame.uri);
    const dataUp = data.slice(0, data.length / 2);
    const dataBottom = data.slice(data.length / 2);
    console.log('index', index, focussedFrame.uri);

    if (index < data.length / 2 - 1) {
      // console.log('i up', index);
      const firstItems = layout({
        data: dataUp,
        index: dataUp.findIndex(d => d.uri === focussedFrame.uri),
        frameOffset,
        width
      }).map(highlight);
      const secItems = this.state.secItems.map(highlight);
      this.setState({ firstItems, secItems, treemapData });
    } else {
      // console.log('i bottom', index);
      const secItems = layout({
        data: dataBottom,
        index: dataBottom.findIndex(d => d.uri === focussedFrame.uri),
        frameOffset,
        width
      }).map(highlight);
      const firstItems = this.state.firstItems.map(highlight);
      this.setState({ firstItems, secItems, treemapData });
    }
  }
  // shouldComponentUpdate() {
  //   return false;
  // }

  enterTag(key) {
    if (key === null) this.setState(resetState);

    const { tags, firstItems, secItems } = resetState(this.state);

    const clonedTags = _.cloneDeep(tags).map(d => {
      d.hover = d.key === key;
      return d;
    });
    const highlight = d => {
      d.highlighted = d.tags.includes(key);
      return d;
    };
    const updFirstItems = firstItems.map(highlight);
    const updSecItems = secItems.map(highlight);

    this.setState({
      tags: clonedTags,
      firstItems: updFirstItems,
      secItems: updSecItems
    });
  }

  leaveTag() {
    this.setState(resetState);
  }

  render() {
    const { cardHeight, cardWidth, width, height, pad, offsetY } = this.props;

    const { tags, firstItems, links, secItems, treemapData } = this.state;

    const StackOne = firstItems.map((ch, i) => (
      <Frame
        {...ch}
        z={firstItems.length - i}
        position={{ left: ch.pos }}
        onMouseEnter={() => {
          this.hoverHandler(null);
          this.hoverHandler(ch);
        }}
        onMouseLeave={() => this.hoverHandler(null)}
      >
        <CardMini
          width={cardWidth}
          height={cardHeight}
          img={ch.thumb}
          {...ch}
        />
      </Frame>
    ));

    const StackTwo = secItems.map((ch, i) => (
      <Frame
        {...ch}
        z={secItems.length - i}
        position={{ left: ch.pos }}
        onMouseEnter={() => this.hoverHandler(ch)}
        onMouseLeave={() => this.hoverHandler(null)}
      >
        <CardMini
          width={cardWidth}
          height={cardHeight}
          img={ch.thumb}
          {...ch}
        />
      </Frame>
    ));

    // const { width, height } = this.props;
    const stackDim = { height: cardHeight };

    const cloudHeight = height - 2 * cardHeight - 2 * pad;
    const tagCloudStyle = {
      position: 'relative',
      height: `${cloudHeight}px`,
      marginBottom: `${pad}px`,
      marginTop: `${pad}px`
    };

    const linksTop = _.flatten(
      firstItems.map(c => {
        const targets = treemapData.filter(t => c.tags.includes(t.data.key));
        const l = targets.map(t => ({
          order: c.first,
          source: c,
          target: t
        }));
        return l;
      })
    );
    const PathsTop = linksTop.map(d => {
      const source = {
        x: d.source.pos + cardWidth / 2,
        y: cardHeight
      };
      const cp = [source.x, source.y + offsetY];
      const target = [
        d.target.left + d.target.width / 2,
        cardHeight + pad + d.target.top
      ];
      return (
        <path
          className={cxx.link}
          d={drawPath([[source.x, source.y], cp, target])}
        />
      );
    });
    const linksBottom = _.flatten(
      secItems.map(c => {
        const targets = treemapData.filter(t => c.tags.includes(t.data.key));
        const l = targets.map(t => ({
          order: c.first,
          source: c,
          target: t
        }));
        return l;
      })
    );
    const PathsBottom = linksBottom.map(d => {
      const source = {
        x: d.source.pos + cardWidth / 2,
        y: height - cardHeight
      };
      const cp = [source.x, source.y - offsetY];
      const target = [
        d.target.left + d.target.width / 2,
        cardHeight + pad + d.target.top + d.target.height
      ];
      return (
        <path
          className={cxx.link}
          d={drawPath([[source.x, source.y], cp, target])}
        />
      );
    });

    return (
      <div style={{ position: 'relative' }}>
        <svg
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            // zIndex: 300,
            left: 0,
            top: 0
          }}
        >
          <defs />
          <g>{PathsTop}</g>
          <g>{PathsBottom}</g>
        </svg>
        <div style={stackDim}>{StackOne}</div>
        <div style={tagCloudStyle}>
          <TagCloud
            data={treemapData}
            width={width}
            height={cloudHeight}
            padX={0}
            padY={0}
            onHover={this.enterTag}
          />
        </div>
        <div style={stackDim}>
          <ul className={`row ${cxx.stack}`}>{StackTwo}</ul>
        </div>
      </div>
    );
  }

  // <text
  //   textAnchor="middle"
  //   stroke="#51c5cf"
  //   strokeWidth="1px"
  //   dy=".3em"
  //   style={{ fontSize: '15px', stroke: 'black' }}
  // >
  //   {t.key}
  // </text>
}

Stack.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cardWidth: PropTypes.number,
  cardHeight: PropTypes.number,
  secCluster: PropTypes.array,
  frameOffset: PropTypes.number
};

Stack.defaultProps = {
  firstCluster: [],
  secCluster: [],
  focussedFrame: null,
  width: 800,
  height: 600,
  cardWidth: 150,
  cardHeight: 150,
  frameOffset: 200,
  markerHeight: 6,
  markerWidth: 0,
  offsetY: 20
};

export default Stack;
