import React from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';
import * as Icon from 'react-feather';

import { db } from 'Firebase';
import { BareModal, Modal, ModalBody } from 'Utils/Modal';
import { SignInModalBody } from 'Components/SignIn';
import { TagInput, PreviewTags, Tag } from 'Components/utils/Tag';

// import { skillTypes } from '../../dummyData';
import { Card } from 'Components/cards';
import ExtendableMarker from 'Components/utils/ExtendableMarker';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/CardStack';

// import { FieldSet } from 'Components/utils/StyledComps';
// import setify from 'Utils/setify';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';

import {
  GlobalThemeConsumer,
  stylesheet as defaultStylesheet
} from 'Src/styles/GlobalThemeContext';

import EditUserInfo from './EditUserInfo';

const TagList = ({ sets, tagColorScale, acc = d => d.values.length }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: 400
      // maxHeight: 200,
      // overflow: 'hidden'
    }}
  >
    {sets.map(key => (
      <div
        className="m-1"
        style={{
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: tagColorScale(key)
        }}
      >
        <span className="p-2">{key}</span>
      </div>
    ))}
  </div>
);

TagList.propTypes = { data: PropTypes.array, tagColorScale: PropTypes.func };

TagList.defaultProps = { data: [], tagColorScale: () => 'purple' };

class ExpSection extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { exp: false };
  render() {
    const { children, className, title } = this.props;
    const { exp } = this.state;
    console.log('this.props', this.props);
    return (
      <section style={{ width: '100%' }}>
        <div
          className="mb-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
            // width: '100%'
          }}
        >
          <div>{title}</div>
          <div>
            <button
              className={css(defaultStylesheet.btn)}
              onClick={() =>
                this.setState(({ exp: oldExp }) => ({ exp: !oldExp }))
              }
            >
              <Icon.Maximize2 />
            </button>
          </div>
        </div>
        {exp && children}
      </section>
    );
  }
}

/*
      <div className="form-group">
        <label htmlFor="pwd">Email:</label>
        <div>
          <input
            value={email}
            className="form-control"
            onChange={
              e => e
              // this.setState(byPropKey('email', event.target.value))
            }
            type="text"
            placeholder="Email Address"
          />
        </div>
      </div>

*/

const ExtendableCard = props => {
  const {
    width,
    height,
    authUser,
    selectedCardId,
    onClick,
    extendedCardId,
    onClose,
    source,
    asyncRemoveCard,
    asyncSubmitChallenge,
    smallScreen,
    iOS
  } = props;

  const { submittedCards, uid, startedCards, collectedCards } = authUser;
  const cards = [...submittedCards, ...startedCards, ...collectedCards];
  const selected =
    extendedCardId !== null &&
    selectedCardId !== null &&
    extendedCardId === selectedCardId;

  const selectedCard = selected ? cards.find(c => c.id === selectedCardId) : {};
  const { id } = selectedCard;

  return (
    <BareModal key={selectedCard ? selectedCard.id : null} visible={selected}>
      {selected && (
        <Card
          {...selectedCard}
          edit={false}
          bookmarkable
          removable
          iOS={iOS}
          width={width}
          height={height}
          onClick={onClick}
          onClose={onClose}
          selected={selected === id}
          onSubmitChallenge={challengeSubmission => {
            asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
          }}
          onRemoveChallengeSubmission={d => console.log(d)}
        />
      )}
    </BareModal>
  );
};

const StyledCardStack = ({ cards, selected, onClick, edit, uid, ...props }) => (
  <Stack
    data={cards}
    duration={600}
    centered={selected !== null}
    selectedIndex={cards.findIndex(c => c.id === selected)}
    width={100}
    height={100}
    unit="%"
    slotSize={100 / 4}
    style={{
      zIndex: 1000
    }}
    {...props}
  >
    {d => (
      <PreviewCard
        {...d}
        onClick={() => onClick(d)}
        key={d.id}
        style={{
          transition: `transform 1s`,
          // TODO: change later
          height: 140,
          transform: selected === d.id && 'scale(1.2)',
          // zIndex: selectedCardId === d.id && 2000,
          opacity: d.template && 0.8
        }}
      />
    )}
  </Stack>
);

