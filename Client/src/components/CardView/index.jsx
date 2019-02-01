import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import WebMercatorViewport from 'viewport-mercator-project';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import TagGrid from '~/components/TagGrid';

import * as mapActions from '~/reducers/Map/actions';

import UserMap from '~/components/UserMap';
import mapTransition from '~/components/utils/mapTransition';

import setify from '~/components/utils/setify';
// import distanceLoc from 'Src/components/utils/distanceLoc';

// rename path
import {screenResize} from '~/reducers/Screen/actions';
import * as cardActions from '~/reducers/Cards/actions';
import * as asyncCardActions from '~/reducers/Cards/async_actions';

import * as dataViewActions from '~/reducers/DataView/actions';

import withAuthorization from '~/components/withAuthorization';
import withAuthentication from '~/components/withAuthentication';
import cardRoutes from '~/Routes/cardRoutes';

import {shiftCenterMap} from '~/lib/geo';
import {topicFilter} from '~/reducers/DataView/dataViewThunks';
import isSubset from '~/lib/isSubset';
import CardViewPage from './CardViewPage';
import SelectUserEnv from './SelectUserEnv';

const mapStateToProps = state => {
  const {collectibleCards} = state.Cards;

  const {width} = state.Screen;
  const {filterSet, cardPanelVisible} = state.DataView;

  const {mapSettings} = state.MapView;

  const {
    authUser: {uid}
  } = state.Session;

  return {
    ...state.MapView,
    ...state.DataView,
    uid,
    filterSet,
    collectibleCards,
    cardPanelVisible,
    ...state.Cards,
    ...state.Screen,
    ...state.Session
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...mapActions,
      ...asyncCardActions,
      ...dataViewActions,
      topicFilter,
      screenResize
    },
    dispatch
  );

// });

const mergeProps = (state, dispatcherProps, ownProps) => {
  const {
    uid,
    collectibleCards,
    filterSet,
    userLocation,
    accessibleRadius,
    mapSettings,
    width,
    height,
    userEnvId
  } = state;

  const mapViewport = {
    ...mapSettings,
    width,
    height
  };

  const mercator = new WebMercatorViewport(mapViewport);

  const {history, location, match} = ownProps;
  const {params} = match;
  const {userEnv} = params;

  const {
    changeMapViewport,
    fetchCollectibleCards,
    topicFilter
  } = dispatcherProps;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeSelectCard, routeExtendCard}
  } = cardRoutes({history, location});

  const extCardId = extended ? selectedCardId : null;

  const extendedCard =
    extCardId !== null
      ? collectibleCards.find(c => c.id === extCardId)
      : null;

  const isInView = loc => {
    const coords = [loc.longitude, loc.latitude];
    const pos = mercator.project(coords);
    return (
      pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height
    );
  };

  const previewCardAction = d => {
    if (selectedCardId === d.id) {
      return routeExtendCard();
    }
    routeSelectCard(d.id);

    changeMapViewport({
      ...mapViewport,
      // ...d.loc,
      ...shiftCenterMap({...d.loc.value, mercator}),
      ...mapTransition
    });
  };

  console.log('filterSet', filterSet);
  const filteredCards = collectibleCards
    .filter(d => filterSet.length === 0 || isSubset(d.topics.value, filterSet))
    .map(c => {
      const accessible = true; // visible;

      return {...c, accessible};
    })
    .filter(d => d.accessible);

  const cardSets = setify(filteredCards);

  const selectedCard =
    filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags =
    selectedCard !== null ? selectedCard.topics.value : filterSet;

  const filterByTopic = topic => topicFilter({filterSet, topic});

  const fetchCards = () => fetchCollectibleCards({uid, userEnvId});

  return {
    ...state,
    ...dispatcherProps,
    previewCardAction,
    routeSelectCard,
    cards: filteredCards,
    cardSets,
    selectedTags,
    selectedCardId,
    extendedCard,
    selectedCard,
    userEnv,
    mapViewport,
    filterByTopic,
    fetchCards,
    ...ownProps
  };
};

function PureMapViewPage({...props}) {
  return (
    <CardViewPage {...props}>
      <UserMap className="absolute" {...props} />
    </CardViewPage>
  );
}

PureMapViewPage.defaultProps = {};

PureMapViewPage.propTypes = {};

function PureTopicMapViewPage({...props}) {
  return <CardViewPage {...props} />;
}

PureMapViewPage.defaultProps = {};

PureMapViewPage.propTypes = {};

function PureTagViewPage({cardSets, ...props}) {
  return (
    <CardViewPage {...props} cardSets={cardSets}>
      <div className="mt-8 mb-3 flex flex-grow justify-center overflow-y-auto">
        <TagGrid
          className="p-2 flex-grow"
          {...props}
          data={cardSets}
          style={{maxWidth: 800}}
        />
      </div>
    </CardViewPage>
  );
}

PureTagViewPage.defaultProps = {};

PureTagViewPage.propTypes = {};

const authCondition = authUser => authUser !== null;

const composeScaffold = comp =>
  compose(
    withRouter,
    withAuthorization(authCondition),
    withAuthentication,
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps
    )
  )(comp);

export const MapViewPage = composeScaffold(PureMapViewPage);
export const TopicMapViewPage = composeScaffold(PureTopicMapViewPage);
export const TagViewPage = composeScaffold(PureTagViewPage);

export {SelectUserEnv};
