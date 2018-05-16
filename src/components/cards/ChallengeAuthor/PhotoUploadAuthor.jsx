import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createShadowStyle, UIthemeContext } from 'Cards/styles';

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

class PhotoUpload extends Component {
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
    imgSrc: null,
    imgFiles: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.imgSrc !== nextState.imgSrc;
  }

  componentDidUpdate(prevProps, prevState) {
    const { imgSrc, imgFiles } = this.state;
    const { onChange } = this.props;
    if (prevState.imgSrc !== imgSrc) {
      onChange({ type: 'photo', imgFiles, description: this.textarea.value });
    }
  }

  render() {
    const { className, placeholder, styles, onChange } = this.props;
    const { imgSrc } = this.state;
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
                style={{ width: '100%', minHeight: 50, height: 50 }}
              />
            </div>
            <div
              style={{
                overflow: 'hidden',
                height: '80%'
              }}
            >
              <h4>Upload Image</h4>
              {console.log('uiColor', uiColor)}
              {imgSrc !== null ? (
                <img
                  src={imgSrc}
                  style={{ width: '100%', height: '100%' }}
                  alt="test"
                />
              ) : (
                <div
                  style={{
                    // TODO: outsource
                    // height: '100%',
                    minHeight: 80,
                    maxHeight: 300,
                    border: `dashed 3px ${uiColor}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <h1
                    className="pl-2 pr-2"
                    style={{ background: uiColor, color: 'black' }}
                  >
                    {'No Image'}
                  </h1>
                </div>
              )}
            </div>
            <div>
              <input
                className="mt-3 w-100"
                style={{ border: `${uiColor} 1px solid` }}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e =>
                  this.setState({
                    imgSrc: convertToImgSrc(e.target.files),
                    imgFiles: e.target.files
                  })
                }
              />
            </div>
          </div>
        )}
      </UIthemeContext.Consumer>
    );
  }
}

export default PhotoUpload;
