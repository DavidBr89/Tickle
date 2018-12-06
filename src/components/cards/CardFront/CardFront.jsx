import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import CardControls from 'Components/cards/CardControls';
import {mediaScale} from 'Constants/mediaTypes';
import {getNumInitFields} from 'Constants/cardFields';
import placeholderImgSrc from '../placeholder.png';

import {ImgOverlay, TextField, MediaField} from './mixinsCardFront';

const TagField = ({values, className, style, onClick}) => {
  if (!values) return null;
  return (
    <div
      onClick={onClick}
      className={`flex ${className} items-center flex-wrap`}
      style={{...style}}>
      {values.map(t => (
        <div className="tag-label bg-black text-xl mr-1 mt-1 mb-1">{t}</div>
      ))}
    </div>
  );
};

TagField.defaultProps = {
  values: [],
  className: '',
  style: {},
  onClick: d => d,
};

export const TitleField = ({onClick, edit, children, className, value}) => {
  if (!value) return null;
  return (
    <div className={`flex ${className}`} onClick={onClick}>
      <h1 className="text-muted mr-1">{value}</h1>
    </div>
  );
};

// const createIcon = type =>
//   React.createElement(type, {
//     style: {color: 'black'},
//   });

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
    onPointsClick: PropTypes.func,
    bottomControls: PropTypes.node,
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
    onPointsClick: d => d,
    bottomControls: <React.Fragment />,
  };

  render() {
    const {
      title,
      tags,
      img,
      points,
      description,
      media,
      // background,
      challengeSubmission,
      style,
      smallScreen,

      onClose,
      onImgClick,
      onDescriptionClick,
      onMediaClick,
      onTitleClick,
      onChallengeClick,
      onFlip,
      onTagsClick,
      onCreate,
      template,
      onPointsClick,
      bottomControls,
      className,
    } = this.props;

    // console.log('media', media, title);
    // const numInitFields = getNumInitFields(this.props);

    return (
      <div
        style={{...style}}
        className={`flex flex-col w-full h-full ${className}`}>
        <ImgOverlay
          onClick={onImgClick}
          src={img ? img.url : null}
          style={{
            // maxHeight: '35%',
            flex: '0 1 50%',
            // flex: `0 1 ${100 - numInitFields * 10}%`,
            cursor: 'pointer',
          }}>
          <div className="absolute z-10 w-full h-full flex justify-end items-end">
            <MediaField
              className="m-1 flex justify-between items-center"
              media={media}
              onClick={onMediaClick}
            />
          </div>
        </ImgOverlay>

        <div className="flex-grow flex flex-col mt-3 mr-3 ml-3 mb-1">
          <TitleField
            className="flex-no-shrink mb-2"
            onClick={onTitleClick}
            value={title && title.value}
          />

          <TagField
            values={tags && tags.value}
            onClick={onTagsClick}
            className="flex-no-shrink mb-2"
          />

          <TextField
            className="flex-no-shrink"
            value={description && description.value}
            style={{flex: '0 1 auto'}}
            onClick={onDescriptionClick}
          />
        </div>

        <CardControls onFlip={onFlip} onClose={onClose}>
          <div className="flex ml-auto mr-auto mb-2">{bottomControls}</div>
        </CardControls>
      </div>
    );
  }
}

export default CardFront;
