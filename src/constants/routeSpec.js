export const TAGS = 'TAGS';
export const GEO = 'GEO';
export const TopicMap = 'topic-map';

export const SIGN_UP_PATH = '/signup';
export const SIGN_IN_PATH = '/signin';
export const LANDING_PATH = '/';

export const DATAVIEW_PATH = '/dataview';
export const GEO_VIEW_PATH = `${DATAVIEW_PATH}/${GEO}`;
export const TOPICMAP_VIEW_PATH = `${DATAVIEW_PATH}/${TopicMap}`;
export const TAG_VIEW_PATH = `${DATAVIEW_PATH}/${TAGS}`;

export const AUTHOR_PATH = '/card_authoring';
export const GEO_AUTHOR_PATH = `${AUTHOR_PATH}/${GEO}`;
export const TOPIC_AUTHOR_PATH = `${AUTHOR_PATH}/${TopicMap}`;
export const TAG_AUTHOR_PATH = `${AUTHOR_PATH}/${TAGS}`;

export const ACCOUNT_PATH = '/account';
export const ADMIN_PATH = '/admin';
export const PASSWORD_FORGET_PATH = '/pw-forget';
export const HOME_PATH = '/home';
export const MYCARDS_PATH = '/my-cards';
export const ADMIN_SIGN_UP_PATH = '/signup-admin';

export const HOME = {name: 'Home', path: HOME_PATH, subRoutes: []};
export const MYCARDS = {
  name: 'My Cards',
  path: MYCARDS_PATH,
  subRoutes: []
};

export const SIGN_IN = {
  name: 'Sign In',
  path: SIGN_IN_PATH,
  subRoutes: []
};

export const SIGN_UP = {
  name: 'Sign In',
  path: SIGN_UP_PATH,
  subRoutes: []
};

export const ADMIN_SIGN_UP = {
  name: 'ADMIN_SIGN_UP',
  path: ADMIN_SIGN_UP_PATH,
  subRoutes: []
};

export const LANDING = {
  name: 'Landing',
  path: LANDING_PATH,
  subRoutes: []
};

export const GEO_VIEW = {name: 'Geo View', path: GEO_VIEW_PATH};
export const TOPIC_VIEW = {name: 'Topic Map', path: TOPICMAP_VIEW_PATH};
export const TAG_VIEW = {name: 'Tag View', path: TAG_VIEW_PATH};

export const DATAVIEW = {
  name: 'Card View',
  path: GEO_VIEW_PATH,
  subRoutes: [GEO_VIEW, TOPIC_VIEW, TAG_VIEW],
};

export const GEO_AUTHOR = {name: 'Geo', path: GEO_AUTHOR_PATH};
export const TOPIC_AUTHOR = {name: 'FloorPlan', path: TOPIC_AUTHOR_PATH};
export const TAG_AUTHOR = {name: 'Topic', path: TAG_AUTHOR_PATH};

export const AUTHOR = {
  name: 'Author Cards',
  // TODO: change later
  path: GEO_AUTHOR_PATH,
  subRoutes: [GEO_AUTHOR, TOPIC_AUTHOR]
};

export const ACCOUNT = {name: 'Account', path: ACCOUNT_PATH};
export const ADMIN = {name: 'Admin', path: ADMIN_PATH};

export const PASSWORD_FORGET = {
  name: 'Forget Password ?',
  path: PASSWORD_FORGET_PATH
};

export const routes = [
  HOME,
  SIGN_IN,
  LANDING,
  DATAVIEW,
  AUTHOR,
  PASSWORD_FORGET,
  ADMIN,
  ACCOUNT,
  MYCARDS,
];

export const authRoutes = [
  // ...HOME_ROUTE,
  DATAVIEW,
  // ...MYCARDS_ROUTE,
  // ...AUTHOR_ROUTE,
  // TODO: change
  // ...ADMIN_ROUTE,
  ACCOUNT,
  MYCARDS
];

export const adminRoutes = [HOME, DATAVIEW, AUTHOR, ADMIN, ACCOUNT, MYCARDS];

export const nonAuthRoutes = [HOME, SIGN_IN, LANDING, PASSWORD_FORGET];
