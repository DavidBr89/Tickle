import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { shadowStyle, colorScale } from './styles';

class CardMarker extends Component {
  static propTypes = {
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: 'hangman' }
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { challenge, style, onClick } = this.props;
    return (
      <div
        style={{
          background: colorScale(challenge.type),
          width: '80%',
          height: '80%',
          border: '1px solid grey',
          padding: '0.2rem',
          ...shadowStyle
        }}
      >
        <div style={{ opacity: 0.5, width: '100%', height: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '13%',
              background: 'black',
              marginTop: '0.23rem'
              // borderRadius: '4px'
            }}
          />
          <div
            style={{
              width: '100%',
              height: '13%',
              background: 'black',
              marginTop: '0.23rem'
              // borderRadius: '4px'
            }}
          />
          <div
            style={{
              width: '100%',
              height: '40%',
              background: 'gold',
              marginTop: '0.23rem'
              // borderRadius: '4px'
            }}
          />
        </div>
      </div>
    );
  }
}

export default CardMarker;
