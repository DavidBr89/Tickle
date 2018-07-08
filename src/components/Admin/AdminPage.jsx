import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Author from './Author';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack';

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
    const selectedCardId = null;
    return (
      <div className="content-block">
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <CardStack
              data={cards}
              className="ml-1 mr-2"
              duration={600}
              centered={selectedCardId !== null}
              selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
              width={100}
              height={900}
              unit="px"
              direction="vertical"
              slotSize={100}
              style={{}}
            >
              {d => (
                <div
                  className="w-100 h-100"
                  key={d.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'center'
                    // border: 'black 5px solid'
                    // pointerEvents: 'none'
                  }}
                >
                  <div style={{ width: '100%', height: 200 }}>
                    <PreviewCard
                      {...d}
                      onClick={d => d}
                      tagColorScale={() => 'green'}
                      key={d.id}
                      edit={d.template}
                      selected={selectedCardId === d.id}
                      style={{
                        transition: `transform 1s`,
                        transform: selectedCardId === d.id && 'scale(1.2)',
                        // zIndex: selectedCardId === d.id && 5000,
                        opacity: d.template && 0.8

                        // width: '100%',
                        // height: '100%',
                        // width: '100%'
                        // maxWidth: '200px'
                      }}
                    />
                  </div>
                </div>
              )}
            </CardStack>
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
