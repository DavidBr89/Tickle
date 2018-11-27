import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Dimensions from 'Utils/DimensionsWrapper';

// import { addCardFilter, removeCardFilter } from 'Reducers/DataView/actions';
import {tagFilter} from 'Reducers/DataView/async_actions';

// import * as chromatic from 'd3-scale-chromatic';
// import hull from 'hull.js';
// import hull from 'concaveman';

// import chroma from 'chroma-js';
// import polylabel from '@mapbox/polylabel';

// import { getBoundingBox, bounds, setify } from '../utils';
// import { groupPoints } from './utils';

import {intersection, union, uniqBy, uniq, flatten} from 'lodash';
// import TopicAnnotationOverlay from './TopicAnnotationOverlay';
// import dobbyscan from './cluster';
import TagCloud from './TagCloud';
// import SpiralTile from './SpiralTreeMap';

const euclDist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

function distance(a, b) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

// function rects(quadtree) {
//   const nodes = [];
//   quadtree.visit((node, x0, y0, x1, y1) => {
//     node.x0 = x0;
//     node.y0 = y0;
//     node.x1 = x1;
//     node.y1 = y1;
//     nodes.push({ x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 });
//   });
//   return nodes;
// }
//

class Cluster extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    scale: PropTypes.number,
  };

  static defaultProps = {
    children: d => d,
    className: '',
    scale: 1,
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  // }

  render() {
    const {
      data,
      width,
      height,
      zoom,
      selectedTags,
      colorScale,
      comps,
      links,
      sets,
      labels,
      filterSet,
      children,
      tagVocabulary,
      cardSets,
    } = this.props;

    return (
        <TagCloud {...this.props} data={cardSets} filterSet={filterSet} />
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({tagFilter}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Cluster);
