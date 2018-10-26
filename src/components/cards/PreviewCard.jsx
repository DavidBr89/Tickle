import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import placeholderImg from './placeholder.png';
import {shadowStyle, colorClass, colorScale} from './styles';
import {Lock as LockF} from 'react-feather';

import {PreviewTags} from 'Utils/Tag';

const PlaceholderField = ({text, style, fullHeight}) => (
  <div
    className="mb-1"
    style={{
      display: 'flex',
      border: 'grey 1px dashed',
      justifyContent: 'center',
      alignItems: 'center',
      height: fullHeight ? '100%' : null
    }}
  >
    <div
      style={{
        // marginTop: '4px',
        // marginBottom: '4px',
        color: 'grey',
        paddingLeft: '2px',
        fontWeight: 'bold',
        ...style
      }}
    >
      {text}
    </div>
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

    if (!accessible)
      return (
        <div
          className={`${className} flex flex-col border-4 border-black`}
          style={contStyle}
          onClick={onClick}
        >
          <div
            className="flex flex-col align-center"
            style={{
              flex: '0 1 100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LockF size={90} />
          </div>
        </div>
      );
    // img.thumbnail ? img.thumbnail || img.url : placeholderImg;
    return (
      <div
        className={`${className} flex flex-col border-2 border-black`}
        style={contStyle} onClick={onClick}>
        {title !== null ? (
          <div
            className="text-truncate"
            style={{fontSize: '16px', margin: '4px 0'}}
          >
            {title}
          </div>
        ) : (
          <PlaceholderField text="Title" style={{fontSize: '18px'}} />
        )}

        <div
          className="mt-1 mb-1"
          style={{height: '50%', background: '#ffd70080'}}
        >
          {showImg && img !== null ? (
            <img
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
            <PlaceholderField
              text="IMG"
              fullHeight
              style={{fontSize: '18px'}}
            />
          )}
        </div>
      </div>
    );
  }
}
export default PreviewCard;
