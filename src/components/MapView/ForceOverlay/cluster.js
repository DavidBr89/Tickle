import kdbush from 'kdbush';

function defaultGetLng(p) {
  return p[0];
}
function defaultGetLat(p) {
  return p[1];
}

export default function dobbyscan(points, radius, getLng, getLat) {
  if (!getLng) getLng = defaultGetLng;
  if (!getLat) getLat = defaultGetLat;

  const pointIds = new Uint32Array(points.length);
  for (var i = 0; i < points.length; i++) {
    pointIds[i] = i;
  }

  function getLngI(i) {
    return getLng(points[i]);
  }
  function getLatI(i) {
    return getLat(points[i]);
  }

  const index = kdbush(pointIds, getLngI, getLatI);

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
        .within(getLngI(j), getLatI(j), radius)
        .filter(isUnclustered);
      // .map((id) => points[id]);
      //   geokdbush.around(
      //     index, getLngI(j), getLatI(j), Infinity, radius, isUnclustered);

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
