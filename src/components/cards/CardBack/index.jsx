import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CardThemeConsumer} from 'Src/styles/CardThemeContext';

import {Trash2, Maximize, Minimize} from 'react-feather';

import {FlipButton} from '../layout';
import {FieldSet} from 'Components/utils/StyledComps';
import Comments from './Comments';
import CardHeader from '../CardHeader';
import BackAuthor from './BackAuthor.jsx';
import {MapAreaControl} from './MapAreaControl';

import CardControls from 'Components/cards/CardControls';

//
const DeleteButton = ({style, onClick, color, className}) => (
  <button
    className="m-1 btn btn-black bg-danger"
    style={{
      alignItems: 'center',
      ...style
    }}
    onClick={onClick}
  >
    <Trash2 size={30} />
  </button>
);

const BackField = ({
  onClick,
  onControlClick,
  style,
  bodyStyle,
  title,
  legendStyle,
  icon,
  children,
  disabled,
  extended
}) => (
  <div
    className="border overflow-hidden relative flex-col-wrapper"
    onClick={!extended ? onClick : () => null}
    style={{
      ...style,
    }}>
    <div
      className="mb-1 z-10 absolute flex-grow flex justify-end items-center"
      style={{right: 0}}
    >
      <button
        className="btn bg-white m-2"
        onClick={extended ? onClick : () => null}>
        {extended ? <Minimize /> : <Maximize />}
      </button>
    </div>
    {children}
  </div>
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

class CardBack extends Component {
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
    loc: {latitude: 0, longitude: 0},
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

  state = {extended: null};

  // TODO: check
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.extended !== nextState.extended ||
      this.props.visible !== nextProps.visible
    );
  }

  selectField = field => {
    this.setState(({extended: prevExtended}) => ({
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
      id: cardId,
      uid,
      style,
      onClose,
      className
    } = this.props;

    const {extended} = this.state;

    const isExtended = field => extended === field && extended !== null;

    const displayStyle = field => {
      const fieldExtended = isExtended(field);
      return {
        transition: 'all 200ms',
        flexGrow: fieldExtended ? '0.5' : '0.3',
        overflow: fieldExtended ? 'scroll' : 'hidden'
      };
    };

    return (
      <div className={`flex flex-col flex-grow ${className}`}>
        <BackField
          title="Author"
          extended
          style={displayStyle('author')}
          onClick={() => this.selectField('author')}>
          { uid && <BackAuthor uid={uid} extended={extended === 'author'} /> }
        </BackField>
        <BackField
          extended={isExtended('map')}
          style={displayStyle('map')}
          edit={edit}
          title="Location">
          <MapAreaControl
            {...this.props}
            {...loc}
            extended={isExtended('map')}
            uiColor={uiColor}
            onChange={r => setMapRadius(r)}
            radius={mapRadius}
            edit={edit}
          />
        </BackField>
        <BackField
          extended={isExtended('comments')}
          onClick={() => this.selectField('comments')}
          title="Comments"
          style={displayStyle('comments')}
          borderColor={uiColor}>
          <Comments cardId={cardId} extended={extended === 'comments'} />
        </BackField>
        <CardControls
          onFlip={flipHandler}
          onClose={onClose}
          style={{
            width: '100%',
            flexShrink: 0,
          }}>
          {edit ? (
            <DeleteButton
              onClick={onDelete}
              color={uiColor}
              style={{width: '20%'}}
            />
          ) : null}
        </CardControls>
      </div>
    );
  }
}

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
