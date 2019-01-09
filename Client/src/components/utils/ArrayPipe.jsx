import React from 'react';
import PropTypes from 'prop-types';

const ArrayPipe = ({ array, children }) => array.map(children);

ArrayPipe.defaultProps = {};

ArrayPipe.propTypes = {};

export default ArrayPipe;
