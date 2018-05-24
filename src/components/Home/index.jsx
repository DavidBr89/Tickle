import React, { Component } from 'react';

import { db } from 'Firebase';

import withAuthorization from '../withAuthorization';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot => {
      const users = [];
      snapshot.forEach(d => users.push(d.data()));

      this.setState({ users });
    });
  }

  render() {
    const { users } = this.state;
    return (
      <div className="content-block">
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        {users.map(d => <div>{Object.values(d)}</div>)}
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(HomePage);
