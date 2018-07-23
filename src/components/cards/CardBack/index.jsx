import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite';

// import cx from './Card.scss';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { FieldSet, FlipButton } from '../layout';
import Comments from './Comments';
import CardHeader from '../CardHeader';
import Author from './Author';
import { MapAreaControl } from './MapAreaControl';

const DeleteButton = ({ style, onClick, color, className }) => (
  <button
    className={`btn ${className}`}
    style={{
      background: color,
      color: 'whitesmoke',
      ...style
    }}
    onClick={onClick}
  >
    <i className="fa fa-trash fa-2x" aria-hidden="true" />
  </button>
);

const BackField = ({ ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet: { shallowBg, fieldSetBorder } }) => (
      <FieldSet
        {...props}
        className={`${css(shallowBg)} ${css(fieldSetBorder)}`}
      />
    )}
  </CardThemeConsumer>
);

DeleteButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string
};
DeleteButton.defaultProps = {
  style: {},
  onClick: d => d,
  color: 'black',
  className: ''
};

class CardBackSkeleton extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      uid: PropTypes.string,
      usrImgUrl: PropTypes.oneOf(null, PropTypes.string)
    }),
    flipHandler: PropTypes.func.isRequired,
    linkedCards: PropTypes.array,
    cardSets: PropTypes.array,
    loc: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    uiColor: PropTypes.string,
    edit: PropTypes.bool,
    mapRadius: PropTypes.number,
    setMapRadius: PropTypes.func,
    onDelete: PropTypes.func
  };

  static defaultProps = {
    linkedCards: [],
    loc: { latitude: 0, longitude: 0 },
    author: {
      uid: null,
      username: 'defaulUser',
      email: 'default@gmail.com',
      usrImgUrl: null
    },
    cardSets: [],
    uiColor: 'grey',
    edit: false,
    flipHandler: d => d,
    mapRadius: 100,
    setMapRadius: d => d,
    onDelete: d => d
  };

  state = { extended: null };

  // TODO: check
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.extended !== nextState.extended;
  }

  selectField = field => {
    this.setState(({ extended: prevExtended }) => ({
      extended: prevExtended !== field ? field : null
    }));
  };

  render() {
    const {
      loc,
      uiColor,
      edit,
      setMapRadius,
      mapRadius,
      flipHandler,
      onDelete,
      tagColorScale,
      template,
      id: cardId,
      uid,
      style
    } = this.props;

    // /TODO: card template update
    const { extended } = this.state;

    const isHidden = field => extended !== null && extended !== field;
    const isExtended = field => ({
      extended: extended === field && extended !== null
    });

    const displayStyle = field => {
      const defaultStyle = { transition: 'height 200ms', marginBottom: 10 };
      const isExt = extended === field;
      if (extended !== null) {
        return {
          ...defaultStyle,
          height: isExt ? '100%' : '7%',
          overflow: isExt ? 'scroll' : 'hidden'
        };
      }
      return {
        height: '30%',
        cursor: 'pointer',
        // background: null,
        ...defaultStyle
      };
    };

    return (
      <div
        ref={cont => (this.cont = cont)}
        className="container"
        style={{
          height: '90%',
          display: 'flex',
          alignContent: 'center',
          flexDirection: 'column'
          // ...style
          // justifyContent: 'space-around'
          // pointerEvents: 'all'
        }}
      >
        <BackField
          legend="Author"
          style={displayStyle('author')}
          onClick={() => this.selectField('author')}
        >
          <Author
            uid={uid}
            extended={extended === 'author'}
            tagColorScale={tagColorScale}
            onClose={() => {
              // TODO
              // console.log('onCLose');
            }}
          />
        </BackField>
        <BackField
          style={{ ...displayStyle('map'), padding: 0 }}
          edit={edit}
          legend="Location"
          legendStyle={{ position: 'absolute', margin: 10, zIndex: 1000 }}
          borderColor={uiColor}
          onClick={() => this.selectField('map')}
        >
          <MapAreaControl
            {...this.props}
            {...loc}
            {...isExtended('map')}
            uiColor={uiColor}
            onChange={r => setMapRadius(r)}
            radius={mapRadius}
            edit={edit}
          />
        </BackField>
        {edit && (
          <BackField
            onClick={() => this.selectField('comments')}
            legend="Comments"
            style={displayStyle('comments')}
            borderColor={uiColor}
          />
        )}
        <div
          className="mt-2"
          style={{
            display: 'flex',
            // TODO: to complex, simplify
            justifyContent: edit && template ? 'flex-end' : 'space-between'
          }}
        >
          {edit && (
            <DeleteButton
              onClick={onDelete}
              className="bg-danger"
              color={uiColor}
              style={{ width: '20%' }}
            />
          )}
          <FlipButton
            className={edit ? 'ml-2' : null}
            color={uiColor}
            onClick={flipHandler}
            style={{ width: edit ? '20%' : '100%' }}
          />
        </div>
      </div>
    );
  }
}

const CardBack = ({ style, ...props }) => (
  <CardHeader
    onClose={props.onClose}
    background={props.background}
    title={props.title}
    uiColor={props.uiColor}
    style={style}
  >
    <CardBackSkeleton {...props} />
  </CardHeader>
);

CardBack.propTypes = {
  flipHandler: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  background: PropTypes.string,
  uiColor: PropTypes.string,
  title: PropTypes.oneOf([PropTypes.string, null]),
  setMapRadius: PropTypes.func
};

CardBack.defaultProps = {
  flipHandler: d => d,
  edit: false,
  onClose: d => d,
  background: 'black',
  uiColor: 'black',
  title: null,
  setMapRadius: d => d
};

export default CardBack;
