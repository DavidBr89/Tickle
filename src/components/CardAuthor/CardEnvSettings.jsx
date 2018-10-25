import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import {setUserEnvList} from 'Reducers/Session/async_actions';

import withAuthorization from 'Src/components/withAuthorization';

class UserEnvSettingsView extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  static defaultProps = {
    userEnvs: [],
  };

  state = {tmpEnvName: null};

  render() {
    const {userEnvs, setUserEnvList} = this.props;
    const {tmpEnvName} = this.state;
    console.log('CardEnvSettings', this.props);
    return (
      <div className="content-margin">
        <h1>UserEnvSettings</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            setUserEnvList({id: tmpEnvName});
          }}>
          <input
            className="form-control"
            value={tmpEnvName}
            onChange={e => this.setState({tmpEnvName: e.target.value})}
          />
          <button type="submit" className="btn">
            Add
          </button>
        </form>
        <ul>
          {userEnvs.map(d => (
            <li>{d.id}</li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({...state.Session.authUser});

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setUserEnvList
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {setUserEnvList} = dispatchProps;
  const {userEnvs} = stateProps;
  const updateUserEnv = env => setUserEnvList([...userEnvs, env]);

  const deleteUserEnv = env =>
    setUserEnvList(userEnvs.filter(u => u.id !== env.id));

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    updateUserEnv,
    deleteUserEnv
  };
};

const authCondition = authUser => !!authUser;
export default compose(
  withRouter,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(UserEnvSettingsView);
