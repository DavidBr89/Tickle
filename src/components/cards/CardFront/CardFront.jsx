import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {PreviewTags} from 'Utils/Tag';

import placeholderImgSrc from '../placeholder.png';

import {Edit} from 'react-feather';

import {FieldSet} from 'Components/utils/StyledComps';
import {mediaScale} from 'Constants/mediaTypes';

import CardControls from 'Components/cards/CardControls';

const defaultProps = {};

const MediaIcons = ({media}) => (
  <div className="ml-1" style={{display: 'flex', alignItems: 'center'}}>
    {media.map(m =>
      React.createElement(mediaScale(m.type), {
        className: 'm-1',
        style: {background: 'white'}
      }),
    )}
  </div>
);

const TagLabels = ({tags, tagColorScale}) => (
  <PreviewTags
    colorScale={tagColorScale}
    data={tags && tags.length > 0 ? tags : ['No Tags']}
  />
);

const ImgOverlay = ({src, className, style, children, footer, onClick}) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      overflow: 'hidden',
      ...style
    }}
  >
    <img
      src={src || placeholderImgSrc}
      alt="Card img"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
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

const FieldIcon = ({edit, className, style, onClick}) =>
  edit ? (
    <span
      className={className}
      onClick={onClick}
      style={{
        cursor: 'pointer',

        ...style
      }}
    >
      <Edit
        size={25}
        style={{
          background: 'white'
        }}
      />
    </span>
  ) : (
    <div
      className={className}
      style={{cursor: 'pointer', background: 'white', ...style}}
    />
  );

const Title = ({onClick, edit, children}) => (
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
  <FieldSet
    className={`border ${className}`}
    legend="Description"
    style={{...style, cursor: 'pointer'}}
    onClick={onClick || onEdit}>
    <div style={{display: 'flex'}}>
      <div style={{width: '100%'}}>
        {text || <p style={{fontStyle: 'italic'}}>{placeholder}</p>}
      </div>
      <FieldIcon edit={edit} />
    </div>
  </FieldSet>
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

const EditButton = ({style, onClick, className}) => (
  <button className={`close ml-1 ${className}`} style={style} onClick={onClick}>
    <Edit />
  </button>
);

EditButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

EditButton.defaultProps = {style: {}, onClick: () => null, className: ''};

/*

            <div
              className="m-1"
              onClick={edit ? onPointsClick : null}
              style={{
                zIndex: edit && 400,
                background: 'white'
              }}
            >
              <div
                className="pl-1 pr-1"
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: 'xx-large' }}>{points}P</div>
                {edit && (
                  <div
                    className="ml-1"
                    style={{
                      // display: 'flex',
                      // alignItems: 'center',
                      height: '50%'
                    }}
                  >
                    <FieldIcon edit={edit} />
                  </div>
                )}
              </div>
            </div>
            */

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
      bottomControls
    } = this.props;

    // console.log('mediaIcons', mediaIcons);
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          ...style
        }}
        className="flex flex-col">
        <ImgOverlay
          onClick={!edit ? onImgClick : null}
          src={img ? img.url : null}
          style={{
            flex: '0 1 50%',
            cursor: !edit && 'pointer',
            minHeight: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              zIndex: 1
            }}
          >
            <FieldIcon
              edit={edit}
              className="m-1"
              onClick={edit ? onImgClick : null}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: 0
            }}
          >
            <MediaIcons media={media} />
          </div>
          <div
            style={{
              // width: '100%',
              // height: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
              // alignItems: 'flex-end'
            }}
          />
        </ImgOverlay>
        <div
          className="mt-3 mr-3 ml-3 mb-1"
          style={{
            flex: '0 1 auto',
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
            style={{display: 'flex', alignItems: 'center'}}
            onClick={onTagsClick}
          >
            <TagLabels tags={tags} tagColorScale={tagColorScale} />
            <FieldIcon edit={edit} className="ml-1" />
          </div>
          <DescriptionField
            text={description}
            placeholder="No Description"
            style={{flex: '0 1 auto'}}
            edit={edit}
            onEdit={onDescriptionClick}
          />

          {edit && (
            <DescriptionField
              className="mt-1"
              text={null}
              placeholder="Add Media"
              style={{flex: '0 1 auto'}}
              edit={edit}
              onEdit={onMediaClick}
            />
          )}
        </div>

        <CardControls onFlip={onFlip} onClose={onClose}>
          <div
            style={{marginLeft: 'auto', marginRight: 'auto', display: 'flex'}}
          >
            {bottomControls}
          </div>
        </CardControls>
      </div>
    );
  }
}

export default CardFront;
