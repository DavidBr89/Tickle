import React from 'react';
import PropTypes from 'prop-types';

import PreviewCard from 'Components/cards/PreviewCard';

import {scaleLinear, extent, range, scaleOrdinal} from 'd3';

import {db} from 'Firebase';

// import { skillTypes } from '../../dummyData';
import CardMarker from '../CardMarker';
import setify from 'Utils/setify';

const AuthorDetails = ({
  onClose,
  style,
  skills,
  activity,
  className,
  collectedCards,
  createdCards,
  ...authorPreviewProps
}) => (
  <div
    className={`${className} flex-col-wrapper`}
    style={{
      ...style
    }}
  >
    <div className="" style={{flexShrink: 0}}>
      <h2>Top Interests</h2>
      {skills.map(d => (
        <div className="text-xl capitalize">#{d}</div>
      ))}
    </div>
    <div className="flex-grow">
      {collectedCards.map(d => (
        <PreviewCard {...d} />
      ))}{' '}
    </div>
    <div className="flex flex-wrap flex-grow relative">
      {createdCards.map(d => (
          <PreviewCard
            {...d}
            className="m-1 w-2/5 p-2"
            style={{width: 100, height: 120}}
          />
      ))}
    </div>
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

AuthorPreview.defaultProps = {photoURL: ''};

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
        className="flex-grow flex-col-wrapper relative "
        {...detailedUserInfo}
      />
    )}
  </div>
);

BackAuthor.defaultProps = {};

class BackAuthorWrapper extends React.Component {
  static defaultProps = {
    fetchData: () => new Promise(resolve => resolve(null))
  };
  componentDidMount() {
    const {uid, fetchData} = this.props;
    // TODO
    fetchData().then(authorInfo => {
      const {
        interests,
        createdCards,
        collectedCards,
        ...basicUserInfo
      } = authorInfo;

      console.log('authorInfo', authorInfo);
      const skills = setify([...createdCards, ...collectedCards])
        .slice(0, 5)
        .map(d => d.key);

      const detailedUserInfo = {
        interests,
        createdCards,
        collectedCards,
        skills,
      };

      this.setState({
        basicUserInfo,
        detailedUserInfo,
      });
    });
  }

  state = {detailedUserInfo: {}, basicUserInfo: {}};

  render() {
    return <BackAuthor {...this.props} {...this.state} />;
  }
}

export default BackAuthorWrapper;
