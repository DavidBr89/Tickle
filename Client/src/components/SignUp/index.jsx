import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import uniq from 'lodash/uniq';

import {compose} from 'recompose';
import {connect} from 'react-redux';

import * as routes from '~/constants/routeSpec';

import PhotoUpload from '~/components/utils/PhotoUpload';

import * as sessionActions from '~/reducers/Session/async_actions';
import {SelectTags} from '~/components/utils/SelectField';
import {PrevBtn, NextBtn} from '~/components/utils/PrevNextBtn';
import styledComp from '~/components/utils/styledComp';

import DefaultLayout from '~/components/DefaultLayout';
import TabSwitcher from '~/components/utils/TabSwitcher';

import useMergeState from '~/components/utils/useMergeState';

import backgroundUrl from './signup_background.png';

import validateEmail from '~/components/utils/validateEmail';

const EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use';

const SignUpPage = ({match, ...props}) => {
  const {params} = match;
  const {admin, userEnv} = params;
  const isAdmin = admin === 'admin';

  return (
    <DefaultLayout
      style={
        {
          // backgroundImage: `url("${backgroundUrl}")`,
          // backgroundRepeat: 'no-repeat',
          // backgroundSize: 'cover'
        }
      }
      menu={
        <div className="absolute w-full flex justify-center">
          <h1>
            SignUp
            {admin ? ' Admin' : null}
          </h1>
        </div>
      }>
      <div className="overflow-scroll flex flex-col flex-grow justify-end">
        <SignUpForm
          className="flex-grow flex flex-col"
          {...props}
          userEnvId={userEnv}
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
  firstName: null,
  lastName: null,
  passwordOne: '',
  passwordTwo: '',
  error: null,
  img: {url: null},
  interests: [],
  loading: false
};

const StyledInput = ({style, className, children, ...rest}) => (
  <div className={className} style={style}>
    <input
      className="w-full form-control flex-grow mb-3 text-2xl"
      {...rest}
    />
  </div>
);
// 'form-control flex-grow mb-3 text-2xl'
// const StyledInput = styledComp({
//   element: 'input',
//   className: 'form-control flex-grow mb-3 text-2xl'
// });

const FormGroup = ({style, className, children, ...rest}) => (
  <div
    className={`flex flex-col flex-wrap mb-3 flex-grow flex-no-shrink justify-end ${className}`}
    style={style}>
    <div className="w-full px-16 py-4">{children}</div>
  </div>
);

// const FormGroup = styledComp({
//   element: 'div',
//   className:
//     'flex flex-col flex-wrap mb-3 flex-grow flex-no-shrink justify-end'
// });
//
const prevNextClass = 'bg-white w-full text-xl p-1';
const StyledPrevBtn = styledComp({
  element: PrevBtn,
  className: prevNextClass
});

const StyledNextBtn = styledComp({
  element: NextBtn,
  className: prevNextClass
});

const SignUpForm = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleTabIndex, setVisibleTabIndex] = useState(0);
  const [userProfile, setUserProfile] = useMergeState(INITIAL_STATE);

  const {
    history,
    admin,
    signUp,
    updateAuthUser,
    userEnvId,
    className
  } = props;

  const goNextIndex = () => {
    setVisibleTabIndex(Math.min(4, visibleTabIndex + 1));
    setError(null);
  };
  const goPrevIndex = () =>
    setVisibleTabIndex(Math.max(0, visibleTabIndex - 1));

  const {
    username,
    email,
    passwordOne,
    passwordTwo,
    img,
    firstName,
    lastName,
    interests
  } = userProfile;

  const onSubmit = event => {
    event.preventDefault();
    if (passwordOne !== passwordTwo)
      return setError({message: 'Password is not correct'});

    setIsLoading(true);

    signUp({
      user: userProfile,
      img,
      userEnvId,
      password: passwordOne
    })
      .then(() => {
        goNextIndex();
        // setUserProfile(() => ({...INITIAL_STATE}));
      })
      .catch(err => {
        setIsLoading(false);
        console.log('newError', err);
        if (err.code === EMAIL_ALREADY_IN_USE) {
          setVisibleTabIndex(1);
        }

        setError(err);
      });

    event.preventDefault();
  };

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  return (
    <form onSubmit={onSubmit} className={`${className} flex flex-col`}>
      {!error && isLoading && (
        <div className="m-auto" style={{fontSize: 'large'}}>
          Loading...
        </div>
      )}

      {error && <div className="m-6 alert">{error.message}</div>}
      <TabSwitcher
        visibleIndex={visibleTabIndex}
        className="flex-no-shrink flex flex-col"
        tabClassName="flex-grow justify-end">
        <FormGroup
          style={{
            backgroundImage: `url("${backgroundUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}>
          <StyledInput
            value={firstName}
            onChange={event =>
              setUserProfile({firstName: event.target.value})
            }
            type="text"
            placeholder="First Name"
          />
          <StyledInput
            value={lastName}
            onChange={event =>
              setUserProfile({lastName: event.target.value})
            }
            type="text"
            placeholder="Last name"
          />
          <StyledNextBtn
            onClick={() => {
              if (firstName && lastName) {
                goNextIndex();
              } else {
                setError({
                  message: 'Please specifiy first or lastName!'
                });
              }
            }}>
            Enter Email
          </StyledNextBtn>
        </FormGroup>
        <FormGroup>
          <StyledInput
            value={email}
            onChange={event => {
              setUserProfile({email: event.target.value});
            }}
            type="email"
            placeholder="Email Address"
          />
          <StyledInput
            value={username}
            onChange={event =>
              setUserProfile({username: event.target.value})
            }
            type="text"
            placeholder="Username"
          />
          <div className="w-full flex">
            <StyledPrevBtn
              className="flex-grow mr-2"
              onClick={goPrevIndex}>
              Enter Name
            </StyledPrevBtn>
            <StyledNextBtn
              className="flex-grow"
              onClick={() => {
                if (username && validateEmail(email)) {
                  return goNextIndex();
                }
                setError({
                  message: 'email or username is not correct'
                });
              }}>
              Enter Interests
            </StyledNextBtn>
          </div>
        </FormGroup>

        <FormGroup>
          <SelectTags
            placeholder="Select Interests"
            inputClassName="flex-grow p-2 border-2 border-black text-xl"
            className="flex-grow"
            idAcc={d => d.id}
            onChange={tag =>
              setUserProfile({
                interests: uniq([...interests, tag])
              })
            }
            values={[{id: 'sports'}, {id: 'yeah'}, {id: 'doooh'}]}
          />
          <div className="flex mt-2 mb-3">
            {interests.length === 0 && (
              <div className="tag-label bg-grey p-2 text-2xl text-white mb-2 mt-1">
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
            <StyledPrevBtn
              className="flex-grow mr-2"
              onClick={goPrevIndex}>
              Enter Email
            </StyledPrevBtn>
            <StyledNextBtn
              className="flex-grow"
              onClick={() => {
                goNextIndex();
              }}>
              Enter Password
            </StyledNextBtn>
          </div>
        </FormGroup>
        <FormGroup>
          <StyledInput
            value={passwordOne}
            onChange={event =>
              setUserProfile({passwordOne: event.target.value})
            }
            type="password"
            placeholder="Password"
          />
          <StyledInput
            value={passwordTwo}
            onChange={event =>
              setUserProfile({passwordTwo: event.target.value})
            }
            type="password"
            placeholder="Confirm Password"
          />
          <div className="flex ">
            <StyledPrevBtn className="mr-2" onClick={goPrevIndex}>
              Enter Interests
            </StyledPrevBtn>
            <StyledNextBtn
              type="submit
              ">
              Sign Up
            </StyledNextBtn>
          </div>
        </FormGroup>
        <FormGroup className="flex-grow flex flex-col">
          <PhotoUpload
            className="flex-grow mb-2"
            {...img}
            onChange={newImg => {
              updateAuthUser({img: newImg});
              setUserProfile({img: newImg});
            }}
          />
          <StyledNextBtn
            className="mr-2"
            onClick={() => history.push(`/${routes.GEO_VIEW.path}`)}>
            Go!
          </StyledNextBtn>
        </FormGroup>
      </TabSwitcher>
    </form>
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
  bindActionCreators(sessionActions, dispatch);

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
