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

class PhotoChallengeAuthor extends Component {
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
    description: null,
    img: { title: null, url: null }
  };

  state = { title: '', ...this.props };
  // }
  componentDidUpdate(prevProps, prevState) {
    const { img, description, title } = this.state;
    const { onChange } = this.props;
    if (
      img.url !== prevState.img.url ||
      description !== prevState.description ||
      title !== prevState.title
    ) {
      onChange({
        type: 'photo',
        img,
        description,
        title
      });
    }
  }

  render() {
    const {
      className,
      placeholder,
      styles,
      onChange,
      uiColor,
      img,
      description,
      title
    } = this.props;

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div>
          <h4>Title</h4>
          <input
            value={title}
            placeholder={placeholder}
            onChange={e => this.setState({ title: e.target.value })}
            style={{ width: '100%', minHeight: 50, height: 50 }}
          />
        </div>
        <div>
          <h4>Description</h4>
          <textarea
            onChange={e => this.setState({ description: e.target.value })}
            defaultValue={description}
            placeholder={placeholder}
            style={{ width: '100%', minHeight: 50, height: 50 }}
          />
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <h4>Upload Image</h4>
          <PhotoUpload
            defaultImgUrl={img.url}
            uiColor={uiColor}
            onChange={newImg => {
              this.setState({ img: newImg });
            }}
          />
        </div>
      </div>
    );
  }
}

export default PhotoChallengeAuthor;
