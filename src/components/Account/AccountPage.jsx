import React from 'react';
import PropTypes from 'prop-types';

import { css } from 'aphrodite';
import * as Icon from 'react-feather';

import { db } from 'Firebase';
import { BareModal, Modal, ModalBody } from 'Utils/Modal';
import { SignInModalBody } from 'Components/SignIn';
import { TagInput, PreviewTags, Tag } from 'Components/utils/Tag';

// import { skillTypes } from '../../dummyData';
import Card from 'Components/cards/ConnectedCard';
import ExtendableMarker from 'Components/utils/ExtendableMarker';

import { PreviewCard } from 'Cards';
import Stack from 'Utils/CardStack';

// import { FieldSet } from 'Components/utils/StyledComps';
// import setify from 'Utils/setify';

import { ScrollView, ScrollElement } from 'Utils/ScrollView';

import {
  GlobalThemeConsumer,
  stylesheet as defaultStylesheet
} from 'Src/styles/GlobalThemeContext';

import EditUserInfo from './EditUserInfo';

export default class AccountPage extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  componentDidMount() {
    const { fetchCards } = this.props;
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  render() {
    const {
      onClose,
      color,
      style,
      tagColorScale,
      // stylesheet,
      authUser,
      selectedCardId,
      extendedCardId,
      extendCard,
      selectCard,
      userInfoExtended,
      extendUserInfo,
      submitUserInfoToDB,
      setAuthUserInfo,
      errorUpdateUserMsg
    } = this.props;

    const {
      skills,
      interests,
      uid,
      createdCards,
      submittedCards,
      collectedCards,
      startedCards,
      succeededCards,
      name,
      username,
      email,
      photoURL,
      userTags
    } = authUser;

    return (
      <React.Fragment>
        <Modal visible={userInfoExtended}>
          <EditUserInfo
            title="Update User Info"
            onClose={extendUserInfo}
            tagColorScale={tagColorScale}
            errorMsg={errorUpdateUserMsg}
            onSubmit={usr => {
              setAuthUserInfo(usr);
              submitUserInfoToDB(usr);
            }}
            authUser={authUser}
            {...this.props}
          />
        </Modal>
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              overflowY: 'scroll'
            }}
            ref={c => (this.cont = c)}
          >
            <h3 className="mt-3">Account</h3>
            <div
              style={{
                position: 'relative',
                height: '65vw',
                maxHeight: 280,
                width: 'auto'
              }}
              className={`${css(defaultStylesheet.imgBorder)} mb-3`}
            >
              <div
                style={{
                  position: 'absolute',
                  // left: 0,
                  // top: 0,
                  height: '60vw',
                  maxHeight: 200,
                  width: 'auto',
                  padding: '20%'
                }}
              />
              <img
                className="mb-2"
                src={photoURL}
                style={{
                  height: '60vw',
                  width: 'auto',
                  // maxWidth: 200,
                  maxHeight: 200
                  // borderRadius: '50%'
                }}
                alt="alt"
              />
              <div
                style={{
                  height: '20%',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: 'xx-large',
                  alignItems: 'center',
                  fontFamily: '"Permanent Marker", Times, serif'
                }}
              >
                <div style={{ transform: 'rotate(-8deg)' }}>{username}</div>
              </div>
            </div>
            <div className="mb-3" style={{ width: '90%' }}>
              <div
                className="mb-1"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <h5 className="mr-1">Username:</h5>
                <div>{username}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                className="mb-1"
              >
                <h5 className="mr-1">email: </h5>
                <div>{email}</div>
              </div>
              <button
                style={{ width: '100%' }}
                className={css(defaultStylesheet.btn)}
                onClick={() => extendUserInfo()}
              >
                <Icon.Edit />
              </button>
            </div>
          </div>
        </ScrollView>
      </React.Fragment>
    );
  }
}
