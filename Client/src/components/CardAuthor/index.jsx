import React from 'react';
import PropTypes from 'prop-types';

import {FlyToInterpolator} from 'react-map-gl';

import WebMercatorViewport from 'viewport-mercator-project';

// import TopicMapAuthor from 'Components/DataView/TopicMap/DragTopicMap';
import {TEMP_ID} from 'Constants/cardFields';
import {V1_DRAG} from 'Components/DragAndDrop';

// import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import * as mapActions from 'Reducers/Map/actions';

import setify from 'Utils/setify'; // eslint-disable-line
import {screenResize} from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';
import * as cardAsyncActions from 'Reducers/Cards/async_actions';
import * as dataViewThunks from 'Reducers/DataView/dataViewThunks';
// TODO: refactor these actions

import cardRoutes from 'Src/Routes/cardRoutes';
import isSubset from 'Src/lib/isSubset';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';
import {shiftCenterMap} from 'Src/lib/geo';
// import {initCard} from 'Constants/cardFields';
import {initCardFields, fallbackTagValues} from 'Constants/cardFields';
import MapAuthor from './MapAuthor';
import CardAuthorPage from './CardAuthorPage';

// import mapViewReducer from './reducer';

// Container
const mapStateToProps = state => {
  const {createdCards, tmpCard} = state.Cards;

  const {filterSet} = state.DataView;
  const {authUser} = state.Session;
  // console.log('selectedCardid', selectedCardId);

  // TODO: own dim reducer
  const {mapSettings, userLocation} = state.MapView;

  const {uid, admin} = authUser;

  const templateCard = {
    ...initCardFields,
    loc: {value: userLocation},
    ...tmpCard,
    uid,
    id: TEMP_ID,
    template: true
  };

  const filteredCards = createdCards.filter(
    d =>
      filterSet.length === 0 ||
      isSubset(d.topics.value || [], filterSet)
  );

  const cards = [templateCard, ...filteredCards].map(d => ({
    ...d,
    edit: true
  }));

  return {
    ...state.MapView,
    ...state.DataView,
    ...state.Cards,
    ...state.Screen,
    ...state.Session,
    authUser,
    admin,
    filterSet,
    templateCard,
    cards
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...cardAsyncActions,
      ...dataViewThunks,
      ...mapActions,
      screenResize
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    cards,
    filterSet,
    authUser,
    mapSettings,
    templateCard,
    width,
    height,
    userEnvId
  } = state;

  const {
    changeMapViewport,
    fetchCreatedCards,
    tagFilter
  } = dispatcherProps;

  const mapViewport = {...mapSettings, width, height};

  const {dataView, history, location, match, children} = ownProps;

  // const {
  //   params: {userEnv}
  // } = match;

  const {
    query: {selectedCardId, extended},
    routing: {routeSelectCard, routeExtendCard}
  } = cardRoutes({history, location});

  const extCardId = extended ? selectedCardId : null;

  const cardSets = setify(cards);

  const selectedCard = cards.find(d => d.id === selectedCardId) || null;

  const selectedTags =
    selectedCard !== null
      ? fallbackTagValues(selectedCard.topics)
      : filterSet;

  const mercator = new WebMercatorViewport(mapViewport);
  const reCenterMap = loc =>
    changeMapViewport({
      ...mapViewport,
      ...shiftCenterMap({...loc.value, mercator}),
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator()
    });

  const previewCardAction = d => {
    selectedCardId === d.id ? routeExtendCard() : routeSelectCard(d.id);
    reCenterMap(d.loc);
  };

  const selectTemplate = () => {
    routeSelectCard(TEMP_ID);
    reCenterMap(templateCard.loc);
  };

  const templateSelected = selectedCardId === TEMP_ID;

  const filterByTag = tag => tagFilter({filterSet, tag});

  const fetchCards = () =>
    fetchCreatedCards({uid: authUser.uid, userEnvId});

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    selectTemplate,
    cardSets,
    reCenterMap,
    selectedCard,
    selectedTags,
    dataView,
    selectedCardId: selectedCard ? selectedCardId : null,
    extCardId,
    templateSelected,
    children,
    userEnvId,
    mapViewport,
    fetchCards,
    filterByTag
  };
};

const authCondition = authUser => authUser !== null;

function PureMapCardAuthorPage({...props}) {
  const {
    asyncUpdateCard,
    reCenterMap,
    mapViewport,
    updateCardTemplate,
    userEnvId
  } = props;

  const mercator = new WebMercatorViewport(mapViewport);

  const centerTemplatePos = value => {
    reCenterMap(value);
    updateCardTemplate({loc: {value}});
  };

  const cardDrop = cardData => {
    const {x, y} = cardData;
    const [longitude, latitude] = mercator.unproject([x, y]);

    const updatedCard = {
      ...cardData,
      loc: {value: {longitude, latitude}}
    };
    if (cardData.id === TEMP_ID) updateCardTemplate(updatedCard);
    else asyncUpdateCard({cardData: updatedCard, userEnvId});
  };

  return (
    <CardAuthorPage {...props} centerTemplatePos={centerTemplatePos}>
      <MapAuthor
        {...props}
        dragId={V1_DRAG}
        className="absolute"
        onCardDrop={cardDrop}
      />
    </CardAuthorPage>
  );
}

PureMapCardAuthorPage.defaultProps = {};

PureMapCardAuthorPage.propTypes = {};

const composeScaffold = comp =>
  compose(
    withAuthentication,
    withAuthorization(authCondition),
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps
    )
  )(comp);

export default composeScaffold(PureMapCardAuthorPage);
