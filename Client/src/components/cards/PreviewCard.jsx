import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import styles from './PreviewCard.css';
import {PreviewTags} from 'Utils/Tag';
import IcAk from 'Styles/alphabet_icons/ic_ak.svg';
import placeholderImg from './placeholder.png';

class PreviewCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.oneOf([PropTypes.array.isRequired, null]),
    tagColorScale: PropTypes.func,
    img: PropTypes.object,
    challenge: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    edit: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    title: null,
    tags: null,
    img: null,
    style: {},
    selected: false,
    // TODO: include only type
    challenge: {type: null},
    edit: false,
    type: null,
    showImg: true,
    accessible: true
  };

  render() {
    const {
      title,
      tags,
      img,
      style,
      onClick,
      edit,
      tagColorScale,
      type,
      showImg,
      accessible,
      className
    } = this.props;

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
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default PreviewCard;

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
