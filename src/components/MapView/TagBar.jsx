import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TransitionGroup, Transition } from 'react-transition-group/';

import { colorScale } from '../cards/styles';

import Tag from './Tag';

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
    const { selectedTags, tags, style, className, onClick, scale } = this.props;
    const { selected } = this.state;
    const opacity = { entering: 0, entered: 1, exiting: 0, exited: 0 };
    const selectedStyle = id =>
      selected.includes(id) ? { transform: 'scale(1.3)' } : {};

    return (
      <TransitionGroup
        className={className}
        appear
        style={{
          ...style,
          justifyContent: 'center',
          flexWrap: 'wrap',
          display: 'flex'
        }}
      >
        {tags.map(s => (
          <Transition appear key={s.key} timeout={500}>
            {state => (
              <Tag
                className="mr-2 mb-2"
                key={s.key}
                barWidth={`${scale(s.count)}%`}
                onClick={() => {
                  this.setState(({ selected: oldSelected }) => {
                    const newSelected = oldSelected.includes(s.key)
                      ? oldSelected.filter(d => d !== s.key)
                      : [s.key, ...oldSelected];
                    // console.log('newSelected', newSelected);
                    onClick(newSelected);
                    return { selected: newSelected };
                  });
                }}
                style={{
                  opacity: opacity[state],
                  transition: 'opacity 0.5s transform 0.5s',
                  ...selectedStyle(s.key)
                }}
              >
                {s.key}
              </Tag>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}

export default TagBar;
