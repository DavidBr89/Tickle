import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { isEqual } from 'lodash';

import ChallengeAuthorModalBody from 'Src/components/ChallengeAuthor';
import { extractCardFields } from 'Constants/cardFields';

import { Modal, ModalBody } from 'Components/utils/Modal';
import { TagDropDown } from 'Components/utils/TagInput';
import { MediaSearch } from '../MediaSearch';

import CardFront from './CardFront';

import EditPhoto from './EditPhoto';

class NumberInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    onChange: d => d
  };

  state = { value: 0, error: null, ...this.state };

  isPosInt = () => /^\+?(0|[1-9]\d*)$/.test(this.state.value);

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.state;
    if (value !== prevState.value) {
      if (this.isPosInt()) {
        // this.props.onChange(value);
        this.setState({ error: null });
      } else {
        this.setState({ error: 'Input is not a positive Integer' });
      }
    }
  }

  render() {
    const { onUpdate, onClose } = this.props;
    const { value, error } = this.state;
    const disabled = error !== null;
    return (
      <ModalBody
        {...this.props}
        onClose={() => onClose()}
        footer={
          <button
            className="btn"
            style={{ opacity: disabled ? 0.5 : 1, transition: 'opacity 200ms' }}
            disabled={disabled}
            onClick={() => onUpdate(value)}
          >
            Update
          </button>
        }
      >
        <input
          type="number"
          value={value}
          pattern="^[0-9]"
          min="0"
          step="1"
          onChange={(e) => {
            this.setState({ value: e.target.value });
          }}
        />
        <div>{error}</div>
      </ModalBody>
    );
  }
}

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
      <ModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={
          <button className="btn" onClick={() => onUpdate(text)}>
            Update
          </button>
        }
      >
        <textarea
          className="form-control"
          onChange={e => this.setState({
            text: e.target.value || null
          })
          }
          rows={5}
          style={{ width: '100%' }}
          placeholder={'<Please insert your description>'}
        >
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

  state = { ...this.props };

  render() {
    const { onUpdate } = this.props;
    const { text } = this.state;

    return (
      <ModalBody
        {...this.props}
        onClose={() => onUpdate(text)}
        footer={
          <button className="btn" onClick={() => onUpdate(text)}>
            Update
          </button>
        }
      >
        <div className="form-control">
          <input
            onChange={e => this.setState({
              text: e.target.value || null
            })
            }
            style={{ width: '100%' }}
            value={text}
          />
        </div>
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
      !isEqual(prevData, data)
      || !isEqual(prevData.challenge, data.challenge)
      || !isEqual(prevData.media, data.media)
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
    const { tagVocabulary } = this.props;

    const {
      title, tags, img, description, media, points
    } = data;
    const closeBtn = (
      <button className="btn" onClick={this.onCloseModal}>
        Close
      </button>
    );

    const modalVisible = dialog !== null;
    const dialogTitle = dialog !== null ? dialog.title : null;
    const modalProps = { visible: modalVisible, title: dialogTitle };

    switch (dialogTitle) {
      case 'Title':
        return (
          <TitleModalBody
            {...modalProps}
            text={title}
            onUpdate={newTitle => this.updateFieldAndCloseModal({ title: newTitle })
            }
          />
        );
      case 'Tags':
        return (
          <ModalBody
            onClose={this.onCloseModal}
            {...modalProps}
            footer={closeBtn}
          >
            <TagDropDown
              style={{ width: '100%' }}
              onChange={newTags => this.updateField({ tags: [...newTags] })}
              editable
              data={tags || []}
              vocabulary={tagVocabulary}
            />
          </ModalBody>
        );
      case 'Photo':
        return (
          <ModalBody
            {...modalProps}
            onClose={this.onCloseModal}
            footer={closeBtn}
          >
            <EditPhoto
              uiColor="grey"
              imgUrl={img ? img.url : null}
              imgName={img && img.name}
              onChange={(imgObj) => {
                console.log('imgObj', imgObj);
                this.updateField({ img: imgObj, dialog: null });
              }}
            />
          </ModalBody>
        );
      case 'Description':
        return (
          <TextAreaModal
            {...modalProps}
            text={description}
            onUpdate={(newDescr) => {
              this.updateFieldAndCloseModal({
                description: newDescr
              });
            }}
          />
        );
      case 'Media':
        return (
          <ModalBody
            footer={closeBtn}
            {...modalProps}
            onClose={this.onCloseModal}
          >
            <MediaSearch
              selectedMedia={media}
              onChange={(mediaItems) => {
                console.log('mediasearch', mediaItems);
                this.updateField({ media: mediaItems });
              }}
            />
          </ModalBody>
        );
      case 'Challenge':
        return (
          <ChallengeAuthorModalBody
            {...modalProps}
            onClose={this.onCloseModal}
            key={challenge ? challenge.id : 'newChallenge'}
            challenge={challenge}
            onChange={(ch) => {
              this.updateField({ challenge: ch });
            }}
          />
        );

      case 'Points':
        return (
          <NumberInput
            {...modalProps}
            onClose={this.onCloseModal}
            value={points}
            onUpdate={(number) => {
              this.updateFieldAndCloseModal({
                points: number
              });
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
      onFlip,
      style,
      background,
      uiColor,
      tagColorScale,
      onSubmit,
      template,
      smallScreen,
      onCreate
    } = this.props;
    const { data, dialog } = this.state;
    console.log('state data', data);
    const modalVisible = dialog !== null;
    const {
      id,
      title,
      tags,
      img,
      description,
      media,
      children,
      challenge,
      points
    } = data;

    return (
      <React.Fragment>
        <Modal className="z-50" visible={modalVisible}>
          {this.modalWriteContent()}
        </Modal>
        <CardFront
          {...this.props}
          onClose={onClose}
          onFlip={onFlip}
          onTagsClick={() => {
            this.setState({
              dialog: { title: 'Tags', data: tags }
            });
          }}
          onTitleClick={() => this.setState({
            dialog: { title: 'Title', data: title }
          })
          }
          onImgClick={() => {
            this.setState({
              dialog: { title: 'Photo', data: tags }
            });
          }}
          onDescriptionClick={() => {
            console.log('click description');
            this.setState({
              dialog: { title: 'Description', data: description }
            });
          }}
          onMediaClick={() => this.setState({
            dialog: { title: 'Media', data: media }
          })
          }
          bottomControls={
            <React.Fragment>
              <button
                className="btn btn-black m-1"
                onClick={() => this.setState({
                  dialog: { title: 'Challenge', data: challenge }
                })
                }
              >
                {challenge === null ? 'Add Challenge' : 'Edit Challenge'}
              </button>
              {template && (
                <button className="btn m-1" onClick={() => onCreate(data)}>
                  Create
                </button>
              )}
            </React.Fragment>
          }
          onPointsClick={() => this.setState({
            dialog: { title: 'Points', data: points }
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
