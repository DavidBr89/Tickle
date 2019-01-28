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

export default function PreviewFrame({
  onClick,
  empty,
  placeholder = 'empty',
  className = '',
  style,
  type = 'type',
  children,
  content = d => d
}) {
  return (
    <div
      className={`${className} text-2xl overflow-hidden flex-no-grow cursor-pointer items-center flex `}
      onClick={onClick}>
      <div
        className={`capitalize font-bold ${empty && 'text-grey'} mr-1`}>
        {type}:
      </div>
      {!empty && (
        <div className="flex-no-grow flex-shrink text-truncate">
          {content()}
        </div>
      )}
      {empty && (
        <span className="text-grey capitalize">{placeholder}</span>
      )}
    </div>
  );
}
