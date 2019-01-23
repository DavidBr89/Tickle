import React, {useState, useEffect, Component} from 'react';

import PropTypes from 'prop-types';

import {Modal, ModalBody} from 'Components/utils/Modal';

import {
  TITLE,
  TAGS,
  DESCRIPTION,
  MEDIA,
  TIMERANGE,
  ACTIVITY,
  POINTS,
  IMG
} from 'Constants/cardFields';

import {ExtendedEditTags} from './TagInput';

import EditPhoto from './EditPhoto';
import MediaSearch from './MediaSearch';
import ActivityModal from './Activity';

export {ActivityModal};

export function NumberInput({...props}) {
  const {onUpdate, data, onClose} = props;
  const [numPoints, setNumPoints] = useState(data.value);
  const [error, setError] = useState(null);

  const isPosInt = val => /^\+?(0|[1-9]\d*)$/.test(val);

  useEffect(() => {
    // if (numPoints !== prevState.numPoints) {
    //   if (this.isPosInt()) {
    //     this.setState({error: null});
    //   } else {
    //     this.setState({error: 'Input is not a positive Integer'});
    //   }
    // }
  });

  const disabled = error !== null;

  return (
    <ModalBody
      {...props}
      onClose={() => onClose()}
      footer={
        <button
          type="button"
          className="btn thick-border"
          style={{
            opacity: disabled ? 0.5 : 1,
            transition: 'opacity 200ms'
          }}
          disabled={disabled}
          onClick={() => onUpdate({value: numPoints})}>
          Update
        </button>
      }>
      <input
        type="number"
        numPoints={numPoints}
        pattern="^[0-9]"
        min="0"
        step="1"
        onChange={e => {
          setNumPoints(e.target.value);
        }}
      />
      <div>{error}</div>
    </ModalBody>
  );
}

export const DescriptionModal = props => {
  console.log('description', props.description);
  const {onChange, modalProps, description} = props;
  const [text, setText] = useState(description.value);
  const tmpData = {value: text};

  return (
    <ModalBody
      {...modalProps}
      footer={
        <button
          type="button"
          className="btn"
          onClick={() => onChange(tmpData)}>
          Update
        </button>
      }>
      <textarea
        className="form-control w-full"
        onChange={e => setText(e.target.value)}
        rows={5}
        placeholder="Please insert your description">
        {text}
      </textarea>
    </ModalBody>
  );
};

// const closeBtn = (
//   <button
//     type="button"
//     className="btn thick-border"
//     onClick={this.onCloseModal}>
//     Close
//   </button>
// );

export const TitleModal = props => {
  const {modalProps, onChange, visible, title: initTitle} = props;

  const [titleText, setTitleText] = useState(initTitle.value);

  // console.log('titleProps', initTitle, 'titleText', titleText);
  const tmpTitle = {value: titleText};

  return (
    <ModalBody
      onClose={() => onChange(tmpTitle)}
      {...modalProps}
      footer={
        <button
          type="button"
          className="btn"
          onClick={() => onChange(tmpTitle)}>
          Update
        </button>
      }>
      <input
        className="capitalize form-control text-2xl w-full text-xl"
        onChange={e => setTitleText(e.target.value || null)}
        value={titleText}
      />
    </ModalBody>
  );
};

export const EditTagsModal = props => {
  const {
    onChange,
    onClose,
    footer,
    visible,
    title,
    tagVocabulary,
    tags,
    modalProps
  } = props;

  return (
    <ModalBody {...modalProps}>
      <ExtendedEditTags
        style={{width: '100%'}}
        onChange={newTags => onChange({value: newTags})}
        editable
        data={tags.value}
        vocabulary={tagVocabulary}
      />
    </ModalBody>
  );
};

export const EditPhotoModal = props => {
  const {img, onChange} = props;

  return (
    <ModalBody {...props}>
      <EditPhoto
        imgUrl={img.value ? img.value.url : null}
        imgName={img.value && img.value.name}
        onChange={imgVal => onChange(IMG, {...img, value: imgVal})}
      />
    </ModalBody>
  );
};

export const MediaSearchModal = props => (
  <ModalBody {...props}>
    <MediaSearch {...props} />
  </ModalBody>
);

const TimeRange = () => <div>test</div>;

export const modalComps = {
  [TITLE]: TitleModal,
  [TAGS]: EditTagsModal,
  [DESCRIPTION]: DescriptionModal,
  [MEDIA]: MediaSearch,
  [TIMERANGE]: TimeRange,
  [ACTIVITY]: ActivityModal
};
