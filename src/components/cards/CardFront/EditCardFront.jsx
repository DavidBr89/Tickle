import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import {isEqual} from 'lodash';

import ChallengeAuthor from 'Src/components/ChallengeAuthor';

import {Modal, ModalBody} from 'Components/utils/Modal';
import {ExtendedEditTags} from 'Components/utils/TagInput';

import {
  MEDIA,
  TAGS,
  extractCardFields,
  initCard,
} from 'Constants/cardFields.ts';
import {MediaSearch} from '../MediaSearch';

import CardFrontTemplate from './CardFrontTemplate';

import EditPhoto from './EditPhoto';

class NumberInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onChange: d => d,
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
            className="btn"
            style={{opacity: disabled ? 0.5 : 1, transition: 'opacity 200ms'}}
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
  comments: [],
};

class TextAreaModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
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
          <button type="button" className="btn" onClick={() => onUpdate(text)}>
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
    onUpdate: PropTypes.func,
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
              value: e.target.value || null,
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
    <button type="button" className="btn" onClick={this.onCloseModal}>
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
                value: newTags.length > 0 ? newTags : null,
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
            this.updateFieldAndCloseModal('description', {value: newDescr});
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
          title={activity.value.title}
          onClose={this.onCloseModal}
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
    onSubmit: PropTypes.func,
    // allChallenges: PropTypes.array
  };

  static defaultProps = {
    // ...ReadCardFront.defaultProps,
    onAttrUpdate: d => d,
    onSubmit: d => d,
    allChallenges: [],
    template: false,
  };

  state = {
    data: {
      ...extractCardFields({...this.props}),
    },
    dialog: null,
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
        [field]: {...oldVal, ...val},
      },
      dialog: null,
    });
  }

  render() {
    const {
      onClose,
      onFlip,
      style,
      background,
      uiColor,
      tagColorScale,
      onSubmit,
      template,
      smallScreen,
      onCreate,
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
      points,
    } = data;

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
          onClose={onClose}
          onFlip={onFlip}
          onFieldLabelChange={(attr, val) => this.updateField(attr, val)}
          onTagsClick={() => {
            this.setState({
              dialog: {title: 'Tags', data: tags},
            });
          }}
          onTitleClick={() =>
            this.setState({
              dialog: {title: 'Title', data: title},
            })
          }
          onImgClick={() => {
            this.setState({
              dialog: {title: 'Photo', data: tags},
            });
          }}
          onDescriptionClick={() => {
            this.setState({
              dialog: {title: 'Description', data: description},
            });
          }}
          onMediaClick={() =>
            this.setState({
              dialog: {title: 'Media', data: media},
            })
          }
          onChallengeClick={() =>
            this.setState({
              dialog: {title: 'activity', data: activity},
            })
          }
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
              dialog: {title: 'Points', data: points},
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
