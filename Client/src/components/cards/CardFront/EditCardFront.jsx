import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import ChallengeAuthor from 'Src/components/ChallengeAuthor';

import {Modal, ModalBody} from 'Components/utils/Modal';
import {ExtendedEditTags} from 'Components/utils/TagInput';

import {extractCardFields, initCard} from 'Constants/cardFields.ts';

import {
  TITLE,
  TAGS,
  DESCRIPTION,
  MEDIA,
  TIMERANGE,
  ACTIVITY
} from 'Constants/cardFields';
import {MediaSearch} from '../MediaSearch';

import CardFrontTemplate from './CardFrontTemplate';

import EditPhoto from './EditPhoto';

import {ImgOverlay, MediaField, EditIcon} from './mixinsCardFront';

const TagField = ({tags, style, onClick, className}) => {
  if (!tags) return null;
  return (
    <div
      onClick={onClick}
      className={`flex ${className} items-center flex-no-wrap overflow-x-hidden`}
      style={{...style}}>
      {tags.map(t => (
        <div className="tag-label bg-black text-lg mr-1 ">{t}</div>
      ))}
    </div>
  );
};

class NumberInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    onChange: d => d
  };

  state = {value: 0, error: null, ...this.state};

  componentDidUpdate(prevProps, prevState) {
    const {value} = this.state;
    if (value !== prevState.value) {
      if (this.isPosInt()) {
        this.setState({error: null});
      } else {
        this.setState({error: 'Input is not a positive Integer'});
      }
    }
  }

  isPosInt = () => /^\+?(0|[1-9]\d*)$/.test(this.state.value);

  render() {
    const {onUpdate, onClose} = this.props;
    const {value, error} = this.state;
    const disabled = error !== null;
    return (
      <ModalBody
        {...this.props}
        onClose={() => onClose()}
        footer={
          <button
            className="btn thick-border"
            style={{
              opacity: disabled ? 0.5 : 1,
              transition: 'opacity 200ms'
            }}
            disabled={disabled}
            onClick={() => onUpdate(value)}>
            Update
          </button>
        }>
        <input
          type="number"
          value={value}
          pattern="^[0-9]"
          min="0"
          step="1"
          onChange={e => {
            this.setState({value: e.target.value});
          }}
        />
        <div>{error}</div>
      </ModalBody>
    );
  }
}

const PlaceholderFrame = ({
  onClick,
  empty,
  placeholder,
  className,
  style,
  edit,
  children
}) => (
  <div
    className={`${className} cursor-pointer items-center flex`}
    style={{width: '90%'}}
    onClick={onClick}>
    {empty ? (
      <div className="italic text-2xl">{placeholder}</div>
    ) : (
      children
    )}
    <div className="ml-auto">
      <EditIcon className="p-2" />
    </div>
  </div>
);

const defaultProps = {
  title: null,
  activity: null,
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

  state = {...this.props};

  render() {
    const {onUpdate} = this.props;
    const {text} = this.state;

    return (
      <ModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={
          <button
            type="button"
            className="btn"
            onClick={() => onUpdate(text)}>
            Update
          </button>
        }>
        <textarea
          className="form-control w-full"
          onChange={e => this.setState({text: e.target.value || null})}
          rows={5}
          placeholder="Please insert your description">
          {text}
        </textarea>
      </ModalBody>
    );
  }
}

class TitleModalBody extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onUpdate: PropTypes.func
  };

  state = {value: null, key: null, ...this.props};

  render() {
    const {onUpdate} = this.props;
    const {key, value} = this.state;

    return (
      <ModalBody
        {...this.props}
        onClose={() => onUpdate({key, value})}
        footer={
          <button
            type="button"
            className="btn"
            onClick={() => onUpdate({key, value})}>
            Update
          </button>
        }>
        <input
          className="capitalize form-control text-2xl w-full text-xl"
          onChange={e =>
            this.setState({
              value: e.target.value || null
            })
          }
          value={value}
        />
      </ModalBody>
    );
  }
}
//
// class DescriptionModal extends Component {
//   static propTypes = {
//     children: PropTypes.node,
//     className: PropTypes.string,
//     onUpdate: PropTypes.func
//   };
//
//   state = { ...this.props };
//
//   render() {
//     const { onUpdate } = this.props;
//     const { text } = this.state;
//
//     return (
//       <ModalBody
//         {...this.props}
//         onClose={() => onUpdate(text)}
//         footer={<FooterBtn onClick={() => onUpdate(text)}>Update</FooterBtn>}
//       >
//         <div className="form-group">
//           <input
//             onChange={e =>
//               this.setState({
//                 title: e.target.value || null
//               })
//             }
//             style={{ width: '100%' }}
//             value={text}
//           />
//         </div>
//       </ModalBody>
//     );
//   }
// }

