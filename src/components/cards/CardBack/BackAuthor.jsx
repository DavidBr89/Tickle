import React from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';

import {
  scaleLinear, extent, range, scaleOrdinal
} from 'd3';

import { db } from 'Firebase';

// import { skillTypes } from '../../dummyData';
import setify from 'Utils/setify';
import CardMarker from '../CardMarker';

const AuthorDetails = ({
  onClose, style, // skills,
  activity, className, collectedCards, createdCards,
  ...authorPreviewProps
}) => {
  const skills = setify([...collectedCards, ...createdCards]);

  return (
    <div
      className={`${className} flex flex-col`}
      style={{ ...style }}
    >
      <div className="flex-no-shrink mb-3">
        <h2 className="mb-1">Top Interests</h2>
        <div className="flex w-full flex-wrap">
          {skills.map(d => (
            <div className="text-xl capitalize bg-black tag-label m-1">{d.key}</div>
          ))}
        </div>
      </div>
      <h2 className="mb-1">Top Cards</h2>
      <div className="flex flex-wrap relative" style={{}}>
        {createdCards.slice(0, 4).map(d => (
          <PreviewCard
            {...d}
            className="m-1 p-2"
            style={{ flex: '0 0 100px', height: 130 }}
          />
        ))}
      </div>
    </div>
  );
};

const AuthorPreview = ({
  className, photoURL, style, username, name, email
}) => (
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
      style={{ objectFit: 'cover' }}
    />
    <div className="absolute m-3">
      <h2 className="text-white tag-label">{username}</h2>
    </div>
  </div>
);

AuthorPreview.defaultProps = { photoURL: 'https://images.unsplash.com/photo-1522602398-e378288fe36d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=75ef40ce9a4927d016af73bb4aa7ac55&auto=format&fit=crop&w=3350&q=80' };

const BackAuthor = ({
  extended,
  style,
  detailedUserInfo,
  basicUserInfo,
  ...props
}) => (
  <div className="flex flex-grow flex-col justify-center overflow-y-auto" style={style}>
    <AuthorPreview
      {...basicUserInfo}
      className="flex flex-col relative flex-no-shrink"
      style={{ flexGrow: 10 }}
    />
    {extended && (
      <AuthorDetails
        className="flex-grow flex flex-col relative p-1"
        {...detailedUserInfo}
      />
    )}
  </div>
);

BackAuthor.defaultProps = {};

class BackAuthorWrapper extends React.Component {
  static defaultProps = {
    fetchData: new Promise(resolve => resolve(null))
  };

  componentDidMount() {
    const { uid, dataPromise } = this.props;
    // TODO OUTSOURCE
    dataPromise.then((authorInfo) => {
      const {
        interests,
        createdCards,
        collectedCards,
        ...basicUserInfo
      } = authorInfo;

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
    });
  }

  state = { detailedUserInfo: {}, basicUserInfo: {} };

  render() {
    return <BackAuthor {...this.props} {...this.state} />;
  }
}

export default BackAuthorWrapper;
