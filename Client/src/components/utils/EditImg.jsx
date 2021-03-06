import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import PhotoUpload from '~/components/utils/PhotoUpload';
import TabSwitcher from '~/components/utils/TabSwitcher';

const AddUrl = props => {
  const inputClick = ev => {
    const el = ev.currentTarget;

    el.select();
  };
  const {onChange, style = {}, className = ''} = props;

  const [imgUrl, setImgUrl] = useState(props.url);

  useEffect(() => {
    if (props.url !== imgUrl) onChange({url: imgUrl});
  }, [imgUrl]);

  return (
    <div
      className={`${className} flex flex-col flex-grow`}
      style={{...style}}>
      <div className="flex-grow flex flex-col items-center">
        {imgUrl ? (
          <div
            className="flex-grow w-full"
            style={{
              background: `url(${imgUrl}) `,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          />
        ) : (
          <div className="pl-2 pr-2 flex flex-col flex-grow border-dashed border-2 border-black w-full items-center justify-center">
            <div className="text-2xl font-bold">No Image</div>
          </div>
        )}
        <div className="mt-3 flex items-center w-full">
          <input
            className="form-control text-lg flex-grow font-bold shadow"
            value={imgUrl}
            placeholder="Add Image Url"
            type="url"
            onClick={inputClick}
            onChange={e => setImgUrl(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default function EditImg(props) {
  const [index, setIndex] = useState(0);
  const {className} = props;

  const btnClassName = i =>
    `btn flex-grow border m-1 ${index === i && 'btn-active-alt'}`;

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex">
        <button
          onClick={() => setIndex(0)}
          type="button"
          className={btnClassName(0)}>
          Upload
        </button>
        <button
          type="button"
          onClick={() => setIndex(1)}
          className={btnClassName(1)}>
          URL
        </button>
      </div>
      <TabSwitcher
        className="flex flex-col flex-grow"
        visibleIndex={index}>
        <PhotoUpload className="flex-grow flex flex-col " {...props} />
        <AddUrl className="flex-grow" {...props} />
      </TabSwitcher>
    </div>
  );
}
