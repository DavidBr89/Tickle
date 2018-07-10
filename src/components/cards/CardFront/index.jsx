import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReadCardFront from './ReadCardFront';
import EditCardFront from './EditCardFront';
import CardHeader from '../CardHeader';

const CardFront = props =>
  props.edit ? (
    <EditCardFront {...props} />
  ) : (
    <CardHeader {...props}>
      <ReadCardFront {...props} />
    </CardHeader>
  );

CardFront.propTypes = {
  edit: PropTypes.bool,
  onAttrUpdate: PropTypes.func
};

CardFront.defaultProps = {
  edit: false,
  onAttrUpdate: () => null
};

export default CardFront;
