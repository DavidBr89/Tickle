import React from 'react';
// import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import IcAk from '~/styles/alphabet_icons/ic_ak.svg';

/**
 * PreviewCard component for CardSlide Show
 */
export default function PreviewCard(props) {
  const {title, img, style, onClick, className} = props;

  return (
    <div
      className={`${className} z-10 cursor-pointer relative p-1 overflow-hidden bg-white flex flex-col border-2 border-black`}
      style={{...style}}
      onClick={onClick}>
      {img !== null && (
        <div className="flex-grow relative">
          <div className="flex flex-no-shrink">
            <h1
              className="z-10 flex-grow m-1  pl-1 pr-1 text-xl truncate-text"
              style={{minHeight: '1.25rem'}}>
              <span className="px-1 bg-white">
                {title || 'No title'}
              </span>
            </h1>
          </div>

          <img
            className="z-0 absolute w-full h-full"
            style={{
              left: 0,
              top: -0,
              display: 'block',
              objectFit: 'cover'
            }}
            src={img.thumbnail || img.url}
            alt="Card cap"
          />
        </div>
      )}
      {img === null && (
        <div className="flex flex-col flex-grow bg-yellow-dark">
          <div className="flex flex-no-shrink">
            <h1
              className="flex-grow m-1  pl-1 pr-1 text-xl truncate-text"
              style={{minHeight: '1.25rem'}}>
              {title || 'No title'}
            </h1>
          </div>
          {img === null && (
            <div className="flex flex-col flex-grow ">
              <div className="p-2 flex-1 flex flex-col justify-center">
                <img
                  className="flex-grow"
                  src={IcAk}
                  style={{maxHeight: 120}}
                  alt="template-logo"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const PreviewCardTemplate = ({className, style, onClick}) => (
  <div
    className={`${className} cursor-pointer relative p-1 overflow-hidden bg-white flex flex-col border-2 border-black `}
    style={{...style}}
    onClick={onClick}>
    <h3>New Card</h3>
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="text-5xl">+</div>
    </div>
  </div>
);

export const PreviewCardSwitch = ({edit, ...props}) =>
  edit ? (
    <PreviewCardTemplate {...props} />
  ) : (
    <PreviewCard {...props} />
  );
