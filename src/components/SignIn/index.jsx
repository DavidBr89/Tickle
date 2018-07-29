import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  static propTypes = {
    onAuthenticate: PropTypes.func
  };

  static defaultProps = {
    onAuthenticate: history => history.push(routes.DATAVIEW),
    history: null
  };

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate(prevProps, prevState) {
    const { history, onAuthenticate } = this.props;
    const { email, password, error } = this.state;
    // if (
    //   error === null &&
    //   // email !== null &&
    //   email !== prevState.email &&
    //   // password !== null &&
    //   password !== prevState.password
    // )
    //   onAuthenticate(history);
  }

  onSubmit = event => {
    const { email, password } = this.state;

    const { history, onAuthenticate } = this.props;
    // console.log('auth', auth);

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        onAuthenticate(history);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

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
