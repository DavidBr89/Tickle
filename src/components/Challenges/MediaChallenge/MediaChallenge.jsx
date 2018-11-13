import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';

import { ModalBody } from 'Utils/Modal';
import MediaUpload from 'Utils/MediaUpload';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';

import ChevronsDown from 'react-feather/dist/icons/chevron-down';

import DelayClick from 'Components/utils/DelayClick';

/*
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
            <div className="mr-1">{!started ? 'Bookmark' : 'UnBookmark'}</div>
            {started && <div>{iconLock}</div>}
          </div>
        </Btn>
*/

const DefaultControls = ({ ...props }) => {
  const {
    media, text, completed, challengeSubmitted, challengeInvalid, challengeStarted,
    onSubmit,
    onStart
  } = props;

  const iconLock = <Icon.Lock size={15} />;
  const submitDisabled = challengeInvalid || challengeSubmitted;
  return (
    <div
      style={{
        display: 'flex',
        justifyItems: 'space-between',
        alignItems: 'center'
      }}
    >
      <div className="mr-3">
        <button
          className="btn"
          type="button"
          disabled={challengeStarted}
          style={{
            opacity: challengeStarted && 0.6
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="mr-1">
              {!challengeStarted ? 'Start' : 'Started'}
            </div>
            {challengeStarted && <div>{iconLock}</div>}
          </div>
        </button>
      </div>
      <button
        type="button"
        className="btn-black"
        disabled={submitDisabled}
        style={{
          opacity: submitDisabled && 0.6
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className="mr-1">{completed ? 'Submitted' : 'Submit'}</div>
          {submitDisabled && <div>{iconLock}</div>}
        </div>
      </button>
    </div>
  );
};

const TextAreaControls = ({ onClick }) => (
  <div style={{ display: 'flex' }}>
    <button className="btn-black mr-1" onClick={onClick}>
      <div style={{ display: 'flex' }}>
        <div>Disable Keyboard</div>
        <ChevronsDown />
      </div>
    </button>
  </div>
);

const SubmitInfo = ({ challengeSubmitted, challengeInvalid }) => {
  if (challengeSubmitted) {
    return (
      <div className="alert alert-success mb-3 p-3">
        <strong>Challenge is submitted!</strong>
      </div>
    );
  }

  if (!challengeInvalid) return null;

  if (challengeInvalid) {
    return (
      <div className="alert alert-warning mb-3 p-3">
        <strong>Please enter some info to fulfill the challenge!</strong>
      </div>
    );
  }

  return null;
};

const Footer = ({
  isSmartphone,
  challengeStarted,
  challengeSubmitted,
  challengeInvalid,
  focusTextArea,
  onChallengeStart,
  onChallengeSubmit,
  onDisableKeyboard
}) => {
  const gcontrol = (
    <DefaultControls
      challengeStarted={challengeStarted}
      challengeSubmitted={challengeSubmitted}
      challengeInvalid={challengeInvalid}
      onStart={onChallengeStart}
      onSubmit={onChallengeSubmit}
    />
  );

  if (isSmartphone) {
    return !focusTextArea ? (
      gcontrol
    ) : (
      <TextAreaControls onClick={onDisableKeyboard} />
    );
  }
  return gcontrol;
};

export default class MediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    stylesheet: PropTypes.object,
    challengeSubmission: PropTypes.oneOf([PropTypes.object, null]),
    bookmarkable: PropTypes.boolean,
    isSmartphone: PropTypes.boolean
  };

  static defaultProps = {
    className: '',
    description: 'placeholder challenge',
    challengeSubmission: null,
    data: {},
    styles: {},
    stylesheet: {},
    bookmarkable: false,
    removable: false,
    isSmartphone: false
  };

  state = {
    media: [],
    response: null,
    completed: false,
    focusTextArea: false,
    ...this.props.challengeSubmission,
    started: this.props.challengeSubmission !== null
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      focusTextArea, media, response, completed
    } = this.state;
    const { onUpdate } = this.props;
  }

  textAreaTimeoutId = null;

  scrollTo = (name, opts) => {
    this._scroller.scrollTo(name, opts);
  };

  render() {
    const {
      // className,
      description,
      onUpdate,
      onClose,
      styles,
      stylesheet,
      title,
      onSubmit,
      challengeSubmission,
      isSmartphone,
      // smallScreen,
      bookmarkable,
      onRemoveSubmission
    } = this.props;
    const {
      media, response, completed, started, focusTextArea
    } = this.state;

    const challengeStarted = challengeSubmission !== null;
    const challengeSubmitted = completed;
    const challengeInvalid = media.length === 0 && response === null;

    return (
      <ModalBody
        onClose={() => {
          onClose();
          // if (
          //   (response !== null && !challengeSubmission) ||
          //   (challengeSubmission && challengeSubmission.response !== response)
          // )
          if (!completed) {
            onUpdate({ response, media, completed });
          }
        }}
        title={title}
        footer={
          <Footer
            isSmartphone={isSmartphone}
            challengeStarted={challengeStarted}
            challengeSubmitted={challengeSubmitted}
            challengeInvalid={challengeInvalid}
            focusTextArea={focusTextArea}
            onChallengeStart={() => {
              // clearTimeout(this.textAreaTimeoutId);
              onUpdate({ media, response, completed: false });
            }}
            onChallengeSubmit={() => {
              onUpdate({ media, response, completed: true });
              this.setState({
                completed: true,
                focusTextArea: false,
                submitted: true
              });
            }}
            onDisableKeyboard={() => {
              this.setState({ focusTextArea: false });
            }}
          />
        }
      >
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            className="flex flex-col flex-grow"
            ref={cont => (this.cont = cont)}
          >
            <div
              className="flex-initial"
              style={{ width: '100%', flex: '0 0 150px' }}
            >
              <p
                style={{
                  width: '100%',
                  maxHeight: '100%',
                  overflow: 'auto',
                  flexShrink: 0,
                  flexGrow: 0
                }}
              >
                {description}
              </p>
            </div>

            <ScrollElement name="textArea">
              <div
                className="border-grey"
                style={{ width: '100%', flex: '0 0 150px' }}
              >
                <h5>Response</h5>
                <textarea
                  className="form-control"
                  style={{ width: '100%' }}
                  disabled={challengeSubmitted}
                  rows="4"
                  placeholder="write your response"
                  value={response}
                  onFocus={() => this.setState({ focusTextArea: true })}
                  onBlur={() => this.setState({ focusTextArea: false })}
                  onChange={(e) => {
                    const text = e.target.value;
                    this.setState({
                      response: text !== '' ? text : null,
                      completed: false
                    });
                  }}
                />
              </div>
            </ScrollElement>

            <ScrollElement name="mediaUpload">
              <MediaUpload
                className="flex-grow"
                disabled={completed}
                btnText="Upload Media"
                uploadPath={id => `challengeSubmissionFiles/${id}`}
                media={media}
                stylesheet={stylesheet}
                buttonStyle={{ width: 30 }}
                onChange={(newMedia) => {
                  this.setState({ media: newMedia, completed: false });
                  onUpdate({ media: newMedia, response, completed: false });
                }}
              />
            </ScrollElement>
            <div className="flexCol mb-3" style={{ justifyContent: 'flex-end' }}>
              <ScrollElement name="info">
                <SubmitInfo
                  challengeSubmitted={challengeSubmitted}
                  challengeInvalid={challengeInvalid}
                />
              </ScrollElement>
            </div>
          </div>
        </ScrollView>
      </ModalBody>
    );
  }
}
