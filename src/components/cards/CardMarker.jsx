import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IcAk from 'Styles/alphabet_icons/ic_ak.svg';

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
        className={`cardmarker ${className}`}
        style={{
          width: 25,
          height: 30,
          // transform: 'translate(-50%,-50%)',
          background: 'white',
          ...style
        }}
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseOut={() => this.setState({ hovered: false })}
        onClick={onClick}
      >
        <div
          className="w-full h-full border-2 border-black flex-col-wrapper"
        >
          <div
            className="flex-grow flex-col-wrapper relative justify-center"
            style={{
              background: 'rgba(255, 215, 0, 0.5)'
            }}
          >
            <img src={IcAk} className="p-1" />
          </div>
        </div>
      </div>
    );
  }
}

export default CardMarker;
