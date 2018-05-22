import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DimWrapper } from 'Utils';

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
    placeholder: PropTypes.string,
    defaultImg: PropTypes.any
  };

  static defaultProps = {
    className: '',
    styles: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description',
    defaultImg: null
  };

  state = {
    imgSrc: null,
    imgFiles: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.imgSrc !== nextState.imgSrc ||
      this.props.defaultImg !== nextProps.defaultImg
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { imgSrc, imgFiles } = this.state;
    const { onChange } = this.props;
    console.log('imgFiles', imgFiles);
    if (prevState.imgSrc !== imgSrc) {
      onChange({ src: imgSrc, files: imgFiles });
    }
  }

  contHeight = 300;

  render() {
    const {
      className,
      placeholder,
      styles,
      onChange,
      uiColor,
      defaultImg
    } = this.props;
    const { imgSrc } = this.state;
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div
          style={{
            overflow: 'hidden',
            height: '100%'
          }}
        >
          <div
            style={{
              // TODO: outsource
              height: '100%',
              // minHeight: 80,
              // maxHeight: 300,
              border: `dashed 3px ${uiColor}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {imgSrc !== null ? (
              <div
                style={{
                  overflow: 'hidden',
                  width: '100%',
                  height: this.contHeight
                }}
              >
                <img
                  src={imgSrc || convertToImgSrc(defaultImg)}
                  width={'100%'}
                  height={this.contHeight}
                  alt="test"
                />
              </div>
            ) : (
              <h1
                className="pl-2 pr-2"
                style={{ background: uiColor, color: 'black', margin: '20%' }}
              >
                {'No Image'}
              </h1>
            )}
          </div>
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
    );
  }
}

export default PhotoUpload;
