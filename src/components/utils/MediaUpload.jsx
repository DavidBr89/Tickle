import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { X } from 'react-feather';
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

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '70%',
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
        <div>
          <button
            className={`${css(btn)} ml-2`}
            style={{ fontWeight: 'bold' }}
            onClick={() => {
              onChange({ imgUrl, file, type });
              this.setState({ imgUrl: null, file: null });
            }}
            disabled={!file}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}

const MediaItem = ({
  url,
  name,
  onRemove,
  stylesheet: { shallowBg, shallowBorder, btn, boxShadow, truncate },
  children = null
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
          <NewTabLink>{label}</NewTabLink>
        </div>
      ) : (
        children({ url, name, loading: url === null })
      )}
      {onRemove && (
        <div>
          <button
            className={css(btn)}
            disabled={!url}
            onClick={onRemove}
            style={{ minWidth: 'unset' }}
          >
            <Icon.X />
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
  className
}) => (
  <ScrollList
    className={className}
    data={data}
    maxHeight={maxHeight}
    style={{
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    {d => <MediaItem {...d} stylesheet={stylesheet} onRemove={onRemove} />}
  </ScrollList>
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
    nodeWrapper: PropTypes.oneOf([null, PropTypes.func])
  };

  static defaultProps = {
    stylesheet: defaultStylesheet,
    nodeWrapper: null,
    style: {}
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
    db.removeFromStorage(uploadPath(id)).then(() =>
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
      <div className="flex-100 flexCol">
        <DataUploadForm
          className="mt-3"
          style={{ width: '100%' }}
          stylesheet={stylesheet}
          onChange={this.addMediaItem}
        />
        {allMedia.length > 0 ? (
          <MediaList
            data={allMedia}
            stylesheet={stylesheet}
            maxHeight={maxHeight}
          />
        ) : (
          <div
            className="flexCol flex-100"
            style={{
              height: '100%',
              // display: 'flex',
              // justifyContent: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div>
              <h3 className="text-muted flex-100">No Media added</h3>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MediaUpload;
