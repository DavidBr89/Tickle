import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';

import { shallowEqualProps } from 'shallow-equal-props';

import placeholderImg from './placeholder.png';
import { Modal, ModalBody } from '../utils/modal';
import { MediaSearch, MediaOverview, ChallengeSearch } from './MediaSearch';
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
  ChallengeButton,
  FlipButton
} from './layout';

import CardHeader from './CardHeader';

const defaultProps = {
  title: null,
  challenge: { type: null },
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
            <MediaOverview data={media} uiColor={uiColor} />
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
      background,
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
          <ModalBody uiColor={uiColor}>
            {this.modalReadContent(dialogTitle)}
          </ModalBody>
        </Modal>

        <div style={{ position: 'relative' }}>
          <Img src={img} />
          <div
            className="m-2 "
            style={{ position: 'absolute', zIndex: 200, left: 0, top: 0 }}
          >
          {/*TODO: fix width */}
            <div style={{ display: 'flex', width: '70%', maxWidth: '80%' }}>
              <PreviewTags colorScale={tagColorScale} data={tags} />
            </div>
          </div>
        </div>
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
    allChallenges: PropTypes.array
  };
  static defaultProps = {
    ...ReadCardFront.defaultProps,
    onAttrUpdate: d => d,
    allChallenges: []
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
    const { uiColor, background, allChallenges } = this.props;
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
            uiColor={uiColor}
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
                description: this.nodeDescription.value || null
              })
            }
          >
            <div className="form-group">
              <textarea
                ref={n => (this.nodeDescription = n)}
                rows={5}
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
              media={media || []}
              uiColor={uiColor}
              background={background}
              onSubmit={mediaItems => {
                this.setFieldState({ media: mediaItems });
              }}
            />
          </div>
        );
      case 'Challenge':
        return (
          <ModalBody uiColor={uiColor}>
            <ChallengeSearch
              onSubmit={ch => {
                this.setFieldState({ challenge: ch });
              }}
              selected={challenge.url}
              uiColor={uiColor}
              type="Challenge"
              data={allChallenges
                // TODO: change
                .map(d => ({
                  url: d.url,
                  title: d.url,
                  descr: '',
                  thumbnail: d.url,
                  type: 'hangman'
                }))}
            />
          </ModalBody>
        );
      default:
        return <div>error</div>;
    }
  }

  // TODO: join ReadCardFront with EditCardFront
  // TODO: join ReadCardFront with EditCardFront
  // TODO: join ReadCardFront with EditCardFront
  // TODO: join ReadCardFront with EditCardFront
  render() {
    const {
      onClose,
      flipHandler,
      style,
      background,
      uiColor,
      tagColorScale
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
            onClose={() => this.setState({ dialog: null })}
            uiColor={uiColor}
            background={background}
          >
            {this.modalWriteContent(dialogTitle)}
          </Modal>
          <div className={cardLayout}>
            <div style={{ position: 'relative' }}>
              <Img src={img} />
              <div
                className="m-2 "
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
              <EditButton
                style={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  zIndex: 200
                }}
                onClick={() => {
                  this.setState({
                    dialog: { title: 'Tags', data: tags }
                  });
                }}
              />
            </div>
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
            <div>
              <div style={{ display: 'flex' }}>
                <div
                  className="p-1 pt-3"
                  style={{ display: 'flex', width: '100%' }}
                >
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
