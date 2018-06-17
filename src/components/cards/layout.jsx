import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Grid from 'mygrid/dist';
import { WithContext as ReactTags } from 'react-tag-input';
import { profileSrc, mediaScale, colorClass, colorScaleRandom } from './styles';

import cxx from './layout.scss';

// TODO: remove
// import { ModalBody } from '../utils/Modal';
// import placeholderImgSrc from './placeholder.png';

import cx from './Card.scss';

import placeholderImgSrc from './placeholder.png';

console.log('cxxx', cxx);

const SearchIcon = ({ style, className }) => (
  <i
    className={`fa fa-search ${className} ${cxx.icon}`}
    style={{ cursor: 'pointer', opacity: 0.75, fontSize: '1rem', ...style }}
  />
);

SearchIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
SearchIcon.defaultProps = { style: {}, className: '' };

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

const FieldSet = ({ children, legend, style, edit, borderColor, onClick }) => (
  <div style={{ overflow: 'hidden', ...style }} onClick={onClick}>
    <div
      style={{
        border: `1px solid ${borderColor}`,
        marginTop: '4px',
        padding: '10px',
        width: '100%',
        height: '100%'
        // overflow: 'hidden'
      }}
    >
      <h5 className={cxx.hover}>
        <span>
          {legend}{' '}
          {!edit ? (
            <SearchIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
          ) : (
            <EditIcon style={{ cursor: 'pointer', fontSize: '1.2rem' }} />
          )}
        </span>
      </h5>
      {children}
    </div>
  </div>
);

FieldSet.propTypes = {
  borderColor: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.oneOf([null, PropTypes.func])
};

FieldSet.defaultProps = {
  edit: false,
  borderColor: 'grey',
  classname: '',
  onClick: null,
  style: {}
};

export const ChallengeField = ({
  text,
  onEdit,
  onClick,
  placeholder,
  style,
  borderColor,
  edit
}) => (
  <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
    <FieldSet edit={edit} borderColor={borderColor} legend="Challenge">
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
);

ChallengeField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

ChallengeField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  borderColor: null,
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
  borderColor,
  edit
}) => (
  <div style={{ ...style, cursor: 'pointer' }} onClick={onClick || onEdit}>
    <FieldSet edit={edit} borderColor={borderColor} legend="Description">
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
);

DescriptionField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

DescriptionField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  borderColor: null,
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
  borderColor,
  edit
}) => (
  <div
    style={{ ...style, cursor: 'pointer', overflow: 'hidden' }}
    onClick={onClick || onEdit}
  >
    <FieldSet edit={edit} legend="Media" borderColor={borderColor}>
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
);

MediaField.propTypes = {
  media: PropTypes.oneOf([null, PropTypes.array]),
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  borderColor: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool
};

MediaField.defaultProps = {
  media: null,
  onEdit: null,
  onClick: null,
  placeholder: 'Add a video, webpage or a sound snippet',
  style: {},
  borderColor: 'grey',
  edit: false
};

const PreviewMedia = ({ data, style }) => (
  <div style={style}>
    <div cols={data.length > 1 ? 2 : 0} rows={Math.min(data.length / 2, 1)}>
      {data.map(m => (
        <div key={m.url}>
          <div className="mr-1 row">
            <i
              style={{ fontSize: '20px' }}
              className={`fa ${mediaScale(m.type)} col-1`}
              aria-hidden="true"
            />
            <div className={`ml-1 col ${cx.textTrunc}`}>{m.title}</div>
          </div>
        </div>
      ))}
    </div>
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
  color,
  style,
  edit,
  children,
  className
}) => (
  <button
    className={`btn btn-active btn-lg btn-block ${className}`}
    disabled={collected}
    style={{
      width: '100%',
      alignSelf: 'flex-end',
      background: color,
      fontWeight: 'bold',
      ...style
    }}
    onClick={onClick}
  >
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{ display: 'inline-flex' }}>
        {children}
        {edit && (
          <EditIcon
            className="ml-1"
            style={{ color: 'white', fontSize: '2rem' }}
          />
        )}
      </span>
    </div>
  </button>
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
  FieldSet,
  DescriptionField,
  PreviewMedia,
  MediaField,
  EditButton,
  Img,
  Comments
};