function writeModalContent() {
  const {data, dialog} = this.state;
  const {activity} = data;
  const {tagVocabulary, addToStorage, removeFromStorage} = this.props;

  const {title, tags, img, description, media, points} = data;

  const closeBtn = (
    <button
      type="button"
      className="btn thick-border"
      onClick={this.onCloseModal}>
      Close
    </button>
  );

  const modalVisible = dialog !== null;
  const dialogTitle = dialog !== null ? dialog.title : null;
  const modalProps = {visible: modalVisible, title: dialogTitle};

  switch (dialogTitle) {
    case 'Title':
      return (
        <TitleModalBody
          {...modalProps}
          {...title}
          onUpdate={newTitle =>
            this.updateFieldAndCloseModal('title', newTitle)
          }
        />
      );
    case 'Tags':
      return (
        <ModalBody
          onClose={this.onCloseModal}
          {...modalProps}
          footer={closeBtn}>
          <ExtendedEditTags
            style={{width: '100%'}}
            onChange={newTags =>
              this.updateField('tags', {
                value: newTags.length > 0 ? newTags : null
              })
            }
            editable
            data={tags.value || []}
            vocabulary={tagVocabulary}
          />
        </ModalBody>
      );
    case 'Photo':
      return (
        <ModalBody
          {...modalProps}
          onClose={this.onCloseModal}
          footer={closeBtn}>
          <EditPhoto
            imgUrl={img.value ? img.value.url : null}
            imgName={img.value && img.value.name}
            onChange={imgObj => {
              this.updateField('img', {value: imgObj});
            }}
          />
        </ModalBody>
      );
    case 'Description':
      return (
        <TextAreaModal
          {...modalProps}
          text={description.value}
          onUpdate={newDescr => {
            this.updateFieldAndCloseModal('description', {
              value: newDescr
            });
          }}
        />
      );
    case 'Media':
      return (
        <ModalBody
          footer={closeBtn}
          {...modalProps}
          onClose={this.onCloseModal}>
          <MediaSearch
            addToStorage={addToStorage}
            removeFromStorage={removeFromStorage}
            media={media}
            onChange={mediaItems => {
              this.updateField('media', {value: mediaItems});
            }}
          />
        </ModalBody>
      );
    case 'activity':
      return (
        <ChallengeAuthor
          {...modalProps}
          onClose={this.onCloseModal}
          title="Activity"
          key={activity ? activity.id : 'newChallenge'}
          activity={activity}
          onChange={ch => {
            this.updateField('activity', {value: ch});
          }}
        />
      );

    case 'Points':
      return (
        <NumberInput
          {...modalProps}
          onClose={this.onCloseModal}
          value={points}
          onUpdate={number => {
            this.updateFieldAndCloseModal('points', {value: number});
          }}
        />
      );
    default:
      return null;
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

  state = {
    data: {
      ...extractCardFields({})
    },
    dialog: null
  };

  componentDidUpdate(prevProps, prevState) {
    const prevData = prevState.data;
    const {onUpdate} = this.props;
    const {data} = this.state;
    // TODO: check the other attrs
    if (
      !isEqual(prevData, data) ||
      !isEqual(prevData.activity, data.activity) ||
      !isEqual(prevData.media, data.media) ||
      !isEqual(prevData.description, data.description)
    ) {
      onUpdate(extractCardFields({...data}));
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // return this.props.description !== nextProps.description;
  //   return false;
  // }

  onCloseModal = () => {
    const {data} = this.state;
    const {onUpdate} = this.props;
    // onUpdate({ ...data });
    this.setState({dialog: null});
  };

  updateField(field, val) {
    const {[field]: oldVal, data} = this.state;
    console.log('field', field, 'val', val);
    this.setState({data: {...data, [field]: {...oldVal, ...val}}});
  }

  updateFieldAndCloseModal(field, val) {
    const {[field]: oldVal, data} = this.state;
    console.log('field', field, 'val', val);
    this.setState({
      data: {
        ...data,
        [field]: {...oldVal, ...val}
      },
      dialog: null
    });
  }

  render() {
    const {
      onClose,
      onFlip,
      style,
      background,
      onSubmit,
      template,
      smallScreen,
      onCreate
    } = this.props;

    console.log('props editcardfront', this.state.data);
    const {data, dialog} = this.state;
    const modalVisible = dialog !== null;
    const {
      id,
      title,
      tags,
      img,
      description,
      media,
      children,
      activity,
      points
    } = data;

    const onTagsClick = () => {
      this.setState({
        dialog: {title: 'Tags', data: tags}
      });
    };
    const onTitleClick = () =>
      this.setState({
        dialog: {title: 'Title', data: title}
      });
    const onImgClick = () => {
      this.setState({
        dialog: {title: 'Photo', data: tags}
      });
    };

    const onDescriptionClick = () => {
      this.setState({
        dialog: {title: 'Description', data: description}
      });
    };
    const onMediaClick = () =>
      this.setState({
        dialog: {title: 'Media', data: media}
      });
    const onChallengeClick = () =>
      this.setState({
        dialog: {title: 'activity', data: activity}
      });

    const fieldNodes = [
      {
        id: TITLE,
        label: 'Title',
        node: (
          <PlaceholderFrame
            onClick={onTitleClick}
            className=""
            empty={title.value === null}
            placeholder="Title">
            <div className="capitalize text-2xl truncate-text">
              {title.value}
            </div>
          </PlaceholderFrame>
        )
      },
      {
        id: TAGS,
        label: 'Tags',
        node: (
          <PlaceholderFrame
            onClick={onTagsClick}
            className=""
            empty={tags.value === null}
            placeholder="Tags">
            <TagField tags={tags.value} />
          </PlaceholderFrame>
        )
      },
      {
        id: DESCRIPTION,
        label: 'Text',
        node: (
          <PlaceholderFrame
            onClick={onDescriptionClick}
            empty={description.value === null}
            placeholder="Description">
            <div className="capitalize truncate-text text-xl">
              {description.value}
            </div>
          </PlaceholderFrame>
        )
      },
      {
        id: MEDIA,
        label: 'Media',
        node: (
          <PlaceholderFrame
            empty={media.value === null}
            placeholder="Media"
            onClick={onMediaClick}>
            <MediaField media={media} />
          </PlaceholderFrame>
        )
      },
      {
        id: TIMERANGE,
        label: 'Date',
        node: (
          <PlaceholderFrame onClick={d => d} placeholder="Date" empty />
        )
      },
      {
        id: ACTIVITY,
        label: 'Activity',
        node: (
          <PlaceholderFrame
            onClick={onChallengeClick}
            placeholder="Activity"
            empty={activity.value === null}>
            <div className="capitalize truncate-text text-xl">
              {activity.value && activity.value.title}
            </div>
          </PlaceholderFrame>
        )
      }
    ];

    return (
      <React.Fragment>
        <Modal className="z-50" visible={modalVisible}>
          {writeModalContent.bind(this)()}
        </Modal>
        <CardFrontTemplate
          {...this.props}
          onResetField={attr => {
            this.updateField(attr, initCard[attr]);
          }}
          fieldNodes={fieldNodes}
          onClose={onClose}
          onFlip={onFlip}
          onFieldLabelChange={(attr, val) =>
            this.updateField(attr, val)
          }
          {...data}
          bottomControls={
            template && (
              <button
                type="button"
                className=" btn text-xl m-2"
                onClick={() => onCreate(data)}>
                Create
              </button>
            )
          }
          onPointsClick={() =>
            this.setState({
              dialog: {title: 'Points', data: points}
            })
          }
          edit
        />
      </React.Fragment>
    );
  }
}

EditCardFront.defaultProps = defaultProps;

export default EditCardFront;
