import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import { css } from 'aphrodite/no-important';

import FileUpload from 'Utils/FileUpload';
import { ModalBody } from 'Utils/Modal';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { db } from 'Firebase';

const FooterBtn = ({ onClick, children, disabled, className, style = {} }) => (
  <button
    className={`${'btn '}${className}`}
    style={{ ...style, fontWeight: 'bold' }}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

class DataUploadForm extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  state = { imgUrl: null, description: null };

  render() {
    const {
      onChange,
      stylesheet: { btn }
    } = this.props;
    const { imgUrl, file } = this.state;
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <FileUpload
          style={{ width: '70%' }}
          onChange={({ url, file: newFile }) => {
            console.log('url', url);
            this.setState({ imgUrl: url, file: newFile });
          }}
        />
        <button
          className={`${css(btn)} ml-2`}
          style={{ height: '100%' }}
          onClick={() => onChange({ imgUrl, file })}
        >
          Add Media
        </button>
      </div>
    );
  }
}

const MediaItem = ({
  url,
  name,
  onRemove,
  stylesheet: { shallowBg, border, btn, boxShadow }
}) => (
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
    <div>{url ? name : 'loading'}</div>
    <div>
      <button className={css(btn)} disabled={!url} onClick={onRemove}>
        x
      </button>
    </div>
  </div>
);

const makePath = m => `challengeSubmissionFiles/${m.id}`;
class MediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func,
    stylesheet: PropTypes.obj
  };

  static defaultProps = {
    className: '',
    description: 'Upload a photo to win the challenge',
    onChange: d => d,
    data: {},
    styles: {},
    stylesheet: {}
  };

  state = { media: [], response: null, ...this.props.challengeSubmission };

  componentDidUpdate(prevProps, prevState) {
    const { media } = this.state;
    const { media: oldMedia } = prevState;
    const mediaItems = media.filter(m => m.url !== null);
    const pendingMediaItems = media.filter(m => m.url === null);

    if (pendingMediaItems.length > 0) {
      const promises = pendingMediaItems.map(({ file, ...rest }) =>
        db.addFileToStorage({ file, path: makePath(rest) }).then(url => {
          console.log('uploaded', file);
          return { ...rest, name: file.name, url };
        })
      );

      Promise.all(promises).then(uploadedMediaItems =>
        this.setState({ media: [...mediaItems, ...uploadedMediaItems] })
      );
    }
  }

  cleanUpBeforeSubmit = () => {
    const { challengeSubmission: oldChallengeSubmission } = this.props;
    const { media: newMedia } = this.state;

    if (oldChallengeSubmission) {
      const { media: oldMedia } = oldChallengeSubmission;
      const mediaDiff = oldMedia.filter(
        o => newMedia.find(m => m.id === o.id) === undefined
      );
      console.log('mediaDiff', mediaDiff);

      const removePromises = mediaDiff.map(o =>
        db.removeFromStorage(makePath(o))
      );
      Promise.all(removePromises).then(() =>
        console.log('removed all old files!', mediaDiff)
      );
    }
  };

  addMediaItem = ({ url, file }) => {
    // TODO fix url
    this.setState(({ media: oldMedia }) => ({
      media: uniqBy(oldMedia.concat({ file, id: file.name, url: null }), 'id')
    }));
  };

  removeMediaItem = id => {
    this.setState(({ media: oldMedia }) => ({
      media: oldMedia.filter(d => d.id !== id)
    }));
  };

  render() {
    const { className, onChange, styles, stylesheet } = this.props;
    const { media, response } = this.state;
    return (
      <ModalBody
        footer={
          <FooterBtn
            onClick={() => {
              this.cleanUpBeforeSubmit();
              onChange({ media, response });
            }}
          >
            Submit Challenge
          </FooterBtn>
        }
      >
        <div className={className} style={{ width: '100%', ...styles }}>
          <h4>Response</h4>
          <textarea
            className="mb-3"
            style={{ width: '100%' }}
            placeholder="write your response"
            value={response}
            onChange={e => this.setState({ response: e.target.value })}
          />
          <DataUploadForm
            style={{ width: '100%' }}
            stylesheet={stylesheet}
            onChange={this.addMediaItem}
          />
        </div>
        <div className="mt-3">
          {media.map(d => (
            <MediaItem
              {...d}
              stylesheet={stylesheet}
              onRemove={() => this.removeMediaItem(d.id)}
            />
          ))}
        </div>
      </ModalBody>
    );
  }
}

const StyledMediaChallenge = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <MediaChallenge {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

export default StyledMediaChallenge;
