import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styles from './Title.css';

class Title extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ diplay: 'flex', justifyContent: 'center', zIndex: 20000 }}>
        <svg>
          <text>{'TICKLE'}</text>
        </svg>
      </div>
    );
  }
}

export default Title;
