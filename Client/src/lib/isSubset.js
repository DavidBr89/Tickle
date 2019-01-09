import intersection from 'lodash/intersection';

const lowercase = s => s.toLowerCase();

const isSubset = (s0, s1) => {
  const interset = intersection(s0.map(lowercase), s1.map(lowercase));
  return (
    (interset.length > 0 && interset.length === s0.length) ||
    interset.length === s1.length
  );
};

export default isSubset;
