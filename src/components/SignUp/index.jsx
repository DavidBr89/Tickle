import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { css } from 'aphrodite';

import * as routes from 'Constants/routes';
import { auth, db } from 'Firebase';

import PhotoUpload from 'Utils/PhotoUpload';
import { TagInput } from 'Utils/Tag';

import { stylesheet } from 'Src/styles/GlobalThemeContext';

import { setAuthUser } from 'Reducers/Session/actions';

const SignUpPage = ({ admin, ...props }) => (
  <div
    style={{
      overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%'
    }}
  >
    <div className="mt-3">
      <h1>SignUp {admin ? 'Admin' : null}</h1>
    </div>
    <SignUpForm {...props} admin={admin} />
  </div>
);

SignUpPage.propTypes = {
  admin: PropTypes.bool
};

SignUpPage.defaultProps = {
  admin: false
};

const INITIAL_STATE = {
  username: '',
  email: '',
  fullname: null,
  passwordOne: '',
  passwordTwo: '',
  error: null,
  img: null,
  interests: [],
  loading: false
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null
});

class SignUpForm extends Component {
  state = INITIAL_STATE;

  onSubmit = event => {
    const {
      username,
      email,
      fullname,
      passwordOne,
      img,
      interests
    } = this.state;

    const { history, onSetAuthUser, admin } = this.props;

    this.setState({ loading: true });

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(res => {
        const authUser = res.user;
        const userProfile = {
          uid: authUser.uid,
          fullname,
          username,
          photoURL: null,
          email,
          interests,
          admin
        };
        onSetAuthUser({ authUser: userProfile });
        history.push(routes.DATAVIEW_GEO);
        // Jump to page
        // Create a user in your own accessible Firebase Database too
        // this.setState({ imgUpload: true });

        db.addImgToStorage({ file: img.file, path: `usr/${authUser.uid}` })
          .then(imgUrl => {
            const userProfileWithImg = { ...userProfile, photoURL: imgUrl };
            db.doCreateUser(userProfileWithImg)
              .then(() => {
                this.setState(() => ({ ...INITIAL_STATE }));
                onSetAuthUser({ authUser: userProfileWithImg });
              })
              .catch(error => {
                this.setState({ error, loading: false });
              });
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

    event.preventDefault();
  };

  // componentDidUpdate(prevProps, prevState) {
  //   const { img } = this.state;
  //   if (img !== null) {
  //     console.log('addImgToStorage', img);
  //   }
  // }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      img,
      loading,
      fullname
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      img === null;

    return (
      <div style={{ width: '90%' }}>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="pwd">User Photo:</label>
            <PhotoUpload
              style={{ height: 200, width: '100%' }}
              imgUrl={img !== null ? img.url : null}
              onChange={img => {
                this.setState(byPropKey('img', img));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullname">Full name:</label>
            <div>
              <input
                className="form-control"
                value={fullname || ''}
                onChange={event =>
                  this.setState(byPropKey('fullname', event.target.value))
                }
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <div>
              <input
                className="form-control"
                value={username}
                onChange={event =>
                  this.setState(byPropKey('username', event.target.value))
                }
                type="text"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Email:</label>
            <div>
              <input
                value={email}
                className="form-control"
                onChange={event =>
                  this.setState(byPropKey('email', event.target.value))
                }
                type="text"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <div className="form-group">
              <label htmlFor="pwd">Interests:</label>
              <TagInput onChange={tags => this.setState({ interests: tags })} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <div>
              <input
                className="form-control"
                value={passwordOne}
                onChange={event =>
                  this.setState(byPropKey('passwordOne', event.target.value))
                }
                type="password"
                placeholder="Password"
              />
            </div>
            <input
              className="form-control"
              value={passwordTwo}
              onChange={event =>
                this.setState(byPropKey('passwordTwo', event.target.value))
              }
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <div
            className="mb-3"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <button
              className={css(stylesheet.btn)}
              disabled={isInvalid}
              type="submit"
            >
              Sign Up
            </button>
            {error && (
              <div className="ml-2 alert alert-danger">{error.message}</div>
            )}
            {!error &&
              loading && (
              <div clasName="ml-2" style={{ fontSize: 'large' }}>
                  Loading...
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Do not have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

const mapDispatchToProps = dispatch => ({
  onSetAuthUser: authUser => {
    dispatch(setAuthUser(authUser));
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps,
    mergeProps
  )
)(SignUpPage);

export { SignUpForm, SignUpLink };
