import React from 'react';

import { auth } from '~/firebase';

/**
 * This function adds one to its input.
 * @param {number} input any number
 * @returns {number} that number, plus one.
 */
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
