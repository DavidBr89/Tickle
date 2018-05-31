import React from 'react';
import * as d3 from 'd3';

import stampStyle from './styles/stamp.scss';
import postcardStyle from './styles/postcard.scss';


// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - (min + 1))) + min;
// }

class Projects extends React.Component {
  static propTypes() {
    return {
      center: React.PropTypes.array.isRequired,
      data: React.PropTypes.array.isRequired,
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    // const node = d3.select('#front').node();
    // console.log('Front', node);
    // const bbox = node.getBoundingClientRect();
    // const width = bbox.width;
    // const height = bbox.height;
    // this.setState({ width, height });
  }

  render() {
    return (
      <div className={postcardStyle.postcard}>
        <div className={postcardStyle.postcardCont}>
          <div style={{ top: '300px', left: '100px' }}className={stampStyle.rubber_stamp}> Under Construction</div>
        </div>
      </div>
    );
  }
}


Projects.defaultProps = {
  center: [0, 0]
};

export default Projects;
