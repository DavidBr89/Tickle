import React from 'react';
import PropTypes from 'prop-types';
import ConnectedCardView from './ConnectedCardView';

import TopicMapVis from 'Components/DataView/TopicMap/TopicMapVis';

import UserMap from 'Components/DataView/Map/UserMap';

export function MapViewPage() {
  return (
    <ConnectedCardView>
      {props => <UserMap className="absolute" {...props} />}
    </ConnectedCardView>
  );
}

MapViewPage.defaultProps = {};

MapViewPage.propTypes = {};

export function TopicMapViewPage() {
  return (
    <ConnectedCardView>
      {props => <TopicMapVis className="absolute" {...props} />}
    </ConnectedCardView>
  );
}

MapViewPage.defaultProps = {};

MapViewPage.propTypes = {};

export default ConnectedCardView;
