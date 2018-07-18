import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { intersection } from 'lodash';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

import { DATAVIEW, authRoutes, nonAuthRoutes } from 'Constants/routes';
// import { ThemeConsumer } from 'Src/styles/ThemeContext';
import { css } from 'aphrodite/no-important';

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

const Navigation = ({ authUser, ...props }) => (
  <div>
    {authUser ? (
      <NavigationAuth {...props} />
    ) : (
      <NavigationNonAuth {...props} />
    )}
  </div>
);

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

const InnerLi = ({ name, path, hash, active, subRoutes = [] }) => (
  <li className="mb-2">
    <Link
      className=" nav-link btn mb-1"
      style={{ background: includePath(path, hash) && 'lightgrey' }}
      to={path}
    >
      {name}
    </Link>
    <ul>
      {subRoutes.map(d => (
        <li>
          <Link
            to={d.path}
            style={{ background: hash.includes(d.path) && 'lightgrey' }}
          >
            {d.name}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

const NavigationAuth = ({
  activePath,
  stylesheet,
  uiColor,
  pathName,
  location
}) => (
  <ul className="navList">
    {Object.keys(authRoutes).map(key => (
      <InnerLi {...authRoutes[key]} hash={location.hash} />
    ))}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = ({ activePath, stylesheet, uiColor, location }) => (
  <ul className="navList">
    {Object.keys(nonAuthRoutes).map(key => (
      <InnerLi {...nonAuthRoutes[key]} hash={location.hash} />
    ))}
  </ul>
);

const mapStateToProps = state => ({
  authUser: state.Session.authUser,
  ...state.router
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDataView
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
