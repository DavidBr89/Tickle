import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
  CHALLENGE,
} from 'Constants/cardFields';

import {ImgOverlay, MediaField, EditIcon} from './mixinsCardFront';

const Tags = ({values, style, onClick, className}) => (
  <div
    onClick={onClick}
    className={`flex ${className} items-center flex-no-wrap overflow-x-hidden`}
    style={{...style}}>
    {values.map(t => (
      <div className="tag-label text-lg mr-1 ">{t}</div>
    ))}
  </div>
);

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

const EditFrame = ({children, onClick}) => (
  <div onClick={onClick} className="flex items-center">
    {children}
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

  state = {
    visiblity: this.props.fields.reduce((acc, d) => {
      acc[d.id] = true;
      return acc;
    }, {}),
  };

  // deriveStateFromProps() {
  //
  // }

  render() {
    const {fields, className, onSelect, onDeselect} = this.props;

    const {visiblity} = this.state;

    const remove = attr => () => {
      this.setState({visiblity: {...visiblity, [attr]: false}});
      onDeselect(attr);
    };

    const addAttr = e => {
      e.preventDefault();
      const attr = this.select.value;
      // const visible = !visiblity[attr];
      this.setState({visiblity: {...visiblity, [attr]: true}});
      // if (!visible) {
      //   onDeselect(attr);
      // }
    };
    // const btnDim = { minHeight: 70, width: 70 };

    const notSelectedFields = fields.filter(d => !visiblity[d.id]);
    const selectedCardFields = fields.filter(d => visiblity[d.id]);
    const disabled = notSelectedFields.length === 0;
    return (
      <div className={`${className}`}>
        <form
          onSubmit={addAttr}
          disabled={disabled}
          className={`flex mb-2 ${disabled && 'disabled'}`}>
          <select
            ref={sel => (this.select = sel)}
            className="form-control flex-grow text-xl mr-1">
            {notSelectedFields.map(d => (
              <option className="text-xl" value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <button
            className={`btn btn-lg ${disabled && 'btn-disabled'}`}
            type="submit">
            Add Field
          </button>{' '}
        </form>
        <ul className="list-reset flex-grow relative  overflow-y-auto">
          {selectedCardFields.map((d, i) => (
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
                className="flex-grow flex items-center justify-between border p-2 ml-1 mr-1" style={{minWidth: 0}}>
                <RemoveBtn onClick={remove(d.id)}>{d.label}</RemoveBtn>
                {d.node}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

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
    challenge: PropTypes.object,
    bookmarkable: PropTypes.boolean,
    onPointsClick: PropTypes.func,
    bottomControls: PropTypes.node,
  };

  static defaultProps = {
    title: null,
    challenge: null,
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
      challenge,
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
            empty={title === null}
            placeholder="Title">
            <h1 className="truncate-text">{title}</h1>
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
            empty={tags.length === 0}
            placeholder="Tags">
            <Tags values={tags} />
          </PlaceholderFrame>
        ),
      },
      {
        id: DESCRIPTION,
        label: 'Text',
        node: (
          <PlaceholderFrame
            onClick={onDescriptionClick}
            empty={description === null}
            placeholder="Description">
            <div className="capitalize truncate-text text-xl">
              {description}
            </div>
          </PlaceholderFrame>
        ),
      },
      {
        id: MEDIA,
        label: 'Media',
        node: (
          <PlaceholderFrame
            empty={media.length === 0}
            placeholder="Media"
            onClick={onMediaClick}>
            <MediaField values={media} />
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
            empty={timerange === null}
          />
        ),
      },
      {
        id: CHALLENGE,
        label: 'Chall.',
        node: (
          <PlaceholderFrame
            onClick={onChallengeClick}
            placeholder="Challenge"
            empty={challenge === null}>
            <div className="capitalize truncate-text text-xl">
              {challenge && challenge.title}
            </div>
          </PlaceholderFrame>
        ),
      },
    ];
    return (
      <div
        style={{...style}}
        className={`flex flex-col w-full h-full ${className}`}>
        <ImgOverlay
          onClick={onImgClick}
          src={img ? img.url : null}
          style={{
            flex: '0 1 50%',
            cursor: 'pointer',
          }}>
          <div className="absolute z-10 w-full h-full flex items-end">
            <EditIcon className="m-1 p-1 " onClick={onImgClick} />
          </div>

          <div className="absolute z-10 w-full h-full flex justify-end items-end">
            <MediaField
              className="m-1 flex justify-between items-center"
              values={media}
            />
          </div>
        </ImgOverlay>

        <SelectCardField
          onDeselect={onResetField}
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
