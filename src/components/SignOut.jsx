import React from 'react';

import { auth } from 'Firebase';

import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';

const SignOutButton = () => (
  <button
    type="button"
    className={css(stylesheet.bareBtn)}
    onClick={auth.doSignOut}
  >
    Sign Out
  </button>
);

export default SignOutButton;
