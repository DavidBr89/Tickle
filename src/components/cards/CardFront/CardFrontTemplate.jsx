import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Check from 'react-feather/dist/icons/check';
import X from 'react-feather/dist/icons/x';

import CardControls from 'Components/cards/CardControls';
import sortBy from 'lodash/sortBy';
//
import {
  ImgOverlay, TextField, TagField, MediaField, TitleField, EditIcon
} from './mixinsCardFront';


const ToggleBtn = ({
  on, children, onClick, style, className
}) => (
  <div className={className}>
    <button
      type="button"
      onClick={onClick}
      className={
        `font-bold w-full border-2 capitalize border-black flex flex-col
        justify-center items-center ${on ? 'bg-grey-light' : 'bg-white'}`
      }
      style={{ ...style, cursor: 'pointer' }}
    >
      <div className="m-1 text-lg">{children}</div>
      {on ? <Check /> : <X />}
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
    dateNode: PropTypes.oneOf([PropTypes.node, null])
  };

  static defaultProps = {
    className: '',
    fields: []
  };

  render() {
    const {
      fields, className, onSelect, onDeselect, values
    } = this.props;

    const visiblity = fields.reduce((acc, d) => { acc[d.id] = values[d.id] !== null; return acc; }, {});

    const toggle = attr => () => {
      const visible = !visiblity[attr];
      if (visible) { onDeselect(attr); }
    };

    const sortedFields = sortBy(fields, d => !visiblity[d.id]);

    return (
      <div className={`${className} flex`}>
        <div className="flex-grow flex relative">
          <div className="absolute h-full w-full flex-grow flex">
            <div className="w-full h-full flex flex-col ">
              {
                sortedFields.map(d => <div
                  className="flex justify-between items-center mb-2"
                  style={{ opacity: visiblity[d.id] ? 1 : 0.5 }}
                >
                  {d.node}
                  <div className="flex-shrink" style={{ width: 70 }}>
                    <ToggleBtn
                      on={visiblity[d.id]}
                      onClick={toggle(d.id)}
                    >
                      {d.id}
                    </ToggleBtn>
                  </div>
                                      </div>)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class CardFront extends Component {
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
    bottomControls: PropTypes.node
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
    radius: 500,
    media: [],
    comments: [],
    flipHandler: d => d,
    tagColorScale: () => 'green',
    bookmarkable: false,
    onRemoveChallengeSubmission: d => d,
    onPointsClick: d => d,
    bottomControls: <React.Fragment />
  };

  render() {
    const {
      tags, img, description, media, title, style, smallScreen, onClose,
      onImgClick, onDescriptionClick, onMediaClick, onTitleClick,
      onChallengeClick, onFlip, onTagsClick, edit, template, points,
      onPointsClick, bottomControls, className
    } = this.props;

    // console.log('mediaIcons', mediaIcons);
    const fieldNodes = [
      {
        id: 'title',
        node: <div className="">
          <h2>Title</h2>
          <TextField className="m-1" onClick={onTitleClick}>
            {title || 'Add Title'}
          </TextField>
              </div>
      }, {
        id: 'tags',
        node: <div className="">
          <h2>Tags</h2>
          <TagField values={tags} edit onClick={onTagsClick} />
        </div>

      }, {
        id: 'descr',
        node: <div className="">
          <h2>Description</h2>
          <TextField
            className="m-1"
            placeholder="Add a Description"
            style={{ flex: '0 1 auto' }}
            edit
            onClick={onDescriptionClick}
          >
            {description}
          </TextField>
              </div>
      }, {
        id: 'media',
        node:
  <div className="">
    <h2>Media</h2>
    <TextField
      className="m-1"
      placeholder="Add Media"
      style={{ flex: '0 1 auto' }}
      edit
      onClick={onMediaClick}
    />
  </div>
      }, {
        id: 'date',
        node: <div className="">
          <h2>Date</h2>
          <TextField
            className="m-1"
            placeholder="Add Date"
            style={{ flex: '0 1 auto' }}
            edit
            onClick={onMediaClick}
          />
              </div>
      }
    ];
    return (
      <div
        style={{ ...style }}
        className={`flex flex-col w-full h-full ${className}`}
      >
        <ImgOverlay
          onClick={onImgClick}
          src={img ? img.url : null}
          style={{
            flex: '0 1 50%',
            cursor: 'pointer'
          }}
        >
          <div className="absolute z-10 w-full h-full flex items-end">
            <EditIcon className="m-1 p-1 " onClick={onImgClick} />
          </div>

          <div
            className="absolute z-10 w-full h-full flex justify-end items-end"
          >
            <MediaField
              className="m-1 flex justify-between items-center"
              values={media}
              onClick={onMediaClick}
            />
          </div>
        </ImgOverlay>

        <SelectCardField
          onDeselect={attr => this.setState({ [attr]: null })}
          onSelect={obj => this.setState({ ...obj })}
          className="flex-grow flex flex-col mt-3 mr-3 ml-3 mb-1"
          values={this.state}
          fields={fieldNodes}
        />


        <CardControls onFlip={onFlip} onClose={onClose}>
          <div className="flex ml-auto mr-auto">{bottomControls}</div>
        </CardControls>
      </div>
    );
  }
}

export default CardFront;
