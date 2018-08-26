import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

// import { intersection } from 'lodash';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

import {
  DATAVIEW,
  authRoutes,
  adminRoutes,
  nonAuthRoutes
} from 'Constants/routes';

import { stylesheet } from 'Src/styles/GlobalThemeContext';
import { css } from 'aphrodite';

import { setDataView } from 'Reducers/DataView/actions';

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
  // TODO: find regex
  const [splA, splB] = [pathA.split('/'), pathB.split('/')].map(p =>
    p.filter(s => s !== '#' && s !== '')
  );
  // console.log(
  //   'splA',
  //   pathA,
  //   /^\/([^/]*)\//.exec(pathA),
  //   'splB',
  //   pathB,
  //   /([^/]*)\/([^/]*)\//.exec(pathB)
  // );
  return splA[0] === splB[0];
};

const InnerLi = ({ name, path, curPath, active, subRoutes = [] }) => (
  <li className="mb-2">
    <Link
      className={`nav-link ${css(stylesheet.bareBtn)} ${subRoutes.length > 0 &&
        'mb-2'}`}
      to={path}
    >
      {name}
    </Link>
    {curPath.includes(path) && (
      <ul>
        {subRoutes.map(d => (
          <li className="mb-1">
            <Link
              to={d.path}
              className={`${css(stylesheet.bareBtn)} nav-link`}
              style={{ border: includePath(path, curPath) && '1px solid grey' }}
            >
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const NavigationHelper = ({
  activePath,
  // stylesheet,
  uiColor,
  pathName,
  location,
  routes,
  signOut
}) => (
  <ul className="navList ">
    {Object.keys(routes).map(key => (
      <InnerLi {...routes[key]} curPath={location.pathname} />
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

const Navigation = ({ authUser, ...props }) => {
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
