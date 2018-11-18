import {nest} from 'd3';
import {uniq, flatten} from 'lodash';

export default function setify(data, defaultTag = 'general') {
  const spreadData = flatten(
    data.map(({tags, ...rest}) => {
      if (tags === null)
        return [{...rest, tag: defaultTag, tags: [defaultTag]}];

      return tags.map(t => ({...rest, tagId: t, tags}));
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
