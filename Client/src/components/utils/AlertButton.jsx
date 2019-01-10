import React, {useState, useEffect} from 'react';

export default function AlertButton({
  className,
  style,
  type,
  children,
  msg,
  onClick,
  ...props
}) {
  const [clicked, setClicked] = useState(false);
  useEffect(
    () => {
      if (clicked) {
        const response = window.confirm(msg);
        if (response) {
          onClick();
        }
        setClicked(false);
      }
    },
    [clicked]
  );

  return (
    <button
      type={type}
      className={className}
      style={style}
      onClick={() => setClicked(true)}>
      {children}
    </button>
  );
}

AlertButton.defaultProps = {
  type: 'button',
  style: {},
  className: '',
  onClick: d => d
};
