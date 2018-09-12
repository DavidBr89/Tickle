import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

import HTML5 from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DragLayer from 'react-dnd/lib/DragLayer';

function collect(monitor) {
  return {
    sourceOffset: monitor.getSourceClientOffset()
  };
}
// import cxx from '../CardCreator.scss';

// import update from 'immutability-helper';
const CardDrag = ({ width, height, left, top, fill }) => (
  <img
    width={width}
    height={height}
    alt="icon"
    background={fill}
    style={{
      position: !(left === null || top === null) ? 'absolute' : null,
      border: '1px dashed gray',
      left,
      top
      // zIndex: 2000
    }}
  />
);

CardDrag.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  left: PropTypes.oneOf([null, PropTypes.number]),
  top: PropTypes.oneOf([null, PropTypes.number])
};

CardDrag.defaultProps = {
  width: 50,
  height: 50,
  left: null,
  top: null,
  fill: 'transparent'
};

export const CardDragPreview = DragLayer(collect)(CardDrag);

// const style = {
//   // border: '1px dashed gray',
//   // backgroundColor: 'white',
//   // padding: '0.5rem 1rem',
//   // marginRight: '1.5rem',
//   // marginBottom: '1.5rem',
//   cursor: 'move',
//   zIndex: 2000
//   // float: 'left'
// };

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
    width: 150,
    height: 150,
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
      selected,
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
          // background: 'white',
          // transform: 'translate(-50%,-50%)',
          opacity,
          // border: 'black 1px dashed',
          ...style,
          cursor: 'pointer',
          // TODO: change later
          // pointerEvents: 'all', // selected && 'all',
          zIndex: selected && 5000
        }}
      >
        {children}
      </div>
    );

    return selected ? connectDragSource(cont) : cont;
  }
}

const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();
    const left = Math.round(item.x + delta.x);
    const top = Math.round(item.y + delta.y);

    component.drop(item.data, left, top, props.dragged);
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

  constructor(props) {
    super(props);
    this.state = {
      top: 100,
      left: 100,
      dropped: false
    };
  }

  componentDidUpdate(prevProps) {
    const { dropHandler, children } = this.props;
    const { left, top, data } = this.state;
    // console.log('left top', left, top);
    // console.log('yeah dropHandler', this.props);
    // const newid = Math.random() * 100;
    // console.log('dropped', dropped, 'prevDropped', prevState.dropped);
    // console.log('this.props', this.props);
    if (prevProps.dragged && !this.props.dragged) {
      // console.log('D', data);
      // TODO: CHANGE LATER
      // TODO: CHANGE LATER
      // TODO: CHANGE LATER
      // TODO: CHANGE LATER
      // TODO: CHANGE LATER
      const inverted = data.normalize
        ? data.normalize.invert([left, top])
        : [left, top];

      console.log('DROP inverted', inverted);
      dropHandler({
        ...data,
        x: inverted[0],
        y: inverted[1]
        // tx: left,
        // ty: top,
        // vx: left,
        // vy: top
      });
    }
  }

  drop(data, left, top, dropped) {
    // console.log('left', left, 'top', top);
    this.setState({ data, left, top, dropped });
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
export const DragDropContextProvider = DragDropContext(HTML5);
