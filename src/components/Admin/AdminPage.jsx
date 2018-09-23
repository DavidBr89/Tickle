import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack/CardStack';

import { BareModal, ModalBody } from 'Utils/Modal';

import ReviewCard from 'Components/cards/ConnectedReviewCard';

import { MediaList } from 'Utils/MediaUpload';

const Author = ({ username }) => <div>{username}</div>;

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
      fetchAllCardsWithSubmissions,
      selectCard,
      authUser,
      modalActive
    } = this.props;
    fetchUsers();

    // const haaike = 'PpNOHOQLtXatZzcaAYVCMQQP5XT2';
    fetchAllCardsWithSubmissions();
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
        <div
          className="flexCol"
          style={{
            flex: 1,
            display: 'grid',
            overflow: 'hidden',
            gridTemplateColumns: '50% 50%',
            gridTemplateRows: '50% 50%'
          }}
        >
          <div style={{ display: 'flex', overflow: 'hidden' }}>
            <div style={{ overflow: 'scroll', width: '100%' }}>
              <h3>Users</h3>
              {users.map(d => <div>{d.username}</div>)}
            </div>
          </div>
          <div>User</div>
          <div
            className="flexCol"
            style={{
              overflow: 'scroll',
              gridColumn: 'span 2'
            }}
          >
            <h3>Cards</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 20%)',
                gridGap: '10',
                // gridTemplateRows: 'repeat(1, 1fr)',
                gridAutoRows: '1fr'
              }}
            >
              {cards.map(d => (
                <div style={{ padding: 10 }}>
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
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPage;
