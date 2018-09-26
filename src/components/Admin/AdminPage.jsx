import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Cards/PreviewCard';
import CardStack from 'Utils/CardStack/CardStack';

import { BareModal, Modal, ModalBody } from 'Utils/Modal';

import CardReview from 'Components/cards/ConnectedReviewCard';

import usrPlaceholderImg from './user-placeholder.png';

import {
  CHALLENGE_STARTED,
  CHALLENGE_SUCCEEDED,
  CHALLENGE_SUBMITTED,
  CARD_CREATED
} from 'Constants/cardFields';

// import { MediaList } from 'Utils/MediaUpload';

// const Author = ({ username }) => <div>{username}</div>;

// import Author from './Author';

const Bar = ({ formula, num }) => (
  <div
    className="pl-1"
    style={{
      width: `${formula(num)}%`,
      // height: 20,
      background: 'yellow'
    }}
  >
    {num}
  </div>
);

class AuthorPreview extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onFilterChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  onCheckBoxChange = filterType => e => {
    const { onFilterChange, cardFilters } = this.props;
    if (e.target.checked) {
      onFilterChange([filterType, ...cardFilters]);
    }
    if (cardFilters.includes(filterType))
      onFilterChange(cardFilters.filter(c => c !== filterType));
  };

  render() {
    const tickBoxStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    };
    const {
      photoURL,
      className,
      style,
      username,
      name,
      email,
      thumbnail,
      cardFilters,
      numStartedCards,
      numSubmittedCards,
      numSucceededCards,
      visible,
      numCreatedCards
    } = this.props;
    const totalCardsLen = numCreatedCards;
    // numStartedCards + numSubmittedCards + numSucceededCards;

    const barFormula = n =>
      totalCardsLen !== 0 ? (n / totalCardsLen) * 100 : 0;

    const PercentBar = props => <Bar formula={barFormula} {...props} />;

    if (!visible)
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div>Please Select User</div>
        </div>
      );
    return (
      <div className={className}>
        <div
          className="flexCol"
          style={{
            height: '100%',
            // boxShadow: '1px 1px grey',
            // background: 'whitesmoke',
            ...style
          }}
        >
          <h3>Selected User</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: 'auto',
              flex: '1 1 auto'
            }}
          >
            <img
              style={{
                width: 'auto',
                height: 'auto'
                // maxHeight: 150
              }}
              src={thumbnail || usrPlaceholderImg}
              alt="alt"
            />
          </div>
          <div>
            <div style={tickBoxStyle}>
              <div>Started Cards</div>
              <input
                type="checkbox"
                checked={cardFilters.includes(CHALLENGE_STARTED)}
                name={CHALLENGE_STARTED}
                value={CHALLENGE_STARTED}
                onChange={this.onCheckBoxChange(CHALLENGE_STARTED)}
              />
            </div>
            <PercentBar num={numStartedCards} />
          </div>
          <div>
            <div style={tickBoxStyle}>
              <div>Submitted Cards</div>
              <input
                type="checkbox"
                checked={cardFilters.includes(CHALLENGE_SUBMITTED)}
                name={CHALLENGE_SUBMITTED}
                value={CHALLENGE_SUBMITTED}
                onChange={this.onCheckBoxChange(CHALLENGE_SUBMITTED)}
              />
            </div>

            <PercentBar num={numSubmittedCards} />
          </div>
          <div>
            <div style={tickBoxStyle}>
              <div>Collected Cards</div>
              <input
                type="checkbox"
                name={CHALLENGE_SUCCEEDED}
                checked={cardFilters.includes(CHALLENGE_SUCCEEDED)}
                value={CHALLENGE_SUCCEEDED}
                onChange={this.onCheckBoxChange(CHALLENGE_SUCCEEDED)}
              />
            </div>
            <PercentBar num={numSucceededCards} />
          </div>
        </div>
      </div>
    );
  }
}

const Grid = ({ data, children }) => {
  if (data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <div style={{ fontSize: 'x-large' }}>No Cards</div>
      </div>
    );
  }
  return (
    <div
      style={{
        flex: '1 0',
        overflowY: 'scroll',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 20%)',
        gridGap: '10',
        // gridTemplateRows: 'repeat(1, 1fr)',
        gridAutoRows: 150 // '1fr'
      }}
    >
      {data.map(children)}
    </div>
  );
};

