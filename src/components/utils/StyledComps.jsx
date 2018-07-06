import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class StyledButton extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    active: PropTypes.boolean
  };

  static defaultProps = {
    children: <span />,
    className: '',
    style: {},
    active: false
  };

  state = { ...this.props };

  componentDidUpdate(prevProps, prevState) {
    const { onClick } = this.props;
    const { active } = this.state;
    if (active !== prevState.active) onClick(active);
  }

  render() {
    const { onClick, children, className, style } = this.props;
    const { active } = this.state;
    const activeClass = active ? 'btn-active' : '';
    return (
      <div
        className={`${className} btn ${activeClass}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          // background: 'whitesmoke',
          ...style
        }}
        onClick={() =>
          this.setState(({ active: activeBefore }) => ({
            active: !activeBefore
          }))
        }
      >
        {children}
      </div>
    );
  }
}
