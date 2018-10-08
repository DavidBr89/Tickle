import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import HTML5 from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
// import DragLayer from 'react-dnd/lib/DragLayer';

function collect(monitor) {
  return {
    sourceOffset: monitor.getSourceClientOffset()
  };
}

const boxSource = {
  beginDrag(props) {
    props.dragHandler(true);
    return { ...props };
  },

  endDrag(props) {
    props.dragHandler(false);
    return { ...props };
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
export class DragSourceCont extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    selected: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    // name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    dragHandler: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    dragHandler: d => d,
    width: 80,
    height: 80,
    selected: false,
    style: {}
  };

  // componentDidUpdate() {
  //   const { dragHandler, isDragging } = this.props;
  //   // if (isDragging) {
  //   //   dragHandler(isDragging);
  //   // }
  // }

  render() {
    const {
      isDragging,
      connectDragSource,
      children,
      width,
      height,
      // selected,
      style
    } = this.props;
    // const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    // TODO better solution
    const cont = (
      <div
        className="dragSource"
        style={{
          width,
          height,
          opacity,
          ...style,
          cursor: 'pointer'
        }}
      >
        {children}
      </div>
    );

    return connectDragSource(cont);
  }
}

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

@DropTarget('DragSourceCont', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isDropped: monitor.didDrop(),
  canDrop: monitor.canDrop()
}))
export class DropTargetCont extends PureComponent {
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
export const DragDropContextProvider = DragDropContext(HTML5);
