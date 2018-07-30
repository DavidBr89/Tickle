import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
// import * as Icon from 'react-feather';

import PhotoUpload from 'Utils/PhotoUpload';
import EditPhoto from './EditPhoto';

import { isEqual } from 'lodash';
import { css } from 'aphrodite/no-important';

// import PhotoChallenge from 'Src/components/Challenges/MatchPhotoChallenge';
import ChallengeAuthorModalBody from 'Src/components/ChallengeAuthor';
import { extractCardFields } from 'Constants/cardFields';
import { MODAL_FULL_HEIGHT } from 'Constants/styleDimensions';

import { Modal, StyledModalBody } from 'Utils/Modal';
import { MediaSearch, MediaOverview } from '../MediaSearch';
import { coverPhotoStyle } from '../styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import {
  // FieldSet,
  // PreviewMedia,
  MediaField,
  ChallengeField,
  DescriptionField,
  EditButton,
  Img,
  ImgOverlay,
  // Tags,
  // SmallPreviewTags,
  BigButton,
  FlipButton
} from '../layout';

import { TagInput, PreviewTags } from 'Components/utils/Tag';

import CardHeader from '../CardHeader';

const FooterBtn = ({ onClick, children, disabled, style = {} }) => (
  <CardThemeConsumer>
    {({ stylesheet: { btn } }) => (
      <button
        className={css(btn)}
        style={{ ...style, fontWeight: 'bold' }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )}
  </CardThemeConsumer>
);
// {id: null, floorX: 0.5, floorY: 0.5, img: null, loc: { latitude: 50.85146, longitude: 4.315483 }, media: null, title: null, tags: null, challenge: null,
// }
//
const defaultProps = {
  title: null,
  challenge: null,
  // date: '28/04/2012 10:00',
  tags: null,
  img: null,
  xpPoints: null,
  description: null,
  // loc: { latitude: 50.828797, longitude: 4.352191 },
  creator: 'Jan',
  radius: 500,
  media: [],
  comments: []
};

class TextAreaModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { ...this.props };

  render() {
    const { onUpdate } = this.props;
    const { text } = this.state;

    return (
      <StyledModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={<FooterBtn onClick={() => onUpdate(text)}>Update</FooterBtn>}
      >
        <div className="form-group">
          <textarea
            onChange={e =>
              this.setState({
                text: e.target.value || null
              })
            }
            rows={5}
            style={{ width: '100%' }}
            placeholder={'<Please insert your description>'}
          >
            {text}
          </textarea>
        </div>
      </StyledModalBody>
    );
  }
}

class TitleModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onUpdate: PropTypes.func
  };

  state = { ...this.props };

  render() {
    const { onUpdate } = this.props;
    const { text } = this.state;

    return (
      <StyledModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={<FooterBtn onClick={() => onUpdate(text)}>Update</FooterBtn>}
      >
        <div className="form-group">
          <input
            onChange={e =>
              this.setState({
                text: e.target.value || null
              })
            }
            style={{ width: '100%' }}
            value={text}
          />
        </div>
      </StyledModalBody>
    );
  }
}

class DescriptionModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onUpdate: PropTypes.func
  };

  state = { ...this.props };

  render() {
    const { onUpdate } = this.props;
    const { text } = this.state;

    return (
      <StyledModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={<FooterBtn onClick={() => onUpdate(text)}>Update</FooterBtn>}
      >
        <div className="form-group">
          <input
            onChange={e =>
              this.setState({
                title: e.target.value || null
              })
            }
            style={{ width: '100%' }}
            value={text}
          />
        </div>
      </StyledModalBody>
    );
  }
}

class EditCardFront extends PureComponent {
  static propTypes = {
    // ...ReadCardFront.propTypes,
    template: PropTypes.bool,
    onAttrUpdate: PropTypes.func,
    onSubmit: PropTypes.func
    // allChallenges: PropTypes.array
  };
  static defaultProps = {
    // ...ReadCardFront.defaultProps,
    onAttrUpdate: d => d,
    onSubmit: d => d,
    allChallenges: [],
    template: false
  };

  constructor(props) {
    super(props);
    this.nodeDescription = null;
  }
  state = {
    data: {
      ...extractCardFields({ ...this.props })
    },
    added: !this.props.template,
    dialog: null
  };

