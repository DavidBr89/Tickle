import React from 'react';

import { scaleOrdinal } from 'd3';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';

import { StyleSheet } from 'aphrodite/no-important';
import { btnStyle } from './helperStyles';

const uiColor = 'grey';
const rawCSS = StyleSheet.create({
  btn: btnStyle,
  boxShadow: { boxShadow: `3px 3px ${uiColor}` },
    modalFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '1rem',
      borderTop: `1px solid ${uiColor}`
    },
});

const tagColors = chromatic.schemeSet3
  .reverse()
  .map(c => chroma(c).alpha(0.04));

const makeTagColorScale = cardSets =>
  scaleOrdinal()
    .domain(cardSets.map(s => s.key))
    .range(tagColors);

const stylesheet = StyleSheet.create(rawCSS);

const {
  Provider: GlobalThemeProvider,
  Consumer: GlobalThemeConsumer
} = React.createContext({ uiColor, stylesheet });

export {
  GlobalThemeProvider,
  GlobalThemeConsumer,
  stylesheet,
  makeTagColorScale
};
