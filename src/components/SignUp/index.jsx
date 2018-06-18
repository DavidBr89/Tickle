import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as routes from 'Constants/routes';
import { auth, db } from 'Firebase';

import PhotoUpload from 'Utils/PhotoUpload';
import { TagInput } from 'Utils/Tag';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { setAuthUser } from 'Reducers/Session/actions';

const SignUpPage = ({ ...props }) => (
  <div style={{ marginTop: 60, overflow: 'scroll' }}>
    <div className="m-3">
      <h1>SignUp</h1>
      <SignUpForm {...props} />
    </div>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  img: null,
  interests: [],
  loading: false
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignUpForm extends Component {
  state = INITIAL_STATE;

  onSubmit = event => {
    const { username, email, passwordOne, img, interests } = this.state;

    const { history, onSetAuthUser } = this.props;

    this.setState({ loading: true });

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your own accessible Firebase Database too
        db.addImgToStorage(img.file)
          .then(imgUrl => {
            const userProfile = {
              uid: authUser.uid,
              username,
              photoURL: imgUrl,
              email,
              interests
            };

            db.doCreateUser(userProfile)
              .then(() => {
                this.setState(() => ({ ...INITIAL_STATE }));
                onSetAuthUser(userProfile);
                // Jump to page
                history.push(routes.MAP);
              })
              .catch(error => {
                this.setState(byPropKey('error', error));
              });
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
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
      loading
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      img === null;

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Username:</label>
          <div>
            <input
              className="form-control"
              value={username}
              onChange={event =>
                this.setState(byPropKey('username', event.target.value))
              }
              type="text"
              placeholder="Full Name"
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

        <div className="form-group">
          <label htmlFor="pwd">User Photo:</label>
          <PhotoUpload onChange={img => this.setState({ img })} />
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
        <button disabled={isInvalid} type="submit">
          Sign Up {loading && <span>loading</span>}
        </button>

        {error && <p>{error.message}</p>}
      </form>
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

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(SignUpPage);

export { SignUpForm, SignUpLink };
