import {nest} from 'd3';
import {uniq, flatten} from 'lodash';

import {fallbackTagValues} from 'Constants/cardFields';

export default function setify(data, acc = d => fallbackTagValues(d.tags)) {
  const spreadData = flatten(
    data.map(d => {
      const tags = acc(d);
      return tags.map(t => ({...d, tagId: t, tags}));
    }),
  );

  const nested = nest()
    .key(d => d.tagId)
    .entries(spreadData)
    .map(d => {
      const tags = uniq(flatten(d.values.map(e => e.tags))).filter(
        e => d.key !== e.key,
      );
      return {
        ...d,
        count: d.values.length,
        tags,
        tagId: d.key,
      };
    })
    .sort((a, b) => b.values.length - a.values.length);
  return nested;
}
