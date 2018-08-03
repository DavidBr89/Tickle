import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';
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
    {sets.map(d => (
      <div
        className="m-1"
        style={{
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: tagColorScale(d.key)
        }}
      >
        <span className="p-3 ">{d.key}</span>
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
    return (
      <section className="mb-3" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
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
    asyncSubmitChallenge
  } = props;

  const makeEditable = d => {
    d.edit = true;
    return d;
  };

  const {
    createdCards,
    submittedCards,
    startedCards,
    collectedCards
  } = authUser;
  const cards = [
    ...createdCards.map(makeEditable),
    ...submittedCards,
    ...startedCards,
    ...collectedCards
  ];
  const selected =
    extendedCardId !== null &&
    selectedCardId !== null &&
    extendedCardId === selectedCardId;

  const selectedCard = selected ? cards.find(c => c.id === selectedCardId) : {};
  const { id, uid } = selectedCard;

  return (
    <BareModal key={selectedCard ? selectedCard.id : null} visible={selected}>
      {selected && (
        <Card
          {...selectedCard}
          width={width}
          height={height}
          onClick={onClick}
          onClose={onClose}
          edit={source === 'created'}
          onDelete={() => asyncRemoveCard(id)}
          selected={selected === id}
          onSubmitChallenge={challengeSubmission => {
            asyncSubmitChallenge({ playerId: uid, ...challengeSubmission });
          }}
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
      <StyledCardStack
        cards={cards}
        selected={selected}
        onClick={onClick}
        {...props}
      />
    </div>
  </ExpSection>
);
export default class AccountPage extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
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
      photoURL
    } = authUser;
    const onCardClick = (d, source) => {
      if (d.id !== selectedCardId) {
        return selectCard(d.id);
      }
      return extendCard({ id: d.id, source });
    };

    const selectedIdCreated = createdCards.find(c => c.id === selectedCardId)
      ? selectedCardId
      : null;

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
      {
        id: 'created',
        cards: createdCards,
        selected: selectedIdCreated,
        title: `Created Cards (${createdCards.length})`
      },
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
      <div
        className="content-block"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        ref={c => (this.cont = c)}
      >
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
          <div>
            <section className="mb-3">
              <h3>Personal</h3>
              <div
                className="ml-2 mb-3"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  ...style
                }}
              >
                <div
                  className="mb-2 mr-3"
                  style={{
                    border: 'solid 1px grey',
                    height: '100%',
                    width: '100%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                    src={photoURL}
                    alt="alt"
                  />
                </div>
                <div>
                  <div className="mb-1">
                    <h5>Username</h5>
                    {username}
                  </div>
                  <div className="mb-1">
                    <h5>email: </h5>
                    {email}
                  </div>
                  <div>
                    <h5>Interests</h5>
                    <PreviewTags data={interests} colorScale={tagColorScale} />
                  </div>
                </div>
                <div
                  className="ml-2"
                  style={{ display: 'flex', alignItems: 'end' }}
                >
                  <button
                    className={css(defaultStylesheet.btn)}
                    onClick={() => extendUserInfo()}
                  >
                    <Icon.Edit />
                  </button>
                </div>
              </div>
            </section>
            <div onClick={() => this.scrollTo('myTags')}>
              <ScrollElement name="myTags">
                <ExpSection title={<h5>My Tags</h5>} className="mb-1">
                  <TagList sets={skills} tagColorScale={tagColorScale} />
                </ExpSection>
              </ScrollElement>
            </div>
            {cardData.map(c => (
              <div onClick={() => this.scrollTo(c.title)}>
                <ScrollElement name={c.title}>
                  <CardSection
                    {...c}
                    onClick={d => onCardClick(d, c.id)}
                    uid={uid}
                    edit
                  />
                </ScrollElement>
              </div>
            ))}
          </div>
        </ScrollView>
      </div>
    );
  }
}
