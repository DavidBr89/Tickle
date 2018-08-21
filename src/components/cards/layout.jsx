import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite/no-important';
// import Grid from 'mygrid/dist';
import { mediaScale } from 'Constants/mediaTypes';
import { profileSrc, colorClass, colorScaleRandom } from './styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { FieldSet } from 'Components/utils/StyledComps';

import { RefreshCcw, Edit, ZoomIn } from 'react-feather';

// TODO: remove
import placeholderImgSrc from './placeholder.png';

const challengeTypes = ['quiz', 'gap text', 'hangman'];

// TODO: remove SASS dependence
// TODO: remove SASS dependence
// TODO: remove SASS dependence
// TODO: remove SASS dependence
const EditIcon = ({ style, className, ...props }) => (
  <span style={{ cursor: 'pointer', fontSize: '1.2rem', ...style }}>
    <Edit size={30} {...props} />
  </span>
);

const ZoomIcon = ({ style, className, ...props }) => (
  <span style={{ cursor: 'pointer', fontSize: '1.2rem', ...style }}>
    <ZoomIn size={30} {...props} />
  </span>
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
const FieldIcon = ({ edit }) =>
  edit ? <EditIcon size={20} /> : <ZoomIcon size={20} />;

export const ChallengeField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  style,
  edit
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, shallowBorder } }) => (
      <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
        <FieldSet
          edit={edit}
          uiColor={uiColor}
          legend="Challenge"
          className={`${css(shallowBg)} ${css(shallowBorder)}`}
          icon={<FieldIcon edit={edit} />}
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
              className={css(stylesheet.truncate)}
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
  className,
  style,
  edit
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, shallowBorder } }) => (
      <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
        <FieldSet
          uiColor={uiColor}
          className={`${css(shallowBg)} ${css(shallowBorder)} ${className}`}
          legend="Description"
          icon={<FieldIcon edit={edit} />}
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
              className={css(stylesheet.truncate)}
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

const MediaField = ({
  media,
  onEdit,
  onClick,
  style,
  placeholder,
  edit,
  smallScreen,
  className
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet: { shallowBg, shallowBorder } }) => (
      <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
        <FieldSet
          icon={<FieldIcon edit={edit} />}
          className={`${css(shallowBg)} ${css(shallowBorder)} ${className}`}
          legend="Media"
          uiColor={uiColor}
        >
          <div style={{ display: 'flex', alignContent: 'end' }}>
            {Array.isArray(media) && media.length > 0 ? (
              <PreviewMedia
                data={media}
                smallScreen={smallScreen}
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

const PreviewMedia = ({ data, style, smallScreen }) => (
  <div
    style={{
      style,
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%'
    }}
  >
    {data.map(m => (
      <div
        key={m.url}
        className="mr-1"
        style={{
          display: 'flex',
          maxWidth: `${
            smallScreen
              ? Math.max(80 / data.length, 45)
              : Math.max(100 / data.length, 40)
          }%`
        }}
      >
        <div className="mr-1">{React.createElement(mediaScale(m.type))}</div>
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {m.title}
        </div>
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
    <EditIcon />
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
      width: '100%',
      height: '100%',
      // pointerEvents: 'none',
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

export const ImgOverlay = ({ src, className, style, children, footer }) => (
  <div
    className={className}
    style={{ position: 'relative', width: '100%', ...style }}
  >
    <Img src={src} />
    <div
      className="m-2"
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
    {footer}
  </div>
);

ImgOverlay.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string
};

ImgOverlay.defaultProps = {
  src: placeholderImgSrc,
  style: {},
  children: null,
  footer: null,
  className: ''
};

export const BigButton = ({
  collected,
  onClick,
  expPoints,
  style,
  edit,
  children,
  disabled,
  className
}) => (
  <CardThemeConsumer>
    {({ uiColor, stylesheet }) => (
      <button
        className={`${className} ${css(stylesheet.btn)}`}
        disabled={disabled}
        style={{
          width: '100%',
          // display: 'inline-flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          ...style
        }}
        onClick={onClick}
      >
        <div style={{ fontWeight: 'bold', fontSize: 'large' }}>{children}</div>
      </button>
    )}
  </CardThemeConsumer>
);

BigButton.propTypes = {
  disabled: PropTypes.bool,
  edit: PropTypes.bool,
  onClick: PropTypes.func,
  expPoints: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

BigButton.defaultProps = {
  disabled: false,
  toggleCardChallenge: d => d,
  expPoints: 60,
  color: 'black',
  onClick: d => d,
  edit: false,
  style: {},
  disabled: false
};

export const FlipButton = ({ style, onClick, color, disabled, className }) => (
  <BigButton
    onClick={onClick}
    color={color}
    style={style}
    className={className}
    disabled={disabled}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <RefreshCcw />
    </div>
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

export const Btn = ({
  onClick,
  children,
  disabled,
  className,
  style = {},
  stylesheet = stylesheet
}) => (
  <CardThemeConsumer>
    {({ stylesheet: { btn } }) => (
      <button
        className={`${css(btn)} ${className}`}
        style={{ ...style }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )}
  </CardThemeConsumer>
);

export const PreviewTags = ({ data, style, placeholder, small, colorScale }) =>
  data !== null && data.length === 0 ? (
    <div className="alert alert-danger">
      <strong>No Tag!</strong> Please add at least one tag!
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        overflow: 'hidden',
        ...style,
        ...tagsStyle
        // overflowY: 'visible'
        // flexWrap: 'no-wrap'
        // alignItems: 'center'
      }}
    >
      {data !== null &&
        data.length > 0 &&
        data.map(t => <Tag title={t} color={tagColor} small={small} />)}
    </div>
  );

export {
  DescriptionField,
  PreviewMedia,
  MediaField,
  EditButton,
  Img,
  Comments
};
