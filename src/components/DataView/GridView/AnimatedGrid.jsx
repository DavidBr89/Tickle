import React, { Component, PureComponent } from 'react';
import { wrapGrid } from 'animate-css-grid';

import PreviewCard from 'Components/cards/PreviewCard';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';
import * as d3 from 'd3';
import VisibilitySensor from 'react-visibility-sensor';

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
            border: 'blue 2px solid',
            display: 'flex',
            justifyContent: 'center',
            ...style
          }}
        >
          {title}{' '}
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
export default class Grid extends Component {
  componentDidMount() {
    // will automatically clean itself up when dom node is removed
    // wrapGrid(this.grid, { easing: 'backOut', stagger: 5, duration: 800 });
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  state = {
    expanded: null,
    selected: null,
    colWidth: 10,
    tags: this.props.userTags.map(t => ({ id: t, title: t, level: 0 }))
  };

  componentDidUpdate(prevProps, prevState) {
    const { expanded } = this.state;
    if (prevState.expanded !== expanded) this.scrollTo(expanded);
  }

  render() {
    const { userTags } = this.props;
    const { tags } = this.state;
    const cards = d3.range(0, 100).map(d => ({ id: d, title: d }));
    const { expanded, selected } = this.state;
    const colWidth = 25;

    const nestedTags = d3
      .nest()
      .key(d => d.level)
      .entries(tags)
      .map(d => ({ ...d, level: d.values[0].level }));

    console.log('nestedTags', userTags, nestedTags);

    const selectedTag = tags.find(t => t.id === selected) || { level: -1 };
    console.log('nestedTags', nestedTags);

    const CellWrapper = e => (
      <Cell
        {...e}
        key={e.id}
        id={e.id}
        expanded={expanded === e.id}
        onClick={() =>
          this.setState({ selected: selected !== e.id ? e.id : null })
        }
      />
    );

    const addTag = t => this.setState(st => ({ tags: [...st.tags, t] }));

    const calcSize = ({ length, level, selLevel }) => {
      if (length) return 50;
      return 100 / (length + (selectedTag.level + 1 === selLevel ? 1 : 0));
    };

    return (
      <div
        className="content-block"
        style={{
          height: '100%',
          overflow: 'scroll'
        }}
      >
        <select>
          <option value={STARTED}>{STARTED}</option>
          <option value={COLLECTED}>{COLLECTED}</option>
          <option value={SUBMITTED}>{SUBMITTED}</option>
          <option value={OPEN}>{OPEN}</option>
        </select>
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div>
            <div ref={el => (this.grid = el)}>
              {nestedTags.map(d => (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  {d.values.map(e => (
                    <CellWrapper
                      {...e}
                      style={{
                        overflow: 'hidden',
                        margin: 5,
                        flex: `0 1 ${calcSize({
                          length: d.values.length,
                          level: d.level,
                          selLevel: selectedTag.level
                        })}%`,
                        minWidth: 0,
                        transition: 'all 1s',
                        background: selected === e.id ? 'gold' : null
                      }}
                    />
                  ))}
                  {selectedTag.level + 1 === d.level && (
                    <div
                      style={{
                        margin: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        border: '1px green dashed',
                        flex: '1 0 50%'
                      }}
                      onClick={() =>
                        addTag({
                          id: Math.random(),
                          title: 'test',
                          level: d.level,
                          parent: null
                        })
                      }
                    >
                      Add Node
                    </div>
                  )}
                </div>
              ))}
              {selectedTag.level + 1 === nestedTags.length && (
                <div
                  onClick={() =>
                    addTag({
                      id: Math.random(),
                      title: 'test',
                      level: nestedTags.length,
                      parent: selected
                    })
                  }
                  style={{ width: '50%' }}
                >
                  Plus
                </div>
              )}
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }
}
