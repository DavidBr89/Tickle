import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { difference, intersection, uniq } from 'lodash';

import { stylesheet, rawCSS } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';

export const TagInput = class TagInput extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    placeholder: PropTypes.string
  };
  static defaultProps = {
    data: [],
    onChange: d => d,
    onAdd: d => d,
    onRemove: d => d,
    onTagInputChange: d => d,
    onSelect: d => d,
    placeholder: 'Search by tags',
    inputTag: null
  };

  state = { showResults: false };
  render() {
    const {
      onClick,
      onAdd,
      onRemove,
      onTagInputChange,
      data,
      style,
      inputTag,
      onSelect,
      vocabulary,
      placeholder,
      showResults,
      height
    } = this.props;

    const firstData = data.slice(0, 5);
    const secData = data.slice(5);
    return (
      <div
        style={style}
        onMouseDown={e => {
          showResults && e.preventDefault();
          // e.stopPropagation();
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            // alignItems: 'center',
            backgroundColor: '#fff',
            overflow: 'hidden',
            padding: 5,
            width: '100%'
            // width: 300
          }}
        >
          <form
            style={{
              flex: '1 0 100px',
              display: 'flex',
              flexWrap: 'no-wrap',
              alignItems: 'center'
            }}
            onSubmit={event => {
              // event.preventDefault();
              // onAdd(inputTag);
            }}
          >
            <input
              className="form-control"
              type="text"
              placeholder={placeholder}
              value={inputTag}
              onChange={event => onTagInputChange(event.target.value)}
              style={{
                position: 'relative',
                // zIndex: 1000,
                background: 'transparent',
                border: 0,
                color: '#777',
                outline: 'none',
                padding: 5
                // minWidth: 40
                // width: 80
              }}
            />
          </form>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
              // flexWrap: 'no-wrap'
            }}
          >
            {firstData.map(key => (
              <button
                className={`${css(stylesheet.bareBtn)} mr-1`}
                style={{
                  position: 'relative',
                  maxWidth: 100,
                  // zIndex: 4000,
                  fontSize: 'small',
                  fontWeight: 'bold',
                  display: 'inline-flex'
                }}
                onClick={() => onRemove(key)}
              >
                <span className={`mr-1 ${css(stylesheet.truncate)}`}>
                  {key}
                </span>
                <span>x</span>
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
            // flexWrap: 'no-wrap'
          }}
        >
          {secData.map(key => (
            <button
              className={`${css(stylesheet.bareBtn)} mr-1`}
              style={{
                position: 'relative',
                maxWidth: 100,
                // zIndex: 4000,
                fontSize: 'small',
                fontWeight: 'bold',
                display: 'inline-flex'
              }}
              onClick={() => onRemove(key)}
            >
              <span className={`mr-1 ${css(stylesheet.truncate)}`}>{key}</span>
              <span>x</span>
            </button>
          ))}
        </div>
        <SearchResults
          visible={showResults}
          height={height}
          data={vocabulary.filter(
            d =>
              inputTag === null ||
              d.key.toLowerCase().includes(inputTag.toLowerCase())
          )}
          onAdd={onAdd}
        />
      </div>
    );
  }
};

const SearchResults = ({ data, text, onAdd, visible, height }) => (
  <div
    style={{
      display: !visible && 'none',
      width: '100%',
      maxHeight: height,
      background: 'white',
      position: 'absolute',
      overflow: 'scroll',
      zIndex: 20000,
      borderLeft: rawCSS.border,
      borderRight: rawCSS.border,
      borderBottom: rawCSS.border
    }}
  >
    {data.length > 0 && (
      <div
        className="mt-3"
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        {data.map(d => (
          <div className="m-2">
            <button
              style={{ width: 175 }}
              className={css(stylesheet.bareBtn)}
              onClick={() => onAdd(d.key)}
              onBlur={e => e.stopPropagation()}
            >
              {d.key} ({d.values.length})
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const DropDown = class DropDown extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  static defaultProps = { style: {}, vocabulary: [] };

  state = {
    active: false,
    curSet: this.props.data,
    setList: [],
    showResults: false
  };

  // .dropdown:hover .dropdown-content {
  //     display: block;
  // }
  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { curSet } = this.state;
    const { curSet: oldSet } = prevState;

    if (curSet.length !== oldSet.length) {
      onChange(curSet);
    }
  }

  removeListItem = set => {
    this.setState(({ setList: olList }) => ({
      setList: olList.filter(s => difference(set, s).length !== 0),
      active: false,
      curSet: []
    }));
  };

  render() {
    const { style } = this.props;
    const { active, curSet, curKey, setList, showResults } = this.state;

    // const isCurSetNew =
    //   curSet.length > 0 &&
    //   setList.filter(s => intersection(curSet, s).length === curSet.length)
    //     .length === 0;

    return (
      <div
        onBlur={() => this.setState({ showResults: false })}
        onSelect={() => this.setState({ showResults: true })}
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          // maxWidth: '60%',
          position: 'relative',
          ...style
          // border: '2px solid #ccc'
        }}
      >
        <div
          style={{
            display: 'flex',
            border: '1px solid lightgrey'
          }}
        >
          <TagInput
            {...this.props}
            style={{ width: '100%' }}
            data={curSet}
            showResults={showResults}
            onTagInputChange={key => this.setState({ curKey: key })}
            inputTag={curKey}
            onAdd={k => {
              if (k && k !== '') {
                this.setState(({ curSet: oldSet }) => ({
                  curSet: uniq([k, ...oldSet]),
                  curKey: ''
                }));
              }
            }}
            onRemove={k => {
              this.setState(({ curSet: oldSet }) => ({
                curSet: oldSet.filter(key => key !== k)
              }));
            }}
          />
        </div>
      </div>
    );
  }
};
