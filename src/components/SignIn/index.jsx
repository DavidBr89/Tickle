import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {signIn} from 'Reducers/Session/async_actions';
// import { compose } from 'recompose';

// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import {SignUpLink} from '../SignUp';
import {PasswordForgetLink} from '../Password';

import {auth} from 'Firebase';
import {ModalBody} from 'Components/utils/Modal';

import {GEO_VIEW} from 'Constants/routeSpec';

import {GlobalThemeConsumer, stylesheet} from 'Src/styles/GlobalThemeContext';

import {fetchCollectibleCards} from 'Reducers/Cards/async_actions';

import DefaultLayout from 'Components/DefaultLayout';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

function onSubmit(event) {
  const {email, password} = this.state;

  const {onAuthenticate} = this.props;
}

const SignInPage = ({signIn, fetchCollectibleCards, ...props}) => {
  const {match, history} = props;
  const {
    params: {userEnv},
  } = match;

  // console.log('history p', history);

  return (
    <DefaultLayout
      menu={
        <div className="flex-grow flex justify-center items-center">
          <h1>Sign In {userEnv}</h1>
        </div>
      }
    >
      <div className="content-margin">
        <SignInFormWrapper
          {...props}
          onSubmit={({email, password, onError}) =>
            signIn({
              userEnv,
              email,
              password,
              onError
            }).then(() => {
              history.push(GEO_VIEW.path);
              // fetchCollectibleCards(uid);
              // console.log('yeah', uid);
            })
          }
        />
        <PasswordForgetLink />
        <SignUpLink />
        {!userEnv && <div>You did not specify a user environment</div>}
      </div>
    </DefaultLayout>
  );
};

const INITIAL_STATE = {
  email: null,
  password: null,
  error: null
};

class SignInFormWrapper extends Component {
  static propTypes = {
    onAuthenticate: PropTypes.func
  };

  static defaultProps = {
    onAuthenticate: d => d,
    history: null
  };

  state = {...INITIAL_STATE};

  render() {
    const {onSubmit} = this.props;
    const {email, password, error} = this.state;

    const isInvalid = password === '' || email === '';
    // console.log('routerProps', this.props);

    return (
      <SignInForm
        onSubmit={() =>
          onSubmit({
            email,
            password,
            onError: err => this.setState({error: err})
          })
        }
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

const SignInForm = ({
  email,
  onSubmit,
  password,
  isInvalid,
  error,
  onPasswordChange,
  onEmailChange
}) => (
  <div
    className="mb-1"
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <div className="form-group">
      <label className="label" htmlFor="first_name">
        Username
      </label>
      <input
        value={email}
        onChange={onEmailChange}
        type="text"
        placeholder="Email Address"
        className="form-control"
      />
    </div>
    <div className="form-group">
      <label className="label" htmlFor="first_name">
        Password
      </label>
      <input
        value={password}
        onChange={onPasswordChange}
        type="password"
        placeholder="Password"
        className="form-control"
      />
    </div>

    <button
      className="btn"
      disabled={isInvalid}
      style={{width: '100%'}}
      type="submit"
      onClick={onSubmit}>
      Sign In
    </button>
    {error !== null && (
      <div
className="alert mt-3" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )}
  </div>
);

SignInForm.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
  isInvalid: PropTypes.bool,
  error: PropTypes.string,
  onPasswordChange: PropTypes.func,
  onEmailChange: PropTypes.func
};

SignInForm.defaultProps = {
  email: null,
  onSubmit: null,
  password: null,
  isInvalid: null,
  error: null,
  onPasswordChange: null,
  onEmailChange: null
};

// export class SignInModalBody extends Component {
//   static propTypes = {
//     onAuthenticate: PropTypes.func,
//     history: PropTypes.object
//   };
//
//   static defaultProps = {
//     onAuthenticate: history => history.push(routes.DATAVIEW_TAGS),
//     history: null
//   };
//
//   state = {...INITIAL_STATE};
//
//   render() {
//     const {onClose} = this.props;
//     const {email, password, error} = this.state;
//
//     const isInvalid = password === '' || email === '';
//
//     return (
//       <ModalBody
//         title="User Sign-In"
//         onClose={onClose}
//         footer={
//           <div>
//             <button className="btn" onClick={onSubmit}>
//               Sign In{' '}
//             </button>
//           </div>
//         }
//       >
//         <SignInPureForm
//           email={email}
//           onEmailChange={event =>
//             this.setState(byPropKey('email', event.target.value))
//           }
//           password={password}
//           onPasswordChange={event =>
//             this.setState(byPropKey('password', event.target.value))
//           }
//           isInvalid={isInvalid}
//           error={error}
//         />
//       </ModalBody>
//     );
//   }
// }
//
// const mapStateToProps = state => ({
//   users: state.User.users
// });

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signIn,
      fetchCollectibleCards
    },
    dispatch,
  );
//
// const authCondition = authUser => !!authUser;
//
// export default compose(
//   withAuthorization(authCondition),
//   connect(null, mapDispatchToProps)
// )(HomePage);
//

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
    mergeProps,
  ),
)(SignInPage);

// export {SignInForm};
