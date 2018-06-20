import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import * as Icon from 'react-feather';

import PhotoUpload from 'Utils/PhotoUpload';

import { isEqual } from 'lodash';

import placeholderImg from './placeholder.png';
import { Modal, ModalBody } from 'Utils/Modal';
import { MediaSearch, MediaOverview } from './MediaSearch';
import ChallengeAuthorModalBody from 'Src/components/ChallengeAuthor';
import { cardLayout } from './styles';

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
} from './layout';

import { TagInput, PreviewTags } from 'Utils/Tag';

import CardHeader from './CardHeader';

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

const coverPhotoStyle = { height: '50%', maxHeight: 400, width: '100%' };

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
    tagColorScale: PropTypes.func
  };

  static defaultProps = {
    ...defaultProps,
    onCollect: null,
    flipHandler: d => d,
    tagColorScale: () => 'green'
  };

  constructor(props) {
    super(props);
    this.state = { dialog: null };
  }

  modalReadContent(modalTitle) {
    const { title, tags, description, media, uiColor } = this.props;
    switch (modalTitle) {
      case 'Title':
        return <p style={{ width: '100%' }}>{title}</p>;
      case 'Tags':
        return <p style={{ width: '100%' }}>{tags}</p>;
      case 'Photo':
        return <div>photo</div>;
      case 'Description':
        return <p style={{ width: '100%' }}>{description}</p>;
      case 'Media':
        return (
          <div>
            <MediaOverview data={media || []} uiColor={uiColor} />
          </div>
        );
      case 'Challenge':
        return <div>challenge</div>;
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
      onCollect,
      uiColor,
      flipHandler,
      // background,
      tagColorScale
    } = this.props;

    const { dialog } = this.state;
    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;

    // TODO: modal color
    return (
      <div className={cardLayout}>
        <Modal
          visible={modalVisible}
          title={dialogTitle}
          onClose={() => this.setState({ dialog: null })}
        >
          {this.modalReadContent(dialogTitle)}
        </Modal>

        <ImgOverlay src={img ? img.url : null} style={coverPhotoStyle}>
          <div style={{ display: 'flex', width: '70%', maxWidth: '80%' }}>
            {/* TODO: fix width */}
            <PreviewTags
              colorScale={tagColorScale}
              uiColor={uiColor}
              data={tags}
            />
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
          style={{ height: '20%' }}
          media={media}
          borderColor={uiColor}
          onClick={() =>
            this.setState({ dialog: { title: 'Media', data: media } })
          }
        />
        <div className="p-1 pt-3" style={{ display: 'flex' }}>
          <BigButton
            onClick={onCollect}
            color={uiColor}
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
    );
  }
}

class EditCardFront extends PureComponent {
  static propTypes = {
    ...ReadCardFront.propTypes,
    template: PropTypes.bool,
    onAttrUpdate: PropTypes.func,
    onSubmit: PropTypes.func,
    allChallenges: PropTypes.array
  };
  static defaultProps = {
    ...ReadCardFront.defaultProps,
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
    data: { ...this.props },
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
    onUpdate({ ...data });
    this.setState({ dialog: null });
  };

  setFieldState(field) {
    this.setState(oldState => ({ data: { ...oldState.data, ...field } }));
  }

  data = {};

  modalWriteContent(modalTitle) {
    const { data } = this.state;
    const { /* allChallenges, */ uiColor, tagColorScale } = this.props;

    // console.log('tagColorScale', tagColorScale);
    // TODO: img
    const { title, tags, img, description, media } = data;
    const closeBtn = <FooterBtn onClick={this.onCloseModal}>Close</FooterBtn>;
    switch (modalTitle) {
      case 'Title':
        return (
          <ModalBody footer={closeBtn}>
            <div className="form-group">
              <input
                onChange={e => this.setFieldState({ title: e.target.value })}
                style={{ width: '100%' }}
                defaultValue={title}
              />
            </div>
          </ModalBody>
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
              defaultImg={img && img.url}
              onChange={imgFile => {
                this.setFieldState({ img: imgFile, dialog: null });
              }}
            />
          </ModalBody>
        );
      case 'Description':
        return (
          <ModalBody footer={closeBtn}>
            <div className="form-group">
              <textarea
                onChange={e =>
                  this.setFieldState({
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
            defaultChallenge={data.challenge}
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
    const { data, added } = this.state;
    const { title, tags, img, description, media, children, challenge } = data;
    const { dialog } = this.state;
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
                        const message = window.confirm(
                          `Are you sure you wish to ${
                            added ? 'remove' : 'create'
                          } this card?`
                        );

                        if (message) {
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

const CardFront = props =>
  props.edit ? (
    <EditCardFront {...props} />
  ) : (
    <CardHeader {...props}>
      <ReadCardFront {...props} />
    </CardHeader>
  );

CardFront.propTypes = {
  edit: PropTypes.bool,
  onAttrUpdate: PropTypes.func
};

CardFront.defaultProps = {
  edit: false,
  onAttrUpdate: () => null
};

export default CardFront;
