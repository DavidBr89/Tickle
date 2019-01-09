import React from 'react';
import PropTypes from 'prop-types';

import ConnectedCard from './ConnectedCard';

import ConnectedEditCard from './ConnectedEditCard';

import ConnectedReviewCard from './ConnectedReviewCard';

const MetaCard = ({edit, completed, ...props}) => {
  if (edit) return <ConnectedEditCard {...props} />;
  if (completed) return <ConnectedReviewCard {...props} />;
  return <ConnectedCard {...props} />;
};

export default MetaCard;
