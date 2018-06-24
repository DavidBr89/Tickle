import kdbush from 'kdbush';
import { intersection, max } from 'lodash';

function defaultX(p) {
  return p[0];
}
function defaultY(p) {
  return p[1];
}

export default function dobbyscan({
  points,
  radius = d => d,
  x = p => p[0],
  y = p => p[1]
}) {
  if (!x) x = defaultX;
  if (!y) y = defaultY;

  const pointIds = new Uint32Array(points.length);
  for (var i = 0; i < points.length; i++) {
    pointIds[i] = i;
  }

  function getX(i) {
    return x(points[i]);
  }
  function getY(i) {
    return y(points[i]);
  }

  const index = kdbush(pointIds, getX, getY);

  const clusters = [];
  const clustered = new Uint8Array(points.length);

  function isUnclustered(i) {
    return !clustered[i];
  }

  for (i = 0; i < points.length; i++) {
    if (clustered[i]) continue;

    const cluster = [];
    const searchQueue = [i];
    clustered[i] = 1;

    while (searchQueue.length) {
      const j = searchQueue.pop();
      cluster.push(points[j]);

      const unclusteredNeighbors = index
        .within(
          getX(j),
          getY(j),
          Math.max(radius(points[i])),
          radius(points[j])
        )
        .filter(isUnclustered);
      // .filter(c => {
      //   const tagsA = points[c].tags;
      //   const tagsB = points[i].tags;
      //   const is = intersection(tagsA, tagsB);
      //   console.log('is', tagsA, tagsB, is);
      //   return is.length > 0;
      // });
      // .map((id) => points[id]);
      //   geokdbush.around(
      //     index, getX(j), getY(j), Infinity, radius, isUnclustered);

      for (let k = 0; k < unclusteredNeighbors.length; k++) {
        const q = unclusteredNeighbors[k];
        clustered[q] = 1;
        searchQueue.push(q);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
