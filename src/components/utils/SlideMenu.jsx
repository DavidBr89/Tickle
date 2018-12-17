import React, {useState} from 'react';

import menuIconSrc from 'Src/styles/menu_icons/menuIconStolen.svg';

const SlideMenu = ({
  className,
  selectedClassName,
  optionClassName,
  style,
  onChange,
  children,
  selectedId,
  onSelectCardType,
  tags,
  visible: defaultVisible,
}) => {
  const [visible, setVisible] = useState(defaultVisible);

  return (
    <div
      tabIndex="-1"
      className={`${className} z-10 relative`}
      style={{outline: 'none'}}
      onBlur={e => {
        e.stopPropagation();
        e.preventDefault();
        setTimeout(() => setVisible(false), 100);
      }}>
      <div className="flex-grow flex justify-end cursor-pointer">
        <div
          onClick={() => setVisible(!visible)}
          className="flex justify-center mr-2 p-1 bg-white"
          style={{width: 40, height: 40}}>
          <img src={menuIconSrc} alt="nav" />
        </div>
      </div>
      <div
        className="mt-2 absolute"
        style={{
          right: visible ? 0 : '-100vw',
          width: 250,
          maxWidth: 250,
          transition: 'right 200ms',
        }}>
        <div className="ml-2 p-2 border-2 border-black shadow bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;
