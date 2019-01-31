import intersection from 'lodash/intersection';

const lowercase = s => s.toLowerCase();

/**
 * Utiility to find subsets between array of topics
 */
const isSubset = (s0, s1) => {
  if (s0 === null || s1 === null) return 0;
  const interset = intersection(s0.map(lowercase), s1.map(lowercase));
  return (
    (interset.length > 0 && interset.length === s0.length) ||
    interset.length === s1.length
  );
};

export default isSubset;
