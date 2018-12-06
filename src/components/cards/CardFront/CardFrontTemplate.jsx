import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';

import {
  extractCardFields,
  initCard,
  isFieldInitialized,
} from 'Constants/cardFields';
// import Check from 'react-feather/dist/icons/check';
import X from 'react-feather/dist/icons/x';

import CardControls from 'Components/cards/CardControls';
import sortBy from 'lodash/sortBy';
import {
  TITLE,
  TAGS,
  DESCRIPTION,
  MEDIA,
  TIMERANGE,
  ACTIVITY,
} from 'Constants/cardFields';

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

export const PlaceholderFrame = ({
  onClick,
  empty,
  placeholder,
  className,
  style,
  edit,
  children,
}) => (
  <div
    className={`${className} cursor-pointer items-center flex`}
    style={{width: '90%'}}
    onClick={onClick}>
    {empty ? <div className="italic text-2xl">{placeholder}</div> : children}
    <div className="ml-auto">
      <EditIcon className="p-2" />
    </div>
  </div>
);

const RemoveBtn = ({on, children, onClick, style, className}) => (
  <div className={className} style={style}>
    <button
      type="button"
      onClick={onClick}
      className={`font-bold w-full capitalize flex flex-col justify-center items-center mr-1 mr-1  ${
        on ? 'bg-grey-light' : 'bg-white'
      }`}
      style={{...style, cursor: 'pointer'}}>
      <X />
    </button>
  </div>
);

