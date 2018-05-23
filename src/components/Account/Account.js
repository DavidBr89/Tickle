import React from 'react';

import AuthUserContext from '../AuthUserContext';
import { PasswordForgetForm, PasswordChangeForm } from '../Password';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default AccountPage;
