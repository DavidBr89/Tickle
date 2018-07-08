import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Author from './Author';

import PreviewCard from 'Cards/PreviewCard';

class AdminPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    users: PropTypes.array
  };

  static defaultProps = { users: [] };

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }

  render() {
    const { authUser, cards } = this.props;
    const { users } = this.props;
    return (
      <div className="content-block">
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div style={{ display: 'flex', justifyContent: 'space-around'}}>
          <div>
            {cards.map(c => (
              <PreviewCard {...c} style={{ width: 200, height: 300 }} />
            ))}
          </div>
          <div>
            {users.map(u => (
              <div style={{ width: 200 }}>
                <Author {...u} className="mb-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPage;