const FieldList = ({values, visiblity, onRemove}) =>
  values.length > 0 && (
    <ul className="list-reset flex-grow relative  overflow-y-auto">
      {values.map((d, i) => (
        <li
          key={d.id}
          className="w-full absolute flex items-center"
          style={{
            opacity: visiblity[d.id] ? 1 : 0.5,
            transform: `translateY(${110 * i}%)`,
            transition: 'transform 0.2s ease-in-out',
            minWidth: 0 /* important */,
          }}>
          <div
            className="flex-grow flex items-center justify-between border-2 p-2 ml-1 mr-1"
            style={{minWidth: 0}}>
            <RemoveBtn onClick={onRemove(d.id)}>{d.label}</RemoveBtn>
            {d.node}
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
  selectedId,
}) => {
  const [visible, setVisible] = useState(false);
  const selected = values.find(v => v.id === selectedId) || null;

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
              className={`${optionClassName} ${x.id === selectedId &&
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

const selectNextFieldId = visiblity =>
  Object.keys(visiblity).find(k => !visiblity[k]) || null;

class SelectCardField extends Component {
  static propTypes = {
    className: PropTypes.string,
    titleNode: PropTypes.oneOf([PropTypes.node, null]),
    tagNode: PropTypes.oneOf([PropTypes.node, null]),
    descrNode: PropTypes.oneOf([PropTypes.node, null]),
    mediaNode: PropTypes.oneOf([PropTypes.node, null]),
    dateNode: PropTypes.oneOf([PropTypes.node, null]),
  };

  static defaultProps = {
    className: '',
    fields: [],
  };

  constructor(props) {
    super(props);
    const {visiblity} = this.props;

    const selectedAttrId = selectNextFieldId(visiblity);

    this.state = {
      visiblity,
      selectedAttrId,
    };
  }
  // deriveStateFromProps() {
  //
  // }

  render() {
    const {fields, className, onSelect, onDeselect} = this.props;

    const {visiblity, selectedAttrId} = this.state;

    const notSelectedFields = fields.filter(d => !visiblity[d.id]);
    const selectedCardFields = fields.filter(d => visiblity[d.id]);
    const disabled = notSelectedFields.length === 0;
    const allHidden = selectedCardFields.length === 0;

    const remove = attr => () => {
      const newVisibility = {...visiblity, [attr]: false};
      this.setState({
        visiblity: newVisibility,
        selectedAttrId: selectNextFieldId(newVisibility),
      });
      onDeselect(attr);
    };

    const addAttr = e => {
      e.preventDefault();
      const {selectedAttrId} = this.state;
      const newVisibility = {...visiblity, [selectedAttrId]: true};
      this.setState({
        visiblity: newVisibility,
        selectedAttrId: selectNextFieldId(newVisibility),
      });
    };

    // const btnDim = { minHeight: 70, width: 70 };

    return (
      <div className={`${className}`}>
        <form
          onSubmit={addAttr}
          disabled={disabled}
          className={`flex mb-2 ${disabled && 'disabled'}`}>
          <SelectField
            selectedId={selectedAttrId}
            className="bg-white flex-grow mr-4 text-xl"
            selectedClassName="border-2 border-black shadow p-2
            italic text-xl flex items-center"
            optionClassName="p-2"
            values={notSelectedFields}
            onChange={v => {
              this.setState({selectedAttrId: v.id});
            }}
          />
          <button
            className={`btn btn-lg border-2 ${disabled && 'btn-disabled'}`}
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
          visiblity={visiblity}
          onRemove={remove}
        />
      </div>
    );
  }
}

const getValue = a => (a ? a.value : null);
export default class CardFrontTemplate extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    tags: PropTypes.any, // PropTypes.oneOf([null, PropTypes.array]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img: PropTypes.oneOf([PropTypes.object, null]),
    onClose: PropTypes.func,
    flipHandler: PropTypes.func,
    style: PropTypes.object,
    background: PropTypes.string,
    tagColorScale: PropTypes.func,
    activity: PropTypes.object,
    bookmarkable: PropTypes.boolean,
    onPointsClick: PropTypes.func,
    bottomControls: PropTypes.node,
  };

  static defaultProps = {
    title: null,
    activity: null,
    challengeSubmission: null,
    // date: '28/04/2012 10:00',
    tags: null,
    img: null,
    xpPoints: null,
    description: null,
    // loc: { latitude: 50.828797, longitude: 4.352191 },
    creator: 'Jan',
    media: [],
    comments: [],
    flipHandler: d => d,
    tagColorScale: () => 'green',
    bookmarkable: false,
    onRemoveChallengeSubmission: d => d,
    onPointsClick: d => d,
    bottomControls: <React.Fragment />,
  };

  render() {
    const {
      tags,
      img,
      description,
      media,
      title,
      timerange,
      style,
      smallScreen,
      onClose,
      onImgClick,
      onDescriptionClick,
      onMediaClick,
      onTitleClick,
      onChallengeClick,
      onFlip,
      onTagsClick,
      template,
      points,
      onPointsClick,
      bottomControls,
      className,
      onResetField,
      onTimeRangeClick = d => d,
      activity,
    } = this.props;

    // console.log('mediaIcons', mediaIcons);
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
        ),
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
        ),
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
              {getValue(description)}
            </div>
          </PlaceholderFrame>
        ),
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
        ),
      },
      {
        id: TIMERANGE,
        label: 'Date',
        node: (
          <PlaceholderFrame
            onClick={onTimeRangeClick}
            placeholder="Date"
            empty
          />
        ),
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
        ),
      },
    ];
    console.log('fieldNodes', fieldNodes);
    const fieldVisibility = fieldNodes.reduce(
      (acc, d) => ({
        ...acc,
        [d.id]: isFieldInitialized({card: this.props, attr: d.id}),
      }),
      {},
    );

    return (
      <div
        style={{...style}}
        className={`flex flex-col w-full h-full ${className}`}>
        <ImgOverlay
          onClick={onImgClick}
          src={img.value ? img.value.url : null}
          style={{
            flex: '0 0 50%',
            cursor: 'pointer',
          }}>
          <div className="absolute z-10 w-full h-full flex items-end">
            <EditIcon className="m-1 p-1 " onClick={onImgClick} />
          </div>

          <div className="absolute z-10 w-full h-full flex justify-end items-end">
            <MediaField
              className="m-1 flex justify-between items-center"
              media={media}
            />
          </div>
        </ImgOverlay>

        <SelectCardField
          onDeselect={onResetField}
          visiblity={fieldVisibility}
          className="flex-grow flex flex-col mt-3 mr-3 ml-3 mb-1"
          fields={fieldNodes}
        />

        <CardControls onFlip={onFlip} onClose={onClose}>
          <div className="flex ml-auto mr-auto">{bottomControls}</div>
        </CardControls>
      </div>
    );
  }
}
