import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaOverview } from 'Components/cards/MediaSearch';

import placeholderImgSrc from '../placeholder.png';

import CardFrame from '../CardHeader';

import { X } from 'react-feather';

import {
  MediaField,
  ChallengeField,
  DescriptionField,
  EditButton,
  Img,
  ZoomIcon,
  BigButton,
  FlipButton
} from '../layout';

const defaultProps = {};

const ImgOverlay = ({ src, className, style, children, footer }) => (
  <div
    className={className}
    style={{
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      ...style
    }}
  >
    <img
      src={src || placeholderImgSrc}
      alt="Card img"
      style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
    />
    <div
      style={{
        position: 'absolute',
        width: '100%',
        // zIndex: 200,
        left: 0,
        top: 0
      }}
    >
      {children}
    </div>
  </div>
);

const Title = ({ onClick, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div className="ml-1" style={{ maxWidth: '100%' }} onClick={onClick}>
      <h1 style={{ marginBottom: 0 }} className="text-truncate">
        {children === null ? (
          <span className="text-muted">No Title</span>
        ) : (
          children
        )}
      </h1>
    </div>
  </div>
);

class CardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    tags: PropTypes.any, // PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.oneOf([PropTypes.object, null]),
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string,
    tagColorScale: PropTypes.func,
    challenge: PropTypes.object,
    bookmarkable: PropTypes.boolean,
    challengeComp: PropTypes.element
  };

  static defaultProps = {
    title: null,
    challenge: null,
    challengeSubmission: null,
    // date: '28/04/2012 10:00',
    tags: null,
    img: null,
    xpPoints: null,
    description: null,
    // loc: { latitude: 50.828797, longitude: 4.352191 },
    creator: 'Jan',
    radius: 500,
    media: [],
    comments: [],
    flipHandler: d => d,
    tagColorScale: () => 'green',
    bookmarkable: false,
    onRemoveChallengeSubmission: d => d,
    challengeComp: MediaChallenge
  };

  render() {
    const {
      tags,
      img,
      description,
      media,
      title,
      uiColor,
      // background,
      challengeSubmission,
      stylesheet,
      tagColorScale,
      style,
      smallScreen,

      onClose,
      onImgClick,
      onDescriptionClick,
      onMediaClick,
      onTitleClick,
      onChallengeClick,
      onFlip,
      onTagsClick
    } = this.props;

    const { cardLayout, btn } = stylesheet;

    return (
      <div
        style={{ height: '100%', zIndex: 3000 }}
        className={`${css(cardLayout)} p-3`}
      >
        <ImgOverlay
          src={img ? img.url : null}
          style={{
            flex: '0 1 40%',
            minHeight: 0
          }}
        >
          <div
            className="m-1"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <PreviewTags
              colorScale={tagColorScale}
              data={tags}
              onClick={onTagsClick}
            />
            <button className={css(btn)} onClick={onClose}>
              <X size={30} />
            </button>
          </div>
        </ImgOverlay>
        <Title onClick={onTitleClick}>{title}</Title>
        <DescriptionField
          text={description}
          placeholder="No Description"
          style={{ flex: '0 1 20%' }}
          onEdit={onDescriptionClick}
        />
        <MediaField
          smallScreen={smallScreen}
          style={{ flex: '0 1 20%' }}
          media={smallScreen ? media.slice(0, 2) : media.slice(0, 4)}
          onClick={onMediaClick}
        />
        <div className="" style={{ display: 'flex', flexShrink: 0 }}>
          <BigButton onClick={onChallengeClick} style={{ width: '80%' }}>
            Challenge
          </BigButton>
          <FlipButton color={uiColor} onClick={onFlip} className="ml-2" />
        </div>
      </div>
    );
  }
}

const StyledCardFront = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <CardFront {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

export default StyledCardFront;
