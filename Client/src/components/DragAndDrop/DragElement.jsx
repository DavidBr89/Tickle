import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import CardMarker from '~/components/cards/CardMarker';

import {connect} from 'react-redux';

import {dragCard} from '~/reducers/Cards/actions';
import {dragSourceMap} from './DragSourceCont';

// TODO hack

const DragElement = ({
  dragId,
  dragCard,
  x,
  y,
  children,
  className,
  ...d
}) => {
  const posStyle = {
    position: 'absolute',
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)'
  };

  const DragSource = dragSourceMap[dragId];
  console.log('dragId', dragId);

  const elem = (
    <div
      onMouseDown={() => dragCard(true)}
      onClick={e => {
        e.stopPropagation();
        dragCard(false);
      }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: '10%',
        border: 'black dashed 2px'
      }}>
      {children}
    </div>
  );

  return (
    <div style={posStyle} className={className}>
      <DragSource
        dragId={dragId}
        dragHandler={dragCard}
        data={d}
        x={x}
        y={y}
        width={80}
        height={80}>
        {elem}
      </DragSource>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    // ...state.MapView,
    // ...state.Cards
    // ...state.DataView,
    // ...state.Screen,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dragCard
    },
    dispatch
  );

const mergeProps = (_, dispatcherProps, ownProps) => ({
  ...dispatcherProps,
  ...ownProps
});

DragElement.defaultProps = {};

DragElement.propTypes = {};

const ConnectedDragElement = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DragElement);

// export default ConnectedDragElement;
export default ConnectedDragElement;
