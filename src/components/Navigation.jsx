import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Link, withRouter} from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

import {
  DATAVIEW,
  authRoutes,
  adminRoutes,
  nonAuthRoutes
} from 'Constants/routes';

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
  return splA[0] === splB[0];
};

const InnerLi = ({name, path, curPath, active, children, subRoutes = []}) => (
  <li className={`nav-link bare-btn mb-1 ${subRoutes.length > 0 && 'mb-3'}`}>
    <Link to={path}>{children}</Link>
    {curPath.includes(path) && (
      <ul className="list-reset">
        {subRoutes.map(d => (
          <li
            className="bare-btn nav-link"
            style={{border: includePath(path, curPath) && '1px solid grey'}}>
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
    {Object.keys(routes).map(key => (
      <InnerLi {...routes[key]} curPath={location.pathname}>
        {children(routes[key])}
      </InnerLi>
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

// console.log('adminRoutes', adminRoutes);

// const NavigationAdmin = ({
//   activePath,
//   location
// }) => (
//   <ul className="navList ">
//     {Object.keys(adminRoutes).map(key => (
//       <InnerLi {...authRoutes[key]} hash={location.hash} />
//     ))}
//     <li>
//       <SignOutButton />
//     </li>
//   </ul>
// );

// const NavigationNonAuth = ({ activePath, stylesheet, uiColor, location }) => (
//   <ul className="navList">
//     {Object.keys(nonAuthRoutes).map(key => (
//       <InnerLi key={key} {...nonAuthRoutes[key]} hash={location.hash} />
//     ))}
//   </ul>
// );

const Navigation = ({authUser, ...props}) => {
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

export default connect(mapStateToProps)(withRouter(Navigation));
