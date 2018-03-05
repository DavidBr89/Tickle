import cxs from 'cxs';

import { scaleOrdinal, scaleLinear, range } from 'd3';
import * as chromatic from 'd3-scale-chromatic';

import { challengeTypes, mediaTypes } from '../../dummyData';

import colorClasses from '../utils/colorClasses';

const mediaScale = scaleOrdinal()
  .domain(mediaTypes)
  .range(['fa-gamepad', 'fa-link', 'fa-camera', 'fa-video-camera']);

const colorScaleRandom = scaleLinear()
  .domain(range(colorClasses.length))
  .range(colorClasses)
  .clamp(true);

const colorClass = (title = 'title') =>
  colorScaleRandom(title.length % colorClasses.length);

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};

const cardLayout = cxs({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '90%'
});

const shadowStyle = {
  boxShadow: '0.4rem 0.4rem grey',
  border: '1px solid grey'
};

const colorScale = scaleOrdinal()
  .domain(challengeTypes)
  .range([...chromatic.schemePastel1, 'wheat']);

export {
  cardLayout,
  shadowStyle,
  colorScale,
  mediaScale,
  colorClass,
  profileSrc,
  colorScaleRandom
};
