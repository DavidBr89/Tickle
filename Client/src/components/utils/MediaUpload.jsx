import React, { Component } from 'react';
import PropTypes from 'prop-types';

import X from 'react-feather/dist/icons/x';
// import { uniqBy } from 'lodash';
import FileUpload from 'Utils/FileUpload';
// import { ModalBody } from 'Utils/Modal';
// import ScrollList from 'Utils/ScrollList';

import uuidv1 from 'uuid/v1';


// import { GlobalThemeConsumer } from 'Src/styles/GlobalThemeContext';

import { TEXT, IMG, VIDEO } from 'Constants/mediaTypes';

import { NewTabLink } from 'Components/utils/StyledComps';

class DataUploadForm extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    stylesheet: PropTypes.object,
    btnText: PropTypes.string
  };

  static defaultProps = {
    style: {},
    buttonStyle: {},
    btnText: 'Browse Files',
    fileName: null
  };

  state = {
    description: null, imgUrl: null, file: null, type: TEXT
  };

  render() {
    const {
      onChange,
      className,
      style,
      disabled,
      buttonStyle,
      btnText
    } = this.props;

    const { imgUrl, file, type } = this.state;
    const imgRegex = /.(jpg|jpeg|png|gif)$/i;
    const videoRegex = /.(ogg|h264|webm|vp9|hls)$/i;
    const disabledUpload = !file || disabled;
    return (
      <div
        className={`${className} flex items-center`}
        style={{ ...style }}
      >
        <FileUpload
          disabled={disabled}
          btnText={btnText}
          style={buttonStyle}
          fileName={file ? file.name : null}
          onChange={({ url, file: newFile }) => {
            let ftype = TEXT;
            if (newFile.name.match(imgRegex)) ftype = IMG;
            if (newFile.name.match(videoRegex)) ftype = VIDEO;
            const st = { imgUrl: url, file: newFile, type: ftype };
            onChange({ ...st });
            this.setState(st);
          }}
        />
      </div>
    );
  }
}

const MediaItem = ({
  url, name, onRemove, disabled, children = null, id
}) => {
  const label = url ? name : 'loading';
  return (
    <div
      className="bg-grey-light mt-1 p-2 w-full flex justify-between items-center"
    >
      {children === null ? (
        <div className="truncate" style={{}}>
          <NewTabLink href={url}>{label}</NewTabLink>
        </div>
      ) : (
        children({ url, name, loading: url === null })
      )}
      {!disabled && (
        <div>
          <button
            className="btn"
            disabled={!url}
            onClick={onRemove}
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
  onRemove: PropTypes.oneOf([null, PropTypes.func])
};
MediaItem.defaultProps = {
  children: null,
  onRemove: null
};


class MediaUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    uploadPath: PropTypes.func.isRequired,
    nodeWrapper: PropTypes.oneOf([null, PropTypes.func]),
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    nodeWrapper: null,
    style: {},
    onChange: d => d,
    onClick: d => d,
    disabled: false
  };

  state = { media: [], pendingMedia: [], ...this.props };


  componentDidUpdate(prevProps, prevState) {
    const { media: oldMedia } = prevState;
    const { onChange, onAdd } = this.props;
    const { media, pendingMedia } = this.state;

    if (oldMedia.length !== media.length) {
      onChange(media);
    }

    if (pendingMedia.length > 0) {
      const promises = pendingMedia.map(({ file, id, ...rest }) => onAdd({ id, file }).then(url => ({ ...rest, url, id })));

      Promise.all(promises).then((uploadedMediaItems) => {
        this.setState({
          media: [...media, ...uploadedMediaItems],
          pendingMedia: []
        });
      });
    }
  }

  render() {
    const {
      nodeWrapper,
      style,
      disabled,
      btnText,
      className, onRemove
    } = this.props;
    const { media, pendingMedia } = this.state;
    const allMedia = [...media, ...pendingMedia];

    const removeFile = (id) => {
      onRemove(id);
      this.setState({ media: media.filter(d => d.id !== id) });
    };

    const addPendingFile = (file) => {
      const id = uuidv1();// file.name;
      const pendingMediaItem = {
        file, id, name: file.name, url: null
      };

      if (media.filter(m => m.id === pendingMediaItem.id).length === 0) {
        this.setState(({
          pendingMedia: [...pendingMedia, pendingMediaItem]
        }));
      }
    };


    return (
      <div className={`${className} flex flex-col`}>
        <div className="flex flex-col flex-grow mt-3 mb-3 p-1 border">
          {allMedia.length > 0 ? (

            <div
              className="flex-grow justify-center items-center"
              style={style}
            >
              {allMedia.map(d => (
                <MediaItem {...d} disabled={disabled} onRemove={() => removeFile(d.id)} />
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-no-shrink justify-center items-center ">
              <div className="text-muted" style={{ fontSize: 'x-large' }}>
                No Media added
              </div>
            </div>
          )}
        </div>
        <FileUpload
          disabled={disabled}
          btnText={btnText}
          onChange={({ file }) => {
            addPendingFile(file);
          }}
        />
      </div>
    );
  }
}

export default MediaUpload;
