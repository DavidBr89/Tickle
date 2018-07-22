import React from 'react';

import { StyleSheet } from 'aphrodite/no-important';


const {
  Provider: CardThemeProvider,
  Consumer: CardThemeConsumer
} = React.createContext({});

export { CardThemeProvider, CardThemeConsumer, btnStyle };
