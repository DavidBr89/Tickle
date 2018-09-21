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

export default class FileUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    uiColor: defaultUIColor,
    placeholder: 'Add your description',
    stylesheet: defaultStylesheet,
    className: '',
    fileName: null,
    disabled: false
  };

  render() {
    const {
      className,
      fileName,
      style,
      onChange,
      uiColor,
      stylesheet,
      disabled
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '60%',
          // TODO: style is not passed down
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
            {fileName || 'Browse File'}
          </div>
        </label>
        <input
          id="all-file-upload"
          disabled={disabled}
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
