import React from 'react';

import Edit from 'react-feather/dist/icons/edit';

const IconCont = ({className, styles, onClick, children}) => (
  <div
    className="mr-1 flex items-center cursor-pointer"
    onClick={onClick}>
    <div className={`flex-col-wrapper justify-center ${className}`}>
      {children}
    </div>
  </div>
);

const EditIcon = ({edit, className, style, onClick}) => (
  <IconCont
    className={`text-black ${className}`}
    onClick={onClick}
    style={style}>
    <Edit size={30} />
  </IconCont>
);

export default function PlaceholderFrame({
  onClick,
  empty,
  placeholder,
  className,
  style,
  edit,
  children
}) {
  return (
    <div
      className={`${className} cursor-pointer items-center flex`}
      style={{width: '90%'}}
      onClick={onClick}>
      {empty ? (
        <div className="italic text-2xl">{placeholder}</div>
      ) : (
        children
      )}
      <div className="ml-auto">
        <EditIcon className="p-2" />
      </div>
    </div>
  );
}
