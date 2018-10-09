import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChevronsUp } from 'react-feather';

import TabNav from 'Utils/TabNav';

import Tree from 'Components/DataView/Tree';

const RELATED_CARDS = 'Related Cards';
const HIERARCHY_CARDS = 'Hierarchy';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    keys: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    onChange: d => d,
    keys: [],
    style: {}
  };

  state = { selected: this.props.keys.length > 0 ? this.props.keys[0] : null };

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  render() {
    const { keys, className, style } = this.props;
    const { selected } = this.state;
    return (
      <div className={className} style={style}>
        {keys.map(k => (
          <button
            className={`btn m-1 ${selected === k ? 'btn-black' : null}`}
            onClick={() => this.setState({ selected: k })}
          >
            {k}
          </button>
        ))}
      </div>
    );
  }
}

class TabMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { extended: false };

  render() {
    const { className, style, children } = this.props;
    const { extended } = this.state;
    return (
      <div
        className="flex p-3 "
        style={{
          // position: 'absolute',
          // width: '100%',
          width: '100%',
          height: '100%', // extended ? '100%' : '0%',
          zIndex: 1000000,
          transition: 'top 400ms, translate 400ms',
          // transform: extended ? 'translateY(0%)' : 'translateY(-100%)',
          position: 'absolute',
          top: extended ? '0%' : '100%',
          ...style
          // display: cardSelected ? 'block' : 'none'
        }}
      >
        <div
          className="flex flex-col bg-grey-lighter overflow-hidden"
          style={{
            flex: '0 1 100%'
          }}
        >
          <div className="flex justify-between">
            <Nav
              keys={[RELATED_CARDS, HIERARCHY_CARDS]}
              onChange={selected => this.setState({ selectedTab: selected })}
            />
            <button
              className="btn"
              onClick={() => this.setState({ extended: !extended })}
            >
              <ChevronsUp />
            </button>
          </div>
          <Tree className="flex-grow" />
        </div>
      </div>
    );
  }
}

export default TabMenu;
