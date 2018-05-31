import React from 'react';
import PropTypes from 'prop-types';
// import * as d3 from 'd3';

// import prune from 'json-prune';
// import superagent from 'superagent';
// import $ from 'jquery';
// import prune from 'json-prune';

import getData from './discogsData';

// import $ from 'jquery';
import CardStack from './CardStack';
import DotDotDot from '../utils/DotDotDot';
// import getData from './discogsData';
// import dummyData from './dummyData';
// import postcardStyle from '../styles/postcard.scss';

import defaultData from './collection.json';

defaultData.forEach((d, i) => {
  d.tags = d.styles;
  d.key = i;
  d.id = i;
});

// console.log('defaultData', defaultData);

// const wait = ms =>
//   new Promise(resolve =>
//     setTimeout(() => {
//       console.log('wait', ms);
//       resolve();
//     }, ms)
//   );

class RecordCollection extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { loadingText: 'loading image data', data: [] };
  }

  componentDidMount() {
    getData({
      onImagesLoaded: () => this.setState({ loadingText: 'loading Genres' }),
      onError: e => {
        this.setState({ loadingText: 'Error, loading preset Data' });
        setTimeout(() => this.setState({ data: defaultData }), 2000);
        console.log('error', e);
      },
      onDataLoaded: data => this.setState({ data })
    });
    // .done(d => console.log('res', d));
    // const log = d => {
    //   console.log('log', d);
    //   return d;
    // };
    // Promise.all(promises).then(values => console.log('v', values));
    // .then(ajaxThrottle(4000));
    // const promises = data.map(d =>
    //   ajaxThrottle(1000).then(
    //     ajax({
    //       url: d.basic_information.resource_url,
    //       type: 'GET',
    //       dataType: 'jsonp',
    //       cache: false
    //     })
    //   )
    // );
    // $.when(...promises).done((...args) => {
    //   console.log('result', args);
    // });
  }

  // componentWillReceiveProps() {
  //   this.setState(setInitialState(collectionData));
  // }

  render() {
    const { height } = this.props;
    const { loadingText, data } = this.state;

    if (data.length === 0)
      return (
        <h1 className="centered" style={{ lineHeight: `${height}px` }}>
          {loadingText}
          <DotDotDot />
        </h1>
      );
    return <CardStack {...this.props} pad={40} data={data} />;
  }
}

RecordCollection.defaultProps = {
  width: 860,
  height: 640
};

export default RecordCollection;
