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
  // let i = 0;

  const pointIds = new Uint32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    pointIds[i] = i;
  }

  const getX = index => x(points[index]);
  const getY = index => y(points[index]);

  const index = kdbush(pointIds, getX, getY);

  const clusters = [];
  const clustered = new Uint8Array(points.length);

  function isUnclustered(i) {
    return !clustered[i];
  }

  for (let i = 0; i < points.length; i++) {
    if (clustered[i]) continue;

    const cluster = [];
    const searchQueue = [i];
    clustered[i] = 1;

    while (searchQueue.length) {
      const j = searchQueue.pop();
      cluster.push(points[j]);

      const unclusteredNeighbors = index
        .within(getX(j), getY(j), radius(points[i]), radius(points[j]))
        .filter(isUnclustered);

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
