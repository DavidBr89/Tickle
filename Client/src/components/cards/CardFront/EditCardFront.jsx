import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

import {BlackModal, ModalBody} from 'Components/utils/Modal';

import {extractCardFields, initCard} from 'Constants/cardFields.ts';

import {
  TITLE,
  TAGS,
  DESCRIPTION,
  MEDIA,
  TIMERANGE,
  ACTIVITY,
  IMG
} from 'Constants/cardFields';

// import {MediaSearch} from '../MediaSearch';

import CardFrontTemplate from './CardFrontTemplate';

import {ImgOverlay, MediaField, EditIcon} from './mixinsCardFront';

import {
  TextAreaModal,
  TitleModal,
  NumberInput,
  EditPhotoModal,
  MediaSearchModal,
  EditTagsModal,
  ActivityModal,
  modalComps
} from './FieldTemplates';

const TagField = ({tags, style, onClick, className}) => {
  if (!tags) return null;
  return (
    <div
      onClick={onClick}
      className={`flex ${className} items-center flex-no-wrap overflow-x-hidden`}
      style={{...style}}>
      {tags.map(t => (
        <div className="tag-label bg-black text-lg mr-1">{t}</div>
      ))}
    </div>
  );
};

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

// function writeModalContent() {
//   const {data, dialog} = this.state;
//   const {activity} = data;
//   const {tagVocabulary, addToStorage, removeFromStorage} = this.props;
//
//   const {title, tags, img, description, media, points} = data;
//
//   const modalVisible = dialog !== null;
//   const modalKey = dialog !== null ? dialog.key : null;
//   const modalProps = {
//     visible: modalVisible,
//     title: modalKey,
//     onClose: this.onCloseModal
//   };
//
//   const ModalBodyComp =
//     modalKey !== null ? modalComps[modalKey] : modalComps[TITLE];
//
//   return (
//     <ModalBodyComp
//       {...this.props}
//       modalProps={modalProps}
//       {...data}
//       onChange={this.updateField}
//     />
//   );
//
//   // switch (dialogTitle) {
//   case 'Title':
//     return (
//       <TitleModal
//         {...modalProps}
//         data={title}
//         footer={null}
//         onClose={this.onCloseModal}
//         onUpdate={newTitle =>
//           this.updateField('title', {
//             // key: 'title',
//             value: newTitle
//           })
//         }
//       />
//     );
//   case 'Tags':
//     return (
//       <EditTagsModal
//         {...modalProps}
//         data={tags}
//         footer={closeBtn}
//         onClose={this.onCloseModal}
//         onChange={newTags =>
//           this.updateField('tags', {
//             value: newTags.length > 0 ? newTags : null
//           })
//         }
//         vocabulary={tagVocabulary}
//       />
//     );
//   case 'Photo':
//     return (
//       <EditPhotoModal
//         {...modalProps}
//         data={img}
//         onClose={this.onCloseModal}
//         footer={closeBtn}
//         onChange={imgObj => {
//           this.updateField('img', {value: imgObj});
//         }}
//       />
//     );
//   case 'Description':
//     return (
//       <TextAreaModal
//         {...modalProps}
//         data={description}
//         onUpdate={newDescr => {
//           this.updateField('description', {
//             value: newDescr
//           });
//         }}
//       />
//     );
//   case 'activity':
//     return (
//       <ActivityModal
//         key={activity ? activity.id : 'newChallenge'}
//         {...modalProps}
//         onClose={this.onCloseModal}
//         title="Activity"
//         data={activity}
//         onChange={ch => {
//           this.updateField('activity', {value: ch});
//         }}
//       />
//     );
//
//   case 'Points':
//     return (
//       <NumberInput
//         {...modalProps}
//         onClose={this.onCloseModal}
//         data={points}
//         onUpdate={number => {
//           this.updateFieldAndCloseModal('points', {value: number});
//         }}
//       />
//     );
//   case 'Media':
//     return (
//       <MediaSearchModal
//         {...modalProps}
//         data={media}
//         footer={closeBtn}
//         onClose={this.onCloseModal}
//         addToStorage={addToStorage}
//         removeFromStorage={removeFromStorage}
//         onChange={mediaItems => {
//           this.updateField('media', {value: mediaItems});
//         }}
//       />
//     );
//   default:
//     return null;
// }
// }

class EditCardFront extends PureComponent {
  static propTypes = {
    // ...ReadCardFront.propTypes,
    template: PropTypes.bool,
    onAttrUpdate: PropTypes.func,
    onSubmit: PropTypes.func
    // allChallenges: PropTypes.array
  };

  static defaultProps = {
    ...initCard
  };

  state = {
    data: {
      ...extractCardFields({...this.props})
    },
    dialog: null
  };

  // componentDidUpdate(prevProps, prevState) {
  //   const prevData = prevState.data;
  //   const {onUpdate} = this.props;
  //   const {data} = this.state;
  //   // TODO: check the other attrs
  //   if (
  //     !isEqual(prevData, data) ||
  //     !isEqual(prevData.activity, data.activity) ||
  //     !isEqual(prevData.media, data.media) ||
  //     !isEqual(prevData.description, data.description)
  //   ) {
  //     const updateData = extractCardFields({...data});
  //     console.log('updateData', updateData);
  //     onUpdate(updateData);
  //   }
  // }

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

  updateField({field, val}) {
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

    console.log('editCardFront data', data);

    const onTagsClick = () => {
      this.setState({
        dialog: {key: TAGS, data: tags}
      });
    };
    const onTitleClick = () =>
      this.setState({
        dialog: {key: TITLE, data: title}
      });

    const onImgClick = () => {
      this.setState({
        dialog: {key: IMG, data: tags}
      });
    };

    const onDescriptionClick = () => {
      this.setState({
        dialog: {key: DESCRIPTION, data: description}
      });
    };
    const onMediaClick = () =>
      this.setState({
        dialog: {key: MEDIA, data: media}
      });
    const onChallengeClick = () =>
      this.setState({
        dialog: {title: ACTIVITY, data: activity}
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

    const updateField = (key, d) => {
      console.log('d', d, key);
      this.setState({data: {...data, [key]: d}});
    };

    const onCloseModal = () => {
      const {data} = this.state;
      const {onUpdate} = this.props;
      // onUpdate({ ...data });
      this.setState({dialog: null});
    };

    const modalKey = dialog !== null ? dialog.key : null;

    const modalProps = {
      visible: modalVisible,
      title: modalKey,
      onClose: onCloseModal
    };

    const ModalBodyComp =
      modalKey !== null ? modalComps[modalKey] : modalComps[TITLE];

    return (
      <React.Fragment>
        <BlackModal className="z-50" visible={modalVisible}>
          <ModalBodyComp
            {...this.props}
            modalProps={modalProps}
            onChange={field => updateField(modalKey, field)}
            {...data}
          />
        </BlackModal>
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
