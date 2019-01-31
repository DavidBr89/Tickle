import React, {useState, useEffect, useRef} from 'react';

import {ScrollView, ScrollElement} from '~/components/utils/ScrollView';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function TabSwitcher({
  children,
  visibleIndex = null,
  className = '',
  tabClassName = ''
}) {
  const scrollCont = React.createRef();
  const wrapperCont = React.createRef();

  useEffect(
    () => {
      console.log('visibleIndex', visibleIndex);
      visibleIndex !== null &&
        scrollCont.current.scrollTo(visibleIndex);
    },
    [visibleIndex]
  );

  return (
    <div
      className={`relative flex relative flex-grow flex-col overflow-x-hidden ${className}`}
      ref={wrapperCont}>
      <ScrollView ref={scrollCont} boundary={wrapperCont}>
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
