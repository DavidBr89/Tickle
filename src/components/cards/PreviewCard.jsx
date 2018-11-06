import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import { PreviewTags } from 'Utils/Tag';
import IcAk from 'Styles/alphabet_icons/ic_ak.svg';
import placeholderImg from './placeholder.png';


const PlaceholderField = ({ text, style, fullHeight }) => (
  <div className="mb-1 flex-grow flex-col-wrapper justify-center items-center h-full">
    <div
      style={{
        color: 'grey',
        fontWeight: 'bold',
        ...style
      }}
    />
    <i
      className="fa fa-1x fa-plus"
      aria-hidden="true"
      style={{
        textalign: 'center',
        // width: '10%',
        marginLeft: '2px',
        color: 'grey',
        pointerevents: 'cursor'
      }}
    />
  </div>
);

PlaceholderField.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  fullHeight: PropTypes.bool
};
PlaceholderField.defaultProps = {
  style: {},
  fullHeight: false
};

class PreviewCard extends Component {
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
    challenge: { type: null },
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
    const selImg = (() => {
      if (img && img.thumbnail) return img.thumbnail;
      if (img && img.url) return img.url;
      return placeholderImg;
    })();
    const contStyle = {
      padding: '5px',
      boxShadow: '0.2rem 0.2rem grey',
      ...style
    };

    return (
      <div
        className={`${className} overflow-hidden bg-white flex-col-wrapper border-2 border-black`}
        style={contStyle}
        onClick={onClick}
      >
        <div
          className="flex-col-wrapper flex-grow relative"
          style={{ background: '#ffd70080' }}
        >
          {img !== null && (
            <img
              className="absolute z-0 w-full h-full"
              style={{
                display: 'block',
                objectFit: 'cover'
              }}
              src={selImg}
              alt="Card cap"
            />
          )}

          <div className="flex-grow flex-col-wrapper">
            <h1 className=" m-1 flex-no-shrink pl-1 pr-1 bg-white text-xl break-words">{title}</h1>
            <div className="p-2 flex-1 flex-col-wrapper justify-center">
              <img className="w-full h-full" src={IcAk} style={{ maxHeight: 120 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PreviewCard;
