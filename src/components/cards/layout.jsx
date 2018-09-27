import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite/no-important';
// import Grid from 'mygrid/dist';
import { mediaScale } from 'Constants/mediaTypes';
import { profileSrc, colorClass, colorScaleRandom } from './styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { FieldSet } from 'Components/utils/StyledComps';

import { RotateCcw, Edit, Search } from 'react-feather';

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
    <Search size={30} {...props} />
  </span>
);

EditIcon.propTypes = { style: PropTypes.object, className: PropTypes.string };
EditIcon.defaultProps = { style: {}, className: '' };

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

// export const ImgOverlay = ({ src, className, style, children, footer }) => (
//   <div
//     className={className}
//     style={{
//       position: 'relative',
//       // width: '100%',
//       marginLeft: 'auto',
//       marginRight: 'auto',
//       ...style
//     }}
//   >
//     <img
//       src={src || placeholderImgSrc}
//       alt="Card img"
//       style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
//     />
//     <div
//       className="m-2"
//       style={{
//         position: 'absolute',
//         width: '100%',
//         // zIndex: 200,
//         left: 0,
//         top: 0
//       }}
//     >
//       {children}
//     </div>
//     {footer}
//   </div>
// );
//
// ImgOverlay.propTypes = {
//   src: PropTypes.string,
//   style: PropTypes.object,
//   children: PropTypes.node,
//   footer: PropTypes.node,
//   className: PropTypes.string
// };
//
// ImgOverlay.defaultProps = {
//   src: placeholderImgSrc,
//   style: {},
//   children: null,
//   footer: null,
//   className: ''
// };

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
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 'bold',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          justifyContent: 'center',
          verticalAlign: 'middle',
          lineHeight: '1.5',
          cursor: 'pointer',
          color: 'white',
          borderRadius: '0px',
          padding: '0.375rem',
          overflow: 'hidden',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'transparent',
          borderImage: 'initial',
          transition:
            'color 0.15s ease-in-out 0s, background-color 0.15s ease-in-out 0s, border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s',
          background: 'black',
          // width: '100%',
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
      <RotateCcw />
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

const Tag = ({ title }) => <div background="yellow">{title}</div>;

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

// export const PreviewTags = ({
//   data,
//   style,
//   placeholder,
//   small,
//   colorScale,
//   onClick
// }) =>
//   data !== null && data.length === 0 ? (
//     <div className="alert alert-danger" onClick={onClick}>
//       <strong>No Tag!</strong> Please add at least one tag!
//     </div>
//   ) : (
//     <div
//       onClick={onClick}
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         flexWrap: 'wrap',
//         overflow: 'hidden',
//         ...style
//         // overflowY: 'visible'
//         // flexWrap: 'no-wrap'
//         // alignItems: 'center'
//       }}
//     >
//       {data !== null &&
//         data.length > 0 &&
//         data.map(t => <Tag title={t} color={tagColor} small={small} />)}
//     </div>
//   );