  componentDidUpdate(prevProps, prevState) {
    const prevData = prevState.data;
    const { onUpdate } = this.props;
    const { data } = this.state;
    // TODO: check the other attrs
    if (
      !isEqual(prevData, data) ||
      !isEqual(prevData.challenge, data.challenge) ||
      !isEqual(prevData.media, data.media)
    ) {
      onUpdate({ ...data });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // return this.props.description !== nextProps.description;
  //   return false;
  // }

  onCloseModal = () => {
    const { data } = this.state;
    const { onUpdate } = this.props;
    // onUpdate({ ...data });
    this.setState({ dialog: null });
  };

  updateField(field) {
    this.setState(oldState => ({ data: { ...oldState.data, ...field } }));
  }

  updateFieldAndCloseModal(field) {
    this.setState(oldState => ({
      data: { ...oldState.data, ...field },
      dialog: null
    }));
  }

  modalWriteContent() {
    const { data, dialog } = this.state;
    const { challenge } = data;
    const { uiColor, tagColorScale, stylesheet, height } = this.props;

    // console.log('tagColorScale', tagColorScale);
    // TODO: img
    const { title, tags, img, description, media } = data;
    const closeBtn = <FooterBtn onClick={this.onCloseModal}>Close</FooterBtn>;

    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;
    const modalProps = { visible: modalVisible, title: dialogTitle };

    switch (dialogTitle) {
      case 'Title':
        return (
          <TitleModal
            {...modalProps}
            text={title}
            onUpdate={newTitle =>
              this.updateFieldAndCloseModal({ title: newTitle })
            }
          />
        );
      case 'Tags':
        return (
          <StyledModalBody
            onClose={this.onCloseModal}
            {...modalProps}
            footer={closeBtn}
          >
            <TagInput
              tags={tags}
              colorScale={tagColorScale}
              uiColor={uiColor}
              onChange={newTags => this.updateField({ tags: [...newTags] })}
            />
          </StyledModalBody>
        );
      case 'Photo':
        return (
          <StyledModalBody
            {...modalProps}
            onClose={this.onCloseModal}
            footer={closeBtn}
            style={
              dialogTitle === 'Media' ? { height: MODAL_FULL_HEIGHT } : null
            }
          >
            <EditPhoto
              uiColor="grey"
              imgUrl={img ? img.url : null}
              stylesheet={stylesheet}
              onChange={imgObj => {
                console.log('onChange', imgObj);
                this.updateField({ img: imgObj, dialog: null });
              }}
            />
          </StyledModalBody>
        );
      case 'Description':
        return (
          <TextAreaModal
            {...modalProps}
            text={description}
            onUpdate={newDescr => {
              this.updateFieldAndCloseModal(
                {
                  description: newDescr
                },
                true
              );
            }}
          />
        );
      case 'Media':
        return (
          <StyledModalBody
            footer={closeBtn}
            {...modalProps}
            onClose={this.onCloseModal}
            style={{ height: MODAL_FULL_HEIGHT }}
          >
            <MediaSearch
              selectedMedia={media}
              stylesheet={stylesheet}
              onChange={mediaItems => {
                this.updateField({ media: mediaItems });
              }}
            />
          </StyledModalBody>
        );
      case 'Challenge':
        return (
          <ChallengeAuthorModalBody
            {...modalProps}
            onClose={this.onCloseModal}
            uiColor={uiColor}
            key={challenge ? challenge.id : 'newChallenge'}
            challenge={challenge}
            onChange={ch => {
              this.updateField({ challenge: ch });
            }}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const {
      onClose,
      flipHandler,
      style,
      background,
      uiColor,
      tagColorScale,
      onSubmit,
      template,
      stylesheet
    } = this.props;
    const { data, added, dialog } = this.state;
    const modalVisible = dialog !== null;
    const { cardLayout, coverPhoto } = stylesheet;
    const {
      id,
      title,
      tags,
      img,
      description,
      media,
      children,
      challenge
    } = data;

    return (
      <CardHeader
        style={{
          zIndex: 4000,
          ...style
        }}
        title={title}
        onClose={onClose}
        background={background}
        uiColor={uiColor}
        edit
        editButton={
          <EditButton
            onClick={() =>
              this.setState({
                dialog: { title: 'Title', data: title }
              })
            }
          />
        }
        flipHandler={flipHandler}
      >
        <div className={css(cardLayout)} style={{ height: '100%' }}>
          <Modal visible={modalVisible}>{this.modalWriteContent()}</Modal>
          <div className={css(cardLayout)}>
            <ImgOverlay
              src={img && img.url}
              className={css(coverPhoto)}
              footer={
                <EditButton
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    width: 40,
                    height: 40,
                    zIndex: 3000
                  }}
                  onClick={() => {
                    this.setState({
                      dialog: { title: 'Photo', data: tags }
                    });
                  }}
                />
              }
            >
              <div
                className="m-2"
                style={{ position: 'absolute', zIndex: 200, left: 0, top: 0 }}
              >
                <div style={{ display: 'flex' }}>
                  <PreviewTags colorScale={tagColorScale} data={tags} />
                  <EditButton
                    className="mr-3"
                    onClick={() => {
                      this.setState({
                        dialog: { title: 'Tags', data: tags }
                      });
                    }}
                  />
                </div>
              </div>
            </ImgOverlay>

            <DescriptionField
              style={{ maxHeight: '20%' }}
              text={description}
              borderColor={uiColor}
              edit
              onEdit={() =>
                this.setState({
                  dialog: {
                    title: 'Description',
                    id: 'description',
                    data: description
                  }
                })
              }
            />
            <MediaField
              style={{ maxHeight: '20%' }}
              media={media}
              borderColor={uiColor}
              edit
              onEdit={() =>
                this.setState({
                  dialog: { title: 'Media', data: media }
                })
              }
            />

            <div className="p-1 pt-3">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <div style={{ width: '80%', display: 'flex' }}>
                  {template && (
                    <BigButton
                      className="mr-2"
                      edit
                      onClick={() => {
                        // TODO
                        const message = window.confirm(
                          `Are you sure you wish to ${
                            added ? 'remove' : 'create'
                          } this card?`
                        );

                        if (message) {
                          onSubmit(data);
                          this.setState({ added: !added });
                        }
                      }}
                    >
                      {added ? 'Remove Card' : 'Create Card'}
                    </BigButton>
                  )}
                  <BigButton
                    edit
                    onClick={() =>
                      this.setState({
                        dialog: { title: 'Challenge', data: challenge }
                      })
                    }
                  >
                    {template ? 'Add Chall.' : 'Update Challenge'}
                  </BigButton>
                </div>
                <FlipButton
                  style={{ width: '20%' }}
                  color={uiColor}
                  onClick={flipHandler}
                  className="ml-3"
                />
              </div>
            </div>
            {children}
          </div>
        </div>
      </CardHeader>
    );
  }
}

EditCardFront.defaultProps = defaultProps;

const StyledEditCardFront = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <EditCardFront {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

export default StyledEditCardFront;
