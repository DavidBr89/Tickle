import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import placeholderImg from './placeholder.png';
import {shadowStyle, colorClass, colorScale} from './styles';
import {Lock as LockF} from 'react-feather';

import {PreviewTags} from 'Utils/Tag';

const PlaceholderField = ({text, style, fullHeight}) => (
  <div className="mb-1 flex-grow flex-col-wrapper justify-center items-center h-full">
    <div
      style={{
        color: 'grey',
        paddingLeft: '2px',
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
    const selImg = (() => {
      if (img && img.thumbnail) return img.thumbnail;
      if (img && img.url) return img.url;
      return placeholderImg;
    })();
    const contStyle = {
      padding: '5px',
      height: '100%',
      background: colorScale(type),
      boxShadow: '0.2rem 0.2rem grey',
      overflow: 'hidden',
      ...style
      // minWidth: '100px'
      // maxHeight: '120px'
    };

    return (
      <div
        className={`${className} flex-col-wrapper border-2 border-black`}
        style={contStyle}
        onClick={onClick}
      >
        <div
          className="flex-grow mt-1 mb-1 relative"
          style={{background: '#ffd70080'}}
        >
          {img !== null ? (
            <img
              className="absolute z-0"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              src={selImg}
              alt="Card cap"
            />
          ) : (
            <PlaceholderField text="IMG" style={{fontSize: '18px'}} />
          )}

          <div className="p-1 absolute">
            <div
              className="pl-1 pr-1 text-truncate bg-white"
              style={{fontSize: '16px', margin: '4px 0'}}>
              {title}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PreviewCard;
