import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';
import { css } from 'aphrodite/no-important';

import { ModalBody } from 'Utils/Modal';
import MediaUpload from 'Utils/MediaUpload';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';
// import ScrollList from 'Utils/ScrollList';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import { ChevronsDown } from 'react-feather';

import DelayClick from 'Components/utils/DelayClick';

import { db } from 'Firebase';

// TODO: untangle later
import { Btn } from 'Components/cards/layout';

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

const GeneralControls = ({ ...props }) => {
  const {
    media,
    text,
    completed,
    challengeSubmitted,
    challengeInvalid,
    challengeStarted,
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
        <DelayClick delay={200} onClick={onStart}>
          <Btn
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
          </Btn>
        </DelayClick>
      </div>
      <DelayClick delay={200} onClick={onSubmit}>
        <Btn
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
        </Btn>
      </DelayClick>
    </div>
  );
};

const TextAreaControls = ({ onClick }) => (
  <div style={{ display: 'flex' }}>
    <Btn className="mr-1" onClick={onClick}>
      <div style={{ display: 'flex' }}>
        <div>Disable Keyboard</div>
        <ChevronsDown />
      </div>
    </Btn>
  </div>
);

const SubmitInfo = ({ challengeSubmitted, challengeInvalid }) => {
  if (challengeSubmitted)
    return (
      <div className="alert alert-success mb-3 p-3">
        <strong>Challenge is submitted!</strong>
      </div>
    );

  if (!challengeInvalid) return null;

  if (challengeInvalid)
    return (
      <div className="alert alert-warning mb-3 p-3">
        <strong>Please enter some info to fulfill the challenge!</strong>
      </div>
    );

  return null;
};

function makeFooter({
  challengeStarted,
  challengeSubmitted,
  challengeInvalid
}) {
  const { isSmartphone, onUpdate, challengeSubmission } = this.props;
  const { focusTextArea, media, response } = this.state;

  const gcontrol = (
    <GeneralControls
      {...this.state}
      challengeStarted={challengeStarted}
      challengeSubmitted={challengeSubmitted}
      challengeInvalid={challengeInvalid}
      onStart={() => {
        clearTimeout(this.textAreaTimeoutId);
        onUpdate({ media, response, completed: false });
      }}
      onSubmit={() => {
        clearTimeout(this.textAreaTimeoutId);
        onUpdate({ media, response, completed: true });
        this.setState({ completed: true });
      }}
    />
  );

  if (isSmartphone) {
    return !focusTextArea ? (
      gcontrol
    ) : (
      <TextAreaControls
        onClick={() => {
          this.setState({ focusTextArea: false });
        }}
      />
    );
  }
  return gcontrol;
}

class MediaChallenge extends Component {
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

  textAreaTimeoutId = null;
  componentDidUpdate(prevProps, prevState) {
    const { focusTextArea, media, response, completed } = this.state;
    const { onUpdate } = this.props;
    if (focusTextArea && prevState.focusTextArea !== focusTextArea) {
      this.scrollTo('textArea');
    }

    if (media.length !== prevState.media.length) {
      this.scrollTo('mediaUpload');
    }

    if (!focusTextArea && prevState.focusTextArea) {
      const sub = { media, response, completed: false };
      clearTimeout(this.textAreaTimeoutId);
      this.textAreaTimeoutId = setTimeout(() => onUpdate(sub), 1000);
    }

    if (completed && !prevState.completed) {
      this.scrollTo('info');
    }
  }

  scrollTo = (name, opts) => {
    this._scroller.scrollTo(name, opts);
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
    const { media, response, completed, started, focusTextArea } = this.state;

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
          //   onUpdate({ response, media, completed });
        }}
        title={title}
        footer={makeFooter.bind(this)({
          challengeStarted,
          challengeSubmitted,
          challengeInvalid
        })}
      >
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            className="flexCol flex-full"
            ref={cont => (this.cont = cont)}
            style={{ minHeight: 300 }}
          >
            <p
              style={{
                width: '100%',
                maxHeight: '100%',
                overflow: 'scroll',
                flexShrink: 0,
                flexGrow: 0
              }}
            >
              {description}
            </p>

            <ScrollElement name="textArea">
              <div style={{ width: '100%', flexShrink: 0, flexGrow: 0 }}>
                <h5>Response</h5>
                <textarea
                  style={{ width: '100%' }}
                  disabled={challengeSubmitted}
                  rows="4"
                  placeholder="write your response"
                  value={response}
                  onFocus={() => this.setState({ focusTextArea: true })}
                  onBlur={() => this.setState({ focusTextArea: false })}
                  onChange={e => {
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
                disabled={completed}
                style={{ width: '100%', flex: '0 0' }}
                uploadPath={id => `challengeSubmissionFiles/${id}`}
                media={media}
                stylesheet={stylesheet}
                buttonStyle={{ width: 30 }}
                onChange={newMedia => {
                  this.setState({ media: newMedia, completed: false });
                  onUpdate({ media: newMedia, response, completed: false });
                }}
              />
            </ScrollElement>
            <div
              className="flexCol mb-3"
              style={{ flex: '1 0 auto', justifyContent: 'flex-end' }}
            >
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

const StyledMediaChallenge = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <MediaChallenge {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

export default StyledMediaChallenge;
