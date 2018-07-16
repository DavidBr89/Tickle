import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from 'Constants/routes';

import AuthUserContext from './AuthUserContext';

import { DATAVIEW, authRoutes, nonAuthRoutes } from 'Constants/routes';
import { ThemeConsumer } from 'Src/styles/ThemeContext';
import { css } from 'aphrodite/no-important';

import { setDataView } from 'Reducers/DataView/actions';

console.log('authRoutes', authRoutes[Object.keys(authRoutes)[0]]);

// const zip= rows=>rows[0].map((_,c)=>rows.map(row=>row[c]))

// const authRoutes = [routes.LANDING, routes.DATAVIEW, routes.ADMIN];
// const authRoutesNames = ['Home', 'Card View', 'Admin'];
const DataViewSubList = ({ stylesheet, setDataView }) => (
  <div>
    <button onClick={() => setDataView('geo')}>Map</button>
    <button onClick={() => setDataView('floorplan')}>Floor</button>
    <button onClick={() => setDataView('topic')}>Topic</button>
  </div>
);
const Navigation = ({ authUser, ...props }) => (
  <ThemeConsumer>
    {({ stylesheet, uiColor }) =>
      authUser ? (
        <NavigationAuth stylesheet={stylesheet} uiColor={uiColor} {...props} />
      ) : (
        <NavigationNonAuth
          stylesheet={stylesheet}
          uiColor={uiColor}
          {...props}
        />
      )
    }
  </ThemeConsumer>
);

const InnerLi = ({ name, path, active, uiColor, subRoutes = [] }) => (
  <li style={{ background: uiColor }}>
    <Link className="btn mb-2" to={path}>
      {name}
    </Link>
    <ul>{subRoutes.map(d => <li><Link to={d.path}>{d.name}</Link></li>)}</ul>
  </li>
);

const NavigationAuth = ({ activePath, stylesheet, uiColor, setDataView }) => (
  <ul>
    {Object.keys(authRoutes).map(key => <InnerLi {...authRoutes[key]} />)}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = ({ activePath, stylesheet, uiColor }) => (
  <React.Fragment>
    {Object.keys(nonAuthRoutes).map(key => <Link className="btn mb-2" to="" />)}
  </React.Fragment>
);

const mapStateToProps = state => ({
  authUser: state.Session.authUser
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
