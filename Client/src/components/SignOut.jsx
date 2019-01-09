import React from 'react';

import { auth } from 'Firebase';

const SignOutButton = () => (
  <button
    type="button"
    className="btn"
    onClick={auth.doSignOut}
  >
    Sign Out
  </button>
);

export default SignOutButton;
