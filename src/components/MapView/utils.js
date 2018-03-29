import { nest } from 'd3';
import { intersection, uniq, flatten } from 'lodash';

export function setify(data) {
  const spreadData = [...data].map(({ id, tags, ...rest }) =>
    tags.map(t => ({ id: t, ref: id, ...rest }))
  );
  return nest()
    .key(d => d.id)
    .entries(flatten([...spreadData]))
    .map(d => {
      const count = d.values.length;
      const tags = uniq(flatten(intersection(d.values.map(e => e.tags))));
      return { count, tags, ...d };
    })
    .sort((a, b) => b.count - a.count);
}
