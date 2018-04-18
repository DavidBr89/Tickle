import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import DocumentMeta from 'react-document-meta';

// import { findRoute } from '../utils';

// import userPic from './user.png';
// import cx from './MainLayout.scss';

export default class MainLayout extends Component {
  static propTypes() {
    return {
      children: PropTypes.Array.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { isToggleOn: false };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <div className="layout layout--main">
          <nav
            className="navbar navbar-expand-lg navbar-dark "
            style={{
              width: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <button
              style={{ border: 'grey 1px solid' }}
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i
                className="fa fa-1x fa-bars"
                style={{ fontSize: '25px', color: 'grey', padding: '2px' }}
              />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            </div>
          </nav>
          <div id="content" className="layout__content">{children}</div>
        </div>
      </div>
    );
  }
}
