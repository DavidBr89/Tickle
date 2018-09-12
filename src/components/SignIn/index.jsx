import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { css } from 'aphrodite';
// import { compose } from 'recompose';

// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../Password';

import { auth } from 'Firebase';
import { ModalBody } from 'Components/utils/Modal';

import * as routes from 'Constants/routes';

import { GlobalThemeConsumer, stylesheet } from 'Src/styles/GlobalThemeContext';

import { setAuthUser } from 'Reducers/Session/actions';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

function onSubmit(event) {
  const { email, password } = this.state;

  const { onAuthenticate } = this.props;
  // console.log('auth', auth);

  auth
    .doSignInWithEmailAndPassword(email, password)
    .then(usr => {
      onAuthenticate(usr);
    })
    .catch(error => {
      this.setState(byPropKey('error', error));
    });

  event.preventDefault();
}

const SignInPage = ({ history }) => (
  <div className="content-block">
    <h1>SignIn</h1>
    <SignInForm
      onAuthenticate={usr => {
        console.log('usr', usr);
        history.push(`${routes.AUTH_ENV_GEO}/temp`);
      }}
    />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

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
    onAuthenticate: d => d,
    history: null
  };

  state = { ...INITIAL_STATE };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <SignInPureForm
        onSubmit={onSubmit.bind(this)}
        email={email}
        onEmailChange={event =>
          this.setState(byPropKey('email', event.target.value))
        }
        password={password}
        onPasswordChange={event =>
          this.setState(byPropKey('password', event.target.value))
        }
        isInvalid={isInvalid}
        error={error}
      />
    );
  }
}

const SignInPureForm = ({
  email,
  onSubmit,
  password,
  isInvalid,
  error,
  onPasswordChange,
  onEmailChange
}) => (
  <form className="mb-1" onSubmit={onSubmit}>
    <input
      value={email}
      onChange={onEmailChange}
      type="text"
      placeholder="Email Address"
      className="form-control mb-1"
    />
    <input
      value={password}
      onChange={onPasswordChange}
      type="password"
      placeholder="Password"
      className="form-control mb-1"
    />
    {onSubmit && (
      <React.Fragment>
        <button
          className={css(stylesheet.btn)}
          disabled={isInvalid}
          style={{ width: '100%' }}
          type="submit"
        >
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </React.Fragment>
    )}
  </form>
);

SignInPureForm.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
  isInvalid: PropTypes.bool,
  error: PropTypes.string,
  onPasswordChange: PropTypes.func,
  onEmailChange: PropTypes.func
};

SignInPureForm.defaultProps = {
  email: null,
  onSubmit: null,
  password: null,
  isInvalid: null,
  error: null,
  onPasswordChange: null,
  onEmailChange: null
};

export class SignInModalBody extends Component {
  static propTypes = {
    onAuthenticate: PropTypes.func,
    history: PropTypes.object
  };

  static defaultProps = {
    onAuthenticate: history => history.push(routes.DATAVIEW_TAGS),
    history: null
  };

  state = { ...INITIAL_STATE };

  render() {
    const { onClose } = this.props;
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <ModalBody
        title="User Sign-In"
        onClose={onClose}
        footer={
          <div>
            <button
              className={css(stylesheet.btn)}
              onClick={onSubmit.bind(this)}
            >
              Sign In{' '}
            </button>
          </div>
        }
      >
        <SignInPureForm
          email={email}
          onEmailChange={event =>
            this.setState(byPropKey('email', event.target.value))
          }
          password={password}
          onPasswordChange={event =>
            this.setState(byPropKey('password', event.target.value))
          }
          isInvalid={isInvalid}
          error={error}
        />
      </ModalBody>
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
