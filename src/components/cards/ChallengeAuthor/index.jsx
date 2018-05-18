import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { UIthemeContext, modalBorder, createShadowStyle } from 'Cards/styles'; // eslint-disable-line
import PhotoUploadAuthor from './PhotoUploadAuthor';
import LearningObject from './LearningObject';

class Nav extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    data: PropTypes.array
  };

  static defaultProps = {
    className: '',
    data: ['PhotoUpload', 'hangman', 'learning Object'],
    uiColor: 'black',
    children: d => d
  };

  state = { selected: this.props.data[0].key };

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
              {data.map(d => (
                <button
                  className="btn"
                  type="button"
                  onClick={updState(d.key)}
                  style={btnStyle(selected, uiColor)}
                  id={d.key}
                >
                  <div
                    style={{
                      // TODO: does not work
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {d.key}
                  </div>
                </button>
              ))}
            </div>
            <div className="tab-content">
              <div className={'w-100 h-100'} role="tabpanel">
                {children(data.find(d => d.key === selected))}
              </div>
            </div>
          </div>
        )}
      </UIthemeContext.Consumer>
    );
  }
}

class ChallengeAuthor extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    uiColor: PropTypes.string,
    onChange: PropTypes.func,
    reset: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    className: '',
    uiColor: 'black',
    onChange: d => d,
    reset: false
  };

  state = {
    selected: null,
    challengeTypes: [
      {
        key: 'Photo Upload',
        comp: <PhotoUploadAuthor onChange={this.props.onChange} />
      },
      { key: 'Learning Object', comp: <div>{'yeah'}</div> },
      {
        key: 'Mini Game',
        comp: <PhotoUploadAuthor onChange={this.props.onChange} />
      }
    ]
  };

  componentWillReceiveProps(nextProps) {
    const challengeTypes = [
      {
        key: 'Photo Upload',
        comp: <PhotoUploadAuthor {...nextProps} />
      },
      { key: 'Learning Object', comp: <div>{'yeah'}</div> },
      {
        key: 'Mini Game',
        comp: <PhotoUploadAuthor {...nextProps} />
      }
    ];

    this.setState({ challengeTypes });
  }

  render() {
    const { className, style } = this.props;
    const { challengeTypes } = this.state;

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', minHeight: 300, ...style }}
      >
        <Nav data={challengeTypes}>
          {({ comp }) => (
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
                  {comp}
                </div>
              </div>
            </div>
          )}
        </Nav>
      </div>
    );
  }
}

export default ChallengeAuthor;
