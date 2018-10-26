import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import * as asyncActions from 'Reducers/Session/async_actions';

import withAuthorization from 'Src/components/withAuthorization';
import withAuthentication from 'Src/components/withAuthentication.jsx';

import {CloseIcon} from 'Src/styles/menu_icons';

class UserEnvSettingsView extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
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
      userEnvSelectedId,
    } = this.props;
    const {tmpEnvName} = this.state;
    return (
      <div className="content-margin">
        <h1>Create User Environments</h1>
        <div>
          <form
            className="flex justify-between mb-3"
            onSubmit={e => {
              e.preventDefault();
              addUserEnv({id: tmpEnvName});
            }}
          >
            <input
              className="form-control"
              style={{flexGrow: 0.75}}
              value={tmpEnvName}
              onChange={e => this.setState({tmpEnvName: e.target.value})}
            />
            <button type="submit" className="ml-1 btn" style={{flexGrow: 0.25}}>
              Add
            </button>
          </form>
          <ul className="list-reset">
            {userEnvs.map(d => (
              <li
                onClick={() => selectUserEnv(d)}
                className={`list-item ${userEnvSelectedId === d.id &&
                  'active'}`}>
                <div>{d.id}</div>
                <CloseIcon
                  onClick={e => {
                    e.stopPropagation();
                    removeUserEnv(d);
                  }}
                />
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
  userEnvs: state.Session.authUser ? state.Session.authUser.userEnvs : [],
});

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators(asyncActions, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {addUserEnv, selectUserEnv, removeUserEnv} = dispatchProps;
  const {authUser} = stateProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps
  };
};

export default compose(
  withRouter,
  withAuthentication,
  withAuthorization(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(UserEnvSettingsView);
