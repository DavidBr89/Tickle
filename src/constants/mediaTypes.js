import * as Icon from 'react-feather';
import { scaleOrdinal } from 'd3';

export const GIF = 'gif';
export const TEXT = 'Text';
export const VIDEO = 'Video';
export const IMG = 'Image';
export const URL = 'url';
export const USER_CONTENT = 'USER_CONTENT';

export const mediaScale = scaleOrdinal()
  .domain([TEXT, IMG, GIF, VIDEO])
  .range([Icon.AlignLeft, Icon.Image, Icon.Image, Icon.Film]);
