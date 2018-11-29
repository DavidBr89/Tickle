import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {withRouter, Redirect} from 'react-router-dom';
import {compose} from 'recompose';

import {signIn} from 'Reducers/Session/async_actions';
// import { compose } from 'recompose';

// import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import {auth} from 'Firebase';
import {ModalBody} from 'Components/utils/Modal';

import {GEO_VIEW, SIGN_IN} from 'Constants/routeSpec';

import DefaultLayout from 'Components/DefaultLayout';
import {PasswordForgetLink} from '../Password';
import {SignUpLink} from '../SignUp';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

function onSubmit(event) {
  const {email, password} = this.state;

  const {onAuthenticate} = this.props;
}

const backgroundUrl =
  'https://images.unsplash.com/photo-1522602398-e378288fe36d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=75ef40ce9a4927d016af73bb4aa7ac55&auto=format&fit=crop&w=3350&q=80';

const inputClass =
  'border-4 bg-white text-2xl py-2 px-3 text-grey-darkest border-black';

const SignInPage = ({signIn, ...props}) => {
  const {match, history} = props;
  const {
    params: {userEnv},
  } = match;
  // const userEnv = params.userEnv || props.userEnv;

  // console.log('history p', history);

  return (
    <DefaultLayout
      className="flex flex-col relative"
      style={{
        backgroundImage: `url("${backgroundUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize:
          'cover' /* Resize the background image to cover the entire container */,
      }}>
      <div className="flex-grow flex flex-col justify-end items-center mb-32 ">
        <div className="w-3/4">
          <SignInFormWrapper
            {...props}
            disabled={!userEnv}
            onSubmit={({email, password, onError}) =>
              signIn({
                userEnvId: userEnv,
                email,
                password,
                onError,
              }).then(() => {
                history.push(`/${userEnv}/${GEO_VIEW.path}`);
              })
            }
          />
          <div>
            <SignUpLink userEnv={userEnv} />
          </div>
          {!userEnv && (
            <div className="alert mt-3">
              You did not specify a user environment! Please change the URL
            </div>
          )}
        </div>
      </div>
      <div className="absolute" style={{bottom: 0, right: 0}}>
        <div className="m-2 italic">{userEnv}</div>
      </div>
    </DefaultLayout>
  );
};

const INITIAL_STATE = {
  email: null,
  password: null,
  error: null,
};

class SignInFormWrapper extends Component {
  static propTypes = {
    onAuthenticate: PropTypes.func,
  };

  static defaultProps = {
    onAuthenticate: d => d,
    history: null,
  };

  state = {...INITIAL_STATE};

  render() {
    const {onSubmit, disabled} = this.props;
    const {email, password, error} = this.state;

    const isInvalid = password === '' || email === '';
    // console.log('routerProps', this.props);

    return (
      <SignInForm
        disabled={disabled}
        onSubmit={() =>
          onSubmit({
            email,
            password,
            // onError: err => {
            //   console.log('ERROR in sign in', err);
            //   // this.setState({error: err});
            // }
          }).catch(err => {
            console.log('caught err', err.message);

            this.setState({error: err.message});
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

const btnClass =
  'uppercase bg-white text-2xl p-2 font-bold border-4 border-black';

const SignInForm = ({
  email,
  onSubmit,
  password,
  isInvalid,
  error,
  onPasswordChange,
  onEmailChange,
  disabled,
}) => (
  <form
    className="mb-1 "
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}>
    <div className="form-group">
      <input
        value={email}
        disabled={disabled}
        onChange={onEmailChange}
        type="text"
        placeholder="Email Address"
        className={inputClass}
      />
    </div>
    <div className="form-group">
      <input
        value={password}
        disabled={disabled}
        onChange={onPasswordChange}
        type="password"
        placeholder="Password"
        className="form-control"
        className={inputClass}
      />
    </div>
    <button
      className={btnClass}
      disabled={isInvalid}
      style={{width: '100%'}}
      type="submit">
      Sign In
    </button>
    {error !== null && (
      <div className="alert mt-3" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )}
  </form>
);

SignInForm.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  password: PropTypes.string,
  isInvalid: PropTypes.bool,
  error: PropTypes.string,
  onPasswordChange: PropTypes.func,
  onEmailChange: PropTypes.func,
};

SignInForm.defaultProps = {
  email: null,
  onSubmit: null,
  password: null,
  isInvalid: null,
  error: null,
  onPasswordChange: null,
  onEmailChange: null,
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
const mapStateToProps = state => ({
  userEnv: state.Session.userEnvSelectedId,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signIn,
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
  ...ownProps,
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  ),
)(SignInPage);

const SignInRedirectPure = ({userEnv}) => (
  <Redirect to={`/${userEnv}/${SIGN_IN.path}`} />
);

export const SignInRedirect = connect(mapStateToProps)(SignInRedirectPure);
