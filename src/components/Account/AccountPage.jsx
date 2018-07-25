import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';
import { css } from 'aphrodite/no-important';

import { db } from 'Firebase';
import { Modal, UnstyledModalBody } from 'Utils/Modal';

// import { skillTypes } from '../../dummyData';
import CardMarker from 'Cards/CardMarker';
import { FieldSet } from 'Components/utils/StyledComps';
import setify from 'Utils/setify';

import { GlobalThemeConsumer, stylesheet } from 'Src/styles/GlobalThemeContext';

import CardStack from 'Components/MapView/CardStack';

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};

const SkillBar = ({ sets, tagColorScale, acc = d => d.values.length }) => {
  console.log('sets', sets);
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

SkillBar.propTypes = { data: PropTypes.array, tagColorScale: PropTypes.func };

SkillBar.defaultProps = { data: [], tagColorScale: () => 'purple' };

// TODO: fix it later
// const CardStack = ({ number }) => (
//   // const scale = d3
//   //   .scaleLinear()
//   //   .domain([0])
//   //   .range([30, 100]);
//
//   <div style={{ display: 'flex' }}>
//     {range(0, number).map(() => (
//       <div style={{ width: `${2}%` }}>
//         <div style={{ width: 25, height: 30, opacity: 0.9 }}>
//           <CardMarker />
//         </div>
//       </div>
//     ))}
//     {number === 0 && <div>No Cards!</div>}
//   </div>
// );
//
// CardStack.propTypes = {
//   number: PropTypes.number
// };

CardStack.defaultProps = { number: 0 };

const noBorderStyle = { border: null };
const legendStyle = { fontSize: '16px' };

const UserInfoModal = ({ ...props }) => (
  <Modal {...props}>
    <UnstyledModalBody footer={<button>close</button>}>
      USER INFO
    </UnstyledModalBody>
  </Modal>
);

class UserDetailedInfo extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    stylesheet
  };

  render() {
    const {
      onClose,
      color,
      style,
      tagColorScale,
      name,
      skills,
      activity,
      interests,
      stylesheet,
      placeholderImgUrl,
      numCollectedCards,
      numCreatedCards,
      photoURL,
      username,
      email,
      createdCards,
      submittedCards,
      selectedCardId,
      extendedCardId,
      extendCard,
      selectCard,
      userInfoExtended,
      extendUserInfo
    } = this.props;
    return (
      <div className="content-block">
        <UserInfoModal
          title="User Info"
          visible={userInfoExtended}
          onClose={() => extendUserInfo()}
        />
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
                  <SkillBar
                    sets={interests}
                    acc={d => d.count}
                    tagColorScale={tagColorScale}
                  />
                </div>
              </div>
              <div>
                <button onClick={() => extendUserInfo()}>Edit</button>
              </div>
            </div>
          </section>
          <section className="mb-1">
            <h4>Skills</h4>
            <SkillBar sets={skills} tagColorScale={tagColorScale} />
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
            <h4>Submitted Cards ({submittedCards.length})</h4>
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

UserDetailedInfo.defaultProps = {
  stylesheet
};

// <div className="mb-1">
//         <span style={{ fontWeight: 'bold' }}>name: </span>
//         {name}
//       </div>
const BasicUserInfo = ({ photoURL, style, username, name, email }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: '100%',
      ...style
    }}
  >
    <div style={{ display: 'flex' }}>
      <div style={{ border: 'solid 1px grey', width: '50%', height: '100%' }}>
        <img width="100%" height="100%" src={photoURL} alt="alt" />
      </div>
      <div className="ml-3">
        <div className="mb-1">
          <span style={{ fontWeight: 'bold' }}>username: </span>
          {username}
        </div>
        <div className="mb-1">
          <span style={{ fontWeight: 'bold' }}>email: </span> {email}
        </div>
      </div>
    </div>
    <div>
      <button>Edit</button>
    </div>
  </div>
);

class User extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = {
    ...this.props,
    submittedCards: [],
    createdCards: [],
    numCollectedCards: 0,
    numCreatedCards: 0
  };

  componentDidMount() {
    const {
      authUser: { uid },
      getUserInfo
    } = this.props;

    getUserInfo(uid);
  }

  render() {
    return <UserDetailedInfo {...this.props} />;
  }
}

User.defaultProps = {
  // TODO: check
  placeholderImgUrl:
    'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png',
  // profile: {
  skills: [],
  interests: [],
  // },
  style: {},
  extended: false
};

const Profile = ({ data }) => (
  <div className="media mt-3">
    <img
      className="d-flex mr-3"
      width={64}
      height={64}
      src={profileSrc()}
      alt="alt"
    />
    <div className="media-body">
      <div>{data.comment}</div>
      <div>
        <small className="font-italic">- {data.name}</small>
      </div>
    </div>
  </div>
);

Profile.propTypes = {
  data: PropTypes.object.isRequired
};
Profile.defaultProps = {
  data: {}
};

// TODO; rempve
Profile.defaultProps = { name: 'jan', comment: 'yeah' };

export default User;
