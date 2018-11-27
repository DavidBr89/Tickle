import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {difference, intersection, uniq} from 'lodash';

const TagSelection = ({data, style, onRemove, className}) => (
  <div style={style} className={className}>
    {data.map(key => (
      <button
        className="mr-1 relative text-sm tag-label"
        style={{
          maxWidth: 140,
          // fontWeight: 'bold',
          // display: 'inline-flex'
        }}
        onClick={() => onRemove(key)}>
        <div className="mr-1 truncate-text">{key}</div>
        <div>x</div>
      </button>
    ))}
  </div>
);

export class EditTagInput extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onChange: d => d,
    onAdd: d => d,
    onRemove: d => d,
    onTagInputChange: d => d,
    onSelect: d => d,
    placeholder: 'Add a tag',
    inputTag: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const {data} = this.props;

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
      className,
    } = this.props;

    const tagMatches = vocabulary
      .filter(d => !data.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase()),
      )
      .map(d => d.key);

    const isDisabled = key => !tagMatches.includes(key);
    return (
      <div className={`${className} flex flex-col flex-grow`}>
        <div className="w-full overflow-y-auto">
          <div className="mt-3 flex flex-wrap w-full">
            {vocabulary.map(d => (
              <div className="mr-2 mb-2">
                <button
                  type="button"
                  className={`bare-btn ${isDisabled(d.key) && 'btn-disabled'}`}
                  disabled={isDisabled(d.key)}
                  onClick={() => onAdd(d.key)}>
                  {d.key} ({d.values.length})
                </button>
              </div>
            ))}
          </div>
        </div>
        <form
          className="flex mb-2"
          onSubmit={event => {
            event.preventDefault();
            onAdd(inputTag);
          }}>
          <input
            className="form-control text-lg flex-grow"
            ref={input => (this.input = input)}
            onBlur={onBlur}
            onSelect={onSelect}
            type="text"
            placeholder={placeholder}
            value={inputTag}
            onChange={event => onTagInputChange(event.target.value)}
          />
          <button
            type="button"
            className="flex-grow ml-1 btn"
            onClick={() => onAdd(inputTag)}>
            Add
          </button>
        </form>

        <div className="border p-1 overflow-y-auto" style={{flex: '0 0 100px'}}>
          {data.length === 0 && (
            <div className="alert-warning p-2 mb-1 font-bold text-xl">
              No Tags added!
            </div>
          )}
          <TagSelection
            className="flex flex-wrap"
            data={data}
            onRemove={onRemove}
          />
        </div>
      </div>
    );
  }
}

