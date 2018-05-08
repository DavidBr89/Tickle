import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

// import cxx from '../CardCreator.scss';

// import update from 'immutability-helper';
const CardDragPreview = ({ width, height, left, top, fill }) => (
  <img
    width={width}
    height={height}
    alt="icon"
    background={fill}
    style={{
      position: !(left === null || top === null) ? 'absolute' : null,
      border: '1px dashed gray',
      left: `${left}px`,
      top: `${top}px`
      // zIndex: 2000
    }}
  />
);

CardDragPreview.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.oneOf([null, PropTypes.number]),
  top: PropTypes.oneOf([null, PropTypes.number])
};

CardDragPreview.defaultProps = {
  width: 50,
  height: 50,
  left: null,
  top: null,
  fill: 'transparent'
};

export default CardDragPreview;

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
    // console.log('monitorXXXX', monitor);
    const item = monitor.getItem();
    // TODO: reorganize
    const x = item.x;
    const y = item.y;

    const left = Math.round(x + delta.x);
    const top = Math.round(y + delta.y);

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
    const { left, top, id } = this.state;
    // console.log('this.state', this.state);
    // console.log('yeah dropHandler', this.props);
    // const newid = Math.random() * 100;
    // console.log('dropped', dropped, 'prevDropped', prevState.dropped);
    // console.log('this.props', this.props);
    if (prevProps.dragged && !this.props.dragged)
      dropHandler({ id, x: left, y: top });
  }

  drop(id, left, top, dropped) {
    console.log('left', left, 'top', top);
    this.setState({ id, left, top, dropped });
  }

  // }

  render() {
    const {
      // canDrop,
      // isOver,
      connectDropTarget,
      // clientOffset,
      style,
      className,
      children
    } = this.props;
    // const { id, left, top, dropped } = this.state;
    // const { x, y } = clientOffset || { x: 0, y: 0 };
    // console.log('dropped', dropped);

    return connectDropTarget(
      <div style={style} className={className}>
        {children}
      </div>
    );
  }
}

export { DragSourceCont, DropTargetCont };
