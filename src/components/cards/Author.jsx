import React from 'react';
import PropTypes from 'prop-types';

import { scaleLinear, extent, range, scaleOrdinal } from 'd3';

import cx from './Card.scss';
import colorClasses from '../utils/colorClasses';

import { skillTypes } from '../../dummyData';
import { CardMarker } from '../utils/map-layers/DivOverlay';
import { FieldSet } from './layout';

const profileSrc = () => {
  const gender = Math.random() < 0.5 ? 'men' : 'women';
  const i = Math.round(Math.random() * 100);
  return `https://randomuser.me/api/portraits/thumb/${gender}/${i}.jpg`;
};

const skillColorScale = scaleOrdinal()
  .domain(skillTypes)
  .range(colorClasses);

const SkillBar = ({ data }) => {
  const scale = scaleLinear()
    .domain(extent(data, d => d.level))
    .range([30, 100]);

  // console.log('scale', scale.domain());

  return (
    <div style={{ display: 'flex' }}>
      {data.map(d => (
        <div
          className={`${skillColorScale(d.type)} ${cx.textTrunc}`}
          style={{
            width: `${scale(d.level)}%`,
            height: '30px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <span>{d.type}</span>
        </div>
      ))}
    </div>
  );
};

SkillBar.propTypes = { data: PropTypes.array };

SkillBar.defaultProps = { data: [] };

const CardStack = ({ number }) => (
  // const scale = d3
  //   .scaleLinear()
  //   .domain([0])
  //   .range([30, 100]);

  <div style={{ display: 'flex' }}>
    {range(0, number).map(() => (
      <div style={{ width: `${2}%` }}>
        <CardMarker width={30} />
      </div>
    ))}
  </div>
);

CardStack.propTypes = {
  number: PropTypes.number
};

CardStack.defaultProps = { number: 0 };

const Author = ({ extended, onClose, color, ...profile }) => {
  const { name, skills, activity, interests } = profile;
  if (!extended) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <img
          className={`${cx.avatar}`}
          width={'80%'}
          height={'80%'}
          src={profileSrc()}
          alt="alt"
        />
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column'
      }}
      className="mt-3"
    >
      <button
        type="button"
        className="close "
        style={{ position: 'absolute', top: 0 }}
        data-dismiss="modal"
        aria-label="Close"
        onClick={onClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <img
        className={`${cx.avatar}`}
        style={{ alignSelf: 'center' }}
        width={'40%'}
        height={'40%'}
        src={profileSrc()}
        alt="alt"
      />

      <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
        Personal
      </div>
      <FieldSet legend={'Interests:'}>
        <SkillBar data={interests} />
      </FieldSet>
      <FieldSet legend={'skills:'}>
        <SkillBar data={skills} />
      </FieldSet>
      <div className="mt-2" style={{ fontSize: '14px', fontWeight: 700 }}>
        Activity
      </div>
      <FieldSet legend={'Collected Cards'}>
        <CardStack number={30} />
      </FieldSet>
      <FieldSet legend={'Created Cards'}>
        <CardStack number={14} />
      </FieldSet>
    </div>
  );
};

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
  // profile: {
  name: 'jan',
  skills: [
    { type: 'arts', level: 22 },
    { type: 'music', level: 14 },
    { type: 'sports', level: 10 }
  ],
  interests: [
    { type: 'movies', level: 12 },
    { type: 'football', level: 5 },
    { type: 'xbox', level: 10 }
  ],
  activity: { collectedCards: 20, createdCards: 13 },
  // },
  extended: false
};

const Profile = ({ data }) => (
  <div className="media mt-3">
    <img
      className={`d-flex mr-3 ${cx.avatar}`}
      width={64}
      height={64}
      src={profileSrc()}
      alt="alt"
    />
    <div className="media-body">
      <div className={cx.textClamp}>{data.comment}</div>
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
