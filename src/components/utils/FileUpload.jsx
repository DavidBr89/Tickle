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
    uiColor: 'grey',
    placeholder: 'Add your description',
    defaultImg: null,
    width: 250,
    height: 250
  };

  // TODO: remove
  contHeight = 300;
// video#<{(|,image#<{(|
  render() {
    const { className, style, onChange, uiColor } = this.props;

    return (
      <input
        className={className}
        style={{ border: `${uiColor} 1px solid`, overflow: 'hidden', ...style }}
        type="file"
        accept="*"
        capture="environment"
        onChange={e => {
          onChange({
            url: convertToImgSrc(e.target.files),
            file: e.target.files[0]
          });
        }}
      />
    );
  }
}
