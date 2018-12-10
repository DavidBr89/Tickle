import React, { Fragment, PureComponent } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import HTML5 from 'react-dnd-html5-backend';

import PropTypes from 'prop-types';

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

@DragSource('DragSource', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  clientOffset: monitor.getClientOffset(),
  sourceClientOffset: monitor.getSourceClientOffset(),
  diffFromInitialOffset: monitor.getDifferenceFromInitialOffset(),
  isdropped: monitor.didDrop()
}))
export default class DragSourceCont extends PureComponent {
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
