import React from 'react';
import PropTypes from 'prop-types';
// import chroma from 'chroma-js';
import { compose } from 'recompose';

import Trash2 from 'react-feather/dist/icons/trash-2';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { DB } from 'Firebase';

import { updateCardTemplate, dragCard } from 'Reducers/Cards/actions';

import { changeMapViewport } from 'Reducers/Map/actions';

import * as asyncCardActions from 'Reducers/Cards/async_actions';

import * as routeActions from 'Reducers/DataView/async_actions';

import cardRoutes from 'Src/Routes/cardRoutes';
import makeBackCardFuncs from './backCardDbMixins';
import EditCardFront from './CardFront/EditCardFront';

import CardBack from './CardBack';

import CardFrame from './CardFrame';

function mapStateToProps(state) {
  return {
    ...state.MapView,
    ...state.Cards,
    ...state.DataView,
    ...state.Screen,
    userLocation: state.MapView.userLocation,
    ...state.Session
  };
}


const DeleteButton = ({ style, className, onClick }) => (
  <button
    className={`pl-10 pr-10 btn btn-black bg-danger ${className}`}
    type="button"
    style={{
      alignItems: 'center',
      ...style
    }}
    onClick={onClick}
  >
    <div><Trash2 size={30} /></div>
  </button>
);

DeleteButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

DeleteButton.defaultProps = {
  style: {},
  onClick: d => d,
  className: ''
};


const mapDispatchToProps = dispatch => bindActionCreators(
  {
    // dragCard,
    updateCardTemplate,
    ...routeActions,
    dragCard,
    ...asyncCardActions,
    changeMapViewport,
    ...routeActions
  },
  dispatch,
);

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    mapViewport, width, height, authUser, tagVocabulary
  } = state;
  const { uid: authorId } = authUser;

  const {
    match, location, history, id: cardId
  } = ownProps;

  // TODO: BUILD IN check
  const { userEnv } = match.params;

  const {
    query: { selectedCardId, extended, flipped },
    routing: { routeFlipCard, routeExtendCard }
  } = cardRoutes({ history, location });

  const {
    updateCardTemplate,
    asyncCreateCard,
    asyncUpdateCard,
    asyncRemoveCard
  } = dispatcherProps;

  const createCard = ({ tags: tmpTags, title: tmpTitle, ...cardData }) => {
    const tags = tmpTags && tmpTags.length > 0 ? tmpTags : ['general'];
    const title = tmpTitle !== null ? tmpTitle : 'Card without title';
    console.log('CARD tmpTitle', tmpTitle);

    asyncCreateCard({ cardData: { ...cardData, title, tags }, userEnv });
  };
  const updateCard = (cardData) => {
    asyncUpdateCard({ cardData, userEnv });
  };

  const removeCard = () => asyncRemoveCard({ cardId, userEnv });

  const onCardUpdate = cardData => (cardData.id === 'temp'
    ? updateCardTemplate(cardData)
    : updateCard(cardData));

  const db = DB(userEnv);

  const filePath = `cards/${authorId}/${cardId}`;
  const removeFromStorage = fileId => db.removeFileFromEnv({
    path: filePath, id: fileId
  });
  const addToStorage = ({ file, id }) => db.addFileToEnv({ file, path: filePath, id });
  // const fetchComments = cardId ? () => db.readComments(cardId) : null;
  // const addComment = text => db.addComment({ uid: authorId, cardId, text });

  const backCardFuncs = makeBackCardFuncs({
    userEnv, cardId, playerId: authorId, authorId
  });

  const onClose = routeExtendCard;

  const onFlip = routeFlipCard;

  return {
    ...state,
    ...dispatcherProps,
    onCardUpdate,
    createCard,
    onClose,
    onFlip,
    flipped,
    removeCard,
    tagVocabulary,
    addToStorage,
    removeFromStorage,
    ...backCardFuncs,
    ...ownProps
  };
};

const EditCard = ({
  createCard,
  removeCard,
  onCardUpdate,
  x,
  y,
  onClose,
  flipped,
  onChallengeClick,
  onCreate,
  template,
  onFlip,
  fetchAuthorData, id,
  ...props
}) => (
  <CardFrame
    key={id}
    flipped={flipped}
    front={
      <EditCardFront
        {...props}
        id={id}
        template={template}
        onClose={onClose}
        onFlip={onFlip}
        onCreate={(d) => {
          createCard({ ...d, x, y });
          onClose();
        }}
        onUpdate={(d) => {
          onCardUpdate({ ...d, x, y });
        }}
      />
    }
    back={
      <CardBack
        {...props}
        id={id}
        onClose={onClose}
        fetchAuthorData={fetchAuthorData}
        onFlip={onFlip}
        edit
        controls={!template ? (<DeleteButton onClick={() => {
          onClose();
          removeCard(props.id);
        }}
        />) : null}
      />
    }
  />
);

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(EditCard);
