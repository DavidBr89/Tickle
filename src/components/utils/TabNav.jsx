import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

export default class TabNav extends React.Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    keys: PropTypes.array,
    preSelected: PropTypes.string,
    onChange: PropTypes.func,
    uiColor: PropTypes.string,
    stylesheet: PropTypes.object
  };

  static defaultProps = {
    className: '',
    keys: ['1', '2', '3'],
    uiColor: 'black',
    children: d => d,
    preSelected: 'PhotoUpload',
    onChange: d => d,
    btnStyle: {},
    stylesheet: {}
  };

  state = { selected: this.props.preSelected };

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  render() {
    const { keys, children, btnStyle, uiColor } = this.props;
    const { selected } = this.state;

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <CardThemeConsumer>
        {({ stylesheet }) => (
          <div style={{ width: '100%' }}>
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
                <button
                  className={`mr-3 ${css(
                    key === selected ? stylesheet.btnActive : stylesheet.btn
                  )}`}
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
              ))}
            </div>
            <div className="tab-content">
              <div className="w-100 h-100" role="tabpanel">
                {children(selected)}
              </div>
            </div>
          </div>
        )}
      </CardThemeConsumer>
    );
  }
}
