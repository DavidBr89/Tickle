import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { css } from 'aphrodite';

// import * as Icon from 'react-feather';

// import chroma from 'chroma-js';
// import * as Icon from 'react-feather';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { MODAL_FULL_HEIGHT } from 'Constants/styleDimensions';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaOverview } from 'Components/cards/MediaSearch';

import CardHeader from '../CardHeader';

import { Btn } from 'Components/cards/layout';

// todo

import {
  // FieldSet,
  // PreviewMedia,
  MediaField,
  ChallengeField,
  DescriptionField,
  EditButton,
  Img,
  ImgOverlay,
  ZoomIcon,
  // Tags,
  // SmallPreviewTags,
  BigButton,
  FlipButton
} from '../layout';

// import CardHeader from '../CardHeader';

const defaultProps = {};

class ReadCardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    tags: PropTypes.any, // PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.oneOf([PropTypes.object, null]),
    onCollect: PropTypes.func,
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string,
    tagColorScale: PropTypes.func,
    challenge: PropTypes.object
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
    onCollect: null,
    flipHandler: d => d,
    tagColorScale: () => 'green'
  };

  state = {
    dialog: null,
    challengeSubmitted:
      this.props.challengeSubmission !== null &&
      this.props.challengeSubmission.completed,
    challengeStarted:
      this.props.challengeSubmission !== null &&
      this.props.challengeSubmission.completed
  };

  closeModal = () => this.setState({ dialog: null });

  modalReadContent(field) {
    const {
      title,
      tags,
      description,
      media,
      uiColor,
      challenge,
      id,
      uid,
      challengeSubmission,
      onSubmitChallenge
    } = this.props;

    const FooterBtn = () => <Btn onClick={this.onClose}>Close</Btn>;

    switch (field) {
      case 'Title':
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
      case 'Media':
        return (
          <ModalBody
            onClose={this.closeModal}
            title="Media"
            footer={<FooterBtn />}
          >
            <MediaOverview edit={false} data={media || []} uiColor={uiColor} />
          </ModalBody>
        );
      case 'Challenge':
        return (
          <MediaChallenge
            {...challenge}
            title="Challenge"
            key={id}
            challengeSubmission={challengeSubmission}
            onClose={this.closeModal}
            onUpdate={d => {
              onSubmitChallenge({
                cardId: id,
                authorId: uid,
                ...challengeSubmission,
                ...d
                // completed: false
              });
              this.setState({
                challengeSubmitted: false,
                challengeStarted: true
              });
            }}
            onSubmit={d => {
              onSubmitChallenge({
                cardId: id,
                authorId: uid,
                ...challengeSubmission,
                ...d
                // completed: true
              });
              this.setState({
                dialog: null,
                challengeSubmitted: true,
                challengeStarted: false
              });
            }}
          />
        );
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
      // onCollect,
      uiColor,
      flipHandler,
      // background,
      challengeSubmission,
      stylesheet,
      tagColorScale,
      style,
      smallScreen
    } = this.props;

    const { dialog, challengeSubmitted } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.key : null;
    const { coverPhoto, cardLayout } = stylesheet;

    // TODO: modal color
    return (
      <CardHeader
        {...this.props}
        style={{
          zIndex: 4000,
          ...style
        }}
      >
        <div className={css(cardLayout)}>
          <Modal
            visible={modalVisible}
            title={dialogTitle}
            onClose={() => this.setState({ dialog: null })}
          >
            {this.modalReadContent(dialogTitle)}
          </Modal>
          <ImgOverlay src={img ? img.url : null} className={css(coverPhoto)}>
            <PreviewTags colorScale={tagColorScale} data={tags} />
          </ImgOverlay>
          <DescriptionField
            style={{ maxHeight: '20%' }}
            text={description}
            onEdit={() =>
              this.setState({
                dialog: {
                  key: 'Description',
                  id: 'description',
                  data: description
                }
              })
            }
          />
          <MediaField
            style={{ maxHeight: '20%' }}
            smallScreen={smallScreen}
            media={smallScreen ? media.slice(0, 2) : media.slice(0, 4)}
            onClick={() =>
              this.setState({ dialog: { key: 'Media', data: media } })
            }
          />
          <div className="" style={{ display: 'flex' }}>
            <BigButton
              onClick={() =>
                this.setState({
                  dialog: { key: 'Challenge', data: media }
                })
              }
              style={{ width: '80%' }}
            >
              {this.btnText()}
            </BigButton>

            <FlipButton
              color={uiColor}
              onClick={flipHandler}
              className="ml-2"
            />
          </div>
        </div>
      </CardHeader>
    );
  }
}

// <span className="ml-1">
//                 <Icon.Lock />
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
