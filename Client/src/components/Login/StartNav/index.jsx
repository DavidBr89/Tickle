import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

const styleButton = { background: 'whitesmoke', width: '80vw' };
const StartNav = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: 'rgba(0, 0, 0, 0.3)'
    }}
  >
    <div className="mt-3">
      <Link to="/">
        <button className="btn" style={styleButton}>
          <h1>Map</h1>
        </button>
      </Link>
    </div>
    <div className="mt-3">
      <Link to="/cardcreator">
        <button className="btn" style={styleButton}>
          <h1>CardAuthoring</h1>
        </button>
      </Link>
    </div>
    <div className="mt-3">
      <Link to="/Journal">
        <button className="btn" style={styleButton}>
          <h1>Journal</h1>
        </button>
      </Link>
    </div>
  </div>
);

export default StartNav;
