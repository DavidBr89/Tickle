import {lazy} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import cardRoutes from '~/Routes/cardRoutes';
import * as asyncSessionActions from '~/reducers/Session/async_actions';
import * as sessionActions from '~/reducers/Session/actions';
import * as asyncAdminActions from '~/reducers/Admin/async_actions';
import * as asyncCardActions from '~/reducers/Cards/async_actions';
import * as adminActions from '~/reducers/Admin/actions';

import withAuthorization from '~/components/withAuthorization';
import withAuthentication from '~/components/withAuthentication';

// import uuidv1 from 'uuid/v1';

import {ADMIN} from '~/constants/routeSpec';
import {TEMP_ID} from '~/constants/cardFields';
import AdminPage from './AdminPage';

const mapStateToProps = state => ({
  ...state.Session,
  ...state.Cards,
  ...state.MapView,
  ...state.Admin
  // userEnvs: state.Session.authUser ? state.Session.authUser.userEnvs : [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...asyncSessionActions,
      ...sessionActions,
      ...asyncAdminActions,
      ...adminActions,
      ...asyncCardActions
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    selectedUserId,
    users,
    envUserIds,
    collectibleCards,
    createdCards,
    userEnvs,
    uid,
    tmpCard,
    mapSettings,
    userLocation,
    userEnvId,
  } = stateProps;

  const {
    createNewUserEnv,
    selectUserEnv,
    removeUserEnv,
    fetchUsers,
    fetchCollectibleCards,
    fetchCreatedCards,
    registerUserToEnv,
    inviteUser,
    setUserEnv,
    createTopic,
    updateTopic,
    removeTopic,
    fetchTopics,
  } = dispatchProps;

  const {match, history, location} = ownProps;

  const urlConfig = cardRoutes({history, location});

  const templateCard = {
    loc: userLocation,
    uid,
    id: TEMP_ID,
    template: true,
    edit: true,
    ...tmpCard
  };

  // const {
  //   params: {userEnv: userEnvId}
  // } = match;

  const routeUserEnv = env => setUserEnv(env);

  // history.push(`/${env}/${ADMIN.path}`);

  const cardType = 'created';
  const getTopics = () => fetchTopics(userEnvId);
  const fetchCards = () =>
    // TODO
    cardType === 'created'
      ? fetchCreatedCards({userEnvId, uid: selectedUserId})
      : fetchCollectibleCards({userEnvId, uid: selectedUserId});

  const cards =
    cardType === 'created' ? createdCards : collectibleCards;

  const onCreateCard = () =>
    console.log('selectedUserId', selectedUserId);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    cards,
    routeUserEnv,
    selectedUserId,
    urlConfig,
    templateCard,
    fetchCards,
    onCreateCard,
    getTopics,
    // nonEnvUsers,
    userEnvs,
    userEnvId,
    selectedUserEnvId: userEnvId,
    inviteUser: usr => {
      // TODO
      inviteUser({...usr, userEnvIds: [userEnvId]});
    }
  };
};

export default compose(
  withRouter,
  withAuthentication,
  withAuthorization(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(AdminPage);
