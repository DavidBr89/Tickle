import React from 'react';
import PropTypes from 'prop-types';

import {scaleLinear, extent, range, scaleOrdinal} from 'd3';

import {db} from 'Firebase';

// import { skillTypes } from '../../dummyData';
import CardMarker from '../CardMarker';
import setify from 'Utils/setify';

const AuthorDetails = ({
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
  className,
  numCreatedCards,
  ...authorPreviewProps
}) => (
  <div
    className={className}
    style={{
      ...style
    }}
  >
    <div className="bg-grey-light">
      <h2>Top Interests</h2>
      {skills.map(d => (
        <div className="text-xl capitalize">#{d}</div>
      ))}
    </div>
    <div className="bg-grey-light" />
  </div>
);

const AuthorPreview = ({className, photoURL, style, username, name, email}) => (
  <div
    className={className}
    style={{
      ...style
    }}
  >
    <img
      className="absolute h-full w-full"
      src={photoURL}
      alt="alt"
      style={{objectFit: 'cover'}}
    />
    <div className="absolute m-3">
      <h1 className="text-white">{username}</h1>
    </div>
  </div>
);

const BackAuthor = ({
  extended,
  style,
  detailedUserInfo,
  basicUserInfo,
  ...props
}) => (
  <div className="flex flex-grow flex-col justify-center" style={style}>
    <AuthorPreview
      {...basicUserInfo}
      className="flex-col-wrapper flex-grow relative"
    />
    {extended && (
      <AuthorDetails
        className="flex-col-wrapper relative justify-center"
        {...detailedUserInfo}
      />
    )}
  </div>
);

BackAuthor.defaultProps = {
  // TODO: check
  placeholderImgUrl:
    'http://sunfieldfarm.org/wp-content/uploads/2014/02/profile-placeholder.png',
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

class BackAuthorWrapper extends React.Component {
  static defaultProps = {
    fetchData: () => new Promise(resolve => resolve(null))
  };
  componentDidMount() {
    const {uid, fetchData} = this.props;
    // TODO
    uid && fetchData(uid).then(
      ({interests, createdCards, collectedCards, ...basicUserInfo}) => {
        const skills = setify([...createdCards, ...collectedCards])
          .slice(0, 5)
          .map(d => d.key);

        const detailedUserInfo = {
          interests,
          createdCards,
          collectedCards,
          skills
        };

        this.setState({
          basicUserInfo,
          detailedUserInfo
        });
      },
    );
  }

  state = {detailedUserInfo: {}, basicUserInfo: {}};

  render() {
    return <BackAuthor {...this.props} {...this.state} />;
  }
}

export default BackAuthorWrapper;
