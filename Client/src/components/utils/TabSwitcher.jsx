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
  setVisibleIndex
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
    <div className="relative flex relative flex-col flex-grow overflow-x-hidden">
      <ScrollView ref={scrollCont}>
        <div
          className="flex flex-grow m-1"
          style={{
            width: `${children.length * 100}%`
          }}>
          {React.Children.map(children, (t, i) => (
            <ScrollElement name={i}>
              <div
                style={{width: `${100 / children.length}%`}}
                className="p-1 flex flex-col flex-grow">
                {t}
              </div>
            </ScrollElement>
          ))}
        </div>
      </ScrollView>
    </div>
  );
}
