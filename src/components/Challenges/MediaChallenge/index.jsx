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
    focusTextArea: false,
    ...this.props.challengeSubmission,
    started: this.props.challengeSubmission !== null
  };

  componentDidUpdate(prevProps, prevState) {
    const { focusTextArea, media } = this.state;
    if (focusTextArea && prevState.focusTextArea !== focusTextArea) {
      this.scrollTo('textArea');
    }

    if (media.length !== prevState.media.length) {
      this.scrollTo('mediaUpload');
    }
  }

  scrollTo = (name, opts) => {
    this._scroller.scrollTo(name, opts);
  };

  textAreaControls = () => (
    <div style={{ display: 'flex' }}>
      <Btn
        className="mr-1"
        onClick={() => {
          this.setState({ focusTextArea: false });
        }}
      >
        <div style={{ display: 'flex' }}>
          <div>Disable Keyboard</div>
          <ChevronsDown />
        </div>
      </Btn>
    </div>
  );

  generalControls = () => {
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

    const iconLock = <Icon.Lock size={20} />;
    return (
      <div style={{ display: 'flex' }}>
        <Btn
          disabled={completed || (media.length === 0 && response === null)}
          style={{
            opacity: completed && 0.6
          }}
          onClick={() => {
            onUpdate({ media, response, completed: true });
            this.setState({ completed: true });
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <div className="mr-1">{completed ? 'Submitted' : 'Submit'}</div>
            {completed && <div>{iconLock}</div>}
          </div>
        </Btn>
      </div>
    );
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

    const challBtnTxt = smallScreen ? 'Chall.' : 'Challenge';

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
          !focusTextArea ? this.generalControls() : this.textAreaControls()
        }
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
                style={{ width: '100%', flex: '0 0' }}
                uploadPath={id => `challengeSubmissionFiles/${id}`}
                media={media}
                stylesheet={stylesheet}
                buttonStyle={{ width: 30 }}
                onChange={newMedia => {
                  this.setState({ media: newMedia, completed: false });
                  onUpdate({ media: newMedia, completed: false });
                }}
              />
            </ScrollElement>
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
