import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { shadowStyle } from '../styles';

import PhotoUploadAuthor from './PhotoUploadAuthor';
import LearningObject from './LearningObject';

function BreadCrumbs() {
  return <div>{'BreadCrumbs'}</div>;
}

class Nav extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    uiColor: PropTypes.string,
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
    const { data, uiColor, children } = this.props;
    const { selected } = this.state;
    const btnStyle = (sel, context) => ({
      background: sel === context ? uiColor : null,
      display: 'inline-flex',
      color: sel === context ? 'white' : null
    });

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <div style={{ width: '100%' }}>
        <div
          className="mb-3 nav"
          style={{ display: 'flex', justifyContent: 'space-between' }}
          role="tablist"
        >
          {data.map(d => (
            <button
              className="btn"
              type="button"
              onClick={updState(d.key)}
              style={btnStyle(selected, d.key)}
              id={d.key}
            >
              {d.key}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <div className={'w-100 h-100'} role="tabpanel">
            {children(data.find(d => d.key === selected))}
          </div>
        </div>
      </div>
    );
  }
}

class index extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    uiColor: PropTypes.string
  };

  static defaultProps = {
    style: {},
    className: '',
    uiColor: 'black'
  };

  state = { selected: null };

  render() {
    const { className, uiColor, style } = this.props;

    const challengeTypes = [
      { key: 'Photo Upload', comp: <PhotoUploadAuthor /> },
      { key: 'Learning Object', comp: <div>{'yeah'}</div> },
      { key: 'Mini Game', comp: <PhotoUploadAuthor /> }
    ];

    return (
      <div
        className={className}
        style={{ width: '100%', height: '100%', minHeight: 300, ...style }}
      >
        <Nav uiColor={uiColor} data={challengeTypes}>
          {({ key, comp }) => (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div
                className="p-2"
                style={{
                  // width: selected === t.name ? '100%' : '20vh',
                  width: '100%',
                  height: '100%',
                  maxHeight: 600,
                  minHeight: 75
                }}
              >
                <div
                  className="w-100 h-100 p-2"
                  style={
                    {
                      // border: 'grey 1px solid',
                      // ...shadowStyle
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

export default index;
