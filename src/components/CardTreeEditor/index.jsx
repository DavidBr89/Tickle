import React from 'react';
import PropTypes from 'prop-types';

import CardTreeEditorPage from './CardTreeEditorPage';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from 'Reducers/TagTree/actions';

const mapStateToProps = state => ({...state.TagTree});

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      actions,
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({...stateProps, ...dispatchProps, ...ownProps});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CardTreeEditorPage);
