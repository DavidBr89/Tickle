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
    dialogKey: null
  };

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

    const {data, dialogKey} = this.state;
    const modalVisible = dialogKey !== null;

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

    const updateField = d => {
      console.log('UPDATE FIELD d.id', d);
      this.setState({data: {...data, [d.key]: d}});
    };

    const onCloseModal = () => {
      const {data} = this.state;
      const {onUpdate} = this.props;
      // onUpdate({ ...data });
      this.setState({dialogKey: null});
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
        node: (
          <d.Preview
            {...data}
            onClick={() => {
              this.setState({
                dialogKey: d.key
              });
            }}
          />
        )
      };
    });

    console.log("data", data);

    return (
      <React.Fragment>
        <BlackModal className="z-50" visible={modalVisible}>
          <Comp.ModalContent
            {...this.props}
            modalProps={modalProps}
            onChange={updateField}
            {...data}
          />
        </BlackModal>
        <CardFrontTemplate
          {...this.props}
          onResetField={attr => {
            this.updateField(attr, initCard[attr]);
          }}
          fieldNodes={previewFields}
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
          edit
        />
      </React.Fragment>
    );
  }
}

EditCardFront.defaultProps = defaultProps;

export default EditCardFront;
