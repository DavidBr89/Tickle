import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cx from './Card.scss';

import { FieldSet, FlipButton } from './layout';
import Comments from './Comments';
import CardHeader from './CardHeader';
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
    deleteHandler: PropTypes.func
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
    deleteHandler: d => d
  };

  state = { extended: null };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.extended !== nextState.extended;
  }

  selectField = field =>
    this.setState(({ extended: prevExtended }) => ({
      extended: prevExtended !== field ? field : null
    }));

  render() {
    const {
      loc,
      author,
      uiColor,
      edit,
      setMapRadius,
      mapRadius,
      flipHandler,
      deleteHandler,
      tagColorScale,
      template,
      id: cardId
    } = this.props;

    // /TODO: card template update
    const { extended } = this.state;

    const isHidden = field => extended !== null && extended !== field;
    const isExtended = field => ({
      extended: extended === field && extended !== null
    });

    const display = field => {
      const h = extended === field ? { height: '90%' } : {};
      return {
        display: isHidden(field) ? 'none' : null,
        ...h
      };
    };

    return (
      <div
        ref={cont => (this.cont = cont)}
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          display: 'flex',
          alignContent: 'center',
          flexDirection: 'column'
          // pointerEvents: 'all'
        }}
      >
        <FieldSet
          legend="Author"
          borderColor={uiColor}
          style={{ ...display('author'), transition: 'all 1s' }}
          onClick={() => this.selectField('author')}
        >
          <Author
            {...author}
            img={author.usrImgUrl}
            extended={extended === 'author'}
            tagColorScale={tagColorScale}
            onClose={() => {
              // TODO
              // console.log('onCLose');
            }}
          />
        </FieldSet>
        <FieldSet
          style={{ width: '100%', height: '30%', ...display('map') }}
          edit={edit}
          legend="Location"
          legendStyle={{ position: 'absolute', zIndex: 100, margin: 10 }}
          bodyStyle={{ padding: 0 }}
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
        </FieldSet>
        <FieldSet
          onClick={() => this.selectField('comments')}
          legend="Comments"
          style={display('comments')}
          borderColor={uiColor}
        >
          {!template ? (
            <Comments
              author={author}
              cardId={cardId}
              extended={extended === 'comments'}
            />
          ) : (
            'No comments'
          )}
        </FieldSet>
        <div
          className="mt-2"
          style={{
            display: 'flex',
            // TODO: to complex, simplify
            justifyContent: edit && template ? 'flex-end' : 'space-between'
          }}
        >
          {edit &&
            !template && (
              <DeleteButton
                onClick={deleteHandler}
                className="bg-danger"
                color={uiColor}
                style={{ width: '20%' }}
              />
            )}
          <FlipButton
            className="ml-2"
            color={uiColor}
            onClick={flipHandler}
            style={{ width: edit ? '20%' : '100%' }}
          />
        </div>
      </div>
    );
  }
}

const CardBack = props => (
  <CardHeader
    onClose={props.onClose}
    background={props.background}
    title={props.title}
    uiColor={props.uiColor}
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
