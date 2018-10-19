import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';

import { GlobalThemeConsumer, stylesheet } from 'Src/styles/GlobalThemeContext';

import usrPlaceholderImg from './user-placeholder.png';

import CardMarker from 'Cards/CardMarker';
import { FieldSet } from 'Components/utils/StyledComps';

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};

const SkillBar = ({ data, tagColorScale }) => {
  const scale = scaleLinear()
    .domain(extent(data, d => d.count))
    // TODO
    .range([50, 100]);

  // console.log('scale', scale.domain());

  return (
    <div style={{ display: 'flex' }}>
      {data.map(d => (
        <div
          style={{
            width: `${scale(d.level)}%`,
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

const AuthorPreview = ({
  photoURL,
  className,
  style,
  username,
  name,
  email,
  thumbnail
}) => (
  <div
    style={{
      boxShadow: '1px 1px grey',
      background: 'whitesmoke',
      ...style
    }}
  >
      <img
        style={{
          width: '100%',
          height: '100%'
          // maxHeight: 150
        }}
        src={thumbnail || usrPlaceholderImg}
        alt="alt"
      />
  </div>
);

// Author.defaultProps = {
//   // TODO: check
//   placeholderImgUrl:
//     'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png',
//   // profile: {
//   name: '',
//   skills: [
//     { key: 'arts', level: 22 },
//     { key: 'music', level: 14 },
//     { key: 'sports', level: 10 }
//   ],
//   interests: [{ key: 'movies' }, { key: 'football' }, { key: 'xbox' }],
//   activity: { collectedCards: 20, createdCards: 13 },
//   // },
//   style: {},
//   extended: false
// };

const Profile = ({ data }) => (
  <div className="media mt-3">
    <img
      className="d-flex mr-3"
      width={64}
      height={64}
      src={profileSrc()}
      alt="alt"
    />
    <div>
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

export default AuthorPreview;
