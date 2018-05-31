import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import * as chromatic from 'd3-scale-chromatic';

// import stampStyle from '../styles/stamp.scss';
import postcardStyle from '../styles/postcard.scss';
// import sets from './tagGraph';
import rawBookmarks from './diigo_new.json';

import TagMap from './TagMap';
import TagCloud from './TagCloud';

// import iconBackground from './icon-file.png';

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - (min + 1))) + min;
// }

function setify(data) {
  return d3
    .nest()
    .key(d => d.key)
    .entries(
      _.flattenDeep(
        data.map(d =>
          d.tags.map(t => {
            d.key = t;
            return d;
          })
        )
      )
    )
    .map(d => {
      d.count = d.values.length;
      return d;
    })
    .filter(d => d.count > 1);
}

class Bookmarks extends React.Component {
  static propTypes() {
    return {
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);

    console.log('rawBookmarks', rawBookmarks);
    const data = rawBookmarks.slice(0, 300).map(d => {
      console.log('d.tags', d.tags);
      d.tags = d.tags ? d.tags.split(',') : [];
      return d;
    });

    this.state = { data, sets: setify(data) };

    // sets(bookmarks)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
  }

  render() {
    const { data, sets } = this.state;
    const { width, height } = this.props;
    console.log('width', width, 'height', height);

    // const color = d3.scaleOrdinal(d3.schemeCategory20);
    // const color = d3.scaleSequential(chromatic.interpolatePiYG);
    const color = d3.scaleOrdinal(chromatic.schemePaired);
    return (
      <div>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <TagCloud
            data={sets}
            width={width}
            height={height / 3}
            color={color}
            clickHandler={tag => {
              this.setState(oldState => {
                const newData = oldState.data.filter(d => d.tags.includes(tag));
                console.log('oldState', newData);
                return {
                  data: newData,
                  sets: setify(newData)
                };
              });
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <TagMap
            data={data}
            sets={sets}
            width={width}
            height={height * 2 / 3}
            color={color}
          />
        </div>
      </div>
    );
  }
}

Bookmarks.defaultProps = {
  radius: 5,
  docWidth: 12,
  docHeight: 16,
  width: 100,
  height: 400
};

export default Bookmarks;

// WEBPACK FOOTER //
// ./src/components/Bookmarks/index.jsx
