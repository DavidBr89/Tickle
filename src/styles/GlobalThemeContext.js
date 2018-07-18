import React from 'react';

import { StyleSheet } from 'aphrodite/no-important';

const uiColor = 'grey'

const {
  Provider: GlobalThemeProvider,
  Consumer: GlobalThemeConsumer
} = React.createContext({ uiColor, stylesheet: StyleSheet.create({boxShadow: `3px 3px ${uiColor}`}) });

export { GlobalThemeProvider, GlobalThemeConsumer };
