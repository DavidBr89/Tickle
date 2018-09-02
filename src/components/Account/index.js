import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withAuthorization from '../withAuthorization';
import AccountPage from './AccountPage';
import { submitUserInfoToDB } from 'Reducers/Session/async_actions';

import { uniq } from 'lodash';

import {
  // asyncUpdateCard,
  // asyncCreateCard,
  // asyncRemoveCard,
  asyncSubmitChallenge,
  fetchCollectibleCards
} from 'Reducers/Cards/async_actions';

import * as actions from 'Reducers/Session/actions';
import { screenResize } from 'Reducers/Screen/actions';

import { makeTagColorScale } from 'Src/styles/GlobalThemeContext'; // eslint-disable-line

import {
  isChallengeSucceeded,
  isChallengeStarted,
  isChallengeSubmitted
} from 'Constants/cardFields';

const isDefined = a => a !== null && a !== undefined;
/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapStateToProps = state => {
  const { cardSets } = state.Account;
  const { tagColorScale, collectibleCards } = state.Cards;
  // console.log('cards');
  //
  // const tagColorScale = makeTagColorScale(cardSets);
  //
  //
  const collectedCards = collectibleCards.filter(isChallengeSucceeded);

  const submittedCards = collectibleCards.filter(isChallengeSubmitted);

  const startedCards = collectibleCards.filter(isChallengeStarted);
  const succeededCards = collectibleCards.filter(isChallengeSucceeded);

  const userTags = uniq(
    [...collectedCards, ...submittedCards, ...startedCards].reduce(
      (acc, c) => [...acc, ...c.tags],
      []
    )
  );

  console.log(
    'startedCards',
    startedCards,
    'submittedCards',
    submittedCards,
    'collectedCards',
    collectedCards
  );

  return {
    authUser: {
      ...state.Screen,
      ...state.Session.authUser,
      collectedCards,
      submittedCards,
      startedCards,
      succeededCards,
      userTags
    },
    ...state.Screen,
    tagColorScale
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      submitUserInfoToDB,
      screenResize,

      // asyncUpdateCard,
      // asyncCreateCard,
      fetchCollectibleCards,
      // asyncRemoveCard,
      asyncSubmitChallenge,

      ...actions
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { authUser } = stateProps;

  const { fetchCollectibleCards } = dispatchProps;
  const fetchCards = () => {
    fetchCollectibleCards(authUser.uid);
  };

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchCards,
    selectedCardId: null,
    //TODO
    userInfoExtended: false
  };
};

const authCondition = authUser => authUser !== null;
export default compose(
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(AccountPage);
