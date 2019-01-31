import {easeExpIn} from 'd3';
import {FlyToInterpolator} from 'react-map-gl';


/**
 * This object defines transition options for the map
 */
const mapEasing = {
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeExpIn
};
export default mapEasing;
