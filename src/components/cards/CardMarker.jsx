import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { shadowStyle, colorScale } from './styles';

class CardMarker extends Component {
  static propTypes = {
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    center: PropTypes.bool,
    marginTop: PropTypes.string,
    shadow: PropTypes.bool,
    barHeight: PropTypes.string
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: null },
    edit: false,
    width: 6.5,
    height: 8,
    center: true,
    marginTop: '6%',
    background: 'black',
    imgColor: 'yellow',
    shadow: true
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      challenge,
      center,
      style,
      edit,
      onClick,
      width,
      height,
      marginTop,
      background,
      imgColor,
      shadow,
      tags,
      barHeight = '12%'
    } = this.props;
    return (
      <div
        style={{
          pointerEvents: 'none',
          // padding: '15%',
          transition: 'opacity 1s',
          width: `${width}vw`,
          height: `${height}vw`,
          maxWidth: '30px',
          maxHeight: '35px',
          // TODO: does not work for widescreen
          transform: center
            ? `translate(${-width / 2}vw, ${-height / 2}vw)`
            : null,
          pointerEvents: null,
          ...style
        }}
        onClick={onClick}
      >
        <div
          style={{
            background: challenge.type
              ? colorScale(challenge.type)
              : 'whitesmoke',
            width: '100%',
            height: '100%',
            padding: '7%',
            // boxShadow: shadow ? 'grey 0.3rem 0.3rem' : null,
            border: '1px solid grey'
            // border: '1px solid grey',
            // border: edit ? '2px dashed black' : null,
          }}
        >
          <div
            style={{
              opacity: 0.5,
              width: '100%',
              height: '100%'
            }}
          >
            <div
              style={{
                width: '100%',
                height: barHeight,
                background,
                marginTop
                // borderRadius: '4px'
              }}
            />
            <div
              style={{
                width: '100%',
                height: barHeight,
                background,
                marginTop
                // borderRadius: '4px'
              }}
            />
            <div
              style={{
                width: '100%',
                height: '50%',
                background: imgColor,
                marginTop
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
