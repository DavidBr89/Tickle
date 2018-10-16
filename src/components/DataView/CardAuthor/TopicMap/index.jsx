import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ZoomCont from '../ZoomContainer';

import floorplanImg from '../floorplan.png';

import FloorPlan from './Floorplan';
import ClusteredFloor from './ClusteredFloor';

function index({ edit, children, ...props }) {
  return <ClusteredFloor {...props}>{}</ClusteredFloor>;
}

index.defaultProps = {};

index.propTypes = {};
export default index;
