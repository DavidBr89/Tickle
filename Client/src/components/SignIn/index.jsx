import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {withRouter, Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

import {signIn} from '~/reducers/Session/async_actions';
// import { compose } from 'recompose';

// import { bindActionCreators } from 'redux';

import {ModalBody} from '~/components/utils/Modal';

import {GEO_VIEW, SIGN_IN} from '~/constants/routeSpec';

import DefaultLayout from '~/components/DefaultLayout';
import {PasswordForgetLink} from '../Password';
import {SignUpLink} from '../SignUp';

import backgroundUrl from './signin_background.png';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const inputClass =
  'border-4 bg-white text-2xl py-2 px-3 text-grey-darkest border-black';

/**
 * SignIn component for the user
 * TODO untangle Redux functionality into another file
 */
const SignInPage = ({signIn, ...props}) => {
  const [error, setError] = useState(null);
  const {match, history} = props;
  const {
    params: {userEnv}
  } = match;

  return (
    <DefaultLayout
      className="flex flex-col relative"
      style={{
        backgroundImage: `url("${backgroundUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
      <div
        className="z-50 w-full absolute flex justify-center"
        style={{
          transform: `translateY(${error ? '0' : '-200%'})`,
          transition: 'transform 100ms'
        }}>
        <div className="max-w-md bg-white m-2 p-4 border-2 border-black shadow text-2xl">
          {error}
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-end items-center mb-32 ">
        <div className="w-3/4">
          <StatefulSignInForm
            {...props}
            disabled={!userEnv}
            onError={err => setError(err)}
            onSubmit={({email, password, onError}) =>
              signIn({
                userEnvId: userEnv,
                email,
                password,
                onError
              }).then(() => {
                history.push(`/${GEO_VIEW.path}`);
              })
            }
          />
          <div className="bg-white border-2 border-black p-2">
            <SignUpLink userEnv={userEnv} />
          </div>
          {!userEnv && (
            <div className="alert mt-3">
              You did not specify a user environment! Please change the
              URL
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
  error: null
};

class StatefulSignInForm extends React.Component {
  static propTypes = {
    onAuthenticate: PropTypes.func
  };

  static defaultProps = {
    onAuthenticate: d => d,
    history: null
  };

  state = {...INITIAL_STATE};

  render() {
    const {onSubmit, onError, disabled} = this.props;
    const {email, password} = this.state;

    const isInvalid = password === '' || email === '';
    // console.log('routerProps', this.props);

    return (
      <SignInForm
        disabled={disabled}
        onSubmit={() =>
          onSubmit({
            email,
            password
            // onError: err => {
            //   console.log('ERROR in sign in', err);
            //   // this.setState({error: err});
            // }
          }).catch(err => {
            onError(err.message);
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
  disabled
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
  </form>
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
const mapStateToProps = state => ({
  userEnv: state.Session.userEnvSelectedId
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signIn
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )
)(SignInPage);

const SignInRedirectPure = ({userEnv}) => (
  <Redirect to={`/${userEnv}/${SIGN_IN.path}`} />
);

export const SignInRedirect = connect(mapStateToProps)(
  SignInRedirectPure
);
