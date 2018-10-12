import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChevronsUp, ChevronsDown, X, ArrowRight } from 'react-feather';

import Tree from 'Components/DataView/Tree';

import RelatedTags from './RelatedTags';

import { PreviewTags } from 'Components/utils/Tag';

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
  textOverflow: 'ellipsis'
};

const Tag = ({ children, className }) => (
  <div className={`p-2 bg-grey ${className}`}>{children}</div>
);

const CardButton = ({ onClick, children }) => (
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

const BreadCrumbs = ({ values }) => <div>{values.map(d => <div>te</div>)}</div>;

BreadCrumbs.defaultProps = { values: [] };

const Tags = ({ values }) => (
  <div className="flex">{values.map(v => <Tag className="m-1">{v}</Tag>)}</div>
);

Tags.defaultProps = { values: [] };

class TabMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    selectedCard: null
  };

  state = { extended: false, selectedTab: RELATED_TAGS };

  flexStyle = () => {
    const { selectedCard } = this.props;
    const { extended } = this.state;
    const selected = selectedCard !== null;

    if (extended) {
      return '1 0 98%';
    }
    return selected ? '0 1 30%' : '0 1 10%';
  };

  render() {
    const {
      className,
      style,
      nestedTags,
      selectedCard,
      onHeaderClick,
      selectedTags,
      relatedTags
    } = this.props;

    const { extended, selectedTab } = this.state;

    const selectedTagLabels = selectedTags.map(d => d.tag);
    const relatedTagLabels = relatedTags.map(d => d.tag);

    const compSwitch = () => {
      if (extended) {
        switch (selectedTab) {
          case RELATED_TAGS:
            return (
              <RelatedTags
                className="w-full h-full"
                selectedCard={selectedCard}
                nestedTags={relatedTags}
              />
            );
          case HIERARCHY_CARDS:
            return <Tree className="h-full" />;
          default:
            return null;
        }
      }

      if (selectedCard !== null) {
        switch (selectedTab) {
          case RELATED_TAGS:
            return (
              <div className="flex items-center">
                <Tags className="w-full h-full" values={selectedTagLabels} />
                <ArrowRight />
                <div className="flex">
                  {relatedTagLabels.length === 0 ? 'No connections' : null}
                  <Tags className="w-full h-full" values={relatedTagLabels} />
                </div>
              </div>
            );
          case HIERARCHY_CARDS:
            return <BreadCrumbs className="h-full" />;
          default:
            return null;
        }
      }
      return null;
    };
    return (
      <div
        className={`${className} `}
        style={{
          // position: 'absolute',
          // width: '100%',
          width: '100%',
          // TODO
          flex: this.flexStyle(),
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
        <div className="h-full flex flex-col bg-grey-lighter p-2">
          <div className="flex justify-between pb-2">
            <Nav
              className="flex"
              keys={[RELATED_TAGS, HIERARCHY_CARDS]}
              onChange={selected => this.setState({ selectedTab: selected })}
            />
            {selectedCard !== null ? (
              <CardButton onClick={onHeaderClick}>
                {selectedCard.title}
              </CardButton>
            ) : (
              <div className="flex items-center">No selected Card</div>
            )}
            <button
              className="btn flex align-center"
              onClick={() => this.setState({ extended: !extended })}
            >
              {extended ? <ChevronsDown /> : <ChevronsUp />}
            </button>
          </div>
          <div className="flex-grow relative ">{compSwitch(selectedTab)}</div>
        </div>
      </div>
    );
  }
}

export default TabMenu;
