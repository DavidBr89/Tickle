import km from 'ml-kmeans';
import { nest } from 'd3';

export function kmeans(values) {
  const euclDist = (x1, y1, x2, y2) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dists = values.map(({ x: x1, y: y1 }) =>
    values.map(({ x: x2, y: y2 }) => [euclDist(x1, y1, x2, y2)])
  );
  const clustered = km(dists, 2).clusters.map((c, i) => ({
    ...values[i],
    cluster: c
  }));

  return nest()
    .key(d => d.cluster)
    .entries(clustered);
}

export function hexagon([x, y], w, h) {
  const x1 = x;
  const y1 = y - h;
  const x2 = x + Math.cos(Math.PI / 6) * w;
  const y2 = y - Math.sin(Math.PI / 6) * h;
  const x3 = x + Math.cos(Math.PI / 6) * w;
  const y3 = y + Math.sin(Math.PI / 6) * h;
  const x4 = x;
  const y4 = y + h;
  const x5 = x - Math.cos(Math.PI / 6) * w;
  const y5 = y + Math.sin(Math.PI / 6) * h;
  const x6 = x - Math.cos(Math.PI / 6) * w;
  const y6 = y - Math.sin(Math.PI / 6) * h;
  return [[x1, y1], [x2, y2], [x3, y3], [x4, y4], [x5, y5], [x6, y6]];
}

export function circle([x, y], offsetX, offsetY) {
  return [
    // "0.7071" scale the sine and cosine of 45 degree for corner points.
    [x, y + offsetY],
    [x + 0.7071 * offsetX, y + 0.7071 * offsetY],
    [x + offsetX, y],
    [x + 0.7071 * offsetX, y - 0.7071 * offsetY],
    [x, y - offsetX],
    [x - 0.7071 * offsetX, y - 0.7071 * offsetY],
    [x - offsetX, y],
    [x - 0.7071 * offsetX, y + 0.7071 * offsetY]
  ];
}

export function groupPoints(
  nodes,
  offsetX = 0,
  offsetY = 0,
  accessor = d => [d[0], d[1]]
) {
  return nodes.reduce(
    (acc, d) => acc.concat(circle(accessor(d), offsetX, offsetY)),
    []
  );
}

export function curveStepOutside(context) {
  let y0, i;
  return {
    lineStart() {
      (y0 = NaN), (i = 0);
    },
    lineEnd() {},
    point(x, y) {
      (x -= y0 > y ? +0.5 : -0.5), (y -= 0.5);
      if (++i === 1) context.moveTo(x, (y0 = y));
      else context.lineTo(x, y0), context.lineTo(x, (y0 = y));
    }
  };
}
