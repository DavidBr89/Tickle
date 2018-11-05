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
  makeUserEnvRoutes,
  adminRoutes,
  nonAuthRoutes,
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

const ListItem = ({
  name,
  path,
  userEnv,
  curPath,
  active,
  children,
  subRoutes = [],
}) => (
  <li className="list-item mb-1">
    <div
      className={`${subRoutes.length > 0 && 'list-item'} ${includePath(
        curPath,
        path,
      ) && 'active'}`}>
      <Link to={path}>{children}</Link>
    </div>
    <ul className="ml-5 list-reset">
      {subRoutes.map(d => (
        <li className={`list-item ${curPath === d.path && 'active'} `}>
          <Link to={d.path}>{d.name}</Link>
        </li>
      ))}
    </ul>
  </li>
);

const NavigationHelper = ({
  activePath,
  uiColor,
  pathName,
  location,
  routes,
  signOut,
  children,
  userEnv,
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
  signOut: PropTypes.boolean,
};

NavigationHelper.defaultProps = {
  signOut: false,
};

const RouteNavigation = ({authUser, selectedUserEnvId, ...props}) => {
  if (authUser) {
    if (authUser.admin) {
      const adminAuthRoutes = makeUserEnvRoutes(selectedUserEnvId, adminRoutes);
      return <NavigationHelper {...props} routes={adminAuthRoutes} />;
    }
    const userAuthRoutes = makeUserEnvRoutes(selectedUserEnvId, authRoutes);
    return <NavigationHelper {...props} signOut routes={userAuthRoutes} />;
  }

  return <NavigationHelper {...props} routes={nonAuthRoutes} />;
};

const mapStateToProps = state => ({
  ...state.Session,
});

export default connect(mapStateToProps)(withRouter(RouteNavigation));
