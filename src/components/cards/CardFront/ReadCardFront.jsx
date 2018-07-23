import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { css } from 'aphrodite';

// import chroma from 'chroma-js';
// import * as Icon from 'react-feather';

import MediaChallenge from 'Components/Challenges/MediaChallenge';
import { TagInput, PreviewTags } from 'Utils/Tag';
import { Modal, ModalBody } from 'Utils/Modal';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { MediaPreview } from 'Components/cards/MediaSearch';

import CardHeader from '../CardHeader';

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
    challengeSubmission: {},
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

  state = { dialog: null };

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

    switch (field) {
      case 'Title':
        return <p style={{ width: '100%' }}>{title}</p>;
      case 'Tags':
        return <p style={{ width: '100%' }}>{tags}</p>;
      case 'Photo':
        return <div>photo</div>;
      case 'Description':
        return (
          <ModalBody>
            <p style={{ width: '100%' }}>{description}</p>
          </ModalBody>
        );
      case 'Media':
        return (
          <ModalBody>
            <MediaPreview data={media || []} uiColor={uiColor} />
          </ModalBody>
        );
      case 'Challenge':
        return (
          <MediaChallenge
            {...challenge}
            key={id}
            {...challengeSubmission}
            onChange={d => {
              onSubmitChallenge({
                cardId: id,
                authorId: uid,
                ...challengeSubmission,
                ...d
              });
              this.setState({ dialog: null });
            }}
          />
        );
      default:
        return <div>error</div>;
    }
  }

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
      stylesheet,
      tagColorScale,
      style
    } = this.props;

    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.key : null;
    const { coverPhoto } = stylesheet;

    // TODO: modal color
    return (
      <CardHeader
        {...this.props}
        style={{
          zIndex: 4000,
          ...style
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '90%',
            justifyContent: 'space-between'
          }}
        >
          <Modal
            visible={modalVisible}
            title={dialogTitle}
            onClose={() => this.setState({ dialog: null })}
          >
            {this.modalReadContent(dialogTitle)}
          </Modal>
          <ImgOverlay src={img ? img.url : null} className={css(coverPhoto)}>
            <div style={{ display: 'flex', width: '70%', maxWidth: '80%' }}>
              {/* TODO: fix width */}
              <PreviewTags colorScale={tagColorScale} data={tags} />
            </div>
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
            media={media}
            onClick={() =>
              this.setState({ dialog: { key: 'Media', data: media } })
            }
          />
          <div className="p-1 pt-3" style={{ display: 'flex' }}>
            <BigButton
              onClick={() =>
                this.setState({
                  dialog: { key: 'Challenge', data: media }
                })
              }
              style={{ width: '80%' }}
            >
              {'Collect Card'}{' '}
            </BigButton>

            <FlipButton
              color={uiColor}
              onClick={flipHandler}
              style={{ width: '20%' }}
              className="ml-2"
            />
          </div>
        </div>
      </CardHeader>
    );
  }
}

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
