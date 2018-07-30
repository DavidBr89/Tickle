import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';
import { css } from 'aphrodite';
import * as Icon from 'react-feather';

import { db } from 'Firebase';
import { BareModal, Modal, ModalBody } from 'Utils/Modal';
import PhotoUpload from 'Components/utils/PhotoUpload';
import { SignInForm } from 'Components/SignIn';
import { TagInput, PreviewTags, Tag } from 'Components/utils/Tag';

// import { skillTypes } from '../../dummyData';
import { Card } from 'Components/cards';
import ExtendableMarker from 'Components/utils/ExtendableMarker';
// import { FieldSet } from 'Components/utils/StyledComps';
// import setify from 'Utils/setify';

import {
  GlobalThemeConsumer,
  stylesheet as defaultStylesheet
} from 'Src/styles/GlobalThemeContext';

import CardStack from 'Components/MapView/CardStack';
import { userFields, compareUserFields } from 'Constants/userFields';

const TagList = ({ sets, tagColorScale, acc = d => d.values.length }) => {
  const scale = scaleLinear()
    .domain(extent(sets, acc))
    // TODO
    .range([50, 100]);

  // console.log('scale', scale.domain());

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
};

TagList.propTypes = { data: PropTypes.array, tagColorScale: PropTypes.func };

TagList.defaultProps = { data: [], tagColorScale: () => 'purple' };

CardStack.defaultProps = { number: 0 };

class EditUserPhoto extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { url: this.props.url };

  render() {
    const { onChange, path } = this.props;
    const { url } = this.state;
    return (
      <PhotoUpload
        {...this.props}
        imgUrl={url}
        onChange={({ url, file }) => {
          db.addImgToStorage({ file, path }).then(url => onChange(url));
          this.setState({ url });
          onChange(url);
        }}
      />
    );
  }
}

