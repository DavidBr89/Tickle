import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Author from './Author';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack/CardStack';

import { Modal, ModalBody } from 'Utils/Modal';

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

// async function yeah() {}

class AdminPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    users: PropTypes.array,
    cards: PropTypes.array
  };

  static defaultProps = { users: [], cards: [] };

  componentDidMount() {
    const {
      fetchUsers,
      fetchCreatedCards,
      selectCard,
      authUser,
      modalActive
    } = this.props;
    console.log('authUser DIDMOUNT', authUser.uid);
    fetchUsers();
    fetchCreatedCards(authUser.uid);
    selectCard(null);
  }

  render() {
    const {
      authUser,
      cards,
      selectedCardId,
      selectCard,
      modalActive,
      toggleModal
    } = this.props;
    const { users } = this.props;
    console.log('cards', selectedCardId, cards);
    const selectedCard = cards.find(c => c.id === selectedCardId);

    return (
      <div className="content-block">
        <Modal
          visible={modalActive}
          title="Title"
          onClose={() => toggleModal(false)}
          uiColor="grey"
          background="white"
        >
          <ModalBody>
            <div>test</div>
          </ModalBody>
        </Modal>
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <div style={{ height: 900, width: 200 }}>
            <CardStack
              data={cards}
              className="ml-1 mr-2"
              selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
              duration={600}
              width={500}
              height={900}
              unit="px"
              direction="vertical"
              slotSize={200}
              centered={selectedCardId !== null}
            >
              {d => (
                <div
                  className="w-100 h-100"
                  key={d.id}
                  onClick={() => selectCard(d.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ width: '100%', height: 200 }}>
                    <PreviewCard
                      {...d}
                      tagColorScale={() => 'green'}
                      key={d.id}
                      edit={d.template}
                      selected={selectedCardId === d.id}
                      style={{
                        transition: `transform 1s`,
                        transform: selectedCardId === d.id && 'scale(1.2)',
                        width: 180,
                        opacity: d.template && 0.8
                      }}
                    />
                  </div>
                </div>
              )}
            </CardStack>
          </div>
          {selectedCardId !== null && (
            <div
              onClick={() => toggleModal(true)}
              style={{
                width: 100,
                height: 100,
                // background: 'green',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '5px 5px grey',
                border: '3px grey solid'
              }}
            >
              {selectedCard.challengeSubmissions.length}
            </div>
          )}
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
