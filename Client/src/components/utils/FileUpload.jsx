import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    disabled: PropTypes.bool,
    btnText: PropTypes.string
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    placeholder: 'Add your description',
    className: '',
    fileName: null,
    disabled: false,
    btnText: 'Browse Files'
  };

  render() {
    const {
      className,
      fileName,
      style,
      onChange,
      disabled,
      btnText
    } = this.props;

    return (
      <div
        className="flex w-full items-center"
        style={{
          ...style
        }}
      >
        <label
          htmlFor="all-file-upload"
          style={{ width: '100%' }}
          className="btn thick-border"
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {fileName || btnText}
          </div>
        </label>
        <input
          id="all-file-upload"
          disabled={disabled}
          className={className + ' border'}
          style={{
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
