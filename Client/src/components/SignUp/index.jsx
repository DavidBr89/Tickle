import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import uniq from 'lodash/uniq';
// import styled from 'styled-components';

import {compose} from 'recompose';
import {connect} from 'react-redux';

import * as routes from 'Src/constants/routeSpec';

import PhotoUpload from 'Src/components/utils/PhotoUpload';

import {signUp} from 'Src/reducers/Session/async_actions';
import {SelectTag} from 'Src/components/utils/SelectField';
import {PrevBtn, NextBtn} from 'Src/components/utils/PrevNextBtn';

import DefaultLayout from 'Src/components/DefaultLayout';
import TabSwitcher from 'Src/components/utils/TabSwitcher';

import useMergeState from 'Src/components/utils/useMergeState';

import backgroundUrl from './signup_background.png';

const SignUpPage = ({match, ...props}) => {
  const {params} = match;
  const {admin, userEnv} = params;
  const isAdmin = admin === 'admin';

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
  img: {url: null },
  interests: [],
  loading: false
};

const SignUpForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleTabIndex, setVisibleTabIndex] = useState(0);
  const [userProfileState, setUserProfileState] = useState(INITIAL_STATE);

  const {history, admin, signUp, userEnv, className} = props;

  const goNextIndex = () =>
    setVisibleTabIndex(Math.min(4, visibleTabIndex + 1));
  const goPrevIndex = () =>
    setVisibleTabIndex(Math.max(0, visibleTabIndex - 1));

  const {
    username,
    email,
    passwordOne,
    passwordTwo,
    img,
    fullname,
    interests
  } = userProfileState;

  const user = {
    username,
    email,
    fullname,
    admin,
    interests
  };

  const onSubmit = event => {
    event.preventDefault();

    setIsLoading(true);

    signUp({
      user,
      img,
      userEnv,
      password: passwordOne
    })
      .then(() => {
        setUserProfileState(() => ({...INITIAL_STATE}));
        history.push(`/${userEnv}/${routes.GEO_VIEW.path}`);
      })
      .catch(newError => {
        setIsLoading(false);
        setError(newError);
      });

    event.preventDefault();
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';
  // img === null;
  const StyledInput = props => (
    <input className="form-control flex-grow mb-3" {...props} />
  );

  const FormGroup = props => (
    <div
      className="flex flex-col flex-wrap mb-3 flex-no-shrink"
      {...props}
    />
  );

  return (
    <div>
      <div
        className="form-group flex flex-col"
        style={{flex: 0.5, minHeight: 300}}>
        <PhotoUpload
          className="flex-grow flex flex-col"
          imgUrl={img.url}
          onChange={newImg => {
            setUserProfileState({img: newImg});
          }}
        />
      </div>
      <TabSwitcher
        visibleIndex={visibleTabIndex}
        className={`${className} flex flex-col`}
        onSubmit={onSubmit}>
        <FormGroup>
          <input
            className="flex-grow form-control mr-1 mb-3"
            value={fullname || ''}
            onChange={event => setUserProfileState(event.target.value)}
            type="text"
            placeholder="First Name"
          />
          <StyledInput
            className="flex-grow form-control mr-1 mb-3"
            value={fullname || ''}
            onChange={event => setUserProfileState(event.target.value)}
            type="text"
            placeholder="Last name"
          />
          <NextBtn onClick={goNextIndex}>Enter Email</NextBtn>
        </FormGroup>
        <FormGroup>
          <StyledInput
            value={email}
            onChange={event =>
              setUserProfileState({email: event.target.value})
            }
            type="text"
            placeholder="Email Address"
          />
          <StyledInput
            value={username}
            onChange={event =>
              setUserProfileState({username: event.target.value})
            }
            type="text"
            placeholder="Username"
          />
          <div className="w-full flex">
            <PrevBtn className="flex-grow mr-2" onClick={goPrevIndex}>
              Enter Name
            </PrevBtn>
            <NextBtn className="flex-grow" onClick={goNextIndex}>
              Enter Interests
            </NextBtn>
          </div>
        </FormGroup>

        <FormGroup>
          <SelectTag
            placeholder="Select Interests"
            inputClassName="flex-grow p-2 border-2 border-black"
            className="flex-grow"
            idAcc={d => d.id}
            onChange={tag =>
              setUserProfileState({
                interests: uniq([...interests, tag])
              })
            }
            values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
          />
          <div className="flex mt-2 mb-3">
            {interests.length === 0 && (
              <div className="tag-label bg-grey text-2xl text-white mb-1 mt-1">
                No Interests
              </div>
            )}
            {interests.map(d => (
              <div className="tag-label text-white mr-1 mt-1 mb-1 bg-black">
                {d}
              </div>
            ))}
          </div>
          <div className="flex">
            <PrevBtn className="flex-grow mr-2" onClick={goPrevIndex}>
              Enter Email
            </PrevBtn>
            <NextBtn className="flex-grow" onClick={goNextIndex}>
              Enter Password
            </NextBtn>
          </div>
        </FormGroup>
        <FormGroup>
          <StyledInput
            value={passwordOne}
            onChange={event =>
              setUserProfileState({passwordOne: event.target.value})
            }
            type="password"
            placeholder="Password"
          />
          <StyledInput
            value={passwordTwo}
            onChange={event =>
              setUserProfileState({passwordTwo: event.target.value})
            }
            type="password"
            placeholder="Confirm Password"
          />
          <div className="flex ">
            <PrevBtn
              className="mr-2"
              style={{flexGrow: 0.3}}
              onClick={goPrevIndex}>
              Enter Interests
            </PrevBtn>
            <button
              style={{flexGrow: 0.7}}
              className="flex-grow btn btn-shadow bg-white mr-2"
              disabled={isInvalid}
              type="submit">
              Sign Up
            </button>
          </div>
        </FormGroup>
      </TabSwitcher>
      {error && (
        <div className="ml-2 alert alert-danger">{error.message}</div>
      )}
      {!error && isLoading && (
        <div clasName="ml-2" style={{fontSize: 'large'}}>
          Loading...
        </div>
      )}
    </div>
  );
};

const SignUpLink = ({userEnv}) => (
  <div>
    <p className="text-lg mb-1">
      Do not have an account?{' '}
      <Link to={`/${userEnv}/${routes.SIGN_UP.path}`}>Sign Up</Link>
    </p>
    <p className="text-lg">
      Or register as Administrator?{' '}
      <Link to={`/${userEnv}/${routes.SIGN_UP.path}/admin`}>
        Sign Up
      </Link>
    </p>
  </div>
);

const mapDispatchToProps = dispatch =>
  bindActionCreators({signUp}, dispatch);

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

export {SignUpForm, SignUpLink};
