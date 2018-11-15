import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';


import CardControls from 'Components/cards/CardControls';
import placeholderImgSrc from '../placeholder.png';

import {
  ImgOverlay, TextField, TagField, MediaField, TitleField
} from './mixinsCardFront';


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
    bottomControls: PropTypes.node
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
    bottomControls: <React.Fragment />
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
      onTagsClick,
      onCreate,
      edit,
      template,
      points,
      onPointsClick,
      bottomControls,
      className
    } = this.props;

    // console.log('mediaIcons', mediaIcons);
    return (
      <div
        style={{ ...style }}
        className={`flex flex-col w-full h-full ${className}`}
      >
        <ImgOverlay
          onClick={onImgClick}
          src={img ? img.url : null}
          style={{
            flex: '0 1 50%',
            cursor: 'pointer'
          }}
        >
          <div
            className="absolute z-10 w-full h-full flex justify-end items-end"
          >
            <MediaField
              className="m-1 flex justify-between items-center"
              values={media}
              onClick={onMediaClick}
            />
          </div>

        </ImgOverlay>

        <div className="flex flex-col mt-3 mr-3 ml-3 mb-1">
          <TitleField hidden={title !== null} className="m-1" onClick={onTitleClick}>
            {title}
          </TitleField>

          <TagField hidden={tags.length === 0} values={tags} onClick={onTagsClick} />

          <TextField
            className="m-1"
            hidden={description === null}
            style={{ flex: '0 1 auto' }}
            onClick={onDescriptionClick}
          >
            {description}
          </TextField>
        </div>

        <CardControls onFlip={onFlip} onClose={onClose}>
          <div className="flex ml-auto mr-auto">{bottomControls}</div>
        </CardControls>
      </div>
    );
  }
}

export default CardFront;
