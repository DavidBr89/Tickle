import React from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';

import { UIthemeContext, modalBorder, createShadowStyle } from 'Cards/styles'; // eslint-disable-line
import PhotoChallengeAuthor from './PhotoChallengeAuthor';

import { Modal, ModalBody } from 'Utils/Modal';

// import LearningObject from './LearningObject';

class Nav extends React.Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
    className: PropTypes.string,
    data: PropTypes.array,
    preSelected: PropTypes.string,
    onChange: PropTypes.func,
    uiColor: PropTypes.string
  };

  static defaultProps = {
    className: '',
    data: ['1', '2', '3'],
    uiColor: 'black',
    children: d => d,
    preSelected: 'PhotoUpload',
    onChange: d => d
  };

  state = { selected: this.props.preSelected };

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
      this.props.onChange(selected);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  render() {
    const { data, children, uiColor } = this.props;
    const { selected } = this.state;

    const btnStyle = (sel, color) => ({
      background: sel ? color : null,
      display: 'inline-flex',
      color: sel ? 'white' : null,
      width: '30%',
      overflow: 'hidden'
      // textOverflow: 'ellipsis'
    });

    const updState = sel => () => this.setState({ selected: sel });

    return (
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
          <div className="w-100 h-100" role="tabpanel">
            {children instanceof Function
              ? children(data.find(key => key === selected))
              : children}
          </div>
        </div>
      </div>
    );
  }
}

function TestComp({ children }) {
  return (
    <div style={{ background: 'gold' }}>
      <div>test</div>
      <div>{children}</div>
    </div>
  );
}

class ChallengeAuthor extends React.Component {
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

  // static getDerivedStateFromProps(nextProps) {
  //   return {
  //     challengeMap: {
  //       PhotoUpload: <PhotoChallengeAuthor {...nextProps} />,
  //       LearningObject: <TestComp {...nextProps} />,
  //       MiniGame: <PhotoChallengeAuthor {...nextProps} />
  //     }
  //   };
  // }

  constructor(props) {
    super(props);

    this.state = {
      selectedKey: Object.keys(this.challengeMap)[0]
    };
  }

  challengeMap = {
    PhotoUpload: <PhotoChallengeAuthor {...this.props} />,
    LearningObject: <TestComp {...this.props} />,
    MiniGame: <PhotoChallengeAuthor {...this.props} />
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.state.selectedKey !== nextState.selectedKey || nextProps.uiColor
  //   );
  // }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ challengeTypes });
  // }

  render() {
    const { className, uiColor, style } = this.props;
    const { selectedKey } = this.state;
    const challengeKeys = Object.keys(this.challengeMap);

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', minHeight: 300, ...style }}
      >
        <Nav
          data={[challengeKeys[0]]}
          preSelected={challengeKeys[0]}
          onChange={key => this.setState({ selectedKey: key })}
          uiColor={uiColor}
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
              {challengeKeys.map(key => (
                <div
                  className="w-100 p-2"
                  style={{ display: selectedKey !== key && 'none' }}
                >
                  {this.challengeMap.PhotoUpload}
                </div>
              ))}
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

class ChallengeAuthorModalBody extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func,
    uiColor: PropTypes.string
  };
  static defaultProps = {
    children: <div />,
    className: '',
    onChange: d => d,
    uiColor: 'black'
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
    const { uiColor } = this.props;
    const btnClass = `btn ${challenge === null && 'disabled'}`;
    const iconSize = { width: 30, height: 30 };

    return (
      <ModalBody
        uiColor={uiColor}
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
          {...this.props}
          onChange={ch => {
            this.setState({ challenge: ch, added: false });
          }}
        />
      </ModalBody>
    );
  }
}

export default ChallengeAuthorModalBody;
