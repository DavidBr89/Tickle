import cxs from 'cxs';
import React from 'react';

import { scaleOrdinal, scaleLinear, range } from 'd3';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';


import colorClasses from '../utils/colorClasses';

const colors0 = [
  '#7fcdbb',
  '#a1dab4',
  '#41b6c4',
  '#a1dab4',
  '#41b6c4',
  '#2c7fb8',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#2c7fb8',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#edf8b1',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#edf8b1',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#253494'
];

const colors2 = [
  '#eeeee5',
  '#6c843e',
  '#dc383a',
  '#687d99',
  '#705f84',
  '#fc9a1a',
  '#aa3a33',
  '#9c4257'
];
const mediaTypes = ['article', 'photo', 'gif', 'video'];
const challengeTypes = ['quiz', 'gap text', 'hangman'];
export const mediaScale = scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-link', 'fa-camera', 'fa-video-camera']);

export const colorScaleRandom = scaleLinear()
  .domain(range(colors0.length))
  .range(colorClasses)
  .clamp(true);

export const colorClass = (title = 'title') =>
  colorScaleRandom(title.length % colors0.length);

export const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};

export const cardLayout = cxs({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '90%'
});

export const shadowStyle = {
  boxShadow: '0.2rem 0.2rem 0.1rem grey'
  // border: '1px solid black'
};

const colors = [...chromatic.schemePastel1, 'wheat'];

const ordinalColScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(colors);

export function colorScale(type) {
  if (type === null) return 'whitesmoke';

  return ordinalColScale(type);
}

export const darkerColorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(ordinalColScale.range().map(c => chroma(c).darker()));

// TODO: chroma alpha does not seem to work
export const brighterColorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(ordinalColScale.range().map(c => chroma(c).alpha(0.5)));

// TODO: make meaningful
export const cardTypeColorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(ordinalColScale.range().map(c => chroma(c).alpha(0.5)));
// export {
//   cardLayout,
//   shadowStyle,
//   colorScale,
//   mediaScale,
//   colorClass,
//   profileSrc,
//   colorScaleRandom
// };
//
//
export const shadowStyleSelect = (color = 'grey') =>
  cxs({
    border: `1px solid ${color}`,
    boxShadow: `6px 6px ${color}`
  });

export const createShadowStyle = (color = 'grey') => ({
  border: `1px solid ${color}`,
  boxShadow: `6px 6px ${color}`
});

export const modalBorder = color => ({ borderTop: `1px solid ${color}` });


export const coverPhotoStyle = { height: '50%', maxHeight: 400, width: '100%' };

export const UIthemeContext = React.createContext({
  uiColor: 'orange',
  background: 'grey'
});
