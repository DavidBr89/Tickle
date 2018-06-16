import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as routes from 'Constants/routes';
import { auth, db } from 'Firebase';

import PhotoUpload from 'Utils/PhotoUpload';

const SignUpPage = ({ ...props }) => (
  <div className="m-3" style={{ marginTop: 60 }}>
    <h1>SignUp</h1>
    <SignUpForm {...props} />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignUpForm extends Component {
  state = INITIAL_STATE;

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    const { history } = this.props;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          // .then(() => {
          //   console.log('addImgToStorage', this.state.imgUrl);
          //
          // })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';


    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address:</label>
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
          <label htmlFor="pwd">Interests:</label>
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
        </div>
        <div className="form-group">
          <label htmlFor="pwd">User Photo:</label>
          <div>
            <PhotoUpload onChange={imgUrl => this.setState({ imgUrl })} />
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
          Sign Up
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

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };
