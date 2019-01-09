import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import uniq from 'lodash/uniq';

import {compose} from 'recompose';
import {connect} from 'react-redux';

import * as routes from 'Constants/routeSpec';

import PhotoUpload from 'Utils/PhotoUpload';

import {signUp} from 'Reducers/Session/async_actions';
import {SelectTag} from 'Components/utils/SelectField';

import DefaultLayout from 'Components/DefaultLayout';
import backgroundUrl from './signup_background.png';

const SignUpPage = ({match, ...props}) => {
  const {params} = match;
  const {admin, userEnv} = params;
  const isAdmin = admin === 'admin';

  console.log('admin', admin, 'params');
  return (
    <DefaultLayout
      style={{
        backgroundImage: `url("${backgroundUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
      menu={
        <div className="absolute w-full flex justify-center">
          <h1>
            SignUp
            {admin ? ' Admin' : null}
          </h1>
        </div>
      }>
      <div className="content-margin overflow-scroll flex flex-col flex-grow">
        <SignUpForm
          className="flex-grow"
          {...props}
          userEnv={userEnv}
          admin={isAdmin}
        />
      </div>
    </DefaultLayout>
  );
};

SignUpPage.propTypes = {
  admin: PropTypes.bool,
};

SignUpPage.defaultProps = {
  admin: false,
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
  loading: false,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null,
});

class SignUpForm extends Component {
  state = INITIAL_STATE;

  onSubmit = event => {
    event.preventDefault();
    const {username, email, fullname, passwordOne, img, interests} = this.state;
    const {history, admin, signUp, userEnv} = this.props;

    const user = {
      username,
      email,
      fullname,
      admin,
      interests,
    };

    this.setState({loading: true});

    signUp({
      user,
      img,
      userEnv,
      password: passwordOne,
    })
      .then(() => {
        this.setState(() => ({...INITIAL_STATE}));
        history.push(`/${userEnv}/${routes.GEO_VIEW.path}`);
      })
      .catch(error => {
        console.log('error', error);
        this.setState({error, loading: false});
      });

    event.preventDefault();
  };

  render() {
    const {className} = this.props;
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      img,
      loading,
      fullname,
      interests,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    // img === null;
    const formGroup = 'flex flex-wrap mb-3 flex-no-shrink';
    return (
      <form className={`${className} flex flex-col`} onSubmit={this.onSubmit}>
        <div
          className="form-group flex flex-col"
          style={{flex: 0.5, minHeight: 300}}>
          <PhotoUpload
            className="flex-grow flex flex-col"
            imgUrl={img !== null ? img.url : null}
            onChange={img => {
              this.setState(byPropKey('img', img));
            }}
          />
        </div>
        <div className={formGroup}>
          <input
            className="flex-grow form-control mr-1 mb-3"
            value={fullname || ''}
            onChange={event =>
              this.setState(byPropKey('fullname', event.target.value))
            }
            type="text"
            placeholder="Full Name"
          />
          <input
            className="form-control flex-grow mb-3"
            value={username}
            onChange={event =>
              this.setState(byPropKey('username', event.target.value))
            }
            type="text"
            placeholder="Username"
          />
        </div>
        <div className={formGroup}>
          <input
            value={email}
            className="form-control flex-grow"
            onChange={event =>
              this.setState(byPropKey('email', event.target.value))
            }
            type="text"
            placeholder="Email Address"
          />
        </div>

        <div className={`${formGroup} flex-col`}>
          <SelectTag
            placeholder="Select Interests"
            inputClassName="flex-grow p-2 border-2 border-black"
            className="flex-grow"
            idAcc={d => d.id}
            onChange={tag =>
              this.setState({interests: uniq([...interests, tag])})
            }
            values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
          />
          <div className="flex mt-2">
            {interests.length === 0 && (
              <div className="tag-label bg-grey mb-1 mt-1">No Interests</div>
            )}
            {interests.map(d => (
              <div className="tag-label mr-1 mt-1 mb-1 bg-black">{d}</div>
            ))}
          </div>
        </div>
        <div className={formGroup}>
          <input
            className="form-control flex-grow mr-1 mb-2"
            value={passwordOne}
            onChange={event =>
              this.setState(byPropKey('passwordOne', event.target.value))
            }
            type="password"
            placeholder="Password"
          />
          <input
            className="form-control flex-grow mb-2"
            value={passwordTwo}
            onChange={event =>
              this.setState(byPropKey('passwordTwo', event.target.value))
            }
            type="password"
            placeholder="Confirm Password"
          />
        </div>
        <div
          className="flex-no-shrink mt-2 mb-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <button
            className="btn btn-shadow bg-white w-full"
            disabled={isInvalid}
            type="submit">
            Sign Up
          </button>
        </div>
        {error && (
          <div className="ml-2 alert alert-danger">{error.message}</div>
        )}
        {!error &&
          loading && (
          <div clasName="ml-2" style={{fontSize: 'large'}}>
              Loading...
            </div>
        )}
      </form>
    );
  }
}

const SignUpLink = ({userEnv}) => (
  <div>
    <p className="text-lg mb-1">
      Do not have an account?{' '}
      <Link to={`/${userEnv}/${routes.SIGN_UP.path}`}>Sign Up</Link>
    </p>
    <p className="text-lg">
      Or register as Administrator?{' '}
      <Link to={`/${userEnv}/${routes.SIGN_UP.path}/admin`}>Sign Up</Link>
    </p>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({signUp}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps,
    mergeProps,
  ),
)(SignUpPage);

export {SignUpForm, SignUpLink};
