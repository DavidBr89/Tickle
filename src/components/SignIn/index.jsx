import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../Password';
import { auth } from 'Firebase';

import * as routes from 'Constants/routes';

const SignInPage = ({ history }) => (
  <div className="content-block">
    <h1>SignIn</h1>
    <SignInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: null,
  password: null,
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate(prevProps, prevState) {
    const { history } = this.props;
    const { email, password, error } = this.state;
    if (
      error === null &&
      // email !== null &&
      email !== prevState.email &&
      // password !== null &&
      password !== prevState.password
    )
      history.push(routes.DATAVIEW);
  }

  onSubmit = event => {
    const { email, password } = this.state;

    const { history } = this.props;
    // console.log('auth', auth);

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        // this.setState(() => ({ ...INITIAL_STATE }));
        console.log('onSubmit', email, password);
        history.push(routes.DATAVIEW_GEO);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;
    console.log('auth', this.state);

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event =>
            this.setState(byPropKey('email', event.target.value))
          }
          type="text"
          placeholder="Email Address"
        />
        <input
          value={password}
          onChange={event =>
            this.setState(byPropKey('password', event.target.value))
          }
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

// const mapStateToProps = state => ({
//   users: state.User.users
// });

// const mapDispatchToProps = dispatch => ({
//   getCardsAction: users => dispatch(getCards)
// });
//
// const authCondition = authUser => !!authUser;
//
// export default compose(
//   withAuthorization(authCondition),
//   connect(null, mapDispatchToProps)
// )(HomePage);
//

export default withRouter(SignInPage);

// export default compose(
//   withAuthorization(authCondition),
//   connect(mapStateToProps, mapDispatchToProps)
// )(HomePage);

export { SignInForm };
