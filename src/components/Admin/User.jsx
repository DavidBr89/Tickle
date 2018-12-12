import React from 'react';

export default function User(props) {
  const {className, username, fullname, email, photoURL} = props;
  return (
    <div className={ `${className} flex` }>
      <img src={photoURL} style={{minWidth: 300, height: 200, flex: 0.5}} />
      <div className="ml-3">
        <div>{fullname}</div>
        <div>{email}</div>
        <div className="flex align-top">
          {['sport', 'reading'].map(d => (
            <div className="tag-label bg-black">{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
