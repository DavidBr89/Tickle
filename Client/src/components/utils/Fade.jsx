import React, {useState, useEffect, useRef} from 'react';
import Transition from 'react-transition-group/Transition';

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
  exiting: {transform: `translateX(${forward ? '110%' : '-100%'})`},
  exited: {transform: `translateX(${forward ? '110%' : '-100%'})`}
});

export const Fade = ({in: inProp, className, index, children}) => {
  const prevIndex = usePrevious(index);

  const forward = prevIndex > index;

  return (
    <Transition in={inProp} timeout={duration}>
      {transState => (
        <div
          className={className}
          style={{
            ...defaultStyle,
            ...transitionStyles(forward)[transState]
          }}>
          {children}
        </div>
      )}
    </Transition>
  );
};

export const TabSwitcher = ({children}) => {
  const [visibleIndex, setVisibleIndex] = useState(0);

  const nextIndex =
    visibleIndex + 1 < children.length ? visibleIndex + 1 : null;

  const prevIndex = visibleIndex - 1 > -1 ? visibleIndex - 1 : null;

  return (
    <div className="flex relative flex-col flex-grow overflow-hidden">
      {children.map((t, i) => (
        <Fade
          className="absolute w-full h-full flex flex-col flex-grow"
          in={visibleIndex === i}
          index={visibleIndex}>
          {t}
          <div className="w-full flex justify-between">
            {prevIndex !== null && (
              <button
                className="flex-grow btn"
                type="button"
                onClick={() => setVisibleIndex(prevIndex)}>
                {children[prevIndex].props.title}
              </button>
            )}
            {nextIndex !== null && (
              <button
                className="flex-grow btn"
                type="button"
                onClick={() => setVisibleIndex(nextIndex)}>
                {children[nextIndex].props.title}
              </button>
            )}
          </div>
        </Fade>
      ))}
    </div>
  );
};

export default TabSwitcher;
