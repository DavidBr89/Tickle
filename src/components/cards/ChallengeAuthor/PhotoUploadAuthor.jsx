import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    description: 'Upload a phot to win the challenge',
    styles: {},
    onChange: d => d
  };

  state = {
    imgSrc: null,
    imgFiles: null
  };

  componentDidUpdate(prevProps, prevState) {
    const { imgSrc, imgFiles } = this.state;
    const { onChange } = this.props;
    if (prevState.imgSrc !== imgSrc) onChange(imgFiles);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.imgSrc !== nextState.imgSrc;
  }

  render() {
    const { className, styles, uiColor } = this.props;
    const { imgSrc } = this.state;
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div
          style={{
            border: 'black 1px solid',
            overflow: 'hidden',
            height: '80%'
          }}
        >
          {imgSrc !== null ? (
            <img
              src={imgSrc}
              style={{ width: '100%', height: '100%' }}
              alt="test"
            />
          ) : (
            <div
              style={{
                // minHeight: '40vh',
                height: 200,
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
                {'Upload an Image'}
              </h1>
            </div>
          )}
        </div>
        <div>
          <input
            className="btn btn-primary mt-3"
            style={{ background: uiColor }}
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
