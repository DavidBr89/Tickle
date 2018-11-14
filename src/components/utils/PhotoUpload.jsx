import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Compress from 'compress.js';

const compress = new Compress();

// import { DimWrapper } from 'Utils';

// import { createShadowStyle, UIthemeContext } from 'Cards/style';

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
export default class PhotoUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultImg: PropTypes.any,
    imgName: PropTypes.string
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description',
    defaultImg: null,
    width: 250,
    height: 250,
    maxHeight: 300,
    imgName: null,
    title: 'Browse Images'
  };

  render() {
    const {
      className,
      placeholder,
      style,
      onChange,
      uiColor,
      defaultImg,
      title,
      maxHeight,
      // width,
      // height,
      imgUrl,
      imgName
    } = this.props;

    return (
      <div className={className} style={{ ...style }}>
        <div
          className="flex-grow w-full h-full overflow-hiden flex justify-center items-center border-dashed border-black border-2"
          style={style}
        >
          {imgUrl ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                maxHeight
              }}
            >
              <img
                src={imgUrl}
                style={{ width: 'auto', maxHeight }}
                alt="test"
              />
            </div>
          ) : (
            <div
              className="text-2xl font-bold pl-2 pr-2 text-muted"
              style={{
                margin: '20%'
              }}
            >
              {'No Image'}
            </div>
          )}
        </div>
        <label
          htmlFor="file-upload"
          className="btn mt-2"
          style={{
            width: '100%',
            display: null,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {imgName ? `Edit: ${imgName}` : title}
        </label>
        <input
          className="mt-3 form-control truncate-text"
          id="file-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const files = [...e.target.files];
            const imgName = e.target.files[0].name;

            // TODO remove
            const imgType = imgName.slice(
              ((imgName.lastIndexOf('.') - 1) >>> 0) + 2
            );
            // onChange({
            //   url: convertToImgSrc(e.target.files),
            //   file: e.target.files[0]
            // });
            compress
              .compress(files, {
                size: 1.5,
                quality: 0.6,
                maxWidth: 1920,
                // maxHeight: 800,
                resize: true
              })
              .then((data) => {
                const img1 = data[0];
                const base64str = img1.data;
                const imgExt = img1.ext;
                const file = Compress.convertBase64ToFile(base64str, imgExt);

                onChange({
                  url: convertToImgSrc(files),
                  title: null,
                  imgType,
                  name: imgName,
                  file
                });
              });
          }}
        />
      </div>
    );
  }
}