class UserList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { sortBy: 'abc' };

  render() {
    const { children, style, data } = this.props;
    const { sortBy } = this.state;
    const alphabetical = (a, b) => {
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    };

    const cardNum = (a, b) => {
      const aSub = a.challengeSubmissions;
      const bSub = b.challengeSubmissions;

      if (aSub.length < bSub.length) return 1;
      if (aSub.length > bSub.length) return -1;
      return 0;
    };

    const sortedData = data.sort(sortBy === 'abc' ? alphabetical : cardNum);

    return (
      <div className="flexCol" style={{ ...style }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            Sort By
            <div style={{ display: 'flex' }}>
              <input
                checked={sortBy === 'abc'}
                type="radio"
                name="contact"
                value="abc"
                onClick={() =>
                  this.setState({
                    sortBy: 'abc'
                  })
                }
              />
              <label htmlFor="contactChoice1">ABC</label>

              <input
                type="radio"
                checked={sortBy === 'cards'}
                value="cards"
                onClick={() =>
                  this.setState({
                    sortBy: 'cards'
                  })
                }
              />
              <label htmlFor="contactChoice2">cards</label>
            </div>
          </div>
        </div>
        <div
          style={{
            overflowY: 'scroll'
            // height: '100%'
          }}
        >
          {sortedData.map(children)}
        </div>
      </div>
    );
  }
}

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
    // fetchUsers();

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
      selectedCard,
      selectedUser,
      changeCardFilter,
      cardFilters,
      startedCards,
      submittedCards,
      succeededCards,
      onFlip,
      flipped,
      createdCards
    } = this.props;
    const { users } = this.props;
    // const selectedCard = cards.find(c => c.id === selectedCardId) || {};

    // const selectedUserIndex = users.findIndex(c => c.uid === selectedUserId);

    return (
      <div className="content-block flexCol" style={{ height: '100%' }}>
        <Modal
          visible={extendedId !== null}
          uiColor="grey"
          background="transparent"
        >
          {extendedId !== null && (
            <CardReview
              {...selectedCard}
              feedback={selectedCard.feedback}
              challengeSubmission={selectedCard.challengeSubmission}
              onClose={() => {
                extendSelection(null);
              }}
            />)
          }
        </Modal>
        <h1>Admin {authUser.username}</h1>
        <p>Restricted area! Only users with the admin rule are authorized.</p>
        <div
          className="flexCol"
          style={{
            flex: 1,
            display: 'grid',
            overflow: 'hidden',
            gridTemplateColumns: '50% 50%',
            gridTemplateRows: '40% 60%'
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div className="flexCol" style={{ width: '100%', height: '100%' }}>
              <h3>Users</h3>
              <UserList data={users} key={users.length} style={{ flex: 1 }}>
                {d => (
                  <div
                    className="p-1"
                    onClick={() => selectUser(d.uid)}
                    style={{
                      borderBottom: '1px lightgrey solid',
                      cursor: 'pointer',
                      background: selectedUserId === d.uid ? 'grey' : 'none'
                    }}
                  >
                    <div style={{ color: selectedUserId === d.uid && 'white' }}>
                      {d.username}
                    </div>
                  </div>
                )}
              </UserList>
            </div>
          </div>
          <AuthorPreview
            visible={selectedUserId !== null}
            {...selectedUser}
            cardFilters={cardFilters}
            className="pl-3"
            onFilterChange={changeCardFilter}
            numStartedCards={startedCards.length}
            numSubmittedCards={submittedCards.length}
            numSucceededCards={succeededCards.length}
            cards={cards}
          />
          <div
            className="flexCol"
            style={{
              gridColumn: 'span 2'
            }}
          >
            <h3>Cards</h3>
            <Grid data={cards}>
              {d => (
                <div
                  style={{ padding: 15, overflow: 'hidden', cursor: 'pointer' }}
                >
                  <PreviewCard
                    {...d}
                    onClick={() => extendSelection(d.id)}
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
              )}
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPage;
