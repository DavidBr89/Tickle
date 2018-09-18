import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaOverview } from 'Components/cards/MediaSearch';

import placeholderImgSrc from '../placeholder.png';

import { X, Edit, Search, RotateCcw } from 'react-feather';

import { FieldSet } from 'Components/utils/StyledComps';

import { mediaScale } from 'Constants/mediaTypes';
import CardControls from 'Components/cards/CardControls';

import {
  // MediaField,
  // ChallengeField,
  // DescriptionField,
  // EditButton,
  // Img,
  // ZoomIcon,
  BigButton,
  FlipButton
} from '../layout';

const defaultProps = {};

const TagLabels = ({ tags, tagColorScale }) => (
  <PreviewTags
    colorScale={tagColorScale}
    data={tags && tags.length > 0 ? tags : ['No Tags']}
  />
);

const ImgOverlay = ({ src, className, style, children, footer, onClick }) => (
  <div
    onClick={onClick}
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
        height: '100%',
        // zIndex: 200,
        left: 0,
        top: 0
      }}
    >
      {children}
    </div>
  </div>
);

const FieldIcon = ({ edit, className, style }) =>
  edit ? (
    <span className={className} style={{ cursor: 'pointer', ...style }}>
      <Edit size={25} />
    </span>
  ) : (
    <span className={className} style={{ cursor: 'pointer', ...style }} />
  );

const Title = ({ onClick, edit, children }) => (
  <h1 className="text-truncate" onClick={onClick}>
    {children === null ? (
      <div>
        <span className="text-muted">No Title</span> <FieldIcon edit={edit} />
      </div>
    ) : (
      <React.Fragment>
        {children} <FieldIcon edit={edit} />
      </React.Fragment>
    )}
  </h1>
);

const DescriptionField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  className,
  style,
  edit
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, shallowBorder } }) => (
      <FieldSet
        uiColor={uiColor}
        className={`${css(shallowBg)} ${css(shallowBorder)} ${className}`}
        legend="Description"
        style={{ ...style, cursor: 'pointer' }}
        onClick={onClick || onEdit}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {text || <p style={{ fontStyle: 'italic' }}>{placeholder}</p>}
          </div>
          <FieldIcon edit={edit} />
        </div>
      </FieldSet>
    )}
  </CardThemeConsumer>
);

DescriptionField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

DescriptionField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  placeholder:
    'Add a description for your card to give hints how to succeed the Challenge',
  style: {},
  edit: false
};

const EditButton = ({ style, onClick, className }) => (
  <button className={`close ml-1 ${className}`} style={style} onClick={onClick}>
    <Edit />
  </button>
);

EditButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

EditButton.defaultProps = { style: {}, onClick: () => null, className: '' };

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
      onTagsClick,
      onCreate,
      edit,
      template
    } = this.props;

    const { cardLayout, btn } = stylesheet;

    return (
      <div
        style={{
          height: '100%',
          zIndex: 3000,
          border: '5px grey solid',
          ...style
        }}
        className={css(cardLayout)}
      >
        <ImgOverlay
          onClick={onImgClick}
          src={img ? img.url : null}
          style={{
            flex: '0 1 40%',
            minHeight: 0
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end'
            }}
          >
            <FieldIcon edit={edit} className="m-1" />
          </div>
        </ImgOverlay>
        <div
          className="mt-3 mr-3 ml-3 mb-1"
          style={{
            flex: '0 1 60%',
            display: 'flex',
            flexDirection: 'column'
            // justifyContent: 'space-around'
          }}
        >
          <Title edit={edit} onClick={onTitleClick}>
            {title}
          </Title>

          <div
            className="mb-1"
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={onTagsClick}
          >
            <TagLabels tags={tags} tagColorScale={tagColorScale} />
            <FieldIcon edit={edit} className="ml-1" />
          </div>
          <DescriptionField
            text={description}
            placeholder="No Description"
            style={{ flex: '0 1 auto' }}
            edit={edit}
            onEdit={onDescriptionClick}
          />
        </div>
        <CardControls onFlip={onFlip} onClose={onClose}>
          <div
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}
          >
            <BigButton onClick={onChallengeClick}>Challenge</BigButton>
            {template && (
              <BigButton className="ml-1" onClick={onCreate}>
                Create
              </BigButton>
            )}
          </div>
        </CardControls>
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
