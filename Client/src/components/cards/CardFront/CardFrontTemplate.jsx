import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

import {
  extractCardFields,
  initCard,
  isFieldInitialized
} from 'Constants/cardFields';
// import Check from 'react-feather/dist/icons/check';
import X from 'react-feather/dist/icons/x';

import CardControls from 'Components/cards/CardControls';
import sortBy from 'lodash/sortBy';

import {ImgOverlay, MediaField, EditIcon} from './mixinsCardFront';

const RemoveBtn = ({on, children, onClick, style, className}) => (
  <div className={className} style={style}>
    <button
      type="button"
      onClick={onClick}
      className={`font-bold w-full capitalize flex flex-col justify-center items-center mr-1 mr-1 cursor-pointer ${
        on ? 'bg-grey-light' : 'bg-white'
      }`}
      style={{...style}}>
      <X />
    </button>
  </div>
);

const FieldList = ({values, visibility, onRemove}) =>
  values.length > 0 && (
    <ul className="list-reset flex-grow relative  overflow-y-auto">
      {values.map((d, i) => (
        <li
          key={d.key}
          className="w-full absolute flex items-center"
          style={{
            opacity: visibility[d.key] ? 1 : 0.5,
            transform: `translateY(${110 * i}%)`,
            transition: 'transform 0.2s ease-in-out',
            minWidth: 0 /* important */
          }}>
          <div
            className="flex-grow flex items-center justify-between border-2 p-2 ml-1 mr-1"
            style={{minWidth: 0}}>
            <RemoveBtn onClick={onRemove(d.key)}>{d.label}</RemoveBtn>
            {d.node}
            <div className="ml-auto">
              <EditIcon className="p-2" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

const SelectField = ({
  className,
  selectedClassName,
  optionClassName,
  style,
  onChange,
  values = [],
  children,
  selectedId
}) => {
  const [visible, setVisible] = useState(false);
  const selected = values.find(v => v.key === selectedId) || null;

  return (
    <div className={`${className} relative z-10`}>
      <div
        className={`h-full cursor-pointer ${selectedClassName}`}
        tabIndex="-1"
        onClick={() => setVisible(!visible)}
        onBlur={() => setVisible(false)}>
        {selected && selected.label}
      </div>
      <div className={`absolute ${!visible && 'hidden'} w-full `}>
        <ul className="mt-2 list-reset p-2 z-10 bg-white border border-black shadow">
          {values.map(x => (
            <li
              className={`${optionClassName} ${x.key === selectedId &&
                'bg-grey'} cursor-pointer`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setVisible(false);
                onChange(x);
              }}>
              {x.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const selectNextFieldId = visibility =>
  Object.keys(visibility).find(k => !visibility[k]) || null;

const SelectCardField = props => {
  const {
    fields,
    className,
    onSelect,
    onResetField,
    data,
    fieldNodes
  } = props;
  console.log('fieldNodes', fieldNodes);

  const fieldVisibility = fieldNodes.reduce(
    (acc, d) => ({
      ...acc,
      [d.key]: data[d.key].value !== null
    }),
    {}
  );

  const [visibility, setVisibility] = useState(fieldVisibility);
  const [fieldId, setFieldId] = useState(selectNextFieldId(visibility));

  const notSelectedFields = fieldNodes.filter(d => !visibility[d.key]);
  const selectedCardFields = fieldNodes.filter(d => visibility[d.key]);
  const disabled = notSelectedFields.length === 0;
  const allHidden = selectedCardFields.length === 0;

  const remove = key => () => {
    const newVisibility = {...visibility, [key]: false};
    setVisibility(newVisibility);
    setFieldId(selectNextFieldId(newVisibility));
    onResetField(key);
  };

  const addAttr = e => {
    e.preventDefault();
    const newVisibility = {...visibility, [fieldId]: true};
    setVisibility(newVisibility);
    setFieldId(selectNextFieldId(newVisibility));
  };

  return (
    <div className={`${className}`}>
      <form
        onSubmit={addAttr}
        disabled={disabled}
        className={`flex mb-2 ${disabled && 'disabled'}`}>
        <SelectField
          selectedId={fieldId}
          className="bg-white flex-grow mr-4 text-xl"
          selectedClassName="border-2 border-black shadow p-2
            italic text-xl flex items-center"
          optionClassName="p-2"
          values={notSelectedFields}
          onChange={v => setFieldId(v.key)}
        />
        <button
          className={`btn btn-lg border-2 border-black shadow ${disabled &&
            'btn-disabled'}`}
          type="submit">
          Add Field
        </button>
      </form>

      {allHidden && (
        <div className="flex-grow text-2xl flex flex-col justify-center items-center">
          No Field added
        </div>
      )}
      <FieldList
        values={selectedCardFields}
        visibility={visibility}
        onRemove={remove}
      />
    </div>
  );
};

export default function CardFrontTemplate(props) {
  const {
    img = {value: null},
    style = {},
    className = '',
    onClose,
    onFlip,
    bottomControls,
    onResetField,
    fieldNodes
  } = props;

  return (
    <div
      style={{...style}}
      className={`flex flex-col w-full h-full ${className}`}>
      <ImgOverlay
        src={img.value ? img.value.url : null}
        style={{
          flex: '0 0 50%',
          cursor: 'pointer'
        }}
      />

      <SelectCardField
        className="flex-grow flex flex-col mt-3 mr-3 ml-3 mb-1"
        data={props}
        fieldNodes={fieldNodes}
        onResetField={onResetField}
      />

      <CardControls onFlip={onFlip} onClose={onClose}>
        <div className="flex ml-auto mr-auto">{bottomControls}</div>
      </CardControls>
    </div>
  );
}
