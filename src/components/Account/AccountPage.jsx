import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';
import { css } from 'aphrodite';
import * as Icon from 'react-feather';

import { db } from 'Firebase';
import { Modal, ModalBody } from 'Utils/Modal';
import PhotoUpload from 'Components/utils/PhotoUpload';
import { TagInput, PreviewTags } from 'Components/utils/Tag';

// import { skillTypes } from '../../dummyData';
import CardMarker from 'Cards/CardMarker';
import { FieldSet } from 'Components/utils/StyledComps';
import setify from 'Utils/setify';

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
            // width: `${scale(acc(d))}%`,
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

  state = { userUpdated: false };

  condSubmit = () => {
    const { userUpdated } = this.state;
    const { authUser, onSubmit, onClose } = this.props;

    if (userUpdated) {
      onSubmit();
      this.setState({ userUpdated: false });
    }
    onClose();
  };

  componentDidUpdate(prevProps, prevState) {
    const { authUser: oldUser } = prevProps;
    const { authUser } = this.props;

    if (!compareUserFields(oldUser, authUser)) {
      this.setState({ userUpdated: true });
    }
  }

  render() {
    const { onChange, tagColorScale} = this.props;
    const {
      onSubmit,
      title,
      username,
      name,
      email,
      photoURL,
      interests,
      uid,
    } = this.props.authUser;

    return (
      <ModalBody
        onClose={this.condSubmit}
        title={title}
        footer={
          <button
            className={css(defaultStylesheet.btn)}
            onClick={this.condSubmit}
          >
            close
          </button>
        }
      >
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="fullname">User Photo:</label>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <EditUserPhoto
                style={{ width: 200 }}
                path={`usr/${uid}`}
                url={photoURL}
                onChange={photoURL => onChange({ photoURL })}
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="fullname">Full name:</label>
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
            <label htmlFor="username">Username:</label>
            <div>
              <input
                className="form-control"
                value={username}
                onChange={e => onChange({ username: e.target.value })}
                type="text"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Interests:</label>
            <TagInput
              tags={interests}
              colorScale={tagColorScale}
              uiColor="grey"
              onChange={newInterests => onChange({ interests: newInterests })}
            />
          </div>
        </div>
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
export default class UserDetailedInfo extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

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
      setAuthUserInfo
    } = this.props;

    console.log('stylesheet', defaultStylesheet);

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
    return (
      <div className="content-block">
        <Modal visible={userInfoExtended}>
          <UserInfoModalBody
            title="User Info"
            onClose={extendUserInfo}
            tagColorScale={tagColorScale}
            onSubmit={() => {
              console.log('Submit');
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
            <h4>Skills</h4>
            <TagList sets={skills} tagColorScale={tagColorScale} />
          </section>
          <section>
            <h4>Created Cards ({createdCards.length})</h4>
            <div style={{ height: 200 }}>
              <CardStack
                className=""
                cards={createdCards}
                selectedCardId={null}
                tagColorScale={tagColorScale}
                width={100}
                height={100}
                slotSize={100 / 5}
                onClick={d => d}
                cardHeight={180}
                unit="%"
              />
            </div>
          </section>
          <section className="mb-3">
            <h4>Submitted Challenges ({submittedCards.length})</h4>
            <div style={{ height: 200 }}>
              <CardStack
                className=""
                cards={submittedCards}
                selectedCardId={null}
                tagColorScale={tagColorScale}
                width={100}
                height={100}
                slotSize={100 / 5}
                onClick={d => d}
                cardHeight={180}
                unit="%"
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
