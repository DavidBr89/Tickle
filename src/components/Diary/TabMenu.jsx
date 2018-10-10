import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChevronsUp, ChevronsDown } from 'react-feather';

import Tree from 'Components/DataView/Tree';

import RelatedTags from './RelatedTags';

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

  state = { extended: false, selectedTab: RELATED_CARDS };

  render() {
    const { className, style, nestedTags, children } = this.props;
    const { extended, selectedTab } = this.state;
    const compSwitch = () => {
      switch (selectedTab) {
        case RELATED_CARDS:
          return <RelatedTags className="w-full h-full" nestedTags={nestedTags} />;
        case HIERARCHY_CARDS:
          return <Tree className="h-full" />;
        default:
          return null;
      }
    };
    return (
      <div
        className={`${className} `}
        style={{
          // position: 'absolute',
          // width: '100%',
          width: '100%',
          flex: extended ? '1 0 98%' : '1 1 20%',
          // height: '100%', // extended ? '100%' : '0%',
          zIndex: 1000000,
          transition: 'flex 400ms, top 400ms, translate 400ms',
          // transform: extended ? 'translateY(0%)' : 'translateY(-100%)',
          // position: 'absolute',
          // top: extended ? '0%' : '100%',
          ...style
          // display: cardSelected ? 'block' : 'none'
        }}
      >
        <div className="h-full flex flex-col bg-grey-lighter">
          <div className="flex justify-between">
            <Nav
              keys={[RELATED_CARDS, HIERARCHY_CARDS]}
              onChange={selected => this.setState({ selectedTab: selected })}
            />
            <button
              className="btn"
              onClick={() => this.setState({ extended: !extended })}
            >
              {extended ? <ChevronsDown /> : <ChevronsUp />}
            </button>
          </div>
          <div className="flex-grow relative">{compSwitch(selectedTab)}</div>
        </div>
      </div>
    );
  }
}

export default TabMenu;
