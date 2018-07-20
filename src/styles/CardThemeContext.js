import React from 'react';

import { StyleSheet } from 'aphrodite/no-important';

const btnStyle = {
  borderRadius: 0,
  padding: '0.375rem',
  backgroundColor: 'transparent',
  backgroundImage: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: '62px',
  overflow: 'hidden',
  // fontWeight: 400,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  verticalAlign: 'middle',
  userSelect: 'none',
  border: '1px solid transparent',
  // fontSize: '1rem',
  lineHeight: 1.5,
  transition:
    'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  cursor: 'pointer'
};

const {
  Provider: CardThemeProvider,
  Consumer: CardThemeConsumer
} = React.createContext({});

export { CardThemeProvider, CardThemeConsumer, btnStyle };
