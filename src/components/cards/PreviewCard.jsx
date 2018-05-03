import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import placeholderImg from './placeholder.png';
import cx from './Card.scss';
import { shadowStyle, colorClass, colorScale } from './styles';
import { PreviewTags } from './layout';

const PlaceholderAttr = ({ text, style, fullHeight }) => (
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

PlaceholderAttr.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  fullHeight: PropTypes.bool
};
PlaceholderAttr.defaultProps = {
  style: {},
  fullHeight: false
};

class PreviewCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.oneOf([PropTypes.array.isRequired, null]),
    img: PropTypes.string,
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    selected: PropTypes.bool,
    edit: PropTypes.bool
  };

  static defaultProps = {
    title: null,
    tags: null,
    img: null,
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: null },
    edit: false
  };

  shouldComponentUpdate(nextProps) {
    // const { selected, title, tags, img } = this.props;
    // return (
    //   selected !== nextProps.selected ||
    //   title !== nextProps.title ||
    //   // TODO: fix array comparison
    //   (tags !== null && tags.length !== nextProps.tags.length) ||
    //   img !== nextProps.img
    // );
    return true;
  }

  render() {
    const { title, tags, img, challenge, style, onClick, edit, tagColorScale } = this.props;
    return (
      <div
        style={{
          ...style,
          padding: '5px',
          height: '100%',
          background: challenge.type
            ? colorScale(challenge.type)
            : 'whitesmoke',
          ...shadowStyle,
          // minWidth: '100px'
          // maxHeight: '120px'
        }}
        onClick={onClick}
      >
        {title !== null ? (
          <div className={cx.cardHeader}>
            <div
              className="text-truncate"
              style={{ fontSize: '16px', margin: '4px 0' }}
            >
              {title}
            </div>
          </div>
        ) : (
          <PlaceholderAttr text={'Title'} style={{ fontSize: '18px' }} />
        )}
        {tags !== null ? (
          <PreviewTags small colorScale={tagColorScale} data={tags} />
        ) : (
          <PlaceholderAttr text={'Tags'} style={{ fontSize: '80%' }} />
        )}

        <div className="mt-1 mb-1" style={{ height: '50%' }}>
          {img !== null || !edit ? (
            <img
              style={{
                display: 'block',
                width: '100%',
                height: '100%'
              }}
              src={img || placeholderImg}
              alt="Card cap"
            />
          ) : (
            <PlaceholderAttr
              text={'IMG'}
              fullHeight
              style={{ fontSize: '18px' }}
            />
          )}
        </div>
      </div>
    );
  }
}
export default PreviewCard;
