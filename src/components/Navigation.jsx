import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Link, withRouter} from 'react-router-dom';

import SignOutButton from './SignOut';
// import * as routes from 'Constants/routeSpec';

import AuthUserContext from './AuthUserContext';

import {
  DATAVIEW,
  authRoutes,
  adminRoutes,
  nonAuthRoutes
} from 'Constants/routeSpec';

// import { setDataView } from 'Reducers/DataView/actions';

// const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

// const authRoutes = [routes.LANDING, routes.DATAVIEW, routes.ADMIN];
// const authRoutesNames = ['Home', 'Card View', 'Admin'];
// const DataViewSubList = ({ stylesheet, setDataView }) => (
//   <div>
//     <button onClick={() => setDataView('geo')}>Map</button>
//     <button onClick={() => setDataView('floorplan')}>Floor</button>
//     <button onClick={() => setDataView('topic')}>Topic</button>
//   </div>
// );

const includePath = (pathA, pathB) => {
  const [splA, splB] = [pathA.split('/'), pathB.split('/')].map(p =>
    p.filter(s => s !== '#' && s !== ''),
  );
  console.log('curPath', pathA, 'path', pathB);
  return splA[0] === splB[0];
};

const ListItem = ({name, path, curPath, active, children, subRoutes = []}) => (
  <li className="mb-1">
    <div
      className={`nav-link  ${includePath(curPath, path) &&
        'nav-link-selected'}`}
    >
      <Link to={path}>{children}</Link>
    </div>
    {includePath(curPath, path) && (
      <ul className="ml-5 list-reset">
        {subRoutes.map(d => (
          <li
            className={`sub-link ${curPath === d.path &&
              'sub-link-selected'} `}
          >
            <Link to={d.path}>{d.name}</Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const NavigationHelper = ({
  activePath,
  uiColor,
  pathName,
  location,
  routes,
  signOut,
  children
}) => (
  <ul className="list-reset">
    {routes.map(r => (
      <ListItem {...r} curPath={location.pathname}>
        {children(r)}
      </ListItem>
    ))}
    {signOut && (
      <li>
        <SignOutButton />
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

const RouteNavigation = ({authUser, ...props}) => {
  if (authUser && authUser.admin) {
    return <NavigationHelper {...props} signOut routes={adminRoutes} />;
  }
  if (authUser !== null)
    return <NavigationHelper {...props} signOut routes={authRoutes} />;

  return <NavigationHelper {...props} routes={nonAuthRoutes} />;
};

const mapStateToProps = state => ({
  authUser: state.Session.authUser,
  ...state.router
});

export default connect(mapStateToProps)(withRouter(RouteNavigation));
