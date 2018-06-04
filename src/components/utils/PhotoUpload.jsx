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
    imgUrl: this.props.defaultImgUrl,
    imgFiles: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.imgUrl !== nextState.imgUrl ||
      this.props.defaultImgUrl !== nextProps.defaultImgUrl
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { imgUrl, imgFile } = this.state;
    const { onChange } = this.props;
    // console.log('imgFiles', imgFile);
    if (prevState.imgUrl !== imgUrl) {
      onChange({ url: imgUrl, file: imgFile });
    }
  }

  // TODO: remove
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
    const { imgUrl } = this.state;
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
            {imgUrl ? (
              <div
                style={{
                  overflow: 'hidden',
                  width: '100%',
                  height: this.contHeight
                }}
              >
                <img
                  src={imgUrl}
                  width="100%"
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
            onChange={e => {
              this.setState({
                imgUrl: convertToImgSrc(e.target.files),
                imgFile: e.target.files[0]
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default PhotoUpload;
