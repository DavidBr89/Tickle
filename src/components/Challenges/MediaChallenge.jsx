import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';
// import { css } from 'aphrodite/no-important';

import { ModalBody } from 'Utils/Modal';
import MediaUpload from 'Utils/MediaUpload';
// import ScrollList from 'Utils/ScrollList';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
// TODO: untangle later
import { Btn } from 'Components/cards/layout';

class MediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    stylesheet: PropTypes.object,
    challengeSubmission: PropTypes.oneOf([PropTypes.object, null]),
    bookmarkable: PropTypes.boolean
  };

  static defaultProps = {
    className: '',
    description: 'placeholder challenge',
    challengeSubmission: null,
    data: {},
    styles: {},
    stylesheet: {},
    bookmarkable: false,
    removable: false
  };

  state = {
    media: [],
    response: null,
    completed: false,
    ...this.props.challengeSubmission,
    started: this.props.challengeSubmission !== null
  };

  render() {
    const {
      className,
      description,
      onUpdate,
      onClose,
      styles,
      stylesheet,
      title,
      onSubmit,
      challengeSubmission,
      smallScreen,
      bookmarkable,
      onRemoveSubmission
    } = this.props;
    const { media, response, completed, started } = this.state;

    const challBtnTxt = smallScreen ? 'Chall.' : 'Challenge';

    const iconLock = <Icon.Lock size={20} />;
    // const isUploading = media.filter(m => m.url === null).length > 0;
    return (
      <ModalBody
        onClose={() => {
          onClose();
          if (
            (response !== null && !challengeSubmission) ||
            (challengeSubmission && challengeSubmission.response !== response)
          )
            onUpdate({ response, completed });
        }}
        title={title}
        footer={
          <div style={{ display: 'flex' }}>
            <Btn
              className="mr-1"
              onClick={() => {
                if (!started) {
                  this.setState({ started: true });
                  onUpdate({ media, response, completed: false });
                } else {
                  onRemoveSubmission();
                }
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <div className="mr-1">
                  {!started ? 'Bookmark' : 'UnBookmark'}
                </div>
                {started && <div>{iconLock}</div>}
              </div>
            </Btn>
            <Btn
              disabled={completed || (media.length === 0 && response === null)}
              onClick={() => {
                onUpdate({ media, response, completed: true });
                this.setState({ completed: true });
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <div className="mr-1">
                  {completed
                    ? `${challBtnTxt} submitted`
                    : `Submit ${challBtnTxt}`}
                </div>
                {completed && <div>{iconLock}</div>}
              </div>
            </Btn>
          </div>
        }
      >
        <div className={className} style={{ width: '100%', ...styles }}>
          <p style={{ width: '100%', maxHeight: '100%', overflow: 'scroll' }}>
            {description}
          </p>
          <h5>Response</h5>
          <textarea
            style={{ width: '100%' }}
            rows="4"
            placeholder="write your response"
            value={response}
            onChange={e => {
              const text = e.target.value;
              this.setState({
                response: text !== '' ? text : null,
                completed: false
              });
            }}
          />
          <div className="mb-3">
            <MediaUpload
              style={{ width: '100%' }}
              uploadPath={id => `challengeSubmissionFiles/${id}`}
              media={media}
              stylesheet={stylesheet}
              buttonStyle={{ width: 30 }}
              onChange={newMedia => {
                this.setState({ media: newMedia, completed: false });
                onUpdate({ media: newMedia, completed: false });
              }}
            />
          </div>
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
