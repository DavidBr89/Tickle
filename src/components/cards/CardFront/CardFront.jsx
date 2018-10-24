import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import placeholderImgSrc from '../placeholder.png';

import {Edit} from 'react-feather';

import {mediaScale} from 'Constants/mediaTypes';

import CardControls from 'Components/cards/CardControls';

const createIcon = type =>
  React.createElement(type, {
    style: {color: 'white'},
  });

// const iconClasses =
//   'border border-white p-1 m-1 flex-col-wrapper items-center text-white';

const IconCont = ({className, styles, onClick, children}) => (
  <div className="ml-1 flex items-center cursor-pointer" onClick={onClick}>
    <div className={`flex-col-wrapper justify-center ${className}`}>
      {children}
    </div>
  </div>
);

IconCont.defaultProps = {
  className: 'text-white',
};

const MediaIcons = ({media}) => (
  <div className="ml-1 flex items-center">
    {media.map(m => (
      <IconCont className="p-1 m-1 border-white border-2">
        {createIcon(mediaScale(m.type))}
      </IconCont>
    ))}
  </div>
);

export const PreviewTags = ({
  values,
  style,
  placeholder,
  small,
  colorScale,
  onClick,
  className
}) => {
  const tagData = values && values.length > 0 ? values : ['No Tags'];
  return (
    <div
      onClick={onClick}
      className={`flex ${className} overflow-hidden`}
      style={{
        flexWrap: 'wrap',
        ...style,
      }}>
      {tagData.map(t => (
        <div className="tag-label text-xl">{t} </div>
      ))}
    </div>
  );
};

PreviewTags.propTypes = {
  values: PropTypes.oneOfType([PropTypes.array, null]),
  style: PropTypes.object,
  placeholder: PropTypes.string,
};

PreviewTags.defaultProps = {
  values: null,
  style: {},
};

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

const EditIcon = ({edit, className, style, onClick}) => (
  <IconCont
    className={`text-black ${className}`}
    onClick={onClick}
    style={style}>
    <Edit size={30} />
  </IconCont>
);

const Title = ({onClick, edit, children, className}) => (
  <div className={`flex items-center ${className}`} onClick={onClick}>
    <div className="flex flex-grow justify-between">
      {children === null ? (
        <h1 className="text-muted">No Title</h1>
      ) : (
        <h1>{children}</h1>
      )}
      {edit && <EditIcon />}
    </div>
  </div>
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
  <div
    className={`${className}`}
    style={{...style, cursor: 'pointer'}}
    onClick={onClick || onEdit}>
    <div className="flex">
      <div className="flex-grow text-xl">
        {text || <p style={{fontStyle: 'italic'}}>{placeholder}</p>}
      </div>
      { edit && <EditIcon /> }
    </div>
  </div>
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
                    <EditIcon edit={edit} />
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
      bottomControls,
      className
    } = this.props;

    // console.log('mediaIcons', mediaIcons);
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          ...style
        }}
        className={`flex flex-col ${className}`}
      >
        <ImgOverlay
          onClick={!edit ? onImgClick : null}
          src={img ? img.url : null}
          style={{
            flex: '0 1 50%',
            cursor: !edit && 'pointer',
          }}
        >
          <div className="absolute z-10 w-full h-full flex items-end">
            {edit && (
              <EditIcon
                className="m-1 p-1 text-white"
                onClick={edit ? onImgClick : null}
              />
            )}
          </div>

          <div className="z-0 absolute w-full h-full flex justify-end items-end">
            <MediaIcons media={media} />
          </div>
        </ImgOverlay>
        <div className="flex flex-col mt-3 mr-3 ml-3 mb-1">
          <Title edit={edit} className="m-1" onClick={onTitleClick}>
            {title}
          </Title>

          <div className="flex justify-between m-1" onClick={onTagsClick}>
            <PreviewTags values={tags} className="" />
            {edit && <EditIcon edit={edit} className="ml-1" />}
          </div>
          <DescriptionField
            text={description}
            className="m-1"
            placeholder="No Description"
            style={{flex: '0 1 auto'}}
            edit={edit}
            onEdit={onDescriptionClick}
          />

          {edit && (
            <DescriptionField
              className="m-1"
              text={null}
              placeholder="Add Media"
              style={{flex: '0 1 auto'}}
              edit={edit}
              onEdit={onMediaClick}
            />
          )}
        </div>

        <CardControls onFlip={onFlip} onClose={onClose}>
          <div className="flex ml-auto mr-auto">{bottomControls}</div>
        </CardControls>
      </div>
    );
  }
}

export default CardFront;
