import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TabNav extends React.Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    keys: PropTypes.array,
    preSelected: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    ui: PropTypes.oneOf([PropTypes.node, null])
  };

  static defaultProps = {
    className: '',
    keys: ['1', '2', '3'],
    children: d => d,
    preSelected: 'PhotoUpload',
    onChange: d => d,
    btnStyle: {},
    ui: null,
    style: {}
  };

  state = { selected: this.props.preSelected };

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  render() {
    const {
      className, keys, children, btnStyle, style, ui
    } = this.props;
    const { selected } = this.state;

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <div className={className} style={style}>
        <div
          className="flex-no-shrink mb-3 nav flex flex-no-wrap"
          role="tablist"
        >
          {keys.map(key => (
            <button
              type="button"
              className={`w-full mr-1 flex-grow ${key === selected ? 'btn btn-black' : 'btn'}`}
              onClick={updState(key)}
              id={key}
            >
              {key}
            </button>
          ))}
          {ui}
        </div>
        <div className="flex-grow flex flex-col">
          {children(selected)}
        </div>
      </div>
    );
  }
}
