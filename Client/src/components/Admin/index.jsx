import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import cardRoutes from 'Src/Routes/cardRoutes';
import * as asyncSessionActions from 'Reducers/Session/async_actions';
import * as asyncAdminActions from 'Reducers/Admin/async_actions';
import * as asyncCardActions from 'Reducers/Cards/async_actions';
import * as adminActions from 'Reducers/Admin/actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication';

// import uuidv1 from 'uuid/v1';

import {ADMIN} from 'Constants/routeSpec';
import {TEMP_ID} from 'Constants/cardFields';
import AdminPage from './AdminPage';

const mapStateToProps = state => ({
  ...state.Session,
  ...state.Cards,
  ...state.MapView,
  ...state.Session.authUser,
  ...state.Admin
  // userEnvs: state.Session.authUser ? state.Session.authUser.userEnvs : [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...asyncSessionActions,
      ...asyncAdminActions,
      ...adminActions,
      ...asyncCardActions
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {uid, tmpCard, mapSettings, userLocation} = stateProps;
  const {
    selectedUserId,
    users,
    envUserIds,
    collectibleCards,
    createdCards,
    userEnvs
  } = stateProps;

  const {
    createNewUserEnv,
    selectUserEnv,
    removeUserEnv,
    fetchUsers,
    fetchCollectibleCards,
    fetchCreatedCards,
    registerUserToEnv,
    inviteUser
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

  const {
    params: {userEnv: userEnvId}
  } = match;

  const routeUserEnv = env => history.push(`/${env}/${ADMIN.path}`);

  const cardType = 'created';
  const fetchCards = () => {
    //TODO
    return cardType === 'created'
      ? fetchCreatedCards({userEnvId, uid: selectedUserId})
      : fetchCollectibleCards({userEnvId, uid: selectedUserId});
  }

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
    // nonEnvUsers,
    userEnvs,
    userEnvId,
    selectedUserEnvId: userEnvId,
    inviteUser: usr => {
      inviteUser({...usr, userEnvIds: [userEnvId]});
    },
    registerUserToEnv: uid => registerUserToEnv({userEnvId, uid})
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
