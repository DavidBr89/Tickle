import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';

import { UIthemeContext, modalBorder, createShadowStyle } from 'Cards/styles'; // eslint-disable-line
import PhotoChallengeAuthor from './PhotoChallengeAuthor';

import { Modal, ModalBody } from 'Utils/Modal';

// import LearningObject from './LearningObject';

class Nav extends Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    data: PropTypes.array,
    preSelected: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    data: ['1', '2', '3'],
    uiColor: 'black',
    children: d => d,
    preSelected: 'PhotoUpload',
    onChange: d => d
  };

  constructor(props) {
    // TODO
    super(props);
    this.state = { selected: props.preSelected };
  }

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      console.log('selected');
      this.props.onChange(selected);
    }
  }

  render() {
    const { data, children } = this.props;
    const { selected } = this.state;

    const btnStyle = (sel, uiColor) => ({
      background: sel ? uiColor : null,
      display: 'inline-flex',
      color: sel ? 'white' : null,
      width: '30%',
      overflow: 'hidden'
      // textOverflow: 'ellipsis'
    });

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <UIthemeContext.Consumer>
        {({ uiColor }) => (
          <div style={{ width: '100%' }}>
            <div
              className="mb-3 nav"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'no-wrap'
              }}
              role="tablist"
            >
              {data.map(key => (
                <button
                  className="btn"
                  type="button"
                  onClick={updState(key)}
                  style={btnStyle(selected, uiColor)}
                  id={key}
                >
                  <div
                    style={{
                      // TODO: does not work
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {key}
                  </div>
                </button>
              ))}
            </div>
            <div className="tab-content">
              <div className={'w-100 h-100'} role="tabpanel">
                {children instanceof Function
                  ? children(data.find(key => key === selected))
                  : children}
              </div>
            </div>
          </div>
        )}
      </UIthemeContext.Consumer>
    );
  }
}

function TestComp({ children }) {
  return (
    <div style={{ background: 'gold' }}>
      <div>{'test'}</div>
      <div>{children}</div>
    </div>
  );
}

class ChallengeAuthor extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    onChange: PropTypes.func,
    reset: PropTypes.bool,
    defaultChallenge: PropTypes.oneOf([PropTypes.object, null])
  };

  static defaultProps = {
    style: {},
    className: '',
    uiColor: 'black',
    onChange: d => d,
    reset: false,
    defaultChallenge: null,
    challengeTypes: ['Photo Upload', 'Learning Object', 'Mini Game']
  };

  challengeMap = {
    PhotoUpload: PhotoChallengeAuthor,
    LearningObject: TestComp,
    MiniGame: PhotoChallengeAuthor
  };

  state = {
    selectedKey: this.props.defaultChallenge
      ? this.props.defaultChallenge.type
      : Object.keys(this.challengeMap)[0]
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.selectedKey !== nextState.selectedKey;
  }

  // getDerivedStateFromProps(nextProps, prevState) {
  //
  // }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({ challengeTypes });
  // }

  render() {
    const { className, style } = this.props;
    const { selectedKey } = this.state;
    const challengeKeys = Object.keys(this.challengeMap);

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', minHeight: 300, ...style }}
      >
        <Nav
          data={challengeKeys}
          preSelected={selectedKey}
          onChange={key => this.setState({ selectedKey: key })}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div
              className="p-2"
              style={{
                // width: selected === t.name ? '100%' : '20vh',
                width: '100%',
                // height: '100%',
                maxHeight: 600
                // minHeight: 400
              }}
            >
              <div
                className="w-100 p-2"
                style={
                  {
                    // border: 'grey 1px solid',
                  }
                }
              >
                {React.createElement(
                  this.challengeMap[selectedKey],
                  this.props
                )}
              </div>
            </div>
          </div>
        </Nav>
      </div>
    );
  }
}

const FooterBtn = ({ onClick, children, disabled, className, style = {} }) => (
  <button
    className={`${'btn '}${className}`}
    style={{ ...style, lineHeight: 0 }}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

class ChallengeAuthorModalBody extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func
  };

  state = { challenge: null, added: false };

  // componentDidUpdate(prevProps, prevState) {
  //   const { challenge, added } = this.state;
  //
  //   if (added !== prevState.added)
  //     this.props.onChange(added ? challenge : null);
  //   // this.props.onChange(null);
  // }

  render() {
    const { challenge, added } = this.state;
    const btnClass = `btn ${challenge === null && 'disabled'}`;
    const iconSize = { width: 30, height: 30 };
    return (
      <ModalBody
        footer={
          <button
            disabled={challenge === null}
            className={btnClass}
            style={{ lineHeight: 0 }}
            onClick={() => {
              this.props.onChange(!added ? challenge : null);
              this.setState({ added: !added });
            }}
          >
            <div className="m-1">
              {added ? (
                <Icon.Lock {...iconSize} />
              ) : (
                <Icon.PlusSquare {...iconSize} />
              )}
            </div>
          </button>
        }
      >
        <ChallengeAuthor
          onChange={ch => {
            this.setState({ challenge: ch, added: false });
          }}
        />
      </ModalBody>
    );
  }
}

export default ChallengeAuthorModalBody;
