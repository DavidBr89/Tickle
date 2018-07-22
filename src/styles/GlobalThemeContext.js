import React from 'react';

import { StyleSheet } from 'aphrodite/no-important';
import { btnStyle } from './helperStyles';

const uiColor = 'grey';
const stylesheet = StyleSheet.create({
  btn: btnStyle,
  boxShadow: { boxShadow: `3px 3px ${uiColor}` }
});

const {
  Provider: GlobalThemeProvider,
  Consumer: GlobalThemeConsumer
} = React.createContext({ uiColor, stylesheet: StyleSheet.create(stylesheet) });

export { GlobalThemeProvider, GlobalThemeConsumer, stylesheet };
