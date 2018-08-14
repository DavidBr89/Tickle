import React from 'react';
import chroma from 'chroma-js';

import { StyleSheet } from 'aphrodite/no-important';
import { rawCSS } from './GlobalThemeContext';

import { btnStyle } from './helperStyles';

const makeStylesheet = ({ uiColor, background }) => {
  const shallowBg = chroma(uiColor)
    .brighten(2.2)
    .hex();

  const littleShallowColor = chroma(uiColor)
    .brighten(1.2)
    .hex();

  const extraShallowBg = chroma(uiColor)
    .brighten(2.3)
    .hex();

  return StyleSheet.create({
    ...rawCSS,
    boxShadow: { boxShadow: `4px 4px ${uiColor}` },
    border: { border: `1px solid ${uiColor}` },
    bigBoxShadow: {
      border: `1px solid ${littleShallowColor}`,
      boxShadow: `6px 6px ${littleShallowColor}`
    },
    bareBtn: {
      ...btnStyle
    },
    btn: {
      ...btnStyle,
      borderColor: uiColor,
      background: shallowBg,
      ':hover': {
        boxShadow: `4px 4px ${uiColor}`
      }
    },
    shallowBg: {
      background: shallowBg
    },
    extraShallowBg: {
      background: extraShallowBg
    },
    btnActive: {
      ...btnStyle,
      background: uiColor,
      color: 'whitesmoke',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center'
      // borderColor: uiColor
    },
    shallowBorder: {
      border: `${chroma(uiColor)
        .brighten(1.8)
        .hex()} solid 1px`
    },
    fieldSetLegend: {
      ':hover': {
        boxShadow: `4px 4px ${uiColor}`
      }
    },
    background: { background },
    modalFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '1rem',
      borderTop: `1px solid ${uiColor}`
    },
    cardLayout: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flex: '1 1 auto'
      // height: '90%'
    },
    coverPhoto: { height: '40%', maxHeight: 400, width: '100%' },
    flipContainer: {
      '-webkit-perspective': 1000,
      '-moz-perspective': 1000,
      '-ms-perspective': 1000,
      perspective: 1000,
      '-ms-transform': 'perspective(1000px)',
      '-moz-transform': 'perspective(1000px)',
      '-webkit-transform': 'perspective(1000px)',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      '-webkit-transform-style': 'preserve-3d',
      height: '100%'
    },
    flipper: {
      height: '100%',
      transition: '0.6s',
      transformStyle: 'preserve-3d',
      position: 'relative'
    },
    flipAnim: {
      transform: 'rotateY(180deg)'
    }
  });
};

const {
  Provider: CardThemeProvider,
  Consumer: CardThemeConsumer
} = React.createContext({});

export { CardThemeProvider, CardThemeConsumer, makeStylesheet };
