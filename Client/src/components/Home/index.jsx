import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {db} from 'Firebase';

import withAuthorization from '../withAuthorization';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    const {onSetUsers} = this.props;
    db.onceGetUsers().then(snapshot => {
      const users = [];
      snapshot.forEach(d => users.push(d.data()));
      onSetUsers({users});
    });
  }

  render() {
    const {users} = this.props;

    // {users.map(d => <div>{Object.values(d)}</div>)}
    return (
      <div className="content-block">
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.User.users
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({type: 'USERS_SET', users})
});

const authCondition = authUser => !!authUser;

export default compose(
  withAuthorization(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
