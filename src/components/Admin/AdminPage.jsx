import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AdminPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { authUser } = this.props;
    return (
      <div className="content-block">
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
      </div>
    );
  }
}

export default AdminPage;
