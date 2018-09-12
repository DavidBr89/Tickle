import { TAGS, GEO, FLOORPLAN } from './dataViews';

export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const LANDING = '/';

export const DATAVIEW = '/dataview';
export const DATAVIEW_GEO = `${DATAVIEW}/${GEO}`;
export const DATAVIEW_FLOORPLAN = `${DATAVIEW}/${FLOORPLAN}`;
export const DATAVIEW_TAGS = `${DATAVIEW}/${TAGS}`;

export const AUTH_ENV = '/card_authoring';
export const AUTH_ENV_GEO = `${AUTH_ENV}/${GEO}`;
export const AUTH_ENV_FLOORPLAN = `${AUTH_ENV}/${FLOORPLAN}`;
export const AUTH_ENV_TAGS = `${AUTH_ENV}/${TAGS}`;

export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const PASSWORD_FORGET = '/pw-forget';
export const HOME = '/home';
export const MYCARDS = '/my-cards';

const HOME_ROUTE = { HOME: { name: 'Home', path: HOME, subRoutes: [] } };
const MYCARDS_ROUTE = {
  MYCARDS: { name: 'My Cards', path: MYCARDS, subRoutes: [] }
};

const SIGN_IN_ROUTE = {
  SIGN_IN: { name: 'Sign In', path: SIGN_IN, subRoutes: [] }
};
const LANDING_ROUTE = {
  LANDING: { name: 'Landing', path: LANDING, subRoutes: [] }
};
const DATAVIEW_ROUTE = {
  DATAVIEW: {
    name: 'Card View',
    // TODO: change later
    path: DATAVIEW_GEO,
    subRoutes: [
      // { name: 'Geo', path: DATAVIEW_GEO },
      // { name: 'Treasure Map', path: DATAVIEW_FLOORPLAN },
      // { name: 'Topic', path: DATAVIEW_TAGS }
    ]
  }
};

const AUTH_ENV_ROUTE = {
  AUTH_ENV: {
    name: 'Author Cards',
    // TODO: change later
    path: AUTH_ENV_GEO,
    subRoutes: [
      // { name: 'Geo', path: AUTH_ENV_GEO }
      // { name: 'FloorPlan', path: AUTH_ENV_FLOORPLAN },
      // { name: 'Topic', path: AUTH_ENV_TAGS }
    ]
  }
};
const ACCOUNT_ROUTE = { ACCOUNT: { name: 'Account', path: ACCOUNT } };
const ADMIN_ROUTE = { ADMIN: { name: 'Admin', path: ADMIN } };

const PASSWORD_FORGET_ROUTE = {
  PASSWORD_FORGET: { name: 'Forget Password ?', path: PASSWORD_FORGET }
};

export const Routes = {
  ...HOME_ROUTE,
  ...SIGN_IN_ROUTE,
  ...LANDING_ROUTE,
  ...DATAVIEW_ROUTE,
  ...AUTH_ENV_ROUTE,
  ...PASSWORD_FORGET_ROUTE,
  ...ADMIN_ROUTE,
  ...ACCOUNT_ROUTE,
  ...MYCARDS_ROUTE,
  ...PASSWORD_FORGET_ROUTE
};

export const authRoutes = {
  // ...HOME_ROUTE,
  ...DATAVIEW_ROUTE,
  // ...MYCARDS_ROUTE,
  ...AUTH_ENV_ROUTE,
  // TODO: change
  // ...ADMIN_ROUTE,
  ...ACCOUNT_ROUTE
};

export const adminRoutes = {
  ...HOME_ROUTE,
  ...DATAVIEW_ROUTE,
  ...AUTH_ENV_ROUTE,
  ...ADMIN_ROUTE,
  ...ACCOUNT_ROUTE,
  ...MYCARDS_ROUTE
};

export const nonAuthRoutes = {
  ...HOME_ROUTE,
  ...SIGN_IN_ROUTE,
  ...LANDING_ROUTE,
  ...PASSWORD_FORGET_ROUTE
};
