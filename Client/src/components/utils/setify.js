import {nest} from 'd3';
import {uniq, flatten} from 'lodash';

import {fallbackTagValues} from 'Constants/cardFields';

export default function setify(data) {
  const spreadData = flatten(
    data.map(d => {
      const topics = d.topics.value || [];
      return topics.map(t => ({...d, topicId: t, topics}));
    })
  );

  const nested = nest()
    .key(d => d.topicId)
    .entries(spreadData)
    .map(d => {
      const topics = uniq(flatten(d.values.map(e => e.topics))).filter(
        e => d.key !== e.key
      );
      return {
        ...d,
        count: d.values.length,
        topics,
        topicId: d.key
      };
    })
    .sort((a, b) => b.values.length - a.values.length);
  console.log('nested', nested);
  return nested;
}
