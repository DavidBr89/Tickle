import cxs from 'cxs';

import { scaleOrdinal, scaleLinear, range } from 'd3';
import * as chromatic from 'd3-scale-chromatic';
import chroma from 'chroma-js';

import { challengeTypes, mediaTypes } from '../../dummyData';

import colorClasses from '../utils/colorClasses';

export const mediaScale = scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

export const colorScaleRandom = scaleLinear()
  .domain(range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

export const colorClass = (title = 'title') =>
  colorScaleRandom(title.length % colorClasses.length);

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

export const colorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(colors);

export const darkerColorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(colorScale.range().map(c => chroma(c).darker()));

// TODO: chroma alpha does not seem to work
export const brighterColorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range(colorScale.range().map(c => chroma(c).alpha(0.5)));
// export {
//   cardLayout,
//   shadowStyle,
//   colorScale,
//   mediaScale,
//   colorClass,
//   profileSrc,
//   colorScaleRandom
// };
