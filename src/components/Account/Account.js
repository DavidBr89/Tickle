import React from 'react';

// import AuthUserContext from '../AuthUserContext';
import { PasswordForgetForm, PasswordChangeForm } from '../Password';

import Author from '../cards/CardBack/Author';

import { GlobalThemeConsumer } from 'Src/styles/GlobalThemeContext';

const AccountPage = ({ authUser = { uid: '000' } }) => (
  <div>
    <h1>Account: {authUser.email}</h1>
    <GlobalThemeConsumer>{({ stylesheet }) => <div />}</GlobalThemeConsumer>
  </div>
);

export default AccountPage;
