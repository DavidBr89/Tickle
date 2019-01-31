import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Link, withRouter} from 'react-router-dom';

import {compose} from 'recompose';

import {
  authRoutes,
  adminRoutes,
  nonAuthRoutes
} from '~/constants/routeSpec';

import SignOutButton from './SignOut';

const includePath = (pathA, pathB) => {
  const [splA, splB] = [pathA.split('/'), pathB.split('/')].map(p =>
    p.filter(s => s !== '#' && s !== '')
  );
  return splA[0] === splB[0];
};

const listItemClass = 'mb-1 p-2 text-xl cursor-pointer';

const ListItem = ({
  name,
  path,
  curPath,
  active,
  children,
  subRoutes = []
}) => (
  <li className={listItemClass}>
    <div
      className={`${subRoutes.length > 0 &&
        listItemClass} ${includePath(curPath, path) && 'active'}`}>
      <Link className="link" to={`/${path}`}>
        {children}
      </Link>
    </div>
    <ul className="ml-5 list-reset">
      {subRoutes.map(d => (
        <li
          className={`${listItemClass} border-black border-2 ${curPath ===
            d.path && 'active'} `}>
          <Link to={`/${d.path}`} className="link">
            {d.name}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

const NavigationHelper = ({
  activePath,
  location,
  routes,
  signOut,
  children,
  userEnv
}) => (
  <ul className="list-reset">
    {routes.map(r => (
      <ListItem {...r} curPath={location.pathname}>
        {children(r)}
      </ListItem>
    ))}
    {signOut && (
      <li>
        <SignOutButton userEnv={userEnv} />
      </li>
    )}
  </ul>
);

NavigationHelper.propTypes = {
  signOut: PropTypes.boolean
};

NavigationHelper.defaultProps = {
  signOut: false
};

/**
 * Utility to map routes to session state i.e. authenticated,
 * not authenticated and admin
 */
const RouteNavigation = ({authUser, match, ...props}) => {
  const {
    params: {userEnv: selectedUserEnvId}
  } = match;
  if (authUser) {
    if (authUser.admin) {
      return (
        <NavigationHelper {...props} signOut routes={adminRoutes} />
      );
    }
    return <NavigationHelper {...props} signOut routes={authRoutes} />;
  }
  return <NavigationHelper {...props} routes={nonAuthRoutes} />;
};

const mapStateToProps = state => ({
  ...state.Session
});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(RouteNavigation);
