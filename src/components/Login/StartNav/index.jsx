import React from 'react';

const styleButton = { background: 'whitesmoke', width: '80vw' };
const StartNav = ({ onClick }) => {
  const clickHandler = () => {
    onClick();
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
        height: '100vh',
        width: '100vw',
        background: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="mt-3" onClick={clickHandler}>
        <button className="btn" style={styleButton}>
          <h1>Map</h1>
        </button>
      </div>
      <div className="mt-3" onClick={clickHandler}>
        <button className="btn" style={styleButton}>
          <h1>CardAuthoring</h1>
        </button>
      </div>
      <div className="mt-3" onClick={clickHandler}>
        <button className="btn" style={styleButton}>
          <h1>Diary</h1>
        </button>
      </div>
    </div>
  );
};

export default StartNav;
