import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

// import { css } from 'aphrodite';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import {TagInput, PreviewTags} from 'Utils/Tag';
import {InlineModal, ModalBody} from 'Utils/Modal';

// TODO change
import {IMG} from 'Constants/mediaTypes';
import {MediaOverview} from './FieldTemplates/MediaSearch.jsx';

import placeholderImgSrc from '../placeholder.png';

import CardFront from './CardFront';

class ReadCardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    tags: PropTypes.any, // PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.oneOf([PropTypes.object, null]),
    onClose: PropTypes.func,
    onFlip: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string,
    tagColorScale: PropTypes.func,
    challenge: PropTypes.object,
    bookmarkable: PropTypes.boolean,
    challengeComp: PropTypes.element
  };

  static defaultProps = {
    title: null,
    challenge: null,
    activitySubmission: null,
    // date: '28/04/2012 10:00',
    tags: null,
    img: null,
    xpPoints: null,
    description: null,
    radius: 500,
    media: [],
    comments: [],
    onFlip: d => d,
    tagColorScale: () => 'green',
    bookmarkable: false,
    onRemoveChallengeSubmission: d => d,
    challengeComp: MediaChallenge
  };

  state = {
    dialogKey: null,
    modalVisible: false
  };

  closeModal = () => this.setState({modalVisible: false});

  btnText = () => {
    const {activitySubmission} = this.props;
    const challengeSubmitted =
      activitySubmission !== null && activitySubmission.completed;
    const challengeStarted =
      activitySubmission !== null && !activitySubmission.completed;

    // TODO: fix later
    const challengeCompleted =
      activitySubmission !== null && activitySubmission.feedback;

    if (challengeCompleted) return 'See Results';

    if (challengeSubmitted) {
      return 'Chall. submitted';
    }
    if (challengeStarted) {
      return 'Chall. started';
    }

    return 'Challenge';
  };

  modalReadContent(field) {
    const {
      title,
      tags,
      description,
      media,
      img,
      activitySubmission,
      challengeComp
    } = this.props;

    const CloseBtn = () => (
      <button
        className="btn"
        onClick={() => this.setState({modalVisible: false})}>
        Close
      </button>
    );

    switch (field) {
      case 'title':
        return <p style={{width: '100%'}}>{title}</p>;
      case 'Tags':
        return <p style={{width: '100%'}}>{tags}</p>;
      case 'Description':
        return (
          <ModalBody
            onClose={this.closeModal}
            title="Description"
            footer={<CloseBtn />}>
            <p style={{width: '100%'}}>{description}</p>
          </ModalBody>
        );
      case 'Img': {
        // TODO
        // const {value: imgValue} = img;
        // const photo = imgValue
        //   ? [{thumbnail: imgValue.url, ...imgValue, type: IMG}]
        //   : [];
        //
        // const mediaWithPhoto = img ? [...photo, ...media.value] : media;
        //
        // console.log('media', media);

        return (
          <ModalBody
            onClose={this.closeModal}
            title="Media"
            footer={<CloseBtn />}>
            <MediaOverview edit={false} data={media.value || []} />
          </ModalBody>
        );
      }
      case 'Challenge':
        return React.cloneElement(challengeComp, {
          onClose: this.closeModal,
          activitySubmission
        });
      default:
        return <div>error</div>;
    }
  }

  render() {
    const {onFlip, onClose} = this.props;

    const {dialogKey, modalVisible} = this.state;

    const setDialogKey = key =>
      this.setState({dialogKey: key, modalVisible: true});

    return (
      <>
        <InlineModal
          visible={modalVisible}
          title={dialogKey}
          onClose={() => this.setState({modalVisible: false})}>
          {this.modalReadContent(dialogKey)}
        </InlineModal>

        <CardFront
          {...this.props}
          onClose={onClose}
          onFlip={onFlip}
          onImgClick={() => setDialogKey('Img')}
          onDescriptionClick={() => setDialogKey('Description')}
          onMediaClick={() => setDialogKey('Media')}
          bottomControls={
            <button
              className="btn bg-black text-2xl text-white"
              onClick={() => setDialogKey('Challenge')}>
              {this.btnText()}
            </button>
          }
        />
      </>
    );
  }
}

export default ReadCardFront;
