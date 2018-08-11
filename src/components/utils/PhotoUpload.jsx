import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  stylesheet as defaultStylesheet,
  uiColor as defaultUIColor
} from 'Src/styles/GlobalThemeContext';

import { css } from 'aphrodite/no-important';

// import { DimWrapper } from 'Utils';

// import { createShadowStyle, UIthemeContext } from 'Cards/style';

function convertToImgSrc(fileList) {
  let file = null;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }

  if (file !== null) {
    return URL.createObjectURL(file);
  }
  return null;
}
export default class PhotoUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultImg: PropTypes.any,
    imgName: PropTypes.string
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description',
    defaultImg: null,
    width: 250,
    height: 250,
    maxHeight: 300,
    stylesheet: defaultStylesheet,
    imgName: null,
    title: 'Choose Image'
  };

  render() {
    const {
      className,
      placeholder,
      style,
      onChange,
      uiColor,
      defaultImg,
      stylesheet,
      title,
      maxHeight,
      // width,
      // height,
      imgUrl,
      imgName
    } = this.props;

    return (
      <div style={{ ...style }}>
        <div
          style={{
            // TODO: outsource
            height: '80%',
            width: '100%',
            // overflow: 'hidden',
            // minHeight: 80,
            overflow: 'hidden',
            border: `dashed 3px ${uiColor}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {imgUrl ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                maxHeight
              }}
            >
              <img
                src={imgUrl}
                style={{ width: 'auto', maxHeight }}
                alt="test"
              />
            </div>
          ) : (
            <h1
              className="pl-2 pr-2 text-muted"
              style={{
                margin: '20%'
              }}
            >
              {'No Image'}
            </h1>
          )}
        </div>
        <label
          htmlFor="file-upload"
          className={`${css(stylesheet.imgUploadBtn)} mt-2`}
          style={{
            width: '100%',
            display: null,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {imgName ? `Edit: ${imgName}` : title}
        </label>
        <input
          id="file-upload"
          className="mt-3"
          style={{
            border: `${uiColor} 1px solid`,
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={e => {
            onChange({
              url: convertToImgSrc(e.target.files),
              file: e.target.files[0]
            });
          }}
        />
      </div>
    );
  }
}
