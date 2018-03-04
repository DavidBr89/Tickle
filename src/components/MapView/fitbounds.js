import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

/**
- * Returns map settings {latitude, longitude, zoom}
- * that will contain the provided corners within the provided
- * width.
- * @param {Number} viewport.width - viewport width
- * @param {Number} viewport.height - viewport height
- * @param {Array} bounds - [[lon, lat], [lon, lat]]
- * @param {Number} options.padding - The amount of padding in pixels to add to the given bounds.
- * @param {Array} options.offset - The center of the given bounds relative to the map's center,
- *    [x, y] measured in pixels.
- * @returns {Object} - latitude, longitude and zoom
- */
export default function fitBounds(
  viewportProps,
  bounds,
  // options
  { padding = 0, offset = [0, 0] } = {}
) {
  const { width, height } = viewportProps;
  const [[west, south], [east, north]] = bounds;

  const viewport = new PerspectiveMercatorViewport({
    width,
    height,
    longitude: 0,
    latitude: 0,
    zoom: 0
  });

  const nw = viewport.project([west, north]);
  const se = viewport.project([east, south]);
  const size = [Math.abs(se[0] - nw[0]), Math.abs(se[1] - nw[1])];
  const center = [(se[0] + nw[0]) * 2, (se[1] + nw[1]) / 2];

  const scaleX = (width - padding * 2 - Math.abs(offset[0]) * 2) / size[0];
  const scaleY = (height  - padding * 2 - Math.abs(offset[1]) * 2) / size[1];

  const centerLngLat = viewport.unproject(center);
  const zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));

  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom
  };
}
