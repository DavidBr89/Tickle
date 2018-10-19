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
    const { className, keys, children, btnStyle, style, ui } = this.props;
    const { selected } = this.state;

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <div className={className} style={style}>
        <div
          className="mb-3 nav"
          style={{
            display: 'flex',
            // justifyContent: 'center',
            flexWrap: 'no-wrap'
          }}
          role="tablist"
        >
          {keys.map(key => (
            <div className="pr-1">
              <button
                style={{ width: '100%' }}
                className={`mr-1 ${key === selected ? 'btn btn-black' : 'btn'}`}
                type="button"
                onClick={updState(key)}
                id={key}
              >
                <div
                  style={{
                    // TODO: does not work
                    textOverflow: 'ellipsis'
                  }}
                >
                  {key}
                </div>
              </button>
            </div>
          ))}
          {ui}
        </div>
        <div className="flex flex-col">
          <div role="tabpanel" style={{flex: '1 1 100%'}}>
            {children(selected)}
          </div>
        </div>
      </div>
    );
  }
}
