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
    placeholder: 'Search by tags'
  };

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
      placeholder
    } = this.props;

    const firstData = data.slice(0, 5);
    const secData = data.slice(5);
    return (
      <div style={style}>
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
              event.preventDefault();
              onAdd(inputTag);
            }}
          >
            <input
              className="form-control"
              type="text"
              placeholder={placeholder}
              onSelect={onSelect}
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
          <div style={{ marginLeft: 'auto' }}>
            <button
              className={`${css(stylesheet.bareBtn)} ml-2 mr-2 pl-2 pr-2`}
              type="button"
              style={{ fontWeight: 'bold' }}
              onClick={() => {
                onAdd(inputTag);
              }}
            >
              +
            </button>
          </div>
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
        <Hits
          data={vocabulary.filter(
            t => inputTag && t.toLowerCase().includes(inputTag.toLowerCase())
          )}
          onAdd={onAdd}
        />
      </div>
    );
  }
};

const Hits = ({ data, text, onAdd }) => (
  <div
    style={{
      width: '100%',
      background: 'white',
      position: 'absolute',
      zIndex: 20000,
      borderLeft: rawCSS.border,
      borderRight: rawCSS.border,
      borderBottom: rawCSS.border
    }}
  >
    {data.length > 0 && (
      <div className="mt-3">
        {data.map(d => (
          <div className="mb-2">
            <button
              className={css(stylesheet.bareBtn)}
              onClick={() => onAdd(d)}
            >
              {d}
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

  state = { active: false, curSet: this.props.data, setList: [] };

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
    const { active, curSet, curKey, setList } = this.state;

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
