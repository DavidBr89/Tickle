import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SignInModalBody } from 'Components/SignIn';
import PhotoUpload from 'Components/utils/PhotoUpload';
import { userFields, compareUserFields } from 'Constants/userFields';

import { css } from 'aphrodite';
import { TagInput, PreviewTags, Tag } from 'Components/utils/Tag';

import { ModalBody } from 'Utils/Modal';

import {
  GlobalThemeConsumer,
  stylesheet as defaultStylesheet
} from 'Src/styles/GlobalThemeContext';

class EditUserPhoto extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = { url: this.props.url };

  render() {
    const { url, imgName } = this.state;
    const { onChange } = this.props;
    return (
      <PhotoUpload
        {...this.props}
        title="Change Image"
        imgUrl={url}
        imgName={imgName}
        maxHeight={200}
        onChange={({ url, file }) => {
          onChange({ photoURL: url, file });
          this.setState({ url, imgName: file.name });
        }}
      />
    );
  }
}

class UserInfoModalBody extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    errorMsg: null
  };

  state = {
    authUser: this.props.authUser,
    userUpdated: false,
    authenticated: false
  };

  conditionalSubmit = () => {
    const { userUpdated, authUser } = this.state;
    const { onSubmit, onClose } = this.props;

    if (userUpdated) {
      onSubmit(authUser);
      this.setState({ userUpdated: false });
    }
    // onClose();
  };

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { authUser: oldUser } = prevState;
    const { authUser } = this.state;

    const { passwordOne, passwordTwo } = authUser;
    const { passwordOne: oldPwOne, passwordTwo: oldPwTwo } = oldUser;
    if (
      !compareUserFields(oldUser, authUser) ||
      (passwordOne !== oldPwOne || passwordTwo !== oldPwTwo)
    ) {
      this.setState({ userUpdated: true });
      // onChange(authUser);
    }

    // if (prevState.userUpdated && compareUserFields(oldUser, authUser))
    //   this.setState({ userUpdated: false });
  }

  renderUpdateUserModal = () => {
    const { onChange, tagColorScale, title } = this.props;
    const {
      onSubmit,
      username,
      name,
      email,
      photoURL,
      interests
    } = this.state.authUser;

    const setUserField = field =>
      this.setState(({ authUser: oldAuthUser }) => ({
        authUser: { ...oldAuthUser, ...field }
      }));

    console.log('photoURL', photoURL);
    return (
      <React.Fragment>
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="fullname">User Photo:</label>
            <div
              style={{
                display: 'flex',
                width: '100%'
                // justifyContent: 'center'
              }}
            >
              <EditUserPhoto
                style={{ width: 200 }}
                url={photoURL}
                onChange={({ file, photoURL: newImgUrl }) =>
                  setUserField({ file, photoURL: newImgUrl })
                }
              />

              <div className="ml-3">
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <div>
                    <input
                      className="form-control"
                      style={{ width: 'unset' }}
                      value={username || ''}
                      onChange={e => setUserField({ username: e.target.value })}
                      type="text"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="interests">Interests:</label>
                  <TagInput
                    className="form-group"
                    tags={interests}
                    colorScale={tagColorScale}
                    uiColor="grey"
                    onChange={newInterests =>
                      setUserField({ interests: newInterests })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div>
              <input
                className="form-control"
                value={email || ''}
                onChange={e => setUserField({ email: e.target.value })}
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <div>
              <input
                className="form-control"
                value={name || ''}
                onChange={e => setUserField({ name: e.target.value })}
                type="text"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pwd">Change Password:</label>
            <div>
              <input
                className="form-control"
                onChange={e => setUserField({ passwordOne: e.target.value })}
                type="password"
                placeholder="Password"
              />
            </div>
            <input
              className="form-control"
              onChange={e => setUserField({ passwordTwo: e.target.value })}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { onChange, tagColorScale, title, errorMsg, onClose } = this.props;
    const { authenticated, cachedUser, userUpdated } = this.state;
    const {
      onSubmit,
      username,
      name,
      email,
      photoURL,
      interests,
      uid,
      passwordOne,
      passwordTwo
    } = this.props.authUser;

    return (
      <ModalBody
        onClose={() => {
          onClose();
        }}
        title={title}
        footer={
          <React.Fragment>
            <div className="mr-1">{errorMsg}</div>
            <button
              className={css(defaultStylesheet.btn)}
              onClick={this.conditionalSubmit}
              disabled={!userUpdated}
            >
              Update
            </button>
          </React.Fragment>
        }
      >
        {this.renderUpdateUserModal()}
      </ModalBody>
    );
  }
}

export default class EditUserInfo extends React.Component {
  state = { authenticated: false };
  render() {
    const { authenticated } = this.state;
    if (authenticated) return <UserInfoModalBody {...this.props} />;
    return (
      <SignInModalBody
        onClose={this.props.onClose}
        title="User Sign-In"
        onAuthenticate={() => this.setState({ authenticated: true })}
      />
    );
  }
}