const CardSection = ({ cards, selected, title, onClick, ...props }) => (
  <ExpSection title={<h5>{title}</h5>}>
    <div style={{ height: 200 }} className="mt-3">
      {cards.length > 0 ? (
        <StyledCardStack
          cards={cards}
          selected={selected}
          onClick={onClick}
          {...props}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <h3>'No Cards'</h3>
        </div>
      )}
    </div>
  </ExpSection>
);
export default class AccountPage extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
    const { fetchCards } = this.props;
    fetchCards();
    // TODO
    // this.props.screenResize({
    //   width: this.cont.offsetWidth,
    //   height: this.cont.offsetHeight
    // });
  }
  // static defaultProps = {
  //   stylesheet
  // };

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  render() {
    const {
      onClose,
      color,
      style,
      tagColorScale,
      // stylesheet,
      authUser,
      selectedCardId,
      extendedCardId,
      extendCard,
      selectCard,
      userInfoExtended,
      extendUserInfo,
      submitUserInfoToDB,
      setAuthUserInfo,
      errorUpdateUserMsg
    } = this.props;

    const {
      skills,
      interests,
      uid,
      createdCards,
      submittedCards,
      collectedCards,
      startedCards,
      name,
      username,
      email,
      photoURL,
      userTags
    } = authUser;
    const onCardClick = (d, source) => {
      if (d.id !== selectedCardId) {
        return selectCard(d.id);
      }
      return extendCard({ id: d.id, source });
    };

    // const selectedIdCreated = createdCards.find(c => c.id === selectedCardId)
    //   ? selectedCardId
    //   : null;

    const selectedIdSubmitted = submittedCards.find(
      c => c.id === selectedCardId
    )
      ? selectedCardId
      : null;

    const selectedIdCollected = collectedCards.find(
      c => c.id === selectedCardId
    )
      ? selectedCardId
      : null;

    const selectedIdStarted = startedCards.find(c => c.id === selectedCardId)
      ? selectedCardId
      : null;

    // const Title = ({ children }) => <h4 style={{ margin: 0 }}>{children}</h4>;

    const cardData = [
      // {
      //   id: 'created',
      //   cards: createdCards,
      //   selected: selectedIdCreated,
      //   title: `Created Cards (${createdCards.length})`
      // },
      {
        id: 'started',
        cards: startedCards,
        selected: selectedIdStarted,
        title: `Started Cards (${startedCards.length})`
      },
      {
        id: 'submitted',
        cards: submittedCards,
        selected: selectedIdSubmitted,
        title: `Submitted Cards (${submittedCards.length})`
      },
      {
        id: 'collected',
        cards: collectedCards,
        selected: selectedIdCollected,
        title: `Collected Cards (${collectedCards.length})`
      }
    ];

    return (
      <React.Fragment>
        <ExtendableCard
          {...this.props}
          onClose={() => extendCard({ id: null, source: null })}
        />

        <Modal visible={userInfoExtended}>
          <EditUserInfo
            title="Update User Info"
            onClose={extendUserInfo}
            tagColorScale={tagColorScale}
            errorMsg={errorUpdateUserMsg}
            onSubmit={usr => {
              setAuthUserInfo(usr);
              submitUserInfoToDB(usr);
            }}
            authUser={authUser}
            {...this.props}
          />
        </Modal>
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              overflowY: 'scroll'
            }}
            ref={c => (this.cont = c)}
          >
            <h3 className="mt-3">Account</h3>
            <div
              style={{
                position: 'relative',
                height: '65vw',
                maxHeight: 280,
                width: 'auto'
              }}
              className={`${css(defaultStylesheet.imgBorder)} mb-3`}
            >
              <div
                style={{
                  position: 'absolute',
                  // left: 0,
                  // top: 0,
                  height: '60vw',
                  maxHeight: 200,
                  width: 'auto',
                  padding: '20%'
                }}
              />
              <img
                className="mb-2"
                src={photoURL}
                style={{
                  height: '60vw',
                  width: 'auto',
                  // maxWidth: 200,
                  maxHeight: 200
                  // borderRadius: '50%'
                }}
                alt="alt"
              />
            </div>
            <div className="mb-3" style={{ width: '90%' }}>
              <div
                className="mb-1"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <h5 className="mr-1">Username:</h5>
                <div>{username}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                className="mb-1"
              >
                <h5 className="mr-1">email: </h5>
                <div>{email}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5>Interests</h5>
                <PreviewTags data={interests} colorScale={tagColorScale} />
              </div>
              <button
                style={{ width: '100%' }}
                className={css(defaultStylesheet.btn)}
                onClick={() => extendUserInfo()}
              >
                <Icon.Edit />
              </button>
            </div>
            <div style={{ width: '90%' }}>
              <ScrollElement name="myTags">
                <ExpSection title={<h5>My Tags</h5>} className="mb-1">
                  {userTags.length > 0 ? (
                    <TagList sets={userTags} tagColorScale={tagColorScale} />
                  ) : (
                    'No Tags'
                  )}
                </ExpSection>
              </ScrollElement>
              {cardData.map(c => (
                <div onClick={() => this.scrollTo(c.title)}>
                  <ScrollElement name={c.title}>
                    <CardSection
                      {...c}
                      onClick={d => onCardClick(d, c.id)}
                      uid={uid}
                      disabled={c.cards.length === 0}
                      edit
                    />
                  </ScrollElement>
                </div>
              ))}
            </div>
          </div>
        </ScrollView>
      </React.Fragment>
    );
  }
}
