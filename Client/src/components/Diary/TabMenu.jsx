import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ChevronsUp, ChevronsDown, X, ArrowRight} from 'react-feather';

import CardTree from 'Components/CardTreeView';

import {PreviewTags} from 'Components/utils/Tag';
import RelatedTags from './RelatedTags';

const RELATED_TAGS = 'Related Tags';
const HIERARCHY_CARDS = 'Hierarchy';

const tagStyle = {
  paddingLeft: 8,
  paddingRight: 8,
  textAlign: 'center',
  marginRight: 2,
  marginTop: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const treeData = {
  id: 'Top Level',
  children: [
    {
      id: 'Level 2: A',
      children: [
        {id: 'Son of A', children: []},
        {id: 'Daughter of A', children: []},
      ],
    },
    {
      id: 'Daughter of A',
      children: [{id: 'lisa', children: []}, {id: 'gisela', children: []}],
    },
    {
      id: 'Son of A',
      children: [{id: 'jan', children: []}, {id: 'nils', children: []}],
    },
    {id: 'Daughter of A', children: []},
    {
      id: 'Level 2: B',
      children: [
        {id: 'Son of A', children: []},
        {id: 'Daughter of A', children: []},
      ],
    },
  ],
};

const Tag = ({children, className}) => (
  <div className={`p-2 bg-grey ${className}`}>{children}</div>
);

const CardButton = ({onClick, children}) => (
  <button className="bare-btn flex items-center" onClick={onClick}>
    <div>{children}</div>
    <div className="ml-1 rounded-full bg-white flex items-center justify-center">
      <X />
    </div>
  </button>
);

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    keys: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    onChange: d => d,
    keys: [],
    style: {},
  };

  state = {selected: this.props.keys.length > 0 ? this.props.keys[0] : null};

  componentDidUpdate(prevProps, prevState) {
    const {selected} = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  render() {
    const {keys, className, style} = this.props;
    const {selected} = this.state;
    return (
      <div className={className} style={style}>
        {keys.map(k => (
          <button
            className={`btn m-1 ${selected === k ? 'btn-black' : null}`}
            onClick={() => this.setState({selected: k})}>
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
    className: PropTypes.string,
  };

  static defaultProps = {
    selectedCard: null,
  };

  state = {extended: false, selectedTab: RELATED_TAGS};

  render() {
    const {
      className,
      style,
      nestedTags,
      selectedCard,
      onHeaderClick,
      selectedTags,
      relatedTags,
      extended,
      onToggle,
    } = this.props;

    const {selectedTab} = this.state;

    const selectedTagLabels = selectedTags.map(d => d.tag);
    const relatedTagLabels = relatedTags.map(d => d.tag);

    const tabComp = (() => {
      switch (selectedTab) {
        case RELATED_TAGS:
          return (
            <RelatedTags selectedCard={selectedCard} nestedTags={relatedTags} />
          );
        case HIERARCHY_CARDS:
          return <CardTree className="m-2 overflow-y-auto" {...treeData} />;
        default:
          return null;
      }
    })();
    return (
      <div
        className={className}
        style={{
          ...style,
        }}>
        <div className="flex-no-shrink flex justify-between pb-2">
          <Nav
            className="flex"
            keys={[RELATED_TAGS, HIERARCHY_CARDS]}
            onChange={selected => this.setState({selectedTab: selected})}
          />
          <button className="btn flex align-center" onClick={onToggle}>
            {extended ? <ChevronsDown /> : <ChevronsUp />}
          </button>
        </div>
        <div className="relative flex-grow overflow-y-auto">
          <div className="absolute w-full h-full">{tabComp}</div>
        </div>
      </div>
    );
  }
}

export default TabMenu;
