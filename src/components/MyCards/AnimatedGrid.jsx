import React, { Component, PureComponent } from 'react';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';
import * as d3 from 'd3';
import VisibilitySensor from 'react-visibility-sensor';
import CardStack from 'Components/DataView/CardStack';

import './layout.scss';

class Cell extends PureComponent {
  randomNumber = Math.floor(Math.random() * 5) + 1;

  render() {
    const { id, title, expanded, onClick, style } = this.props;
    return (
      <ScrollElement name={id}>
        <div
          onClick={onClick}
          style={{
            ...style
          }}
        >
          <h2>{title}</h2>
        </div>
      </ScrollElement>
    );
  }
}

/*
        <input
          type="range"
          min="10"
          max="50"
          value={colWidth}
          onChange={e => {
            this.setState({ colWidth: e.target.value });
          }}
        />
 */

const STARTED = 'started';
const COLLECTED = 'collected';
const SUBMITTED = 'submitted';
const OPEN = 'open';

const Linx = ({ width, height, nodes, domNodes }) => {
  const makePath = (s, t) => {
    const tgt = nodes.find(e => e.id === t);
    const coords = [[s.pos, 0], [tgt.pos, height]];
    console.log('tgt', t, tgt, s, 'coords', coords);
    return <path d={d3.line()(coords)} stroke="black" fill="none" />;
  };

  const coords = Object.keys(domNodes).map(k => {
    const pos = [domNodes[k].offsetLeft, domNodes[k].offsetTop];
    return { id: k, pos };
  });

  console.log('coords', coords);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', zIndex: -1 }}
    >
      {nodes.map(s => s.children.map(c => makePath(s, c)))}
    </svg>
  );
};

const unStratify = root => {
  const stack = [root];
  let stackItem = 0;
  let current;
  let children, i, len;

  while ((current = stack[stackItem++])) {
    // get the arguments
    children = current.children || [];
    for (i = 0, len = children.length; i < len; i++) {
      stack.push(children[i]);
    }
  }
  return stack.map(e => ({
    ...e,
    children: e.children ? e.children.map(d => d.id) : []
  }));
};

export default class Grid extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // wrapGrid(this.grid, { easing: 'backOut', stagger: 5, duration: 800 });
  }

  scrollTo = (name, opts) => {
    this._scroller.scrollTo(name, opts);
  };

  state = {
    expanded: null,
    selected: null,
    colWidth: 10,
    flatNodes: [{ id: 'root', title: 'root', parent: null, depth: 0 }] // this.props.userTags.map(t => ({ id: t, title: t, depth: 0 }))
  };

  componentDidUpdate(prevProps, prevState) {
    const { selected, flatNodes } = this.state;
    const tag = flatNodes.find(d => d.id === selected) || { depth: -1 };
    const prevTag = flatNodes.find(d => d.id === prevState.selected) || {
      depth: -1
    };

    if (tag.depth > prevTag.depth) this.scrollTo(selected, { left: 0 });

    if (tag.depth < prevTag.depth) this.scrollTo(selected, { left: 1 });
  }

  dict = {};

  layout = selectedTag => {
    const newNodes = [...this.state.flatNodes, selectedTag];
    const { width } = this.props;

    const root = d3
      .stratify()
      // .id(function(d) { return d.name; })
      .parentId(d => d.parent)(newNodes);

    const partition = d3
      .partition()
      .size([200, 200])
      .padding(0)
      .round(true)(root);

    const flatNodes = unStratify(partition).map(d => ({
      ...d.data,
      ...d,
      parent: d.parent ? d.parent.id : null
    }));
    // TODO: fix check

    this.setState({
      flatNodes,
      selected: selectedTag.id
    });
  };

  render() {
    const { flatNodes, selected, expanded } = this.state;

    const nestedTags = d3
      .nest()
      .key(d => d.depth)
      .entries(flatNodes)
      .map(d => ({ ...d, depth: d.values[0].depth }));

    const selectedTag = flatNodes.find(d => d.id === selected) || {};

    // const cards = d3.range(0, 100).map(d => ({ id: d, title: d }));
    const colWidth = 25;

    const CellWrapper = e => (
      <Cell {...e} key={e.id} id={e.id} expanded={expanded === e.id} />
    );

    const gap = 80;

    const pad = 40;
    return (
      <div
        className="content-block"
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '0 0 100%'
          // height: '100%',
          // overflow: 'scroll'
        }}
      >
        <div>BreadCrumbs</div>
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              ref={el => (this.grid = el)}
              style={{ flex: '0 0 100%', display: 'flex', overflow: 'scroll' }}
            >
              {nestedTags.map(d => (
                <React.Fragment>
                  <div
                    key={d.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      flex: '0 0 50%',
                      overflow: 'scroll'
                      // height: 1000,
                      // height: 200,
                      // margin: 1,
                      // marginBottom: 70,
                      // overflow: 'scroll'
                      // justifyContent: 'center'
                    }}
                  >
                    {d.values.map(e => (
                      <div
                        ref={r => (this.dict[e.id] = r)}
                        onClick={() =>
                          this.setState({
                            selected: selected !== e.id ? e.id : null
                          })
                        }
                        style={{
                          // height: 200,
                          transition: 'all 500ms',
                          flex: `1 1 ${selected === e.id ? '500px' : 'auto'}`,
                          minHeight: 200,
                          transition: 'all 1s',
                          // TODO: fix later
                          background: selected === e.id ? 'gold' : null,
                          border: 'grey 2px solid',
                          // display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <CellWrapper {...e.data} />
                        {selectedTag.id === e.id && (
                          <div
                            style={{
                              margin: 5,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end'
                              // height: '100%'
                              // width: 200,
                              // height: 200
                            }}
                          >
                            <div
                              style={{
                                border: '1px solid black'
                              }}
                              onClick={() =>
                                this.layout({
                                  id: `${flatNodes.length + 1}`,
                                  title: flatNodes.length + 1,
                                  depth: d.depth,
                                  parent: selected
                                })
                              }
                            >
                              Add Children
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }
}
