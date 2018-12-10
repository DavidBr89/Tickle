import React from 'react';
import PropTypes from 'prop-types';

import {FlyToInterpolator} from 'react-map-gl';

import WebMercatorViewport from 'viewport-mercator-project';

import MapAuthor from 'Components/DataView/Map/MapAuthor';

// import TopicMapAuthor from 'Components/DataView/TopicMap/DragTopicMap';
import {TEMP_ID} from 'Constants/cardFields';

// import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import * as mapActions from 'Reducers/Map/actions';

import setify from 'Utils/setify'; // eslint-disable-line
import {screenResize} from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';
import * as asyncActions from 'Reducers/Cards/async_actions';
import * as dataViewActions from 'Reducers/DataView/async_actions';
// TODO: refactor these actions
import * as routeActions from 'Reducers/DataView/async_actions';

import cardRoutes from 'Src/Routes/cardRoutes';
import isSubset from 'Src/lib/isSubset';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';
import {shiftCenterMap} from 'Src/lib/geo';
// import {initCard} from 'Constants/cardFields';
import {fallbackTagValues} from 'Constants/cardFields';
import UserEnvironmentSettings from './UserEnvironmentSettings';
import CardAuthorPage from './CardAuthorPage';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {createdCards, tmpCard} = state.Cards;

  const {filterSet} = state.DataView;
  // console.log('selectedCardid', selectedCardId);

  // TODO: own dim reducer
  const {mapSettings, userLocation} = state.MapView;

  const {
    authUser: {uid, admin},
  } = state.Session;

  const templateCard = {
    loc: userLocation,
    uid,
    id: TEMP_ID,
    template: true,
    ...tmpCard,
  };

  const filteredCards = createdCards.filter(
    d => filterSet.length === 0 || isSubset(d.tags.value || [], filterSet),
  );

  const cards = [templateCard, ...filteredCards];

  return {
    ...state.MapView,
    ...state.DataView,
    ...state.Cards,
    ...state.Screen,
    uid,
    admin,
    filterSet,
    templateCard,
    cards,
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...asyncActions,
      ...dataViewActions,

      ...routeActions,
      ...mapActions,
      screenResize,
    },
    dispatch,
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {cards, filterSet, mapSettings, templateCard, width, height} = state;

  const {changeMapViewport, tagFilter} = dispatcherProps;
  const mapViewport = {...mapSettings, width, height};

  const {dataView, history, location, match, children} = ownProps;

  const {
    params: {userEnv},
  } = match;

  const {
    query: {selectedCardId, extended},
    routing: {routeSelectCard, routeExtendCard},
  } = cardRoutes({history, location});

  const extCardId = extended ? selectedCardId : null;

  const cardSets = setify(cards);

  const selectedCard = cards.find(d => d.id === selectedCardId) || null;

  const selectedTags =
    selectedCard !== null ? fallbackTagValues(selectedCard.tags) : filterSet;

  const mercator = new WebMercatorViewport(mapViewport);
  const reCenterMap = d =>
    changeMapViewport({
      ...mapViewport,
      ...shiftCenterMap({...d.loc, mercator}),
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });

  const previewCardAction = d => {
    selectedCardId === d.id ? routeExtendCard() : routeSelectCard(d.id);
    reCenterMap(d);
  };

  const selectTemplate = () => {
    routeSelectCard(TEMP_ID);
    reCenterMap(templateCard);
  };

  const templateSelected = selectedCardId === TEMP_ID;

  const filterByTag = tag => tagFilter({filterSet, tag});

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    selectTemplate,
    cardSets,
    selectedCard,
    selectedTags,
    dataView,
    selectedCardId,
    extCardId,
    templateSelected,
    children,
    userEnv,
    mapViewport,
    filterByTag,
  };
};

const authCondition = authUser => authUser !== null;

function PureMapCardAuthorPage({...props}) {
  const {asyncUpdateCard, mapViewport, updateCardTemplate, userEnv} = props;

  const mercator = new WebMercatorViewport(mapViewport);

  const cardDrop = cardData => {
    console.log('cardDrop', cardData);
    const {x, y} = cardData;
    const [longitude, latitude] = mercator.unproject([x, y]);

    const updatedCard = {...cardData, loc: {longitude, latitude}};
    if (cardData.id === TEMP_ID) updateCardTemplate(updatedCard);
    else asyncUpdateCard({cardData: updatedCard, userEnv});
  };

  return (
    <CardAuthorPage {...props}>
      <MapAuthor {...props} className="absolute" onCardDrop={cardDrop} />
    </CardAuthorPage>
  );
}

PureMapCardAuthorPage.defaultProps = {};

PureMapCardAuthorPage.propTypes = {};

function PrivateTopicMapAuthorPage({...props}) {
  return (
    <CardAuthorPage {...props}>
    </CardAuthorPage>
  );
}

const composeScaffold = comp =>
  compose(
    withAuthentication,
    withAuthorization(authCondition),
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    ),
  )(comp);

export const MapCardAuthorPage = composeScaffold(PureMapCardAuthorPage);

export const TopicMapAuthorPage = composeScaffold(PrivateTopicMapAuthorPage);

export default CardAuthorPage;

export {UserEnvironmentSettings};
