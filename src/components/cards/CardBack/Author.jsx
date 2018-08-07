import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';
import { css } from 'aphrodite/no-important';

import { db } from 'Firebase';

// import { skillTypes } from '../../dummyData';
import CardMarker from '../CardMarker';
import { FieldSet } from 'Components/utils/StyledComps';
import setify from 'Utils/setify';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

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
    <div style={{ display: 'flex' }}>
      {sets.map(d => (
        <div
          style={{
            width: `${scale(acc(d))}%`,
            height: '30px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: tagColorScale(d.key)
          }}
        >
          <span>{d.key}</span>
        </div>
      ))}
    </div>
  );
};

SkillBar.propTypes = { data: PropTypes.array, tagColorScale: PropTypes.func };

SkillBar.defaultProps = { data: [], tagColorScale: () => 'purple' };

// TODO: fix it later
const CardStack = ({ number }) => (
  // const scale = d3
  //   .scaleLinear()
  //   .domain([0])
  //   .range([30, 100]);

  <div style={{ display: 'flex' }}>
    {range(0, number).map(() => (
      <div style={{ width: `${2}%` }}>
        <div style={{ width: 25, height: 30, opacity: 0.9 }}>
          <CardMarker />
        </div>
      </div>
    ))}
    {number === 0 && <div>No Cards!</div>}
  </div>
);

CardStack.propTypes = {
  number: PropTypes.number
};

CardStack.defaultProps = { number: 0 };

const noBorderStyle = { border: null };
const legendStyle = { fontSize: '16px' };

const ExtendedAuthor = ({
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
  ...authorPreviewProps
}) => (
  <div
    style={{
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
      // alignItems: 'center',
      flexDirection: 'column',
      ...style
    }}
  >
    <AuthorPreview {...authorPreviewProps} />

    <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
      Personal
    </div>
    <FieldSet
      legend="Interests:"
      className={css(stylesheet.shallowBg)}
      style={noBorderStyle}
      legendStyle={legendStyle}
    >
      <SkillBar
        sets={interests}
        acc={d => d.count}
        tagColorScale={tagColorScale}
      />
    </FieldSet>
    <FieldSet
      legend="skills:"
      style={noBorderStyle}
      className={css(stylesheet.shallowBg)}
      legendStyle={legendStyle}
    >
      <SkillBar sets={skills} tagColorScale={tagColorScale} />
    </FieldSet>
    <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
      Activity
    </div>
    <FieldSet
      legend="Collected Cards"
      className={css(stylesheet.shallowBg)}
      style={noBorderStyle}
      legendStyle={legendStyle}
    >
      <CardStack number={numCollectedCards} />
    </FieldSet>
    <FieldSet
      legend="Created Cards"
      className={css(stylesheet.shallowBg)}
      style={noBorderStyle}
      legendStyle={legendStyle}
    >
      <CardStack number={numCreatedCards} />
    </FieldSet>
  </div>
);

// <div className="mb-1">
//         <span style={{ fontWeight: 'bold' }}>name: </span>
//         {name}
//       </div>
const AuthorPreview = ({ photoURL, style, username, name, email }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      // alignItems: 'center',
      // height: '100%',
      ...style
    }}
  >
    <div style={{ display: 'flex' }}>
      <img
        width="30%"
        height="100%"
        src={photoURL}
        alt="alt"
        style={{ borderRadius: '100%' }}
      />
      <div className="ml-3">
        <div className="mb-1">
          <span style={{ fontWeight: 'bold' }}>username: </span>
          {username}
        </div>
      </div>
    </div>
  </div>
);

class Author extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = {
    ...this.props,

    collectedCards: [],
    createdCards: [],
    numCollectedCards: 0,
    numCreatedCards: 0
  };

  componentDidMount() {
    const { uid } = this.props;
    console.log('AUTHOR UID', uid);
    if (!uid) return;
    db.getDetailedUserInfo(uid).then(res => {
      const {
        interests: plainInterests,
        createdCards,
        collectedCards,
        ...userDetails
      } = res;

      const interests = plainInterests.map(key => ({ key, count: 10 }));
      const skills = setify([...createdCards, ...collectedCards]).slice(0, 5);

      const numCollectedCards = collectedCards.length;
      const numCreatedCards = createdCards.length;

      this.setState({
        ...userDetails,
        interests,
        skills,
        collectedCards,
        createdCards,
        numCollectedCards,
        numCreatedCards
      });
    });
  }

  render() {
    const { extended, stylesheet, uid } = this.props;

    return extended ? (
      <ExtendedAuthor {...this.state} stylesheet={stylesheet} key={uid} />
    ) : (
      <AuthorPreview {...this.state} stylesheet={stylesheet} key={uid} />
    );
  }
}

// const Author = ({ extended, ...restProps }) =>
//   extended ? (
//     <ExtendedAuthor {...restProps} key={restProps.uid} />
//   ) : (
//     <AuthorPreview {...restProps} key={restProps.uid} />
//   );

// Author.propTypes = {
//   //  profile: PropTypes.shape({
//   name: PropTypes.string,
//   skills: PropTypes.array(
//     PropTypes.shape({ name: PropTypes.string, level: PropTypes.number })
//   ),
//   activity: PropTypes.object(
//     PropTypes.shape({
//       collectedCards: PropTypes.number,
//       createdCards: PropTypes.number
//     })
//   ),
//   extended: PropTypes.bool
// };

Author.defaultProps = {
  // TODO: check
  placeholderImgUrl:
    'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png',
  // profile: {
  skills: [
    { key: 'arts', level: 22 },
    { key: 'music', level: 14 },
    { key: 'sports', level: 10 }
  ],
  interests: [{ key: 'movies' }, { key: 'football' }, { key: 'xbox' }],
  activity: { collectedCards: 20, createdCards: 13 },
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

export default Author;
