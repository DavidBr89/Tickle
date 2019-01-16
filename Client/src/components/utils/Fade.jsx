import React, {useState, useEffect, useRef} from 'react';
import Transition from 'react-transition-group/Transition';

import {ScrollView, ScrollElement} from 'Utils/ScrollView';

const duration = 300;
const defaultStyle = {
  transition: `transform ${duration}ms `
  // opacity: 0
};

function usePrevious(value) {
  const ref = useRef();
  console.log('cache', ref.current);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const transitionStyles = forward => ({
  entering: {transform: `translateX(0%)`},
  entered: {transform: `translateX(0%)`},
  exiting: {transform: `translateX(${forward ? '110%' : '-110%'})`},
  exited: {transform: `translateX(${forward ? '110%' : '-110%'})`}
});

export const Fade = ({in: inProp, className, index, children}) => (
  <div
    className={className}
    style={{
      ...defaultStyle,
      transform: `translateX(${index * 100}%)`
    }}>
    {children}
  </div>
);

export default function TabSwitcher(props) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <PureTabSwitcher
      {...props}
      visibleIndex={visibleIndex}
      setVisibleIndex={setVisibleIndex}
    />
  );
};

export const PureTabSwitcher = ({
  children,
  visibleIndex,
  setVisibleIndex
}) => {
  const nextIndex =
    visibleIndex + 1 < children.length ? visibleIndex + 1 : null;

  const scrollCont = React.createRef();
  const prevIndex = visibleIndex - 1 > -1 ? visibleIndex - 1 : null;

  useEffect(() => {
    scrollCont.current.scrollTo(visibleIndex);
  });

  return (
    <div className="relative flex relative flex-col flex-grow overflow-x-hidden">
      <ScrollView ref={scrollCont}>
        <div
          className="flex flex-grow "
          style={{
            width: `${children.length * 100}%`
          }}>
          {children.map((t, i) => (
            <ScrollElement name={i}>
              <div
                style={{width: `${100 / children.length}%`}}
                className="p-1 flex flex-col flex-grow"
                key={t.id}>
                {t.content}
                <div className="w-full flex justify-between">
                  {prevIndex !== null && (
                    <div className="flex-grow flex items-center">
                      {React.cloneElement(children[prevIndex].acc, {
                        onClick: () => setVisibleIndex(prevIndex)
                      })}
                    </div>
                  )}
                  {nextIndex !== null && (
                    <div className="flex-grow flex items-center">
                      {React.cloneElement(children[nextIndex].acc, {
                        onClick: () => setVisibleIndex(nextIndex)
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollElement>
          ))}
        </div>
      </ScrollView>
    </div>
  );
};

