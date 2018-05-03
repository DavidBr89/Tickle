import { nest } from 'd3';
import { intersection, uniq, flatten } from 'lodash';

export function setify(data) {
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

export function getBoundingBox(coords, acc = d => [d[0], d[1]]) {
  const bounds = { minX: Infinity, maxX: 0, minY: Infinity, maxY: 0 };

  for (let j = 0; j < coords.length; j++) {
    const [x, y] = acc(coords[j]);

    bounds.minX = bounds.minX < x ? bounds.minX : x;
    bounds.maxX = bounds.maxX > x ? bounds.maxX : x;
    bounds.minY = bounds.minY < y ? bounds.minY : y;
    bounds.maxY = bounds.maxY > y ? bounds.maxY : y;
  }

  // const { leftTop, leftBottom, rightTop, rightBottom } = bounds;
  // }
  return [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.maxY],
    {
      leftTop: [bounds.minX, bounds.maxY],
      leftBottom: [bounds.minX, bounds.minY],
      rightTop: [bounds.maxX, bounds.maxY],
      rightBottom: [bounds.maxX, bounds.minY]
    }
  ];
}

// export function bounds(polygon, fixed = 4) {
//   const sq = {
//     left: undefined,
//     top: undefined,
//     right: undefined,
//     bottom: undefined
//   };
//   polygon.map(coords => {
//     const x = coords[0];
//     const y = coords[1];
//
//     if (x < sq.left || undefined === sq.left) sq.left = x;
//     else if (x > sq.right || undefined === sq.right) sq.right = x;
//
//     if (y < sq.bottom || undefined === sq.bottom) sq.bottom = y;
//     else if (y > sq.top || undefined === sq.top) sq.top = y;
//   });
//
//   sq.left = sq.left.toFixed(fixed);
//   sq.top = sq.top.toFixed(fixed);
//   sq.right = sq.right.toFixed(fixed);
//   sq.bottom = sq.bottom.toFixed(fixed);
//   return sq;
// }
