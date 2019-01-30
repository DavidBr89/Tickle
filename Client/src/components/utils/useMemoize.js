import React, {useState, useMemo} from 'react';

import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

export default function memo(value) {
  const getMemoized = useMemo(() => {
    let memoized;
    let tmp;
    return current => {
      if (!isEqual(current, memoized)) {
        tmp = cloneDeep(memoized);
        memoized = current;
      }
      return tmp;
    };
  }, []);
  return getMemoized(value);
}
