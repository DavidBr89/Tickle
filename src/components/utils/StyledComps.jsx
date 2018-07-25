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

export const NewTabLink = ({ href, className, style, children }) => (
  <a className={className} target="_blank" href={href} rel="noopener">
    {children}
  </a>
);

NewTabLink.propTypes = {
  href: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOf([PropTypes.node, null])
};

NewTabLink.defaultProps = {
  href: '',
  style: {},
  children: null
};

export const FieldSet = ({
  children,
  legend,
  style,
  edit,
  uiColor,
  onClick,
  legendStyle,
  bodyStyle,
  className,
  icon
}) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      // border: `1px solid ${uiColor}`,
      marginTop: '4px',
      width: '100%',
      height: '100%',
      // padding: 10,
      ...style,
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        margin: 10,
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          position: 'relative',
          ...bodyStyle
        }}
      >
        <div>
          <h5 style={legendStyle}>
            <span>
              {legend} {icon}
            </span>
          </h5>
        </div>
      </div>
      {children}
    </div>
  </div>
);

FieldSet.propTypes = {
  uiColor: PropTypes.string,
  legend: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  edit: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.oneOf([null, PropTypes.func]),
  legendStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  icon: PropTypes.oneOf([PropTypes.node, null])
};

FieldSet.defaultProps = {
  edit: false,
  uiColor: 'grey',
  classname: '',
  onClick: null,
  style: {},
  legendStyle: {},
  bodyStyle: {}
};
