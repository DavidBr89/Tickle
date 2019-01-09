import React from 'react';

import { connect } from 'react-redux';

import { BareModal } from 'Components/utils/Modal';

const mapStateToProps = state => ({ ...state.Screen });

const mergeProps = (stateProps, _, ownProps) => ({
  ...stateProps,
  ...ownProps
});

const CardModal = ({ props, isSmartphone }) => (
  <BareModal
    {...props}
    style={{ margin: `${!isSmartphone ? '2.5rem' : ''} auto` }}
  />
);

const ConnectedCardModal = connect(
  mapStateToProps,
  null,
  mergeProps
)(CardModal);

export default ConnectedCardModal;
