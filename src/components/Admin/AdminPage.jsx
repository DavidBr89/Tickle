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
    fetchUsers();
    fetchCreatedCards(authUser.uid);
    // selectCard(null);
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
    // console.log('cards', selectedCardId, cards);
    const selectedCard = cards.find(c => c.id === selectedCardId);

    // {selectedCardId !== null && (
    //   <div
    //     onClick={() => toggleModal(true)}
    //     style={{
    //       width: 100,
    //       height: 100,
    //       // background: 'green',
    //       display: 'flex',
    //       boxShadow: '5px 5px grey',
    //       border: '3px grey solid'
    //     }}
    //   >
    //     {selectedCard.challengeSubmissions.length}
    //   </div>
    // )}

    return (
      <div className="content-block flexCol" style={{ height: '100%' }}>
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
          className="flex-100"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            height: '100%'
          }}
        >
          <CardStack
            data={cards}
            selectedIndex={null}
            duration={600}
            width={30}
            height={100}
            unit="%"
            direction="vertical"
            slotSize={30}
            centered={false}
          >
            {u => (
              <div style={{ width: 200 }}>
                <Author {...u} className="mb-3" />
              </div>
            )}
          </CardStack>
          <CardStack
            data={cards}
            selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
            duration={600}
            width={30}
            height={100}
            unit="%"
            direction="vertical"
            slotSize={30}
            centered={selectedCardId !== null}
          >
            {d => (
              <PreviewCard
                {...d}
                onClick={() => selectCard(d.id)}
                tagColorScale={() => 'green'}
                key={d.id}
                edit={d.template}
                selected={selectedCardId === d.id}
                style={{
                  transition: `transform 1s`,
                  transform: selectedCardId === d.id && 'scale(1.2)',
                  width: '100%'
                }}
              />
            )}
          </CardStack>
        </div>
      </div>
    );
  }
}

export default AdminPage;
