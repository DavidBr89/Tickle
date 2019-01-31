import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import * as asyncActions from '~/reducers/Session/async_actions';

import withAuthorization from '~/components/withAuthorization';
import withAuthentication from '~/components/withAuthentication.jsx';

// import {CloseIcon} from '~/styles/menu_icons';

import {DATAVIEW} from '~/constants/routeSpec';

class SelectUserEnv extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    userEnvs: []
  };

  state = {tmpEnvName: null};

  render() {
    const {
      authUser,
      addUserEnv,
      removeUserEnv,
      selectUserEnv,
      userEnvs,
      selectedUserEnvId,
      routeUserEnv
    } = this.props;
    const {tmpEnvName} = this.state;
    return (
      <div className="content-margin">
        <h1 className="mb-3">Select User Environments</h1>
        <div>
          <ul className="list-reset">
            {userEnvs.map(d => (
              <li
                onClick={() => routeUserEnv(d.id)}
                className={`list-item ${selectedUserEnvId === d.id &&
                  'active'}`}>
                <div>{d.id}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Session,
  userEnvs: state.Session.authUser
    ? state.Session.authUser.userEnvs
    : []
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(asyncActions, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {addUserEnv} = dispatchProps;
  const {match, history} = ownProps;

  const {
    params: {userEnv}
  } = match;

  const routeUserEnv = env => history.push(`/${env}/${DATAVIEW.path}`);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    routeUserEnv,
    selectedUserEnvId: userEnv,
    addUserEnv: newEnv => addUserEnv({envId: userEnv, newEnv})
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
)(SelectUserEnv);
