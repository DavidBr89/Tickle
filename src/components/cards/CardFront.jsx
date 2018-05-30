import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import * as Icon from 'react-feather';

import PhotoUpload from 'Utils/PhotoUpload';

import { shallowEqualProps } from 'shallow-equal-props';

import placeholderImg from './placeholder.png';
import { Modal, ModalBody } from 'Utils/Modal';
import { MediaSearch, MediaOverview } from './MediaSearch';
import ChallengeAuthorModalBody from './ChallengeAuthor';
import { cardLayout } from './styles';

import {
  // FieldSet,
  // PreviewMedia,
  MediaField,
  DescriptionField,
  EditButton,
  Img,
  ImgOverlay,
  TagInput,
  // Tags,
  // SmallPreviewTags,
  PreviewTags,
  ChallengeButton,
  FlipButton
} from './layout';

import CardHeader from './CardHeader';

const defaultProps = {
  title: null,
  challenge: { type: null },
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
          <ChallengeButton
            onClick={onCollect}
            color={uiColor}
            style={{ width: '80%' }}
          />

          <FlipButton color={uiColor} onClick={flipHandler} className="ml-2" />
        </div>
      </div>
    );
  }
}

class EditCardFront extends PureComponent {
  static propTypes = {
    ...ReadCardFront.propTypes,
    onAttrUpdate: PropTypes.func,
    onSubmit: PropTypes.func,
    allChallenges: PropTypes.array
  };
  static defaultProps = {
    ...ReadCardFront.defaultProps,
    onAttrUpdate: d => d,
    onSubmit: d => d,
    allChallenges: []
  };

  constructor(props) {
    super(props);
    this.state = { data: { ...props }, dialog: null };
    this.nodeDescription = null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const prevData = prevState.data;
  //   const { data } = this.state;
  //   // TODO: check the other attrs
  //   if (
  //     !shallowEqualProps(prevData, data) ||
  //     !shallowEqualProps(prevData.challenge, data.challenge)
  //   ) {
  //     console.log('update data', data);
  //     this.props.onAttrUpdate({ ...data });
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // return this.props.description !== nextProps.description;
  //   return false;
  // }

  onCloseModal = () => {
    const { data } = this.state;
    const { onAttrUpdate: onFieldUpdate } = this.props;
    this.setState({ dialog: null });
    onFieldUpdate({ ...data });
  };

  setFieldState(field) {
    this.setState(oldState => ({ data: { ...oldState.data, ...field } }));
  }

  data = {};

  modalWriteContent(modalTitle) {
    const { data } = this.state;
    const {
      /* allChallenges, */ uiColor,
      challenge: defaultChallenge,
      tagColorScale
    } = this.props;

    // console.log('tagColorScale', tagColorScale);
    // TODO: img
    const { title, tags, img, description, media } = data;
    const closeBtn = (
      <FooterBtn onClick={this.onCloseModal}>{'Close'}</FooterBtn>
    );
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
              onChange={newTags => this.setFieldState({ tags: newTags })}
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
            defaultChallenge={defaultChallenge ? defaultChallenge.type : null}
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
      onSubmit
    } = this.props;
    const { data } = this.state;
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
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', width: '100%' }}>
                  {/* TODO: make component */}
                  <ChallengeButton
                    style={{ width: '80%' }}
                    color={uiColor}
                    edit
                    onClick={() =>
                      this.setState({
                        dialog: { title: 'Challenge', data: challenge }
                      })
                    }
                  />
                  <FlipButton
                    color={uiColor}
                    onClick={flipHandler}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>
            <button
              className="btn"
              style={{ width: '80%' }}
              color={uiColor}
              edit
              onClick={() => onSubmit(data)}
            >
              {'Create Card'}
            </button>
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
