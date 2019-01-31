import React, {useEffect} from 'react';
/**
 * utility react hook for componentDidUpdate
 * @param {array} function to call when did update
 * @param {array} effect inputs
 */
export default function useDidUpdateEffect(fn, inputs) {
  const didMountRef = React.useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}
