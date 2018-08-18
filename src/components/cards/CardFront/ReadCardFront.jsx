import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { MODAL_FULL_HEIGHT } from 'Constants/styleDimensions';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaOverview } from 'Components/cards/MediaSearch';

import CardFrame from '../CardHeader';

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
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string,
    tagColorScale: PropTypes.func,
    challenge: PropTypes.object,
    bookmarkable: PropTypes.boolean
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
    onRemoveChallengeSubmission: d => d
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
      uid,
      challengeSubmission,
      onSubmitChallenge,
      smallScreen,
      bookmarkable,
      removable,
      onRemoveChallengeSubmission
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
            smallScreen={smallScreen}
            {...challenge}
            bookmarkable={bookmarkable}
            removable={removable}
            title="Challenge"
            key={id}
            challengeSubmission={challengeSubmission}
            onClose={this.closeModal}
            onRemoveSubmission={onRemoveChallengeSubmission}
            onUpdate={d => {
              onSubmitChallenge({
                cardId: id,
                ...challengeSubmission,
                ...d
              });
              this.setState({
                challengeStarted: !d.completed,
                challengeSubmitted: d.completed
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
      title,
      uiColor,
      flipHandler,
      // background,
      challengeSubmission,
      stylesheet,
      tagColorScale,
      style,
      smallScreen
    } = this.props;

    const { dialogKey, challengeSubmitted } = this.state;
    const modalVisible = dialogKey !== null;
    const { coverPhoto, cardLayout } = stylesheet;
    // TODO: modal color
    return (
      <CardFrame
        {...this.props}
        onHeaderClick={() =>
          this.setState({
            dialogKey: 'title'
          })
        }
        style={{
          zIndex: 4000,
          ...style
        }}
      >
        <div className={css(cardLayout)}>
          <Modal
            visible={modalVisible}
            title={dialogKey}
            onClose={() => this.setState({ dialogKey: null })}
          >
            {this.modalReadContent(dialogKey)}
          </Modal>
          <ImgOverlay src={img ? img.url : null} className={css(coverPhoto)}>
            <PreviewTags colorScale={tagColorScale} data={tags} />
          </ImgOverlay>
          <DescriptionField
            text={description}
            onEdit={() =>
              this.setState({
                dialogKey: 'Description'
                // id: 'description',
                // data: description
              })
            }
          />
          <MediaField
            smallScreen={smallScreen}
            media={smallScreen ? media.slice(0, 2) : media.slice(0, 4)}
            onClick={() => this.setState({ dialogKey: 'Media' })}
          />
          <div className="" style={{ display: 'flex', flexShrink: 0 }}>
            <BigButton
              onClick={() =>
                this.setState({
                  dialogKey: 'Challenge'
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
      </CardFrame>
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
