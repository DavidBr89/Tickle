import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IcAk from 'Styles/alphabet_icons/ic_ak.svg';

import {shadowStyle, colorScale} from './styles';

class CardMarker extends Component {
  static propTypes = {
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool,
    width: PropTypes.oneOf([PropTypes.number, null]),
    height: PropTypes.oneOf([PropTypes.number, null]),
    center: PropTypes.bool,
    shadow: PropTypes.bool,
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    style: {},
    selected: false,
    width: null,
    height: null,
    center: true,
    background: 'black',
    shadow: true,
  };

  state = {hovered: false};
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
      color,
      shadow,
      // tags,
      className,
      selected,
    } = this.props;

    const {hovered} = this.state;
    return (
      <div
        className={`cardmarker bg-white ${className}`}
      style={{
          width: 25,
          height: 30,
          ...style,
        }}
        onMouseOver={() => this.setState({hovered: true})}
        onMouseOut={() => this.setState({hovered: false})}
        onClick={onClick}>
        <div
          className="w-full h-full border-2 border-black flex-col-wrapper"
          style={{padding: 2}}>
          <div className="flex-grow flex-col-wrapper relative justify-center bg-yellow-dark">
            <img src={IcAk} className="p-1" />
          </div>
        </div>
      </div>
    );
  }
}

export default CardMarker;