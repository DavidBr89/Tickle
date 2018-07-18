import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleOrdinal } from 'd3';
import * as Icon from 'react-feather';
// import Grid from 'mygrid/dist';
import { WithContext as ReactTags } from 'react-tag-input';
import { ARTICLE, PHOTO, GIF, VIDEO } from 'Constants/mediaTypes';
import { profileSrc, colorClass, colorScaleRandom } from './styles';
import cxx from './layout.scss';
import { css } from 'aphrodite/no-important';

// TODO: remove
// import { ModalBody } from '../utils/Modal';
// import placeholderImgSrc from './placeholder.png';

import cx from './Card.scss';

import placeholderImgSrc from './placeholder.png';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

const challengeTypes = ['quiz', 'gap text', 'hangman'];
const mediaScale = scaleOrdinal()
  .domain([ARTICLE, PHOTO, GIF, VIDEO])
  .range([Icon.AlignLeft, Icon.Image, Icon.Image, Icon.Film]);

export const ZoomIcon = ({ style, className }) => (
  <i
    className={`fa fa-search ${className} ${cxx.icon}`}
    style={{ cursor: 'pointer', opacity: 0.75, fontSize: '1rem', ...style }}
  />
);

ZoomIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
ZoomIcon.defaultProps = { style: {}, className: '' };

const EditIcon = ({ style, className }) => (
  <i
    className={`fa fa-pencil-square-o ${className} ${cxx.icon}`}
    style={{ cursor: 'pointer', fontSize: '1.2rem', ...style }}
  />
);

EditIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
EditIcon.defaultProps = { style: {}, className: '' };

const Legend = ({ children, style }) => (
  <legend
    style={{
      width: 'unset',
      marginRight: '2px',
      fontSize: '18px',
      marginBottom: 0,
      fontStyle: 'italic',
      ...style
    }}
  >
    {children}
  </legend>
);

Legend.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node
};

Legend.defaultProps = { style: {}, children: null };

// TODO: later
// !edit ? (
//               <SearchIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
//             ) : (
//               <EditIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
//             )

export const FieldSet = ({
  children,
  legend,
  style,
  edit,
  uiColor,
  onClick,
  legendStyle,
  bodyStyle,
  className,
  icon
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      // border: `1px solid ${uiColor}`,
      marginTop: '4px',
      width: '100%',
      height: '100%',
      padding: 10,
      overflow: 'hidden',
      ...style
      // overflow: 'hidden'
    }}
  >
    <div
      style={{
        position: 'relative',
        ...bodyStyle
      }}
    >
      <div>
        <h5 style={legendStyle}>
          <span>
            {legend} {icon}
          </span>
        </h5>
      </div>
    </div>
    {children}
  </div>
);

FieldSet.propTypes = {
  uiColor: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.oneOf([null, PropTypes.func]),
  legendStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  icon: PropTypes.oneOf([PropTypes.node, null])
};

FieldSet.defaultProps = {
  edit: false,
  uiColor: 'grey',
  classname: '',
  onClick: null,
  style: {},
  legendStyle: {},
  bodyStyle: {}
};

export const ChallengeField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  style,
  edit
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, fieldSetBorder } }) => (
      <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
        <FieldSet
          edit={edit}
          uiColor={uiColor}
          legend="Challenge"
          className={`${css(shallowBg)} ${css(fieldSetBorder)}`}
          icon={edit ? <EditIcon /> : <ZoomIcon />}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <div
              className={cx.textClamp}
              style={{ height: '100%', overflow: 'hidden' }}
            >
              {text !== null ? (
                text
              ) : (
                <span style={{ fontStyle: 'italic' }}>{placeholder}</span>
              )}
            </div>
          </div>
        </FieldSet>
      </div>
    )}
  </CardThemeConsumer>
);

ChallengeField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

ChallengeField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  placeholder: 'Add a challenge to your Card',
  style: {},
  edit: false
};

const DescriptionField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  style,
  edit
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, fieldSetBorder } }) => (
      <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
        <FieldSet
          uiColor={uiColor}
          className={`${css(shallowBg)} ${css(fieldSetBorder)}`}
          legend="Description"
          icon={edit ? <EditIcon /> : <ZoomIcon />}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <div
              className={cx.textClamp}
              style={{ height: '100%', overflow: 'hidden' }}
            >
              {text !== null ? (
                text
              ) : (
                <span style={{ fontStyle: 'italic' }}>{placeholder}</span>
              )}
            </div>
          </div>
        </FieldSet>
      </div>
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

const MediaField = ({ media, onEdit, onClick, style, placeholder, edit }) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, fieldSetBorder } }) => (
      <div
        style={{ ...style, cursor: 'pointer', overflow: 'hidden' }}
        onClick={onClick || onEdit}
      >
        <FieldSet
          icon={edit ? <EditIcon /> : <ZoomIcon />}
          className={`${css(shallowBg)} ${css(fieldSetBorder)}`}
          legend="Media"
          uiColor={uiColor}
        >
          <div style={{ display: 'flex', alignContent: 'end' }}>
            {Array.isArray(media) && media.length > 0 ? (
              <PreviewMedia
                data={media.slice(0, 4)}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div style={{ fontStyle: 'italic' }}>{placeholder}</div>
            )}
          </div>
        </FieldSet>
      </div>
    )}
  </CardThemeConsumer>
);

