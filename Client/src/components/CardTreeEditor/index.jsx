import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from 'Reducers/Session/actions';

import {stratify} from 'd3';
import uuidv1 from 'uuid/v1';

import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';

import withAuthorization from 'Components/withAuthorization';
import withAuthentication from 'Components/withAuthentication';
import CardTreeEditorPage from './CardTreeEditorPage';

const mapStateToProps = state => {
  const {tagTreeData} = state.Session;
  const tmpRoot = {id: uuidv1(), title: 'New Topic', date: new Date()};
  const tmpTreeData = tagTreeData.length > 0 ? tagTreeData : [tmpRoot];
  const {tagVocabulary} = state.Cards;

  return {...state.Session, treeData: tmpTreeData, tagVocabulary};
};

/*
exampleAction: authUser => {
    dispatch(setAuthUser(authUser));
  }
*/
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...actions,
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {treeData} = stateProps;
  const {setTagTreeData} = dispatchProps;
  console.log('stateProps', stateProps);
  console.log('dispatchProps', dispatchProps);

  const root = stratify()
    .id(d => d.id)
    .parentId(d => d.parent)(treeData)
    .sort((a, b) => b.data.date - a.data.date);

  const onTitleChange = n =>
    setTagTreeData(treeData.map(d => (d.id === n.id ? {...d, ...n} : d)));
  const onAdd = n => setTagTreeData([...treeData, n]);
  const onRemove = n => setTagTreeData(treeData.filter(d => d.id !== n.id));
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onTitleChange,
    onAdd,
    onRemove,
    root,
  };
};

export default compose(
  withRouter,
  withAuthentication,
  withAuthorization(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(CardTreeEditorPage);
