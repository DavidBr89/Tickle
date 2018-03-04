import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { shadowStyle, colorScale } from './styles';

class CardMarker extends Component {
  static propTypes = {
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: null },
    edit: false
  };

  // shouldComponentUpdate() {
  //   return false;
  // }

  render() {
    const { challenge, style, edit, onClick } = this.props;
    return (
      <div
        style={{
          border: edit ? '2px dashed black' : null,
          // padding: '15%',
          transition: 'opacity 1s',
          width: '9vw',
          height: '6vh',
          ...style
        }}
      >
        <div
          style={{
            background: challenge.type
              ? colorScale(challenge.type)
              : 'whitesmoke',
            width: '100%',
            height: '100%',
            padding: '0.2rem',
            border: '1px solid grey',
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
      </div>
    );
  }
}

export default CardMarker;