MediaField.propTypes = {
  media: PropTypes.oneOf([null, PropTypes.array]),
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

MediaField.defaultProps = {
  media: null,
  onEdit: null,
  onClick: null,
  placeholder: 'Add a video, webpage or a sound snippet',
  style: {},
  edit: false
};

const PreviewMedia = ({ data, style }) => (
  <div
    style={{
      style,
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}
  >
    {data.map((m, i) => (
      <div
        key={m.url}
        className="mr-3 mb-1"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div className="mr-1">{React.createElement(mediaScale(m.type))}</div>
        <div className={` ${cx.textTrunc}`}>{m.title}</div>
      </div>
    ))}
  </div>
);

PreviewMedia.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object
  // extended: PropTypes.bool
};

PreviewMedia.defaultProps = {
  data: [{ title: 'bka', url: 'bla', descr: 'bla' }],
  extended: false,
  style: { width: '90%' }
};

const EditButton = ({ style, onClick, className }) => (
  <button className={`close ml-1 ${className}`} style={style} onClick={onClick}>
    <EditIcon style={{ fontSize: '2rem' }} />
  </button>
);

EditButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func
};

EditButton.defaultProps = { style: {}, onClick: () => null, className: '' };

const Img = ({ src, style }) => (
  <div
    className="mt-1 mb-1"
    style={{
      border: '1px solid var(--black)',
      width: '100%',
      height: '100%',
      ...style
    }}
  >
    <img
      src={src || placeholderImgSrc}
      alt="Card img"
      style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
    />
  </div>
);

Img.propTypes = {
  src: PropTypes.string,
  style: {}
};

Img.defaultProps = { src: null, style: {} };

export const ImgOverlay = ({ src, style, children, footer }) => (
  <div style={{ position: 'relative', ...style }}>
    <Img src={src} />
    <div
      className="m-2 "
      style={{ position: 'absolute', zIndex: 200, left: 0, top: 0 }}
    >
      {children}
    </div>
    {footer}
  </div>
);

ImgOverlay.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  footer: PropTypes.node
};

ImgOverlay.defaultProps = {
  src: placeholderImgSrc,
  style: {},
  children: null,
  footer: null
};

export const BigButton = ({
  collected,
  onClick,
  expPoints,
  style,
  edit,
  children,
  className
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet }) => (
      <button
        className={`${className} ${css(stylesheet.btn)}`}
        disabled={collected}
        style={{
          width: '100%',
          // display: 'inline-flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          ...style
        }}
        onClick={onClick}
      >
        <div style={{ fontWeight: 'bold', fontSize: 'large' }}>
          {children}
          {edit && <EditIcon className="ml-1" />}
        </div>
      </button>
    )}
  </CardThemeConsumer>
);

BigButton.propTypes = {
  collected: PropTypes.bool,
  edit: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

BigButton.defaultProps = {
  collected: false,
  toggleCardChallenge: d => d,
  expPoints: 60,
  color: 'black',
  onClick: d => d,
  edit: false,
  style: {}
};

export const FlipButton = ({ style, onClick, color, className }) => (
  <BigButton
    onClick={onClick}
    color={color}
    style={style}
    className={className}
  >
    <i
      className="fa fa-retweet fa-2x"
      style={{ fontSize: 32 }}
      aria-hidden="true"
    />
  </BigButton>
);

FlipButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string
};
FlipButton.defaultProps = {
  style: {},
  onClick: d => d,
  color: 'black',
  className: ''
};

const randomComment = () =>
  [
    'woah, what a nice card',
    'that was really a hidden and interesting place',
    'A real piece of art',
    'this is one of the best sights in Brussels',
    'without this app I would have never found this place'
  ][Math.floor(Math.random() * 4)];

const Comments = ({ data, extended, onClose }) => (
  <div>
    {extended && (
      <button
        type="button"
        className="close "
        data-dismiss="modal"
        aria-label="Close"
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
    )}
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div>
        {data.map(({ comment, user, date, imgSrc }) => (
          <div style={{ display: 'flex' }}>
            <img
              className={`${cx.avatar} mr-3`}
              width="20%"
              height="20%"
              src={profileSrc()}
              alt="alt"
            />
            <div className="media-body">
              <div className={cx.textClamp}>
                <small>{randomComment()}</small>
              </div>
              <div>
                <small className="font-italic">
                  - {user}, {date && date.toString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

Comments.propTypes = {
  data: PropTypes.array.isRequired,
  extended: PropTypes.bool.isRequired
};

Comments.defaultProps = {
  data: [
    {
      user: 'Jan',
      date: new Date(),
      comment: 'Yes, cool shit',
      imgSrc: profileSrc()
    }
  ],
  extended: false
};

export {
  DescriptionField,
  PreviewMedia,
  MediaField,
  EditButton,
  Img,
  Comments
};
