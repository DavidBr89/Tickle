import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { difference, intersection, uniq } from 'lodash';

import { stylesheet, rawCSS } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';

const TagSelection = ({ data, style, onRemove }) => (
  <div style={style}>
    {data.map(key => (
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
);

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

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;

    if (data.length !== prevProps.data.length) {
      this.props.onBlur();
      this.input.blur();
    }
  }
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
      matchesVisible,
      height,
      editable,
      onBlur
    } = this.props;

    const slicedData = !editable ? data.slice(0, 5) : data;

    const tagMatches = vocabulary
      .filter(d => !slicedData.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase())
      );

    return (
      <div
        onMouseDown={e => {
          // TODO: important
          matchesVisible && e.preventDefault();
          // e.stopPropagation();
        }}
      >
        {editable && (
          <div style={{ minHeight: 50 }}>
            {slicedData.length === 0 && (
              <div className="alert-warning p-2 mb-1">
                <strong>No Tag added!</strong>
              </div>
            )}
            <TagSelection
              style={{
                display: 'flex',
                // alignItems: 'center',
                flexWrap: 'wrap'
                // minHeight: 200
              }}
              data={slicedData}
              onRemove={onRemove}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            // alignItems: 'center',
            backgroundColor: '#fff',
            overflow: 'hidden',
            padding: 5,
            width: '100%',
            ...style
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
              ref={input => (this.input = input)}
              onBlur={onBlur}
              onSelect={onSelect}
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
            {editable &&
              slicedData.length === 0 && (
              <button
                className={css(stylesheet.btn)}
                onClick={() => onAdd(inputTag)}
              >
                  Add
              </button>
            )}
          </form>
          {!editable && (
            <TagSelection
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'no-wrap'
              }}
              data={slicedData}
              onRemove={onRemove}
            />
          )}
        </div>
        <SearchResults
          visible={matchesVisible}
          height={height}
          data={tagMatches}
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
              style={
                {
                  // TODO: later bar charts
                  // width: 175
                }
              }
              className={css(stylesheet.bareBtn)}
              onClick={() => onAdd(d.key)}
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
    className: PropTypes.string,
    onInputSelect: PropTypes.oneOf([null, PropTypes.func])
  };
  static defaultProps = { style: {}, vocabulary: [] };

  state = {
    active: false,
    curSet: this.props.data,
    setList: [],
    matchesVisible: false,
    editable: false,
    onInputSelect: null
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
    const { style, editable } = this.props;
    const { active, curSet, curKey, setList, matchesVisible } = this.state;

    // const isCurSetNew =
    //   curSet.length > 0 &&
    //   setList.filter(s => intersection(curSet, s).length === curSet.length)
    //     .length === 0;

    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          // maxWidth: '60%',
          position: 'relative',
          ...style
          // border: '2px solid #ccc'
        }}
      >
        <TagInput
          {...this.props}
          onBlur={() => this.setState({ matchesVisible: false })}
          onSelect={() => {
            const { onInputSelect } = this.props;
            this.setState({ matchesVisible: true });
            if (onInputSelect) {
              onInputSelect();
            }
          }}
          style={{
            border: '1px solid lightgrey'
          }}
          data={curSet}
          matchesVisible={matchesVisible}
          editable={editable}
          onTagInputChange={key => this.setState({ curKey: key })}
          inputTag={curKey}
          onAdd={k => {
            if (k && k !== '') {
              this.setState(({ curSet: oldSet }) => ({
                curSet: uniq([k, ...oldSet]),
                curKey: ''
                // matchesVisible: false
              }));
            }
          }}
          onRemove={k => {
            this.setState(({ curSet: oldSet }) => ({
              curSet: oldSet.filter(key => key !== k)
              // matchesVisible: false
            }));
          }}
        />
      </div>
    );
  }
};
