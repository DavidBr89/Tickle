import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import * as Icon from 'react-feather';

import PhotoUpload from 'Utils/PhotoUpload';

import { isEqual } from 'lodash';

import PhotoChallenge from 'Src/components/Challenges/MatchPhotoChallenge';

import { Modal, ModalBody } from 'Utils/Modal';
import { MediaSearch, MediaOverview } from '../MediaSearch';
import ChallengeAuthorModalBody from 'Src/components/ChallengeAuthor';
import { cardLayout, coverPhotoStyle } from '../styles';

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

import { TagInput, PreviewTags } from 'Utils/Tag';

import CardHeader from '../CardHeader';

const FooterBtn = ({ onClick, children, disabled, className, style = {} }) => (
  <button
    className={`${'btn '}${className}`}
    style={{ ...style, fontWeight: 'bold' }}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
// {id: null, floorX: 0.5, floorY: 0.5, img: null, loc: { latitude: 50.85146, longitude: 4.315483 }, media: null, title: null, tags: null, challenge: null,
// }
const extractCardFields = ({
  id,
  uid,
  floorX = 0.5,
  floorY = 0.5,
  img = null,
  loc: { latitude = 50.85146, longitude = 4.315483 },
  tags = [],
  media = null,
  title = null,
  challenge = null,
  description = ''
}) => ({
  id,
  uid,
  floorX,
  floorY,
  img,
  loc: { longitude, latitude },
  tags,
  media,
  title,
  challenge,
  description
});
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
    const { onClose } = this.props;
    const { description } = this.state;

    return (
      <ModalBody
        footer={
          <FooterBtn onClick={() => onClose(description)}>Update</FooterBtn>
        }
      >
        <div className="form-group">
          <textarea
            onChange={e =>
              this.setState({
                description: e.target.value || null
              })
            }
            rows={5}
            style={{ width: '100%' }}
            placeholder={'<Please insert your description>'}
          >
            {description}
          </textarea>
        </div>
      </ModalBody>
    );
  }
}

class TitleModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { ...this.props };

  render() {
    const { onUpdate } = this.props;
    const { title } = this.state;

    return (
      <ModalBody
        footer={<FooterBtn onClick={() => onUpdate(title)}>Update</FooterBtn>}
      >
        <div className="form-group">
          <input
            onChange={e =>
              this.setState({
                title: e.target.value || null
              })
            }
            style={{ width: '100%' }}
            value={title}
          />
        </div>
      </ModalBody>
    );
  }
}

class EditCardFront extends PureComponent {
  static propTypes = {
    // ...ReadCardFront.propTypes,
    template: PropTypes.bool,
    onAttrUpdate: PropTypes.func,
    onSubmit: PropTypes.func,
    allChallenges: PropTypes.array
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

  setFieldState(field) {
    this.setState(oldState => ({ data: { ...oldState.data, ...field } }));
  }

  modalWriteContent(modalTitle) {
    const { data } = this.state;
    const { challenge } = data;
    const { uiColor, tagColorScale } = this.props;

    // console.log('tagColorScale', tagColorScale);
    // TODO: img
    const { title, tags, img, description, media } = data;
    const closeBtn = <FooterBtn onClick={this.onCloseModal}>Close</FooterBtn>;
    switch (modalTitle) {
      case 'Title':
        return (
          <TitleModal
            title={title}
            onUpdate={newTitle => this.setFieldState({ title: newTitle })}
          />
        );
      case 'Tags':
        return (
          <ModalBody footer={closeBtn}>
            <TagInput
              tags={tags}
              colorScale={tagColorScale}
              uiColor={uiColor}
              onChange={newTags => this.setFieldState({ tags: [...newTags] })}
            />
          </ModalBody>
        );
      case 'Photo':
        return (
          <ModalBody footer={closeBtn}>
            <PhotoUpload
              uiColor={uiColor}
              imgUrl={img ? img.url : null}
              onChange={imgObj => {
                console.log('img OBJ', imgObj);
                this.setFieldState({ img: imgObj, dialog: null });
              }}
            />
          </ModalBody>
        );
      case 'Description':
        return (
          <div className="form-group">
            <TextAreaModal
              description={description}
              key={description}
              onClose={newDescr => {
                this.setFieldState({
                  description: newDescr
                });
              }}
              rows={5}
              style={{ width: '100%' }}
              placeholder={'<Please insert your description>'}
            />
          </div>
        );
      case 'Media':
        return (
          <ModalBody footer={closeBtn}>
            <MediaSearch
              selectedMedia={media}
              onChange={mediaItems => {
                this.setFieldState({ media: mediaItems });
              }}
            />
          </ModalBody>
        );
      case 'Challenge':
        return (
          <ChallengeAuthorModalBody
            uiColor={uiColor}
            key={challenge ? challenge.id : 'newChallenge'}
            challenge={challenge}
            onChange={ch => {
              this.setFieldState({ challenge: ch });
            }}
          />
        );
      default:
        return <div>error</div>;
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
      template
    } = this.props;
    const { data, added, dialog } = this.state;
    const { title, tags, img, description, media, children, challenge } = data;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;

    return (
      <CardHeader
        title={title}
        onClose={onClose}
        background={background}
        uiColor={uiColor}
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
        style={style}
      >
        <div className={cardLayout} style={{ height: '100%' }}>
          <Modal
            visible={modalVisible}
            title={modalVisible ? dialog.title : ''}
            onClose={this.onCloseModal}
            uiColor={uiColor}
            background={background}
          >
            {this.modalWriteContent(dialogTitle)}
          </Modal>
          <div className={cardLayout}>
            <ImgOverlay
              src={img && img.url}
              style={coverPhotoStyle}
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
                <div style={{ display: 'inline-flex', width: '85%' }}>
                  {template && (
                    <BigButton
                      className={added ? 'bg-danger' : 'bg-success'}
                      color={uiColor}
                      edit
                      onClick={() => {
                        this.setState({ added: !added });
                        // TODO
                        const message = window.confirm(
                          `Are you sure you wish to ${
                            added ? 'remove' : 'create'
                          } this card?`
                        );

                        if (message) {
                          console.log('create card data', data);
                          onSubmit(data);
                        }
                      }}
                    >
                      {added ? 'Remove Card' : 'Create Card'}
                    </BigButton>
                  )}
                  <BigButton
                    className="ml-2"
                    color={uiColor}
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
                  style={{ width: '16%' }}
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

export default EditCardFront;
