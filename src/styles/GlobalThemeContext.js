// import React from 'react';
//
// import { scaleOrdinal } from 'd3';
// import * as chromatic from 'd3-scale-chromatic';
// import chroma from 'chroma-js';
//
// import { StyleSheet } from 'aphrodite/no-important';
// import { btnStyle } from './helperStyles';
//
// // const uiColor = '#6c757d';
// const uiColor = 'grey';
// const shallowBg = chroma(uiColor)
//   .brighten(2.2)
//   .hex();
//
// // const tagColor = 'gold';
//
// // '#eeeee5',
// // '#6c843e',
// // '#dc383a',
// // '#687d99',
// // '#705f84',
// // '#fc9a1a',
// // '#aa3a33',
// // '#9c4257'
//
// const tagColor = chroma('#a5b1c2')
//   .brighten(0.5)
//   .hex();
//
// // chroma('gold')
// // .darken(0.5)
// // .hex();
//
// const rawCSS = {
//   border: { border: `1px solid ${shallowBg}` },
//   shallowBg: { background: shallowBg },
//   imgBorder: {
//     boxShadow: '4px 4px lightgrey',
//     background: 'white',
//     padding: 10
//   },
//
//   btn: {
//     ...btnStyle,
//     borderColor: uiColor,
//     border: `1px solid ${shallowBg}`,
//     background: shallowBg,
//     ':hover': {
//       boxShadow: `4px 4px ${uiColor}`
//     }
//   },
//   bareBtn: {
//     ...btnStyle,
//     fontWeight: 'inherit',
//     background: shallowBg,
//     ':hover': {
//       boxShadow: `4px 4px ${uiColor}`
//     }
//   },
//   imgUploadBtn: {
//     ...btnStyle,
//     display: null,
//     borderColor: uiColor,
//     border: `1px solid ${shallowBg}`,
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     background: shallowBg,
//     ':hover': {
//       boxShadow: `4px 4px ${uiColor}`
//     }
//   },
//   truncate: {
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis'
//   },
//   boxShadow: { boxShadow: `3px 3px ${uiColor}` },
//   modalFooter: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: '1rem',
//     borderTop: `1px solid ${uiColor}`
//   }
// };
//
// const tagColors = chromatic.schemeSet3
//   .reverse()
//   .map(c => chroma(c).alpha(0.04));
//
// const makeTagColorScale = cardSets =>
//   scaleOrdinal()
//     .domain(cardSets.map(s => s.key).sort())
//     .range(tagColors.sort());
//
// const stylesheet = StyleSheet.create(rawCSS);
//
// const {
//   Provider: GlobalThemeProvider,
//   Consumer: GlobalThemeConsumer
// } = React.createContext({ uiColor, tagColor, stylesheet, rawCSS });
//
// const calcDataViewHeight = isSmartphone => (isSmartphone ? '60%' : '60%');
//
// export {
//   GlobalThemeProvider,
//   GlobalThemeConsumer,
//   stylesheet,
//   uiColor,
//   makeTagColorScale,
//   tagColor,
//   rawCSS,
//   calcDataViewHeight
// };
