import React from 'react';
import PropTypes from 'prop-types';

import ConnectedCardAuthor from './ConnectedCardAuthor';

import MapAuthor from 'Components/DataView/Map/MapAuthor';

import TopicMapAuthor from 'Components/DataView/TopicMap/DragTopicMap';
import UserEnvironmentSettings from './UserEnvironmentSettings';

export function MapCardAuthorPage() {
  return (
    <ConnectedCardAuthor>
      {props => <MapAuthor {...props} className="absolute" />}
    </ConnectedCardAuthor>
  );
}

MapCardAuthorPage.defaultProps = {};

MapCardAuthorPage.propTypes = {};

export function TopicMapAuthorPage() {
  return (
    <ConnectedCardAuthor>
      {props => <TopicMapAuthor {...props} />}
    </ConnectedCardAuthor>
  );
}

export {UserEnvironmentSettings};
// TODO Hierarchy View

export default ConnectedCardAuthor;
