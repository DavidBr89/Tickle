import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import CardMarker from 'Components/cards/CardMarker';

import { DragSourceCont } from './DragSourceTarget';

import { connect } from 'react-redux';

import { dragCard } from 'Reducers/Cards/actions';

const DragElement = ({ dragCard, x, y, children, ...d }) => {
  const posStyle = {
    position: 'absolute',
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)'
  };
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
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={posStyle}>
      <DragSourceCont
        dragHandler={dragCard}
        data={d}
        x={x}
        y={y}
        width={80}
        height={80}
      >
        {elem}
      </DragSourceCont>
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
