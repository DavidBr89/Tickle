import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';

import {
  GlobalThemeConsumer,
  stylesheet as defaultStylesheet,
  uiColor as defaultUIColor
} from 'Src/styles/GlobalThemeContext';
// import { DimWrapper } from 'Utils';

// import { createShadowStyle, UIthemeContext } from 'Cards/style';

function convertToImgSrc(fileList) {
  let file = null;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^video\//)) {
      file = fileList[i];
      break;
    }
  }

  if (file !== null) {
    return URL.createObjectURL(file);
  }
  return null;
}

export default class DataUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultImg: PropTypes.any
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    uiColor: defaultUIColor,
    placeholder: 'Add your description',
    stylesheet: defaultStylesheet,
    defaultImg: null,
    width: 250,
    height: 250,
    className: '',
    fileName: null
  };

  // TODO: remove
  contHeight = 300;
  // video#<{(|,image#<{(|
  render() {
    const {
      className,
      fileName,
      style,
      onChange,
      uiColor,
      stylesheet
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          ...style
        }}
      >
        <label
          htmlFor="all-file-upload"
          style={{ width: '100%' }}
          className={`${css(stylesheet.btn)} mt-2 `}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {fileName || 'Choose File'}
          </div>
        </label>
        <input
          id="all-file-upload"
          className={className}
          style={{
            border: `${uiColor} 1px solid`,
            overflow: 'hidden',
            ...style
          }}
          type="file"
          accept="*"
          capture="environment"
          onChange={e => {
            const file = e.target.files[0];
            onChange({
              url: convertToImgSrc(e.target.files),
              file
            });
          }}
        />
      </div>
    );
  }
}
