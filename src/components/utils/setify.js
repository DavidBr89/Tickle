import { nest } from 'd3';
import { intersection, uniq, flatten } from 'lodash';

export default function setify(data) {
  const spreadData = [...data].map(({ tags, ...rest }) =>
    tags.map(t => ({ tag: t, ...rest }))
  );
  return nest()
    .key(d => d.tag)
    .entries(flatten([...spreadData]))
    .map(d => {
      const count = d.values.length;
      const tags = uniq(flatten(intersection(d.values.map(e => e.tags))));
      const values = d.values.map(e => {
        e.tagId = `${d.key}${e.id}`;
        return e;
      });
      return { count, tags, ...d, values };
    })
    .sort((a, b) => {
      const nameA = a.key.toUpperCase(); // ignore upper and lowercase
      const nameB = b.key.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
}
