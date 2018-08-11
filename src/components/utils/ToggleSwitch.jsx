import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';

import { stylesheet } from 'Src/styles/GlobalThemeContext';

const rawCss = StyleSheet.create({
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 60,
    height: 34
  },
  switchInput: {
    // display: 'none',
    ':checked': {
      backgroundColor: '#2196F3'
    },
    ':focus': {
      boxShadow: '0 0 1px #2196F3'
    }
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s'
  },
  sliderCube: {
    position: 'absolute',
    content: '',
    height: 26,
    width: 26,
    left: 4,
    bottom: 4,
    backgroundColor: 'white',
    zIndex: 100,
    transition: '.4s'
  }
});

class ToggleSwitch extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { toggled: false };

  render() {
    const { toggled } = this.state;
    return (
      <button
        className={css(stylesheet.btn)}
        onClick={() => this.setState({ toggled: !toggled })}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ zIndex: 100 }}>
            {toggled ? (
              <div>
                <small>started</small> <small>cards</small>
              </div>
            ) : (
              'all cards'
            )}
          </div>
          <div className={css(rawCss.switch)}>
            <span
              className={css(rawCss.sliderCube)}
              style={{
                transform: toggled && 'translateX(26px)'
              }}
            />
            <span className={css(rawCss.slider)} />
          </div>
        </div>
      </button>
    );
  }
}

export default ToggleSwitch;
