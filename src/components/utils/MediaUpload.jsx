import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';
import { uniqBy } from 'lodash';
import { Stylesheet, css } from 'aphrodite/no-important';

import FileUpload from 'Utils/FileUpload';
import { ModalBody } from 'Utils/Modal';
import ScrollList from 'Utils/ScrollList';

import { GlobalThemeConsumer } from 'Src/styles/GlobalThemeContext';

import { db } from 'Firebase';
import { TEXT, IMG, VIDEO } from 'Constants/mediaTypes';

import { stylesheet as defaultStylesheet } from 'Src/styles/GlobalThemeContext';

class DataUploadForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    stylesheet: PropTypes.object
  };

  defaultProps: {
    stylesheet: defaultStylesheet
  };

  state = { description: null, imgUrl: null, file: null, type: TEXT };

  render() {
    const {
      onChange,
      stylesheet: { btn },
      className
    } = this.props;

    const { imgUrl, file, type } = this.state;
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center'
          // justifyContent: 'space-between',
          // height: '100%'
        }}
      >
        <FileUpload
          style={{ width: '40%' }}
          fileName={file ? file.name : null}
          onChange={({ url, file: newFile }) => {
            this.setState({ imgUrl: url, file: newFile });
          }}
        />
        <div className={`${css(btn)} ml-2`}>
          <select
            style={{ border: 'unset', fontSize: 18, padding: 1 }}
            onChange={e => this.setState({ type: e.target.value })}
          >
            <option>{TEXT}</option>
            <option>{IMG}</option>
            <option>{VIDEO}</option>
          </select>
        </div>

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
          {label}
        </div>
      ) : (
        children({ url, name, loading: url === null })
      )}
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
    </div>
  );
};

MediaItem.propTypes = {
  children: PropTypes.oneOf([null, PropTypes.func])
};
MediaItem.defaultProps = {
  children: null
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
    const maxHeight = '30%';
    return (
      <div style={{ height: '100%' }}>
        <DataUploadForm
          className="mt-3"
          style={{ width: '100%' }}
          stylesheet={stylesheet}
          onChange={this.addMediaItem}
        />
        <div
          className={`mt-3 ${css(stylesheet.border)}`}
          style={{
            height: maxHeight
            // display: 'flex',
            // flexDirection: 'column',
            // justifyContent: 'space-between'
          }}
        >
          {allMedia.length > 0 ? (
            <ScrollList
              data={allMedia}
              maxHeight="100%"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                ...style
              }}
            >
              {d => (
                <MediaItem
                  {...d}
                  stylesheet={stylesheet}
                  onRemove={() => this.removeMediaItem(d.id)}
                />
              )}
            </ScrollList>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <h3 className="text-muted">No Media added</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MediaUpload;
