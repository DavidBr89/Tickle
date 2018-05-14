import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cx from './Card.scss';

import { FieldSet, Comments, FlipButton } from './layout';
import CardHeader from './CardHeader';
import Author from './Author';
import MapAreaControl from './MapAreaControl';

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
    author: PropTypes.object.isRequired,
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
    cardSets: [],
    uiColor: 'grey',
    edit: false,
    flipHandler: d => d,
    mapRadius: 100,
    setMapRadius: d => d,
    deleteHandler: d => d
  };

  constructor(props) {
    super(props);
    this.state = { extended: null };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.extended !== nextState.extended;
  }

  render() {
    const {
      loc,
      author,
      uiColor,
      comments,
      edit,
      setMapRadius,
      mapRadius,
      flipHandler,
      deleteHandler,
      tagColorScale
    } = this.props;

    const { extended } = this.state;
    const selectField = field => () =>
      extended !== field && this.setState({ extended: field });
    const unSelectField = field => () =>
      extended === field && this.setState({ extended: null });

    const isHidden = field => extended !== null && extended !== field;
    const isExtended = field => ({
      extended: extended === field && extended !== null
    });

    const display = field => ({
      display: isHidden(field) ? 'none' : null,
      height: extended === field ? '100%' : '29%'
      // opacity: field !== 'map' && edit ? 0.5 : null
    });

    return (
      <div
        ref={cont => (this.cont = cont)}
        className={`container ${cx.cardMini2} `}
        style={{
          height: '90%',
          zIndex: -10
        }}
      >
        <FieldSet
          legend={'Author'}
          borderColor={uiColor}
          style={{ ...display('author') }}
          onClick={selectField('author')}
        >
          <Author
            {...author}
            extended={extended === 'author'}
            tagColorScale={tagColorScale}
            onClose={() => {
              // TODO
              // console.log('onCLose');
              this.setState({ extended: null });
            }}
          />
        </FieldSet>
        <FieldSet
          style={{ width: '100%', ...display('map') }}
          edit={edit}
          legend={'Location'}
          borderColor={uiColor}
          onClick={selectField('map')}
        >
          <MapAreaControl
            {...this.props}
            {...loc}
            {...isExtended('map')}
            onClose={unSelectField('map')}
            uiColor={uiColor}
            onChange={r => setMapRadius(r)}
            radius={mapRadius}
            edit={edit}
          />
        </FieldSet>
        <FieldSet
          onClick={selectField('comments')}
          legend={'Comments'}
          style={display('comments')}
          borderColor={uiColor}
        >
          <Comments
            extended={extended === 'comments'}
            data={comments}
            onClose={unSelectField('comments')}
          />
        </FieldSet>
        <div
          className="mt-2"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {edit && (
            <DeleteButton
              onClick={deleteHandler}
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
