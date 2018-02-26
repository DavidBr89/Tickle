import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import chroma from 'chroma-js';

import { shallowEqualProps } from 'shallow-equal-props';

import placeholderImg from './placeholder.png';
import { Modal, ModalBody } from '../utils/modal';
import { MediaSearch, MediaOverview } from './MediaSearch';
import { cardLayout } from './styles';

import {
  // FieldSet,
  // PreviewMedia,
  MediaField,
  DescriptionField,
  EditButton,
  Img,
  TagInput,
  // Tags,
  // SmallPreviewTags,
  PreviewTags,
  CollectButton,
  FlipButton
} from './layout';

import CardHeader from './CardHeader';

const defaultProps = {
  title: null,
  challenge: { type: 'gap text' },
  // date: '28/04/2012 10:00',
  tags: null,
  img: placeholderImg,
  xpPoints: null,
  description: null,
  // loc: { latitude: 50.828797, longitude: 4.352191 },
  creator: 'Jan',
  radius: 500,
  media: null,
  comments: []
};

class ReadCardFront extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    tags: PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    onCollect: PropTypes.func,
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string
  };

  static defaultProps = {
    ...defaultProps,
    onCollect: null,
    flipHandler: d => d
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
            <MediaOverview data={media} color={uiColor} />
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
      background
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
          background={chroma(background).brighten(0.7)}
          onClose={() => this.setState({ dialog: null })}
        >
          <ModalBody uiColor={uiColor} background={background}>
            {this.modalReadContent(dialogTitle)}
          </ModalBody>
        </Modal>
        <PreviewTags data={tags} />

        <Img src={img} />
        <DescriptionField
          text={description}
          borderColor={uiColor}
          onClick={() =>
            this.setState({
              dialog: { title: 'Description', data: description }
            })
          }
        />
        <MediaField
          media={media}
          borderColor={uiColor}
          onClick={() =>
            this.setState({ dialog: { title: 'Media', data: media } })
          }
        />
        <div className="p-1 pt-3" style={{ display: 'flex' }}>
          <CollectButton
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
    onAttrUpdate: PropTypes.func
  };
  static defaultProps = {
    ...ReadCardFront.defaultProps,
    onAttrUpdate: d => d
  };

  constructor(props) {
    super(props);
    this.state = { data: { ...props }, dialog: null };
    this.nodeDescription = null;
  }

  componentDidUpdate(prevProps, prevState) {
    const prevData = prevState.data;
    const { data } = this.state;
    // TODO: check the other attrs
    if (!shallowEqualProps(prevData, data))
      this.props.onAttrUpdate({ ...data });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // return this.props.description !== nextProps.description;
  //   return false;
  // }

  setFieldState(field) {
    this.setState(oldState => ({
      data: { ...oldState.data, ...field }
    }));
  }

  modalWriteContent(modalTitle) {
    const { data } = this.state;
    const { uiColor, background } = this.props;
    // TODO: img
    const { title, tags, img, description, media, challenge } = data;
    switch (modalTitle) {
      case 'Title':
        return (
          <ModalBody
            uiColor={uiColor}
            background={background}
            onSubmit={() => this.setFieldState({ title: this.nodeTitle.value })}
          >
            <div className="form-group">
              <input
                ref={n => (this.nodeTitle = n)}
                style={{ width: '100%' }}
                defaultValue={title}
              />
            </div>
          </ModalBody>
        );
      case 'Tags':
        return (
          <TagInput
            tags={tags}
            onSubmit={newTags => this.setFieldState({ tags: newTags })}
          />
        );
      case 'Photo':
        return <div>photo</div>;
      case 'Description':
        return (
          <ModalBody
            uiColor={uiColor}
            background={background}
            onSubmit={() =>
              this.setFieldState({
                description: this.nodeDescriptin.value || null
              })
            }
          >
            <div className="form-group">
              <textarea
                ref={n => (this.nodeDescription = n)}
                style={{ width: '100%' }}
                onSubmit={() => null}
                placeholder={'<Please insert your description>'}
              >
                {description}
              </textarea>
            </div>
          </ModalBody>
        );
      case 'Media':
        return (
          <div>
            <MediaSearch
              media={media}
              uiColor={uiColor}
              background={background}
              onSubmit={mediaItems => {
                this.setFieldState({ media: mediaItems });
              }}
            />
          </div>
        );
      case 'Challenge':
        return <div>challenge</div>;
      default:
        return <div>error</div>;
    }
  }

  render() {
    const { onClose, flipHandler, style, background, uiColor } = this.props;
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
            className="mr-2"
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
            onClose={() => this.setState({ dialog: null })}
            uiColor={uiColor}
            background={background}
          >
            {this.modalWriteContent(dialogTitle)}
          </Modal>
          <div className={cardLayout}>
            <div style={{ display: 'flex' }}>
              <PreviewTags data={tags} />
              <EditButton
                style={{ fontSize: '24px' }}
                onClick={() => {
                  this.setState({
                    dialog: { title: 'Tags', data: tags }
                  });
                }}
              />
            </div>
            <Img src={img} />
            <DescriptionField
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
              media={media}
              borderColor={uiColor}
              edit
              onEdit={() =>
                this.setState({
                  dialog: { title: 'Media', data: media }
                })
              }
            />
            <div>
              <div style={{ display: 'flex' }}>
                <div
                  className="p-1 pt-3"
                  style={{ display: 'flex', width: '100%' }}
                >
                  {/* TODO: make component */}
                  <CollectButton
                    style={{ width: '80%' }}
                    color={uiColor}
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
