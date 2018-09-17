import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Author from './Author';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack/CardStack';

import { BareModal, ModalBody } from 'Utils/Modal';

import ReviewCard from 'Components/cards/ConnectedReviewCard';

import { MediaList } from 'Utils/MediaUpload';

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

    // const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';
    fetchCreatedCards();
    // selectCard(null);
  }

  render() {
    const {
      authUser,
      cards,
      selectedCardId,
      selectCardId,
      modalActive,
      toggleModal,
      selectUser,
      selectedUserId,
      extendedId,
      extendSelection,
      selectedCard
    } = this.props;
    const { users } = this.props;
    // const selectedCard = cards.find(c => c.id === selectedCardId) || {};

    const selectedUserIndex = users.findIndex(c => c.uid === selectedUserId);
    return (
      <div className="content-block flexCol" style={{ height: '100%' }}>
        <BareModal
          visible={extendedId !== null}
          uiColor="grey"
          background="transparent"
        >
          <ReviewCard
            {...selectedCard}
            onClose={() => {
              extendSelection(null);
            }}
          />
        </BareModal>
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div className="flex-full flexCol m-3">
          <div
            className="flex-full"
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div className="flexCol" style={{ width: '30%' }}>
              <h3>Users</h3>
              <CardStack
                key="e"
                className="flex-full"
                data={users}
                selectedIndex={selectedUserIndex}
                duration={600}
                width={100}
                slotSize={30}
                height={100}
                unit="%"
                direction="vertical"
                centered={selectedUserId !== null && users.length > 0}
              >
                {u => (
                  <div
                    key={u.uid}
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: selectedUserId === u.uid && 'scale(1.2)',
                      transition: `transform 500ms`
                    }}
                    onClick={() => selectUser(u.uid)}
                  >
                    <Author {...u} className="mb-3" />
                  </div>
                )}
              </CardStack>
            </div>
            <div
              className="flexCol"
              style={{ height: '100%', justifyContent: 'center' }}
            >
              <div>
                Review
                <div>{selectedCard && selectedCard.id}</div>
              </div>
            </div>
            <div className="flexCol" style={{ width: '30%' }}>
              <h3>Cards</h3>
              <CardStack
                className="flex-full"
                data={cards}
                selectedIndex={cards.findIndex(c => c.id === selectedCardId)}
                duration={600}
                width={100}
                height={100}
                unit="%"
                direction="vertical"
                slotSize={30}
                centered={selectedCardId !== null}
              >
                {d => (
                  <PreviewCard
                    {...d}
                    onClick={() =>
                      selectedCardId !== d.id
                        ? selectCardId(d.id)
                        : extendSelection(d.id)
                    }
                    tagColorScale={() => 'green'}
                    key={d.id}
                    edit={d.template}
                    selected={selectedCardId === d.id}
                    style={{
                      transition: `transform 500ms`,
                      transform: selectedCardId === d.id && 'scale(1.2)',
                      width: '100%'
                    }}
                  />
                )}
              </CardStack>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPage;
