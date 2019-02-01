import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import Compress from 'compress.js';

import {addToStorage, removeFromStorage} from '~/firebase/db';
import useDeepCompareMemoize from '~/components/utils/useDeepCompareMemoize';
import useMemoize from '~/components/utils/useMemoize';

const compress = new Compress();

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

export default function PhotoUpload(props) {
  const {
    className = '',
    style = {},
    onChange,
    title = 'Browse Images',
    url,
    name,
    id = null,
    imgStyle = {},
    btnClassName = '',
    //TODO make a constant out of
    folder = 'img'
  } = props;

  const oldId = useMemoize(id);

  const makePath = newId => `${folder}/${newId}`;
  useEffect(() => {
    if (id !== null && oldId !== null && id !== oldId) {
      removeFromStorage(makePath(oldId)).then(e =>
        console.log('remove img success')
      );
    }
  }, [id]);

  return (
    <div className={`${className} flex flex-col`} style={style}>
      <div
        className="flex-grow flex flex-col justify-center items-center text-4xl border border-black font-bold text-muted "
        style={style}>
        {url ? (
          <div
            className="flex-grow w-full"
            style={{
              ...imgStyle,
              background: `url(${url}) `,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            alt="test"
          />
        ) : (
          <div className="m-auto">No Image</div>
        )}
      </div>
      <label
        htmlFor="file-upload"
        className={`flex-no-shrink btn btn-shadow bg-white text-xl mt-3 ${btnClassName}`}
        style={{
          width: '100%',
          display: null,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
        {name ? `Edit: ${name}` : title}
      </label>
      <input
        className="form-control truncate-text"
        id="file-upload"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={e => {
          const files = [...e.target.files];
          const {name} = e.target.files[0];
          // TODO do a type for different file types
          compress
            .compress(files, {
              size: 1.5,
              quality: 0.6,
              maxWidth: 1920,
              // maxHeight: 800,
              resize: true
            })
            .then(data => {
              const img1 = data[0];
              const base64str = img1.data;
              const imgExt = img1.ext;
              const file = Compress.convertBase64ToFile(
                base64str,
                imgExt
              );
              const newId = uuidv1();

              addToStorage({file, path: makePath(newId)}).then(
                newUrl => {
                  onChange({
                    url: newUrl,
                    name,
                    id: newId
                  });
                }
              );
            });
        }}
      />
    </div>
  );
}
