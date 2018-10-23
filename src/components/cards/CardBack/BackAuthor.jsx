import React from 'react';
import PropTypes from 'prop-types';

import {scaleLinear, extent, range, scaleOrdinal} from 'd3';

import {db} from 'Firebase';

// import { skillTypes } from '../../dummyData';
import CardMarker from '../CardMarker';
import setify from 'Utils/setify';

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
    className="flex flex-col relative justify-center"
    style={{
      ...style
    }}
  >
    <AuthorPreview {...authorPreviewProps} />
    <div className="mt-2" style={{fontSize: '14px', fontWeight: 700}}>
      Personal
    </div>
    <div legend="Interests:" className="bg-grey-light" />
    <div className="mt-2" style={{fontSize: '14px', fontWeight: 700}}>
      Activity
    </div>
    <div legend="Collected Cards" className="bg-grey-light" />
    <div legend="Created Cards" className="bg-grey-light" />
  </div>
);

const AuthorPreview = ({photoURL, style, username, name, email}) => (
  <div
    className="relative flex"
    style={{
      ...style
    }}
  >
    <img
      width="100%"
      height="100%"
      src={photoURL}
      alt="alt"
      style={{objectFit: 'cover'}}
    />
    <div className="absolute ml-3">
      <h2 className="">{username}</h2>
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
    const {uid} = this.props;
    if (!uid) return;
    db.getDetailedUserInfo(uid).then(res => {
      const {
        interests: plainInterests,
        createdCards,
        collectedCards,
        ...userDetails
      } = res;

      const interests = plainInterests.map(key => ({key, count: 10}));
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
    const {extended, uid} = this.props;

    return extended ? (
      <ExtendedAuthor {...this.state} key={uid} />
    ) : (
      <AuthorPreview {...this.state} key={uid} />
    );
  }
}

Author.defaultProps = {
  // TODO: check
  placeholderImgUrl:
    'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png',
  // profile: {
  skills: [
    {key: 'arts', level: 22},
    {key: 'music', level: 14},
    {key: 'sports', level: 10}
  ],
  interests: [{key: 'movies'}, {key: 'football'}, {key: 'xbox'}],
  activity: {collectedCards: 20, createdCards: 13},
  // },
  style: {},
  extended: false
};

export default Author;
