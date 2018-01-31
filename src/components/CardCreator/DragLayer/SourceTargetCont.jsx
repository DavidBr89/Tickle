import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

// import cxx from '../CardCreator.scss';

import CardDragPreview from './CardDragPreview';

// import update from 'immutability-helper';

const style = {
  // border: '1px dashed gray',
  // backgroundColor: 'white',
  // padding: '0.5rem 1rem',
  // marginRight: '1.5rem',
  // marginBottom: '1.5rem',
  cursor: 'move',
  zIndex: 2000
  // float: 'left'
};

const boxSource = {
  beginDrag(props) {
    console.log('props', props);
    props.dragHandler(true);
    return {};
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      alert(`You dropped ${item.name} into ${dropResult.name}!`); // eslint-disable-line no-alert
    }
    props.dragHandler(false);
    return {};
  }
};

@DragSource('DragSourceCont', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isdropped: monitor.didDrop()
}))
class DragSourceCont extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    // name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    dragHandler: PropTypes.func
  };

  static defaultProps = {
    dragHandler: d => d
  };

  // componentDidUpdate() {
  //   const { dragHandler, isDragging } = this.props;
  //   // if (isDragging) {
  //   //   dragHandler(isDragging);
  //   // }
  // }

  render() {
    const { isDragging, connectDragSource, children } = this.props;
    // const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div style={{ width: '100%', height: '100%', opacity }}>{children}</div>
    );
  }
}

const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();

    const left = Math.round(delta.x);
    const top = Math.round(delta.y);

    console.log('drop', monitor.didDrop());
    component.drop(item.id, left, top, props.dragged);
  }
  // },
  // canDrop(props, monitor, component) {
  //   console.log('canDrop', component, monitor);
  //   // component.undrop();
  // }
};

@DropTarget('DragSourceCont', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isdropped: monitor.didDrop()
}))
class DropTargetCont extends PureComponent {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    // isOver: PropTypes.bool.isRequired,
    // canDrop: PropTypes.bool.isRequired,
    // clientOffset: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    // dropped: PropTypes.bool.isRequired,
    dropHandler: PropTypes.func
  };

  static defaultProps = {
    dropHandler: d => d
  };

  constructor(props) {
    super(props);
    this.state = {
      top: 20,
      left: 80,
      dropped: false
    };
  }

  componentDidUpdate(prevProps) {
    const { dropHandler, children } = this.props;
    const { left, top } = this.state;
    // console.log('yeah dropHandler', this.props);
    // const newid = Math.random() * 100;
    // console.log('dropped', dropped, 'prevDropped', prevState.dropped);
    console.log(this.props.dragged,  prevProps.dragged)
    if (prevProps.dragged && !this.props.dragged)
      dropHandler({ id: Math.random() * 1999, x: left, y: top });
  }

  drop(id, left, top, dropped) {
    console.log('drop', dropped);
    this.setState({ id, left, top, dropped });
  }

  // }

  render() {
    const {
      // canDrop,
      // isOver,
      connectDropTarget,
      // clientOffset,
      children
    } = this.props;
    const { id, left, top, dropped } = this.state;
    // const { x, y } = clientOffset || { x: 0, y: 0 };
    // console.log('dropped', dropped);

    return connectDropTarget(
      <div
        style={{
          position: 'absolute'
        }}
      >
        {children}
      </div>
    );
  }
}

export { DragSourceCont, DropTargetCont };