class UserInfoModalBody extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    errorMsg: null
  };

  state = {
    cachedUser: this.props.authUser,
    userUpdated: false,
    authenticated: false
  };

  conditionalSubmit = () => {
    const { userUpdated } = this.state;
    const { authUser, onSubmit, onClose } = this.props;

    if (userUpdated) {
      onSubmit();
      this.setState({ userUpdated: false });
    }
    // onClose();
  };

  componentDidUpdate(prevProps, prevState) {
    const { authUser: oldUser } = prevProps;
    const { authUser } = this.props;

    const { passwordOne, passwordTwo } = authUser;
    const { passwordOne: oldPwOne, passwordTwo: oldPwTwo } = oldUser;
    if (
      !compareUserFields(oldUser, authUser) ||
      (passwordOne !== oldPwOne || passwordTwo !== oldPwTwo)
    ) {
      this.setState({ userUpdated: true });
    }
    if (prevState.userUpdated && compareUserFields(oldUser, authUser))
      this.setState({ userUpdated: false });
  }

  renderUpdateUserModal = () => {
    const { onChange, tagColorScale, title } = this.props;
    const {
      onSubmit,
      username,
      name,
      email,
      photoURL,
      interests,
      uid
    } = this.props.authUser;

    return (
      <React.Fragment>
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="fullname">User Photo:</label>
            <div
              style={{
                display: 'flex',
                width: '100%'
                // justifyContent: 'center'
              }}
            >
              <EditUserPhoto
                style={{ width: 200 }}
                path={`usr/${uid}`}
                url={photoURL}
                onChange={photoURL => onChange({ photoURL })}
              />

              <div className="ml-3">
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <div>
                    <input
                      className="form-control"
                      style={{ width: 'unset' }}
                      value={username || ''}
                      onChange={e => onChange({ username: e.target.value })}
                      type="text"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="interests">Interests:</label>
                  <TagInput
                    className="form-group"
                    tags={interests}
                    colorScale={tagColorScale}
                    uiColor="grey"
                    onChange={newInterests =>
                      onChange({ interests: newInterests })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div>
              <input
                className="form-control"
                value={email || ''}
                onChange={e => onChange({ email: e.target.value })}
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <div>
              <input
                className="form-control"
                value={name || ''}
                onChange={e => onChange({ name: e.target.value })}
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pwd">Change Password:</label>
            <div>
              <input
                className="form-control"
                onChange={e => onChange({ passwordOne: e.target.value })}
                type="password"
                placeholder="Password"
              />
            </div>
            <input
              className="form-control"
              onChange={e => onChange({ passwordTwo: e.target.value })}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { onChange, tagColorScale, title, errorMsg, onClose } = this.props;
    const { authenticated, cachedUser, userUpdated } = this.state;
    const {
      onSubmit,
      username,
      name,
      email,
      photoURL,
      interests,
      uid,
      passwordOne,
      passwordTwo
    } = this.props.authUser;

    return (
      <ModalBody
        onClose={() => {
          onChange(cachedUser);
          onClose();
        }}
        title={title}
        footer={
          authenticated && (
            <React.Fragment>
              <div className="mr-1">{errorMsg}</div>
              <button
                className={css(defaultStylesheet.btn)}
                onClick={this.conditionalSubmit}
                disabled={!userUpdated}
              >
                Update
              </button>
            </React.Fragment>
          )
        }
      >
        {!authenticated ? (
          <div>
            <p>Please sign in again!</p>
            <SignInForm
              onAuthenticate={() => this.setState({ authenticated: true })}
            />
          </div>
        ) : (
          this.renderUpdateUserModal()
        )}
      </ModalBody>
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
    onClose
  } = props;

  const { createdCards, submittedCards } = authUser;
  const cards = [...createdCards, ...submittedCards];
  const selected =
    extendedCardId !== null &&
    selectedCardId !== null &&
    extendedCardId === selectedCardId;

  const selectedCard = selected ? cards.find(c => c.id === selectedCardId) : {};

  return (
    <BareModal key={selectedCard ? selectedCard.id : null} visible={selected}
    >
      {selected && (
        <Card
          {...selectedCard}
          width={width}
          height={height}
          onClick={onClick}
          onClose={onClose}
        />
      )}
    </BareModal>
  );
};

export default class UserDetailedInfo extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
    this.props.screenResize({
      width: this.cont.offsetWidth,
      height: this.cont.offsetHeight
    });
  }
  // static defaultProps = {
  //   stylesheet
  // };

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
      name,
      username,
      email,
      photoURL
    } = authUser;
    const onCardClick = d =>
      d.id !== selectedCardId ? selectCard(d.id) : extendCard(d.id);

    const selectedIdCreated = createdCards.find(c => c.id === selectedCardId)
      ? selectedCardId
      : null;

    const selectedIdSubmitted = submittedCards.find(
      c => c.id === selectedCardId
    )
      ? selectedCardId
      : null;

    return (
      <div
        className="content-block"
        style={{ position: 'relative' }}
        ref={c => (this.cont = c)}
      >
        <ExtendableCard {...this.props} onClose={() => extendCard(null)} />

        <Modal visible={userInfoExtended}>
          <UserInfoModalBody
            title="Update User Info"
            onClose={extendUserInfo}
            tagColorScale={tagColorScale}
            errorMsg={errorUpdateUserMsg}
            onSubmit={() => {
              submitUserInfoToDB(authUser);
            }}
            onChange={usr =>
              setAuthUserInfo({
                uid,
                interests,
                username,
                name,
                email,
                photoURL,
                ...usr
              })
            }
            authUser={authUser}
            {...this.props}
          />
        </Modal>
        <div
          style={{
            display: 'flex',
            position: 'relative',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            ...style
          }}
        >
          <section className="mb-3">
            <h4>Personal</h4>
            <div
              className="ml-2 mb-3"
              style={{
                display: 'flex',
                width: '100%',
                // justifyContent: 'center',
                // alignItems: 'center',
                ...style
              }}
            >
              <div
                style={{
                  border: 'solid 1px grey',
                  height: '100%',
                  width: '100%',
                  maxHeight: 200,
                  maxWidth: 200
                }}
              >
                <img width="200" height="100%" src={photoURL} alt="alt" />
              </div>
              <div className="ml-3">
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
                  <PreviewTags data={interests} tagColorScale={tagColorScale} />
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
          <section className="mb-1">
            <h4>My Tags</h4>
            <TagList sets={skills} tagColorScale={tagColorScale} />
          </section>
          <section>
            <h4>Created Cards ({createdCards.length})</h4>
            <div style={{ height: 200 }}>
              <CardStack
                className=""
                cards={createdCards}
                selectedCardId={selectedIdCreated}
                tagColorScale={tagColorScale}
                width={100}
                height={100}
                slotSize={100 / 5}
                cardHeight={180}
                unit="%"
                onClick={onCardClick}
              />
            </div>
          </section>
          <section className="mb-3">
            <h4>Submitted Challenges ({submittedCards.length})</h4>
            <div style={{ height: 200 }}>
              <CardStack
                className=""
                cards={submittedCards}
                selectedCardId={selectedIdSubmitted}
                tagColorScale={tagColorScale}
                width={100}
                height={100}
                slotSize={100 / 5}
                onClick={d => d}
                cardHeight={180}
                unit="%"
                onClick={onCardClick}
              />
            </div>
          </section>
          <section className="mb-3">
            <h4>Collected Cards (TODO)</h4>
            <div style={{ height: 200 }}>TODO</div>
          </section>
        </div>
      </div>
    );
  }
}

// <div className="mb-1">
//         <span style={{ fontWeight: 'bold' }}>name: </span>
//         {name}
//       </div>
// const BasicUserInfo = ({ photoURL, style, username, name, email }) => (
//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'center',
//       // alignItems: 'center',
//       width: '100%',
//       height: '100%',
//       ...style
//     }}
//   >
//     <div style={{ display: 'flex' }}>
//       <div style={{ border: 'solid 1px grey', width: '50%', height: '100%' }}>
//         <img width="100%" height="100%" src={photoURL} alt="alt" />
//       </div>
//       <div className="ml-3">
//         <div className="mb-1">
//           <span style={{ fontWeight: 'bold' }}>username: </span>
//           {username}
//         </div>
//         <div className="mb-1">
//           <span style={{ fontWeight: 'bold' }}>email: </span> {email}
//         </div>
//       </div>
//     </div>
//     <div>
//       <button>Edit</button>
//     </div>
//   </div>
// );
