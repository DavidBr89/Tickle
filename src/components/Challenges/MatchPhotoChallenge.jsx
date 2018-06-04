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

class PhotoChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object
  };

  static defaultProps = {
    className: '',
    description: 'Upload a phot to win the challenge',
    styles: {}
  };

  state = {
    imgSrc: null
  };

  render() {
    const { className, description, styles } = this.props;
    const { imgSrc } = this.state;
    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', ...styles }}
      >
        <div className="w-100 h-100">
          <h2>{description}</h2>
          {imgSrc !== null ? (
            <img
              src={imgSrc}
              style={{ width: '100%', height: '100%' }}
              alt="test"
            />
          ) : (
            <div
              style={{
                minHeight: '40vh',
                maxHeight: 300,
                border: 'dashed 1px black'
              }}
            />
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={e =>
              this.setState({ imgSrc: convertToImgSrc(e.target.files) })
            }
          />
        </div>
      </div>
    );
  }
}

export default PhotoChallenge;
