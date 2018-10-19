import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { difference, intersection, uniq } from 'lodash';

const TagSelection = ({ data, style, onRemove }) => (
  <div style={style}>
    {data.map(key => (
      <button
        className="tag-btn m-1"
        style={{
          position: 'relative',
          maxWidth: 140,
          // zIndex: 4000,
          fontSize: 'small',
          fontWeight: 'bold',
          display: 'inline-flex'
        }}
        onClick={() => onRemove(key)}
      >
        <span className="mr-1 truncate-text">{key}</span>
        <span>x</span>
      </button>
    ))}
  </div>
);

export const EditTagInput = class EditTagInput extends Component {
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
    placeholder: 'Add a tag',
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
      height,
      editable,
      onBlur,
      className
    } = this.props;

    const tagMatches = vocabulary
      .filter(d => !data.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase())
      );

    return (
      <div className={`${className} flex flex-col flex-grow`}>
        <div
          className="border p-1 mb-1 overflow-scroll"
          style={{ flex: '0 0 100px', overflow: 'scroll' }}
        >
          {data.length === 0 && (
            <div className="alert-warning p-2 mb-1">
              <strong>Please add a tag!</strong>
            </div>
          )}
          <TagSelection
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
            data={data}
            onRemove={onRemove}
          />
        </div>
        <form
          className="flex mb-1"
          onSubmit={event => {
            event.preventDefault();
            onAdd(inputTag);
          }}
        >
          <input
            className="border form-control flex-grow"
            ref={input => (this.input = input)}
            onBlur={onBlur}
            onSelect={onSelect}
            type="text"
            placeholder={placeholder}
            value={inputTag}
            onChange={event => onTagInputChange(event.target.value)}
          />
          <button className="btn" style={{}} onClick={() => onAdd(inputTag)}>
            Add
          </button>
        </form>
        <SearchResults
          className="flex-grow"
          visible
          data={tagMatches}
          onAdd={onAdd}
        />
      </div>
    );
  }
};

export const ReadTagInput = class ReadTagInput extends Component {
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
      inputTag,
      onSelect,
      vocabulary,
      placeholder,
      matchesVisible,
      height,
      onBlur,
      className,
      style
    } = this.props;

    const slicedData = data.slice(0, 5);

    const tagMatches = vocabulary
      .filter(d => !slicedData.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase())
      );

    return (
      <div
        className={className}
        style={style}
        onMouseDown={e => {
          // TODO: important
          matchesVisible && e.preventDefault();
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
          </form>
          <TagSelection
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'no-wrap'
            }}
            data={slicedData}
            onRemove={onRemove}
          />
        </div>
        <SearchResults
          visible={matchesVisible}
          height={height}
          data={tagMatches}
          onAdd={onAdd}
          style={{ position: 'absolute' }}
        />
      </div>
    );
  }
};

const SearchResults = ({
  data,
  text,
  onAdd,
  visible,
  height,
  className,
  style
}) => (
  <div
    className={`border ${className}`}
    style={{
      display: !visible && 'none',
      width: '100%',
      maxHeight: height,
      background: 'white',
      // position: 'absolute',
      overflow: 'scroll',
      zIndex: 20000,
      ...style
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
              className="bare-btn"
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

export const TagDropDown = class TagDropDown extends Component {
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

    const TagInput = editable ? EditTagInput : ReadTagInput;

    return (
      <TagInput
        {...this.props}
        className="relative border"
        style={{
          flex: matchesVisible ? '0 0 70%' : null,
          transition: 'all 0.4s'
        }}
        onBlur={() => this.setState({ matchesVisible: false })}
        onSelect={() => {
          const { onInputSelect } = this.props;
          this.setState({ matchesVisible: true });
          // TODO
          if (onInputSelect) {
            onInputSelect();
          }
        }}
        data={curSet}
        matchesVisible={matchesVisible}
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
    );
  }
};
