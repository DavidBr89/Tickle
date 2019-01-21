import React, {useState, useEffect, useRef} from 'react';

import {ScrollView, ScrollElement} from 'Utils/ScrollView';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function TabSwitcher({
  children,
  visibleIndex,
  setVisibleIndex,
  className,
  tabClassName
}) {
  const scrollCont = React.createRef();

  useEffect(() => {
    scrollCont.current.scrollTo(visibleIndex);
    // scrollCont.childNodes.map(el => {
    //   console.log('blur', el);
    //   el.blur();
    // });
  });

  return (
    <div
      className={`relative flex relative flex-grow flex-col overflow-x-hidden ${className}`}>
      <ScrollView ref={scrollCont}>
        <div
          className="flex flex-grow"
          style={{
            width: `${children.length * 100}%`
          }}>
          {React.Children.map(children, (t, i) => (
            <ScrollElement name={i}>
              <div
                style={{width: `${100 / children.length}%`}}
                className={`flex flex-col flex-grow p-1 ${tabClassName}`}>
                {t}
              </div>
            </ScrollElement>
          ))}
        </div>
      </ScrollView>
    </div>
  );
}
