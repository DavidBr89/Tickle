import React from 'react';
import PropTypes from 'prop-types';

import IcAk from 'Styles/alphabet_icons/ic_ak.svg';
import Edit from 'react-feather/dist/icons/edit';

import {mediaScale} from 'Constants/mediaTypes';

const createIcon = type =>
  React.createElement(type, {
    style: {color: 'black'},
  });

// const iconClasses =
//   'border border-white p-1 m-1 flex-col-wrapper items-center text-white';

const IconCont = ({className, styles, onClick, children}) => (
  <div className="mr-1 flex items-center cursor-pointer" onClick={onClick}>
    <div className={`flex-col-wrapper justify-center ${className}`}>
      {children}
    </div>
  </div>
);

IconCont.defaultProps = {
  className: 'text-white',
};

export const MediaField = ({media, onClick, edit, className}) => {
  const {value} = media;
  if (!value) return null;
  return (
    <div className={className}>
      <div className="flex justify-end items-end">
        {value.map(m => (
          <IconCont className="p-1 m-1 border-black border-2">
            {createIcon(mediaScale(m.type))}
          </IconCont>
        ))}
      </div>
    </div>
  );
};
const MediaIcons = ({values}) => (
  <div className="flex items-center">
    {values.map(m => (
      <IconCont className="p-1 m-1 border-black border-2">
        {createIcon(mediaScale(m.type))}
      </IconCont>
    ))}
  </div>
);

const PreviewTags = ({
  values,
  style,
  placeholder,
  small,
  colorScale,
  onClick,
  className,
}) => (
  <div
    onClick={onClick}
    className={`flex ${className} items-center flex-wrap`}
    style={{...style}}>
    {values.map(t => (
      <div className="tag-label text-xl mr-1 mt-1 mb-1">{t}</div>
    ))}
  </div>
);

PreviewTags.propTypes = {
  values: PropTypes.oneOfType([PropTypes.array, null]),
  style: PropTypes.object,
  placeholder: PropTypes.string,
};

PreviewTags.defaultProps = {
  values: null,
  style: {},
};

export const TagField = ({values, edit, onClick, placeholder}) => {
  if (values === null) return null;

  return (
    <div className="flex items-center" onClick={onClick}>
      {values.length === 0 ? (
        <div className="text-xl italic">{placeholder}</div>
      ) : (
        <PreviewTags values={values} />
      )}
    </div>
  );
};

TagField.defaultProps = {placeholder: 'Add Tags'};

export const ImgOverlay = ({
  src,
  className,
  style,
  children,
  footer,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
      overflow: 'hidden',
      ...style,
    }}>
    {src ? (
      <img
        src={src}
        alt="Card img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    ) : (
      <div className="w-full h-full bg-yellow-dark p-8">
        <img className="w-full h-full" src={IcAk} />
      </div>
    )}
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        // zIndex: 200,
        left: 0,
        top: 0,
      }}>
      {children}
    </div>
  </div>
);

export const EditIcon = ({edit, className, style, onClick}) => (
  <IconCont
    className={`text-black ${className}`}
    onClick={onClick}
    style={style}>
    <Edit size={30} />
  </IconCont>
);

export const TitleField = ({
  onClick,
  edit,
  children,
  className,
  placeholder,
  hidden,
}) => {
  if (hidden) return null;
  const titleCont = children || <span className="italic">{placeholder}</span>;
  return (
    <div
      className={`flex items-center items-center ${className}`}
      onClick={onClick}>
      <h1 className="text-muted mr-1">{titleCont}</h1>
    </div>
  );
};

TitleField.defaultProps = {placeholder: 'Add a Title'};

export const TextField = ({
  onClick,
  placeholder,
  className,
  style,
  edit,
  value,
}) => {
  if (value === null) return null;
  return (
    <div
      className={`${className}`}
      style={{...style, cursor: 'pointer'}}
      onClick={onClick}>
      <div className="flex items-center text-xl">
        <div className="mr-1">{value}</div>
      </div>
    </div>
  );
};

TextField.propTypes = {
  text: PropTypes.oneOf([PropTypes.string, null]),
  // TODO: how to
  onEdit: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  edit: PropTypes.bool,
};

TextField.defaultProps = {
  text: null,
  onEdit: null,
  onClick: null,
  placeholder:
    'Add a description for your card to give hints how to succeed the Challenge',
  style: {},
  edit: false,
};
