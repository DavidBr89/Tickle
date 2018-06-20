import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createShadowStyle, UIthemeContext } from 'Cards/styles';

import PhotoUpload from 'Utils/PhotoUpload';

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

class MatchPhotoChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    reset: PropTypes.bool,
    defaultImg: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    styles: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description',
    reset: false,
    img: { title: null, url: null }
  };

  // }
  // componentDidUpdate(prevProps, prevState) {
  //   this.props.onChange(this.state);
  // }

  render() {
    const {
      className,
      placeholder,
      styles,
      onChange,
      uiColor,
      img,
      description
    } = this.props;

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div>
          <h4>Description</h4>
          <textarea
            ref={node => (this.textArea = node)}
            defaultValue={description}
            placeholder={placeholder}
            style={{ width: '100%', minHeight: 50, height: 50 }}
          />
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <h4>Upload Image</h4>
          <PhotoUpload
            defaultImgUrl={img.url}
            key={img.url}
            uiColor={uiColor}
            onChange={newImg => {
              onChange({
                type: 'photo',
                img: newImg,
                data: {},
                description: this.textArea.value
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default MatchPhotoChallenge;
