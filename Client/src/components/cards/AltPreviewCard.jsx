import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import placeholderImg from './placeholder.png';
import Asrc from 'Src/styles/alphabet_icons/ic_ak.svg';

class AltPreviewCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.oneOf([PropTypes.array.isRequired, null]),
    tagColorScale: PropTypes.func,
    img: PropTypes.object,
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    title: null,
    tags: null,
    img: null,
    style: {},
    selected: false,
    // TODO: include only type
    challenge: {type: null},
    edit: false,
    type: null,
    showImg: true,
    accessible: true
  };

  render() {
    const {
      title,
      tags,
      img,
      style,
      onClick,
      edit,
      tagColorScale,
      type,
      showImg,
      accessible,
      className
    } = this.props;

    const contStyle = {
      padding: '5px',
      height: '100%',
      boxShadow: '0.2rem 0.2rem grey',
      overflow: 'hidden',
      ...style
      // minWidth: '100px'
      // maxHeight: '120px'
    };

    // img.thumbnail ? img.thumbnail || img.url : placeholderImg;
    return (
      <div className={className+ ' bg-white'} style={contStyle} onClick={onClick}>
        <img src={Asrc} className="w-full h-full" />
      </div>
    );
  }
}
export default AltPreviewCard;
