import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { difference, intersection, uniq } from 'lodash';

export const TagInput = class TagInput extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onSelect: PropTypes.func
  };
  static defaultProps = {
    data: [],
    onChange: d => d,
    onAdd: d => d,
    onRemove: d => d,
    onTagInputChange: d => d,
    onSelect: d => d
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
      onSelect
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          overflow: 'hidden',
          padding: 5
          // width: 300
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'no-wrap',
            justifyContent: 'space-between'
            // position: 'relative',
            // zIndex: 2000
            // width: 250
          }}
        >
          <input
            className="form-control"
            type="text"
            placeholder="Search by Tag"
            onSelect={onSelect}
            value={inputTag}
            onChange={event => onTagInputChange(event.target.value)}
            style={{
              position: 'relative',
              zIndex: 1000,
              background: 'transparent',
              border: 0,
              color: '#777',
              outline: 'none',
              padding: 5
              // width: 80
            }}
          />
          <button
            className="slim-btn ml-2 mr-2 pl-2 pr-2"
            type="button"
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              onAdd(inputTag);
            }}
          >
            +
          </button>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'no-wrap'
            }}
          >
            {data.map(key => (
              <span
                className="mr-2"
                style={{
                  position: 'relative',
                  zIndex: 4000,
                  fontSize: 'small',
                  fontWeight: 'bold'
                }}
                onClick={() => onRemove(key)}
              >
                <span>{key}</span>
                <span> x</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export const DropDown = class DropDown extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  static defaultProps = { style: {} };

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
    const { active, curSet, curKey, setList } = this.state;
    // const { style } = this.props;
    const drStyle = { display: active ? 'block' : 'none' };
    const isCurSetNew =
      curSet.length > 0 &&
      setList.filter(s => intersection(curSet, s).length === curSet.length)
        .length === 0;

    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          maxWidth: '50%'
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
          <button
            className="slim-btn m-2"
            onClick={() => this.setState(st => ({ active: !st.active }))}
            disabled={curSet.length === 0}
            style={{ position: 'relative', zIndex: 1000, display: 'none' }}
          >
            ▼
          </button>
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 5000,
            display: active ? 'block' : 'none'
            // border: '1px solid lightgrey'
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%'
            }}
          >
            <div
              className="dropdown-content p-2"
              style={{
                background: 'whitesmoke'
                // border: '2px solid #ccc'
                // border: '1px solid lightgrey'
              }}
            >
              {isCurSetNew && (
                <div
                  style={{
                    padding: '0.25rem',
                    pointer: 'cursor',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <div>{curSet.join(', ')}</div>
                  <button
                    className="slim-btn m-2"
                    type="button"
                    onClick={() =>
                      this.setState(({ curSet: cl, setList: oldSetList }) => ({
                        setList: [cl, ...oldSetList],
                        // curSet: [],
                        active: false
                      }))
                    }
                    style={{ position: 'relative', zIndex: 1000 }}
                  >
                    Add set
                  </button>
                </div>
              )}
              {[...setList].map(set => (
                <div
                  style={{
                    padding: '0.25rem',
                    pointer: 'cursor',
                    display: 'flex',
                    // justifyContent: 'space-around',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    onClick={() => {
                      this.setState({ curSet: set, active: false });
                    }}
                  >
                    {set.join(', ')}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: 0
                    }}
                    onClick={() => this.removeListItem(set)}
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
