import React from 'react';

import { scaleOrdinal } from 'd3';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';

import { StyleSheet } from 'aphrodite/no-important';
import { btnStyle } from './helperStyles';

// const uiColor = '#6c757d';
const uiColor = 'grey';
const shallowBg = chroma(uiColor)
  .brighten(2.2)
  .hex();

const rawCSS = {
  btn: {
    ...btnStyle,
    borderColor: uiColor,
    background: shallowBg,
    ':hover': {
      boxShadow: `4px 4px ${uiColor}`
    }
  },
  boxShadow: { boxShadow: `3px 3px ${uiColor}` },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '1rem',
    borderTop: `1px solid ${uiColor}`
  }
};

const tagColors = chromatic.schemeSet3
  .reverse()
  .map(c => chroma(c).alpha(0.04));

const makeTagColorScale = cardSets =>
  scaleOrdinal()
    .domain(cardSets.map(s => s.key).sort())
    .range(tagColors.sort());

const stylesheet = StyleSheet.create(rawCSS);

const {
  Provider: GlobalThemeProvider,
  Consumer: GlobalThemeConsumer
} = React.createContext({ uiColor, stylesheet });

export {
  GlobalThemeProvider,
  GlobalThemeConsumer,
  stylesheet,
  uiColor,
  makeTagColorScale
};