export const EditOneTagInput = class ReadTagInput extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onSelect: PropTypes.func,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onChange: d => d,
    onAdd: d => d,
    onRemove: d => d,
    onTagInputChange: d => d,
    onSelect: d => d,
    placeholder: 'Add a Title',
    inputTag: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const {data} = this.props;

    if (data.length !== prevProps.data.length) {
      this.props.onBlur();
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
      style,
    } = this.props;

    const slicedData = data.slice(0, 1);

    const tagMatches = vocabulary
      .filter(d => !slicedData.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase()),
      );

    return (
      <div
        className={className}
        style={style}
        onMouseDown={e => {
          // TODO: important
          matchesVisible && e.preventDefault();
          // e.stopPropagation();
        }}>
        <div className="flex thick-border text-lg bg-white ">
          <form
            className="flex m-3"
            onSubmit={event => {
              event.preventDefault();
              onAdd(inputTag);
            }}>
            {slicedData.length === 1 ? (
              <TagSelection
                className="flex items-center"
                data={slicedData}
                onRemove={onRemove}
              />
            ) : (
              <input
                ref={input => (this.input = input)}
                onBlur={onBlur}
                onSelect={onSelect}
                type="text"
                placeholder={placeholder}
                value={inputTag}
                onChange={event => onTagInputChange(event.target.value)}
                style={{background: 'transparent', border: 0, outline: 'none'}}
              />
            )}
          </form>
        </div>
        <SearchResults
          visible={matchesVisible}
          height={height}
          data={tagMatches}
          onAdd={onAdd}
          style={{position: 'absolute'}}
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
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onChange: d => d,
    onAdd: d => d,
    onRemove: d => d,
    onTagInputChange: d => d,
    onSelect: d => d,
    placeholder: 'Search by tags',
    inputTag: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const {data} = this.props;

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
      style,
    } = this.props;

    const slicedData = data.slice(0, 5);

    const tagMatches = vocabulary
      .filter(d => !slicedData.includes(d.key))
      .filter(
        d =>
          inputTag === null ||
          d.key.toLowerCase().includes(inputTag.toLowerCase()),
      );

    return (
      <div
        className={className}
        style={style}
        onMouseDown={e => {
          // TODO: important
          matchesVisible && e.preventDefault();
          // e.stopPropagation();
        }}>
        <div className="flex thick-border text-lg bg-white ">
          <form
            className="flex m-3"
            onSubmit={event => {
              event.preventDefault();
              onAdd(inputTag);
            }}>
            <input
              ref={input => (this.input = input)}
              onBlur={onBlur}
              onSelect={onSelect}
              type="text"
              placeholder={placeholder}
              value={inputTag}
              onChange={event => onTagInputChange(event.target.value)}
              style={{background: 'transparent', border: 0, outline: 'none'}}
            />
          </form>
          {slicedData.length > 0 && (
            <TagSelection
              className="flex items-center"
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
          style={{position: 'absolute'}}
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
  style,
}) => (
  <div
    className={`${className} w-full bg-white overflow-y-auto z-50`}
    style={{
      display: !visible && 'none',
      maxHeight: height,
      ...style,
    }}>
    {data.length > 0 && (
      <div
        className="mt-3"
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        {data.map(d => (
          <div className="m-2">
            <button
              type="button"
              className="tag-label"
              onClick={() => onAdd(d.key)}>
              {d.key} ({d.values.length})
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const Select = class Select extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onInputSelect: PropTypes.oneOf([null, PropTypes.func]),
    Input: PropTypes.node,
  };

  static defaultProps = {style: {}, vocabulary: []};

  state = {
    active: false,
    curSet: this.props.data || [],
    setList: [],
    matchesVisible: false,
    editable: false,
    onInputSelect: d => d,
    Input: ReadTagInput,
  };

  componentDidUpdate(prevProps, prevState) {
    const {onChange} = this.props;
    const {curSet} = this.state;
    const {curSet: oldSet} = prevState;

    if (curSet.length !== oldSet.length) {
      onChange(curSet);
    }
  }

  removeListItem = set => {
    this.setState(({setList: olList}) => ({
      setList: olList.filter(s => difference(set, s).length !== 0),
      active: false,
      curSet: [],
    }));
  };

  render() {
    const {style, Input} = this.props;
    const {active, curSet, curKey, setList, matchesVisible} = this.state;

    return (
      <Input
        {...this.props}
        className="relative"
        style={{
          flex: matchesVisible ? '0 0 70%' : null,
          transition: 'all 0.4s',
        }}
        onBlur={() => this.setState({matchesVisible: false})}
        onSelect={() => {
          const {onInputSelect} = this.props;
          this.setState({matchesVisible: true});
          onInputSelect && onInputSelect();
        }}
        data={curSet}
        matchesVisible={matchesVisible}
        onTagInputChange={key => this.setState({curKey: key})}
        inputTag={curKey}
        onAdd={k => {
          if (k && k !== '') {
            this.setState(({curSet: oldSet}) => ({
              curSet: uniq([k, ...oldSet]),
              curKey: '',
            }));
          }
        }}
        onRemove={k => {
          this.setState(({curSet: oldSet}) => ({
            curSet: oldSet.filter(key => key !== k),
          }));
        }}
      />
    );
  }
};

export const ExtendedEditTags = props => (
  <Select {...props} Input={EditTagInput} />
);

export const SelectTags = props => <Select {...props} Input={ReadTagInput} />;

export const EditOneTag = props => (
  <Select {...props} Input={EditOneTagInput} />
);
