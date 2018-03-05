import { PerspectiveMercatorViewport } from 'viewport-mercator-project';

// function fromLatLngToPixel(position) {
//   var scale = Math.pow(2, Map.getZoom());
//   var proj = Map.getProjection();
//   var bounds = Map.getBounds();
//
//   var nw = proj.fromLatLngToPoint(
//     new google.maps.LatLng(
//       bounds.getNorthEast().lat(),
//       bounds.getSouthWest().lng()
//     ));
//   var point = proj.fromLatLngToPoint(position);
//
//   return new google.maps.Point(
//     Math.floor((point.x - nw.x) * scale),
//     Math.floor((point.y - nw.y) * scale));
// },
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
// function paddedBounds(bounds, viewportProps, npad, spad, epad, wpad) {
//   const [[west, south], [east, north]] = bounds;
//   const SW = [west, south];
//   const NE = [east, north];
//
//   const { width, height } = viewportProps;
//   const viewport = new PerspectiveMercatorViewport({
//     width,
//     height,
//     longitude: 0,
//     latitude: 0,
//     zoom: 0
//   });
//
//   const { width, height, zoom } = viewportProps;
//   const topRight = viewport.project(NE);
//   const bottomLeft = viewport.project(SW);
//
//   const scale = Math.pow(2, zoom);
//
//   const SWtopoint = map.getProjection().fromLatLngToPoint(SW);
//   const SWpoint = new google.maps.Point(
//     (SWtopoint.x - bottomLeft.x) * scale + wpad,
//     (SWtopoint.y - topRight.y) * scale - spad
//   );
//   const SWworld = new google.maps.Point(
//     SWpoint.x / scale + bottomLeft.x,
//     SWpoint.y / scale + topRight.y
//   );
//   const pt1 = map.getProjection().fromPointToLatLng(SWworld);
//
//   const NEtopoint = map.getProjection().fromLatLngToPoint(NE);
//   const NEpoint = new google.maps.Point(
//     (NEtopoint.x - bottomLeft.x) * scale - epad,
//     (NEtopoint.y - topRight.y) * scale + npad
//   );
//   const NEworld = new google.maps.Point(
//     NEpoint.x / scale + bottomLeft.x,
//     NEpoint.y / scale + topRight.y
//   );
//   const pt2 = map.getProjection().fromPointToLatLng(NEworld);
//
//   return new google.maps.LatLngBounds(pt1, pt2);
// }
//
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
  const center = [(se[0] + nw[0]) / 2, (se[1] + nw[1]) / 2];

  const scaleX = (width - padding  - Math.abs(offset[0]) * 2) / size[0];
  const scaleY = (height - padding  - Math.abs(offset[1]) * 2) / size[1];
  console.log('scaleY', scaleY);

  const centerLngLat = viewport.unproject(center);
  const zoom = viewport.zoom + Math.log2(Math.abs(Math.min(scaleX, scaleY)));

  return {
    longitude: centerLngLat[0],
    latitude: centerLngLat[1],
    zoom
  };
}
