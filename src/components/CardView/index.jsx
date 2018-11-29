import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {PerspectiveMercatorViewport} from 'viewport-mercator-project';
import {LinearInterpolator, FlyToInterpolator} from 'react-map-gl';

import WebMercatorViewport from 'viewport-mercator-project';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import TopicMapVis from 'Components/DataView/TopicMap/TopicMapVis';
import TagGrid from 'Components/TagGrid';

import * as mapActions from 'Reducers/Map/actions';

import UserMap from 'Components/DataView/Map/UserMap';

import {intersection} from 'lodash';
import {resizeCardWindow, userMove, changeViewport} from 'Reducers/Map/actions';

import setify from 'Utils/setify';
import distanceLoc from 'Components/utils/distanceLoc';
// rename path
import {screenResize} from 'Reducers/Screen/actions';
import * as cardActions from 'Reducers/Cards/actions';

import * as dataViewActions from 'Reducers/DataView/actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';
import cardRoutes from 'Src/Routes/cardRoutes';

import {shiftCenterMap} from 'Src/lib/geo';
import {tagFilter} from 'Reducers/DataView/async_actions';
import CardViewPage from './CardViewPage';
import SelectUserEnv from './SelectUserEnv';

// import mapViewReducer from './reducer';

const lowercase = s => s.toLowerCase();
const filterByTag = (doc, filterSet) =>
  filterSet.length === 0 ||
  intersection(doc.tags.map(lowercase), filterSet.map(lowercase)).length ===
    filterSet.length;

// const applyFilter = challengeState => d => {
//   if (challengeState === CHALLENGE_SUBMITTED) return isChallengeSubmitted(d);
//   return !isChallengeSubmitted(d);
// };

// Container
const mapStateToProps = state => {
  const {collectibleCards} = state.Cards;

  const {width, height} = state.Screen;
  const {
    // selectedCardId,
    filterSet,
    cardPanelVisible,
    // challengeStateFilter
  } = state.DataView;

  const {mapSettings} = state.MapView;

  const {
    authUser: {uid},
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
    // cards: filteredCards
    // cardSets,
    // selectedTags,
    // tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...cardActions,
      ...mapActions,
      // ...asyncActions,
      ...dataViewActions,
      tagFilter,
      // ...dataViewAsyncActions,
      resizeCardWindow,
      userMove,
      screenResize,
      changeViewport,
    },
    dispatch,
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
  } = state;

  const mapViewport = {
    ...mapSettings,
    width,
    height,
  };

  const mercator = new WebMercatorViewport(mapViewport);

  const {history, location, match} = ownProps;
  const {params} = match;
  const {userEnv} = params;

  const {changeMapViewport} = dispatcherProps;

  const {
    query: {selectedCardId, extended, flipped},
    routing: {routeSelectCard, routeExtendCard},
  } = cardRoutes({history, location});

  const extCardId = extended ? selectedCardId : null;

  const extendedCard =
    extCardId !== null ? collectibleCards.find(c => c.id === extCardId) : null;

  const isInView = loc => {
    const coords = [loc.longitude, loc.latitude];
    const pos = mercator.project(coords);
    return pos[0] > 0 && pos[0] < width && pos[1] > 0 && pos[1] < height;
  };

  const previewCardAction = d => {
    if (selectedCardId === d.id) {
      return routeExtendCard();
    }
    routeSelectCard(d.id);

    changeMapViewport({
      ...mapViewport,
      // ...d.loc,
      ...shiftCenterMap({...d.loc, mercator}),
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easePoly,
      // zoom: 11,
    });
  };

  const filteredCards = collectibleCards
    .filter(d => filterByTag(d, filterSet))
    .map(c => {
      // const visible = isInView(c.loc);
      const accessible = true; // visible;
      // (visible && isInDistance(c.loc)) || (isCardSeen(c) && visible);

      return {...c, accessible};
    })
    .filter(d => d.accessible);

  const cardSets = setify(filteredCards);
  const selectedCard = filteredCards.find(d => d.id === selectedCardId) || null;

  const selectedTags = selectedCard !== null ? selectedCard.tags : filterSet;

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
    ...ownProps,
  };
};

function updCardLoc({x, y}, mapViewport) {
  const vp = new PerspectiveMercatorViewport(mapViewport);

  const [longitude, latitude] = vp.unproject([
    x, // || mapViewport.width / 2,
    y, // || mapViewport.height / 2
  ]);
  return {latitude, longitude};
}

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
  return (
    <CardViewPage {...props}>
      <TopicMapVis className="absolute" {...props} />
    </CardViewPage>
  );
}

PureMapViewPage.defaultProps = {};

PureMapViewPage.propTypes = {};

function PureTagViewPage({cardSets, ...props}) {
  return (
    <CardViewPage {...props} cardSets={cardSets}>
      <div className="mt-8 mb-3 flex flex-grow justify-center overflow-y-auto">
        <TagGrid
          className="flex-grow"
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
    withAuthentication,
    withAuthorization(authCondition),
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps,
    ),
  )(comp);

export const MapViewPage = composeScaffold(PureMapViewPage);
export const TopicMapViewPage = composeScaffold(PureTopicMapViewPage);
export const TagViewPage = composeScaffold(PureTagViewPage);

export {SelectUserEnv};
