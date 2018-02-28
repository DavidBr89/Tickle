import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import placeholderImg from './placeholder.png';
import cx from './Card.scss';
import { shadowStyle, colorClass, colorScale } from './styles';
import { PreviewTags } from './layout';

class PreviewCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.oneOf([PropTypes.array.isRequired, null]),
    img: PropTypes.string,
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    selected: PropTypes.bool
  };

  static defaultProps = {
    title: '<Empty Title>',
    tags: ['tag1', 'tag2', 'tag3'],
    img: placeholderImg,
    style: {},
    selected: false,
    // TODO: include only type
    challenge: { type: null }
  };

  shouldComponentUpdate(nextProps) {
    const { selected, title, tags, img } = this.props;
    return (
      selected !== nextProps.selected ||
      title !== nextProps.title ||
      // TODO: fix array comparison
      (tags !== null && tags.length !== nextProps.tags.length) ||
      img !== nextProps.img
    );
  }

  render() {
    const { title, tags, img, challenge, style, onClick } = this.props;
    return (
      <div
        style={{
          ...style,
          padding: '5px',
          backfaceVisibility: 'hidden',
          height: '100%',
          background: challenge.type
            ? colorScale(challenge.type)
            : 'whitesmoke',
          ...shadowStyle
        }}
        onClick={onClick}
      >
        <div className={cx.cardHeader}>
          <div
            className="text-truncate"
            style={{ fontSize: '16px', margin: '4px 0' }}
          >
            {title}
          </div>
        </div>
        <PreviewTags small data={tags} />
        <div className="mt-1 mb-1" style={{ height: '50%' }}>
          <img
            style={{
              display: 'block',
              width: '100%',
              height: '100%'
            }}
            src={img}
            alt="Card cap"
          />
        </div>
      </div>
    );
  }
}
export default PreviewCard;
