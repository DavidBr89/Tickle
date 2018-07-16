export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const LANDING = '/';
export const MAP = '/map';
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const PASSWORD_FORGET = '/pw-forget';
export const HOME = '/home';

export const Routes = {
  HOME: { name: 'HOME', path: HOME },
  SIGN_IN: { name: 'Sign In', path: SIGN_IN },
  LANDING: { name: 'Landing', path: LANDING },
  MAP: { name: 'Map', path: MAP },
  ACCOUNT: { name: 'Account', path: ACCOUNT },
  ADMIN: { name: 'Admin', path: ADMIN },
  PASSWORD_FORGET: { name: 'Forget Password ?', path: PASSWORD_FORGET }
};

export const authRoutes = {
  HOME: { name: 'HOME', path: HOME },
  LANDING: { name: 'Landing', path: LANDING },
  MAP: { name: 'Map', path: MAP },
  ACCOUNT: { name: 'Account', path: ACCOUNT },
  ADMIN: { name: 'Admin', path: ADMIN }
};

export const nonAuthRoutes = {
  SIGN_IN: { name: 'Sign In', path: SIGN_IN },
  LANDING: { name: 'Landing', path: LANDING },
  PASSWORD_FORGET: { name: 'Forget Password ?', path: PASSWORD_FORGET }
};
