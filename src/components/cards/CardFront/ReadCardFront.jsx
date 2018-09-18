import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaOverview } from 'Components/cards/MediaSearch';

import placeholderImgSrc from '../placeholder.png';

import CardFront from './CardFront';

import { Btn } from 'Components/cards/layout';

import { IMG } from 'Constants/mediaTypes';

class ReadCardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    tags: PropTypes.any, // PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.oneOf([PropTypes.object, null]),
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
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
    challengeSubmission: null,
    // date: '28/04/2012 10:00',
    tags: null,
    img: null,
    xpPoints: null,
    description: null,
    // loc: { latitude: 50.828797, longitude: 4.352191 },
    creator: 'Jan',
    radius: 500,
    media: [],
    comments: [],
    flipHandler: d => d,
    tagColorScale: () => 'green',
    bookmarkable: false,
    onRemoveChallengeSubmission: d => d,
    challengeComp: MediaChallenge
  };

  state = {
    dialogKey: null,
    challengeSubmitted:
      this.props.challengeSubmission !== null &&
      this.props.challengeSubmission.completed,
    challengeStarted:
      this.props.challengeSubmission !== null &&
      this.props.challengeSubmission.completed
  };

  closeModal = () => this.setState({ dialogKey: null });

  modalReadContent(field) {
    const {
      title,
      tags,
      description,
      media,
      uiColor,
      challenge,
      id,
      img,
      uid,
      challengeSubmission,
      onSubmitChallenge,
      smallScreen,
      bookmarkable,
      removable,
      onRemoveChallengeSubmission,
      challengeComp
    } = this.props;

    const FooterBtn = () => (
      <Btn onClick={() => this.setState({ dialogKey: null })}>Close</Btn>
    );

    switch (field) {
      case 'title':
        return <p style={{ width: '100%' }}>{title}</p>;
      case 'Tags':
        return <p style={{ width: '100%' }}>{tags}</p>;
      case 'Description':
        return (
          <ModalBody
            onClose={this.closeModal}
            title="Description"
            footer={<FooterBtn />}
          >
            <p style={{ width: '100%' }}>{description}</p>
          </ModalBody>
        );
      case 'Img': {
        const photo = img
          ? [
            {
              thumbnail: img.url,
              ...img,
              type: IMG
            }
          ]
          : [];

        const mediaWithPhoto = img ? [...photo, ...media] : media;

        return (
          <ModalBody
            onClose={this.closeModal}
            title="Media"
            footer={<FooterBtn />}
          >
            <MediaOverview
              edit={false}
              data={mediaWithPhoto}
              uiColor={uiColor}
            />
          </ModalBody>
        );
      }
      case 'Challenge':
        return React.cloneElement(challengeComp, {
          onClose: this.closeModal,
          challengeSubmission
        });
      default:
        return <div>error</div>;
    }
  }

  btnText = () => {
    const { challengeStarted, challengeSubmitted } = this.state;
    if (challengeSubmitted) {
      return 'Challenge done';
    }
    if (challengeStarted) {
      return 'Challenge started';
    }
    return 'Challenge';
  };

  render() {
    const {
      tags,
      img,
      description,
      media,
      title,
      uiColor,
      flipHandler,
      // background,
      challengeSubmission,
      stylesheet,
      tagColorScale,
      style,
      smallScreen,
      onHeaderClick,
      onClose
    } = this.props;

    const { dialogKey, challengeSubmitted } = this.state;
    const modalVisible = dialogKey !== null;
    return (
      <React.Fragment>
        <Modal
          visible={modalVisible}
          title={dialogKey}
          onClose={() => this.setState({ dialogKey: null })}
        >
          {this.modalReadContent(dialogKey)}
        </Modal>

        <CardFront
          {...this.props}
          onClose={onClose}
          onTitleClick={() => console.log('img click')}
          onImgClick={() =>
            this.setState({
              dialogKey: 'Img'
            })
          }
          onDescriptionClick={() =>
            this.setState({
              dialogKey: 'Description'
            })
          }
          onMediaClick={() => this.setState({ dialogKey: 'Media' })}
          onChallengeClick={() =>
            this.setState({
              dialogKey: 'Challenge'
            })
          }
          onFlip={flipHandler}
        />
      </React.Fragment>
    );
  }
}

// <span className="ml-1">
//                 <Icon.Lock />
//
//               </span>
const StyledReadCardFront = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <ReadCardFront {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

// const mapStateToProps = state => ({ authUserId: state.Session.uid });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       asyncSubmitChallenge
//     },
//     dispatch
//   );
//
export default StyledReadCardFront;
// mapStateToProps
// mapDispatchToProps
