import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Author from './Author';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack/CardStack';

export class ControlledCardStack extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = { onChange: d => d };

  state = { selectedIndex: 0 };

  render() {
    const { data, children } = this.props;
    const { selectedIndex } = this.state;
    return (
      <CardStack {...this.props} selectedIndex={this.state.selectedIndex}>
        {(d, i) => (
          <div
            onClick={() => {
              // console.log('ControlledCardStack click', d);
              this.setState({ selectedIndex: i });
            }}
          >
            {children(d)}
          </div>
        )}
      </CardStack>
    );
  }
}

class AdminPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    users: PropTypes.array
  };

  static defaultProps = { users: [], cards: [] };

  componentDidMount() {
    const { fetchUsers, fetchCreatedCards, authUser } = this.props;
    console.log('authUser DIDMOUNT', authUser.uid);
    fetchUsers();
    fetchCreatedCards(authUser.uid);
  }

  render() {
    const { authUser, cards } = this.props;
    const { users } = this.props;
    const selectedCardId = null;
    console.log('CardStack', CardStack);
    return (
      <div className="content-block">
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ height: 900, width: 200, border: 'black solid 1px' }}>
            <ControlledCardStack
              data={cards}
              className="ml-1 mr-2"
              duration={600}
              width={500}
              height={900}
              unit="px"
              direction="vertical"
              slotSize={200}
              centered
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
                        width: 180,
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
            </ControlledCardStack>
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
