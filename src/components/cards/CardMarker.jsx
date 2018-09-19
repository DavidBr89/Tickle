import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { shadowStyle, colorScale } from './styles';

class CardMarker extends Component {
  static propTypes = {
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool,
    width: PropTypes.oneOf([PropTypes.number, null]),
    height: PropTypes.oneOf([PropTypes.number, null]),
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
    width: null,
    height: null,
    center: true,
    marginTop: '6%',
    background: 'black',
    imgColor: 'yellow',
    shadow: true
  };

  state = { hovered: false };
  // shouldComponentUpdate() {
  //   return false;
  // }

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
      color,
      imgColor,
      shadow,
      // tags,
      barHeight = '12%',
      barColor = 'black',
      className,
      selected
    } = this.props;

    const { hovered } = this.state;
    return (
      <div
        className="cardmarker"
        style={{
          // pointerEvents: 'none',
          // padding: '15%',
          width: '100%',
          height: '100%',
          // zIndex: 100,
          background: 'white',
          // transition: 'width 300ms, height 300ms, transform 300ms',
          // transform: 'translate(-50%,-50%)',
          // transition: 'transform 400ms',
          // transform: hovered || selected ? 'scale(2)' : null,
          ...style
          // transform: hovered || (selected && 'scale(2)')
        }}
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseOut={() => this.setState({ hovered: false })}
        onClick={onClick}
      >
        <div
          style={{
            background: color,
            width: '100%',
            height: '100%',
            padding: '7%',
            pointerEvents: 'none',
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
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                width: '100%',
                height: barHeight,
                background: barColor,
                marginTop,
                pointerEvents: 'none'
                // borderRadius: '4px'
              }}
            />
            <div
              style={{
                width: '100%',
                height: barHeight,
                background: barColor,
                marginTop,
                pointerEvents: 'none'
                // borderRadius: '4px'
              }}
            />
            <div
              style={{
                width: '100%',
                height: '50%',
                background: imgColor,
                marginTop,
                pointerEvents: 'none'
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
