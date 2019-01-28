import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

import {BlackModal} from 'Components/utils/Modal';

import {extractCardFields, initCard} from 'Constants/cardFields.ts';

import {TITLE} from 'Constants/cardFields';

import CardFrontTemplate from './CardFrontTemplate';

import {fieldComps} from './FieldTemplates';

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

export default function EditCardFront(props) {
  const {onClose, onFlip, style, template, onCreate, onUpdate} = props;

  const [data, setData] = useState(extractCardFields(props));
  const [dialogKey, setDialogKey] = useState(null);

  const modalVisible = dialogKey !== null;

  const updateField = d => {
    setData({...data, [d.key]: d});
  };

  const resetField = key => {
    setData({...data, [key]: {...data[key], value: null}});
  };
  const onCloseModal = () => {
    onUpdate({...data});
    setDialogKey(null);
  };

  const Comp =
    dialogKey !== null ? fieldComps[dialogKey] : fieldComps[TITLE];

  const modalProps = {
    visible: modalVisible,
    title: dialogKey,
    onClose: onCloseModal
  };

  const previewFields = Object.keys(fieldComps).map(k => {
    const d = fieldComps[k];

    return {
      ...d,
      node: <d.Preview {...data} onClick={() => setDialogKey(d.key)} />
    };
  });

  return (
    <>
      <BlackModal className="z-50" visible={modalVisible}>
        <Comp.ModalContent
          {...props}
          modalProps={modalProps}
          onChange={updateField}
          {...data}
        />
      </BlackModal>
      <CardFrontTemplate
        {...props}
        fieldNodes={previewFields}
        onResetField={resetField}
        onClose={onClose}
        onFlip={onFlip}
        onFieldLabelChange={updateField}
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
      />
    </>
  );
}

EditCardFront.defaultProps = defaultProps;
