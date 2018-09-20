import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
// import * as Icon from 'react-feather';

// import PhotoUpload from 'Utils/PhotoUpload';
import EditPhoto from './EditPhoto';

import { isEqual } from 'lodash';
import { css } from 'aphrodite/no-important';

// import PhotoChallenge from 'Src/components/Challenges/MatchPhotoChallenge';
import ChallengeAuthorModalBody from 'Src/components/ChallengeAuthor';
import { extractCardFields } from 'Constants/cardFields';

import { Modal, StyledModalBody } from 'Utils/Modal';
import { MediaSearch, MediaOverview } from '../MediaSearch';
import { coverPhotoStyle } from '../styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import CardFront from './CardFront';

import { DropDown } from 'Utils/TagInput';

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

  constructor(props) {
    super(props);
  }

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
      <StyledModalBody
        {...this.props}
        onClose={() => onClose()}
        footer={
          <FooterBtn
            style={{ opacity: disabled ? 0.5 : 1, transition: 'opacity 200ms' }}
            disabled={disabled}
            onClick={() => onUpdate(value)}
          >
            Update
          </FooterBtn>
        }
      >
        <input
          type="number"
          value={value}
          pattern="^[0-9]"
          min="0"
          step="1"
          onChange={e => {
            this.setState({ value: e.target.value });
          }}
        />
        <div>{error}</div>
      </StyledModalBody>
    );
  }
}

const FooterBtn = ({ onClick, children, disabled, style = {} }) => (
  <CardThemeConsumer>
    {({ stylesheet: { btn } }) => (
      <button
        className={css(btn)}
        style={{ ...style, zIndex: 5000, /* TODO: hack */ fontWeight: 'bold' }}
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
//       <StyledModalBody
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
//       </StyledModalBody>
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
    const {
      uiColor,
      tagColorScale,
      stylesheet,
      height,
      tagVocabulary
    } = this.props;

    const { title, tags, img, description, media, points } = data;
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
            <DropDown
              style={{ width: '100%' }}
              onChange={newTags => this.updateField({ tags: [...newTags] })}
              onSelect={n => console.log('select yeah', n)}
              vocabulary={[]}
              onClick={n => console.log('submit', n)}
              data={tags}
              vocabulary={tagVocabulary}
            />
          </StyledModalBody>
        );
      case 'Photo':
        return (
          <StyledModalBody
            {...modalProps}
            onClose={this.onCloseModal}
            footer={closeBtn}
          >
            <EditPhoto
              uiColor="grey"
              imgUrl={img ? img.url : null}
              imgName={img && img.name}
              stylesheet={stylesheet}
              onChange={imgObj => {
                console.log('imgObj', imgObj);
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
              this.updateFieldAndCloseModal({
                description: newDescr
              });
            }}
          />
        );
      case 'Media':
        return (
          <StyledModalBody
            footer={closeBtn}
            {...modalProps}
            onClose={this.onCloseModal}
          >
            <MediaSearch
              selectedMedia={media}
              stylesheet={stylesheet}
              onChange={mediaItems => {
                console.log('mediasearch', mediaItems);
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

      case 'Points':
        return (
          <NumberInput
            {...modalProps}
            onClose={this.onCloseModal}
            value={points}
            onUpdate={number => {
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
      flipHandler,
      style,
      background,
      uiColor,
      tagColorScale,
      onSubmit,
      template,
      stylesheet,
      smallScreen,
      onCreate
    } = this.props;
    const { data, dialog } = this.state;
    const modalVisible = dialog !== null;
    const { coverPhoto } = stylesheet;
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
        <Modal visible={modalVisible}>{this.modalWriteContent()}</Modal>
        <CardFront
          {...this.props}
          onClose={onClose}
          onTagsClick={() => {
            this.setState({
              dialog: { title: 'Tags', data: tags }
            });
          }}
          onTitleClick={() =>
            this.setState({
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
          onMediaClick={() =>
            this.setState({
              dialog: { title: 'Media', data: media }
            })
          }
          bottomControls={
            <React.Fragment>
              <BigButton
                onClick={() =>
                  this.setState({
                    dialog: { title: 'Challenge', data: challenge }
                  })
                }
              >
                {challenge === null ? 'Add Challenge' : 'Edit Challenge'}
              </BigButton>
              {template && (
                <BigButton className="ml-1" onClick={() => onCreate(data)}>
                  Create
                </BigButton>
              )}
            </React.Fragment>
          }
          onPointsClick={() =>
            this.setState({
              dialog: { title: 'Points', data: points }
            })
          }
          onFlip={flipHandler}
        />
      </React.Fragment>
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
