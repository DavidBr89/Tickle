import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { X } from 'react-feather';
// import { uniqBy } from 'lodash';
import { css } from 'aphrodite/no-important';

import FileUpload from 'Utils/FileUpload';
// import { ModalBody } from 'Utils/Modal';
import ScrollList from 'Utils/ScrollList';

// import { GlobalThemeConsumer } from 'Src/styles/GlobalThemeContext';

import { db } from 'Firebase';
import { TEXT, IMG, VIDEO } from 'Constants/mediaTypes';

import { stylesheet as defaultStylesheet } from 'Src/styles/GlobalThemeContext';

import { NewTabLink } from 'Components/utils/StyledComps';

class DataUploadForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    stylesheet: PropTypes.object
  };

  static defaultProps: {
    stylesheet: defaultStylesheet,
    style: {},
    buttonStyle: {}
  };

  state = { description: null, imgUrl: null, file: null, type: TEXT };

  render() {
    const {
      onChange,
      stylesheet: { btn },
      className,
      style,
      buttonStyle
    } = this.props;

    const { imgUrl, file, type } = this.state;
    const imgRegex = /.(jpg|jpeg|png|gif)$/i;
    const videoRegex = /.(ogg|h264|webm|vp9|hls)$/i;
    console.log('FIle', file);

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          // width: '70%',
          ...style
          // justifyContent: 'space-between',
          // height: '100%'
        }}
      >
        <FileUpload
          style={buttonStyle}
          fileName={file ? file.name : null}
          onChange={({ url, file: newFile }) => {
            let ftype = TEXT;
            if (newFile.name.match(imgRegex)) ftype = IMG;
            if (newFile.name.match(videoRegex)) ftype = VIDEO;

            this.setState({ imgUrl: url, file: newFile, type: ftype });
          }}
        />
        <button
          className={`${css(btn)} ml-2`}
          style={{
            fontWeight: 'bold',
            flex: '1 1 auto'
          }}
          onClick={() => {
            onChange({ imgUrl, file, type });
            this.setState({ imgUrl: null, file: null });
          }}
          disabled={!file}
        >
          Add
        </button>
      </div>
    );
  }
}

const MediaItem = ({
  url,
  name,
  onRemove,
  stylesheet: { shallowBg, shallowBorder, btn, boxShadow, truncate },
  children = null,
  id
}) => {
  const label = url ? name : 'loading';
  return (
    <div
      className={`${css(shallowBg)} mt-1 p-2`}
      style={{
        // height: 100,
        width: '100%',
        display: 'flex',
        // border: 'grey solid 1px',
        justifyContent: 'space-between',
        alignItems: 'center'
        // justifyContent: 'center'
      }}
    >
      {children === null ? (
        <div className={css(truncate)} style={{}}>
          <NewTabLink href={url}>{label}</NewTabLink>
        </div>
      ) : (
        children({ url, name, loading: url === null })
      )}
      {onRemove && (
        <div>
          <button
            className={css(btn)}
            disabled={!url}
            onClick={() => onRemove(id)}
            style={{ minWidth: 'unset' }}
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
};

MediaItem.propTypes = {
  children: PropTypes.oneOf([null, PropTypes.func]),
  onRemove: PropTypes.oneOf([null, PropTypes.func]),
  stylesheet: PropTypes.object
};
MediaItem.defaultProps = {
  children: null,
  onRemove: null,
  stylesheet: defaultStylesheet
};

export const MediaList = ({
  data,
  maxHeight,
  stylesheet,
  onRemove,
  classNam,
  style
}) => (
  <div
    style={{
      flex: '0 0 100%',
      justifyContent: 'center',
      alignItems: 'center',
      ...style
    }}
  >
    {data.map(d => (
      <MediaItem {...d} stylesheet={stylesheet} onRemove={onRemove} />
    ))}
  </div>
);

MediaList.defaultProps = {
  data: []
};

MediaList.propTypes = {
  data: PropTypes.array,
  maxHeight: PropTypes.number,
  stylesheet: PropTypes.object,
  onRemove: PropTypes.func
};

class MediaUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    stylesheet: PropTypes.object,
    uploadPath: PropTypes.func.isRequired,
    nodeWrapper: PropTypes.oneOf([null, PropTypes.func]),
    onClick: PropTypes.func
  };

  static defaultProps = {
    stylesheet: defaultStylesheet,
    nodeWrapper: null,
    style: {},
    onChange: d => d,
    onClick: d => d
  };

  state = { media: [], pendingMedia: [], ...this.props };

  addMediaItem = ({ url, file, type }) => {
    const { media } = this.state;
    const pendingMediaItem = { file, id: file.name, url: null, type };

    if (media.filter(m => m.id === pendingMediaItem.id).length === 0) {
      this.setState(({ pendingMedia: oldPendingMedia }) => ({
        pendingMedia: [...oldPendingMedia, pendingMediaItem]
      }));
    }
  };

  removeMediaItem = id => {
    const { uploadPath } = this.props;
    const p = uploadPath(id);
    console.log();
    db.removeFromStorage(p).then(() =>
      console.log('removedMediaItem Success', id)
    );
    this.setState(({ media: oldMedia }) => ({
      media: oldMedia.filter(d => d.id !== id)
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { media: oldMedia } = prevState;
    const { onChange, uploadPath } = this.props;
    const { media, pendingMedia } = this.state;

    if (oldMedia.length !== media.length) {
      onChange(media);
    }

    if (pendingMedia.length > 0) {
      const promises = pendingMedia.map(({ file, ...rest }) =>
        db
          .addFileToStorage({ file, path: uploadPath(rest.id) })
          .then(url => ({ ...rest, name: file.name, url }))
      );

      Promise.all(promises).then(uploadedMediaItems =>
        this.setState({
          media: [...media, ...uploadedMediaItems],
          pendingMedia: []
        })
      );
    }
  }

  render() {
    const { media, pendingMedia } = this.state;
    const { nodeWrapper, style, stylesheet } = this.props;
    const allMedia = [...media, ...pendingMedia];
    const maxHeight = '200%';
    return (
      <div className="flexCol" style={{ flexShrink: 0 }}>
        <DataUploadForm
          style={{ width: '100%' }}
          stylesheet={stylesheet}
          onChange={this.addMediaItem}
        />
        <div
          className={`mt-3 mb-3 p-1 ${css(stylesheet.border)}`}
          style={
            {
              // border: '1px solid grey'
            }
          }
        >
          {allMedia.length > 0 ? (
            <div
              className="flexCol flex-100"
              style={{
                flex: '0 0 100%'
              }}
            >
              <MediaList
                data={allMedia}
                onRemove={this.removeMediaItem}
                stylesheet={stylesheet}
                maxHeight={maxHeight}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className="text-muted" style={{ fontSize: 'x-large' }}>
                No Media added
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MediaUpload;
