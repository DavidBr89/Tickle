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
    placeholder: PropTypes.string
  };

  static defaultProps = {
    className: '',
    styles: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description'
  };

  state = {
    img: null,
    description: ''
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.img !== nextState.img ||
      this.state.description !== nextState.description
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { img, description } = this.state;
    const { onChange } = this.props;
    onChange({ type: 'photo', img, description });
  }

  render() {
    const { className, placeholder, styles, onChange } = this.props;
    return (
      <UIthemeContext.Consumer>
        {({ uiColor }) => (
          <div
            className={className}
            style={{ width: '100%', height: '100%', ...styles }}
          >
            <div>
              <h4>Description</h4>
              <textarea
                placeholder={placeholder}
                ref={r => (this.textarea = r)}
                onChange={e => {
                  this.setState({ description: e.target.value });
                }}
                style={{ width: '100%', minHeight: 50, height: 50 }}
              />
            </div>
            <div style={{ width: '100%', height: '100%' }}>
              <h4>Upload Image</h4>
              <PhotoUpload
                uiColor={uiColor}
                onChange={img => this.setState({ img })}
              />
            </div>
          </div>
        )}
      </UIthemeContext.Consumer>
    );
  }
}

export default PhotoChallengeAuthor;
