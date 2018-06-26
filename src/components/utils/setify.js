import { nest } from 'd3';
import { uniq, flatten } from 'lodash';

export default function setify(data) {
  const spreadData = flatten(
    data.map(({ tags, ...rest }) => tags.map(t => ({ ...rest, tag: t, tags })))
  );

  const nested = nest()
    .key(d => d.tag)
    .entries(spreadData)
    .map(d => {
      const tags = uniq(flatten(d.values.map(e => e.tags)));
      return { ...d, count: d.values.length, tags, tag: d.key };
    });
  return nested;
}
