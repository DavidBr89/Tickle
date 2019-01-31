import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import withAuthorization from '~/components/withAuthorization';

import MediaUpload from '~/components/utils/MediaUpload';

import {BlackModal, ModalBody} from '~/components/utils/Modal';

class TextChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    submission: PropTypes.oneOf([PropTypes.object, null]),
    bookmarkable: PropTypes.boolean,
    isSmartphone: PropTypes.boolean
  };

  static defaultProps = {
    className: '',
    activity: {
      description: 'placeholder challenge',
      title: null
    },
    activitySubmission: null,
    media: [],
    response: null
  };

  state = {
    media: [],
    response: null,
    completed: false,
    mediaModalVisible: false,
    ...this.props.submission
  };

  textAreaTimeoutId = null;

  render() {
    const {
      onClose,
      styles,
      activity: {title, description},
      onSubmit,
      addToStorage,
      removeFromStorage,
      media
    } = this.props;

    const {response, mediaModalVisible} = this.state;

    // const challengeStarted = activitySubmission !== null;
    // const challengeSubmitted = completed;
    // const challengeInvalid = media.length === 0 && response === null;

    return (
      <ModalBody
        onClose={onClose}
        title={title || 'Challenge'}
        footer={
          <button
            type="button"
            className="btn"
            onClick={() => {
              onSubmit({
                media,
                response,
                completed: true
              });
              onClose();
            }}>
            Submit
          </button>
        }>
        <div className="flex flex-col flex-grow">
          <div style={{maxHeight: 200}} className="mb-5">
            <h2 className="mb-2">Description</h2>
            <p className="flex-no-shrink w-full text-lg">
              {description}
            </p>
          </div>

          <div className="mb-3">
            <h2 className="mb-2">Response</h2>
            <textarea
              className="form-control w-full"
              rows="4"
              placeholder="Write your response"
              value={response}
              onChange={e => {
                const text = e.target.value;
                this.setState({
                  response: text !== '' ? text : null,
                  completed: false
                });
              }}
            />
          </div>
          <button
            type="button"
            className="btn w-full"
            onClick={() => this.setState({mediaModalVisible: true})}>
            Add Media
          </button>
          <BlackModal visible={mediaModalVisible}>
            <ModalBody
              onClose={() => this.setState({mediaModalVisible: false})}>
              <MediaUpload
                className="flex-grow"
                media={media}
                onAdd={addToStorage}
                onRemove={removeFromStorage}
                btnText="Upload Media"
                onChange={newMedia => {
                  onSubmit({
                    media: newMedia,
                    response,
                    completed: false
                  });
                }}
              />
            </ModalBody>
          </BlackModal>
        </div>
      </ModalBody>
    );
  }
}

const authCondition = authUser => authUser !== null;

export default compose(
  withAuthorization(authCondition),
  withRouter
)(TextChallenge);
