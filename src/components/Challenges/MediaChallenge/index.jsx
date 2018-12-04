import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import * as Icon from 'react-feather';
import withAuthorization from 'Components/withAuthorization';

import MediaUpload from 'Utils/MediaUpload';

import {ScrollView, ScrollElement} from 'Utils/ScrollView';

import ChevronsDown from 'react-feather/dist/icons/chevron-down';

import {BlackModal, ModalBody} from 'Utils/Modal';

// import DelayClick from 'Components/utils/DelayClick';

/*
        <Btn
          className="mr-1"
          onClick={() => {
            if (!started) {
              this.setState({ started: true });
              addChallengeSubmission({ media, response, completed: false });
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

// class AddMedia extends Component {
//   static propTypes = {
//     children: PropTypes.node,
//     className: PropTypes.string
//   };
//
//   render() {
//     const {
//       response, media, addToStorage, removeFromStorage
//     } = this.props;
//     return (
//       <div>
//
//         <MediaUpload
//           onAdd={addToStorage}
//           onRemove={removeFromStorage}
//           className="flex-grow"
//           btnText="Upload Media"
//           media={media}
//           buttonStyle={{ width: 30 }}
//           onChange={(newMedia) => {
//           }}
//         />
//       </div>
//     );
//   }
// }

class PureMediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    stylesheet: PropTypes.object,
    challengeSubmission: PropTypes.oneOf([PropTypes.object, null]),
    bookmarkable: PropTypes.boolean,
    isSmartphone: PropTypes.boolean,
  };

  static defaultProps = {
    className: '',
    description: 'placeholder challenge',
    challengeSubmission: null,
    media: [],
    response: null,
  };

  state = {
    media: [],
    response: null,
    completed: false,
    mediaModalVisible: false,
    ...this.props,
  };

  textAreaTimeoutId = null;

  render() {
    const {
      description,
      addChallengeSubmission,
      onClose,
      styles,
      title,
      onSubmit,
      addToStorage,
      removeFromStorage,
      media,
    } = this.props;

    const {response, mediaModalVisible} = this.state;

    // const challengeStarted = challengeSubmission !== null;
    // const challengeSubmitted = completed;
    // const challengeInvalid = media.length === 0 && response === null;

    return (
      <ModalBody
        onClose={onClose}
        title="Challenge"
        footer={
          <button
            type="button"
            className="btn"
            onClick={() => {
              onSubmit({
                media,
                response,
                completed: true,
              });
              onClose();
            }}>
            Submit
          </button>
        }>
        <div className="flex flex-col flex-grow">
          <div style={{maxHeight: 200}} className="mb-5">
            <h2 className="mb-2">Description</h2>
            <p className="flex-no-shrink w-full text-lg">{description}</p>
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
                  completed: false,
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
                  onSubmit({media: newMedia, response, completed: false});
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

const MediaChallenge = compose(
  withAuthorization(authCondition),
  withRouter,
)(PureMediaChallenge);

export default MediaChallenge;
