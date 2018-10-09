import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

// import DragLayer from 'react-dnd/lib/DragLayer';

const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();
    const left = Math.round(item.x + delta.x);
    const top = Math.round(item.y + delta.y);

    console.log('ITEM DATA', item);
    component.drop(item.data, left, top);
  }
  // },
  // canDrop(props, monitor, component) {
  //   console.log('canDrop', component, monitor);
  //   // component.undrop();
  // }
};

@DropTarget('DragSource', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isDropped: monitor.didDrop(),
  canDrop: monitor.canDrop()
}))
export default class DropTargetCont extends PureComponent {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    // isOver: PropTypes.bool.isRequired,
    // canDrop: PropTypes.bool.isRequired,
    // clientOffset: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    // dropped: PropTypes.bool.isRequired,
    dropHandler: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    dropHandler: d => d,
    style: {}
  };

  state = {
    top: 100,
    left: 100,
    data: null,
    dropped: false
  };

  componentDidUpdate(prevProps) {
    const { dropHandler, isDropped, canDrop } = this.props;
    const { left, top, data } = this.state;

    console.log('canDrop', data);
    if (!prevProps.isDropped && isDropped) {
      dropHandler({
        ...data,
        x: left,
        y: top
      });
    }
  }

  drop(data, left, top) {
    this.setState({ data, left, top });
  }

  // }

  render() {
    const { connectDropTarget, style, className, children } = this.props;

    return connectDropTarget(
      <div style={style} className={className}>
        {children}
      </div>
    );
  }
}
