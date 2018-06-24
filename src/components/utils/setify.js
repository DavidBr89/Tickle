import { nest } from 'd3';
import { uniq, flatten } from 'lodash';

export default function setify(data) {
  const spreadData = [...data].map(({ tags, ...rest }) =>
    tags.map(t => ({ tag: t, tags, ...rest }))
  );
  return nest()
    .key(d => d.tag)
    .entries(flatten([...spreadData]))
    .map(d => {
      const tags = uniq(flatten(d.values.map(e => e.tags)));
      console.log('d.values', d.values);
      return { tags, tag: d.key, ...d };
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
