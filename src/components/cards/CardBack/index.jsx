import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'aphrodite/no-important';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

import { Trash2, Maximize, Minimize } from 'react-feather';

import { FlipButton } from '../layout';
import { FieldSet } from 'Components/utils/StyledComps';
import Comments from './Comments';
import CardHeader from '../CardHeader';
import Author from './Author';
import { MapAreaControl } from './MapAreaControl';

//
const DeleteButton = ({ style, onClick, color, className }) => (
  <CardThemeConsumer>
    {({ stylesheet: { btn, shallowBg, fieldSetBorder } }) => (
      <button
        className={`${css(btn)} bg-danger`}
        style={{
          background: color,
          alignItems: 'center',
          // display: 'flex',
          // color: 'whitesmoke',
          ...style
        }}
        onClick={onClick}
      >
        <Trash2 size={35} color="white" />
      </button>
    )}
  </CardThemeConsumer>
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
  extended
}) => (
  <CardThemeConsumer>
    {({ stylesheet: { shallowBg, fieldSetBorder, bareBtn } }) => (
      <div
        className={`${css(shallowBg)} ${css(fieldSetBorder)}`}
        onClick={!extended ? onClick : () => null}
        style={{
          // border: `1px solid ${uiColor}`,
          marginTop: '4px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          ...style,
          overflow: 'hidden'
        }}
      >
        <div
          className="mb-1"
          style={{
            display: 'flex',
            // width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '1.25rem', flex: '0 0 auto' }}>{title}</div>
          <button
            className={css(bareBtn)}
            onClick={extended ? onClick : () => null}
          >
            {extended ? <Minimize /> : <Maximize />}
          </button>
        </div>
        {children}
      </div>
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

const StyledAuthor = ({ ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => <Author {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

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
    return (
      this.state.extended !== nextState.extended ||
      this.props.visible !== nextProps.visible
    );
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
      style,
      visible
    } = this.props;

    const { extended } = this.state;

    const isExtended = field => extended === field && extended !== null;
    const displayStyle = field => {
      const defaultStyle = { transition: 'height 200ms', marginBottom: 10 };
      const isExt = isExtended(field);
      return {
        ...defaultStyle,
        height: isExt ? '100%' : 50,
        minHeight: 40,
        flex: '1 1 auto',
        // position: field === 'map' && 'absolute',
        // flex: '1 1 auto',
        overflow: isExt ? 'scroll' : 'hidden'
      };
    };

    return (
      <div
        ref={cont => (this.cont = cont)}
        className="flexCol flex-100"
        style={{
          height: '100%',
          // display: 'flex',
          alignContent: 'center'
          // flexDirection: 'column'
          // zIndex: 10000
          // ...style
          // justifyContent: 'space-around'
          // pointerEvents: 'all'
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <BackField
            title="Author"
            extended
            style={displayStyle('author')}
            onClick={() => this.selectField('author')}
          >
            {visible && (
              <StyledAuthor
                uid={uid}
                extended={extended === 'author'}
                tagColorScale={tagColorScale}
              />
            )}
          </BackField>
          {visible && (
            <BackField
              extended={isExtended('map')}
              style={{ ...displayStyle('map') }}
              edit={edit}
              title="Location"
              borderColor={uiColor}
              onClick={() => this.selectField('map')}
            >
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
          )}
          {visible && (
            <BackField
              extended={isExtended('comments')}
              onClick={() => this.selectField('comments')}
              title="Comments"
              style={displayStyle('comments')}
              borderColor={uiColor}
            >
              <Comments cardId={cardId} extended={extended === 'comments'} />
            </BackField>
          )}
          <div
            className="mt-2"
            style={{
              flexShrink: 0,
              display: 'flex',
              // TODO: to complex, simplify
              justifyContent: edit && template ? 'flex-end' : 'space-between'
            }}
          >
            {edit && (
              <DeleteButton
                disabled
                onClick={onDelete}
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
