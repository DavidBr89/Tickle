import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, Transition } from 'react-transition-group/';

import { colorScale } from '../cards/styles';

class TagBar extends Component {
  static propTypes = {
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    selectedTags: PropTypes.array,
    onClick: PropTypes.func
  };

  static defaultProps = {
    data: [],
    style: {},
    className: '',
    selectedTags: [],
    onClick: d => d
  };

  constructor(props) {
    super(props);
    this.state = { selected: [] };
  }

  // componentWillReceiveProps(nextProps) {
  //   // this.setState({
  //   //   sets: setify(nextProps.data)
  //   // });
  // }

  render() {
    const { selectedTags, tags, style, className, onClick } = this.props;
    const { selected } = this.state;
    const dotOpacity = { entering: 0, entered: 1, exiting: 0, exited: 0 };
    const selectedStyle = id =>
      selected.includes(id) ? { border: 'black solid 1px' } : {};

    return (
      <TransitionGroup
        className={className}
        style={{
          ...style,
          justifyContent: 'center',
          overflowX: 'scroll',
          overflowY: 'visible',
          width: '100%',
          // height: '100%',
          display: 'grid',
          gridTemplateRows: '50%',
          gridTemplateColumns: 'auto',
          gridAutoFlow: 'column'
          // border: 'solid 5px rosybrown',
        }}
      >
        {tags.map(s => (
          <Transition key={s} timeout={{ enter: 400, exit: 400 }}>
            {state => (
              <div
                onClick={() => {
                  this.setState(({ selected: oldSelected }) => {
                    const newSelected = oldSelected.includes(s)
                      ? oldSelected.filter(t => t !== s)
                      : [s, ...oldSelected];
                    onClick(newSelected);
                    return { selected: newSelected };
                  });
                }}
                className="mr-1 mt-1 p-1"
                style={{
                  borderLeft: 'grey 4px solid',
                  opacity: dotOpacity[state],
                  transition: 'opacity 0.3s',
                  background: colorScale(s),
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  ...selectedStyle(s)
                }}
              >
                {s}
              </div>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

export default TagBar;
