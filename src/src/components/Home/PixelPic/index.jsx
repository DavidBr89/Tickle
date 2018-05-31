import * as d3 from 'd3';
import { hexbin } from 'd3-hexbin';

import React from 'react';

import ReactDOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';

import rawColors from './nes-colors.js';

import picSrc from './jan1.jpg';
import picSrc2 from './jan2.jpg';

function rgbToLab(rgb) {
  const lab = d3.lab(d3.rgb.apply(null, rgb));
  return [lab.l, lab.a, lab.b];
}

// import d3Radial from 'd3-radial';

// import { bboxCollide } from 'd3-bboxCollide';

// import { forceSurface } from 'd3-force-surface';
// import { annotation, annotationCalloutCircle } from 'd3-svg-annotation';

// import d3sketchy from '../utils/d3.sketchy';

// import swoopyArrow from './utils/swoopyArrow';
// import data from './aboutData';

// import { forceContainer } from '../utils/helper';

// const centerOffset = 50;
// const xOffset = 20;
// TODO: this is wrong
// const yOffset = 50;

// Images.prototype.setPixels = function() {
//     var sw          = this.imageWidth,
//         sh          = this.imageHeight,
//         imageData   = this.context.getImageData( 0, 0, sw, sh ),
//         data        = imageData.data,
//         y, x, n, m;
//
//     for ( y = 0; y < sh; y += this.pixelation ) {
//         for ( x = 0; x < sw; x += this.pixelation ) {
//
//             var red = data[((sw * y) + x) * 4];
//             var green = data[((sw * y) + x) * 4 + 1];
//             var blue = data[((sw * y) + x) * 4 + 2];
//
//             for ( n = 0; n < this.pixelation; n++ ) {
//                 for ( m = 0; m < this.pixelation; m++ ) {
//                     if ( x + m < sw ) {
//                         data[((sw * (y + n)) + (x + m)) * 4] = red;
//                         data[((sw * (y + n)) + (x + m)) * 4 + 1] = green;
//                         data[((sw * (y + n)) + (x + m)) * 4 + 2] = blue;
//                     }
//                 }
//             }
//         }
//     }

function euclidean(a, b) {
  let sum = 0;

  a.forEach((val, i) => {
    sum += Math.pow(b[i] - val, 2);
  });

  return Math.sqrt(sum);
}
function closestPoint(point, list) {
  let minDistance = Infinity,
    value;

  list.forEach(p => {
    const distance = euclidean(point, p);
    if (distance < minDistance) {
      minDistance = distance;
      value = p;
    }
  });

  return value;
}
// Average sub-pixels, update each one to the collective average
function averageColor(colors, nesColors) {
  // console.log('colors', colors, 'nesColors', nesColors);
  const lab = colors.map(rgbToLab);
  const average = d3.range(3).map(i => d3.mean(lab.map(color => color[i])));
  const closest = closestPoint(average, nesColors);
  const rgb = d3.lab.apply(null, closest).rgb();

  return [rgb.r, rgb.g, rgb.b, 255];
}
function processPixel(px, py, imageData, pixelSize, nesColors, width) {
  const indices = [];

  d3.range(pixelSize).map(x => {
    d3.range(pixelSize).map(y => {
      indices.push(4 * ((py + y) * width + px + x));
    });
  });

  const average = averageColor(
    indices.map(i => imageData.data.slice(i, i + 3)),
    nesColors
  );

  indices.forEach(i => {
    for (let j = 0; j < 4; j++) {
      imageData.data[i + j] = average[j];
    }
  });
}

class PixelPic extends React.Component {
  static propTypes() {
    return {
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired,
      data: React.PropTypes.array.isRequired
    };
  }

  constructor() {
    super();
    this.update = this.update.bind(this);
    this.updateHex = this.updateHex.bind(this);
    this.state = { selected: true };
  }

  componentDidMount() {
    this.updateHex();
    this.update();
  }

  componentDidUpdate() {
    // this.update();
    // this.updateHex();
  }

  updateHex() {
    const { width, height } = this.props;
    const context = ReactDOM.findDOMNode(this.canvas).getContext('2d');
    const svg = ReactDOM.findDOMNode(this.svg);

    const rad = 2;
    const step = 4;
    const Hexbin = hexbin()
      .size([width - rad, height - rad])
      .radius(rad);
    //
    // console.log('hx', Hexbin);

    const color = d3
      .scaleLinear()
      .domain([14, 15, 35, 132])
      .range(['blue', 'green', 'yellow', '#ae017e'])
      .interpolate(d3.interpolateRgb);

    const points = [];
    let hexagons = [];

    const img = new Image();
    img.src = picSrc;

    img.onload = () => {
      context.drawImage(img, 0, 0, width, height);
      const imgData = context.getImageData(0, 0, width, height).data;

      for (
        let i = 0, n = width * height * step, d = imgData;
        i < n;
        i += step
      ) {
        points.push([(i / step) % width, Math.floor(i / step / width), d[i]]);
      }

      // const nesColors = rawColors.map(rgbToLab);
      hexagons = Hexbin(points);
      hexagons.forEach(e => {
        e.mean = d3.mean(e, p => p[2]);

        const indices = [];

        d3.range(step).map(x => {
          d3.range(step).map(y => {
            indices.push(step * ((e.y + y) * width + e.x + x));
          });
        });

        // const average = averageColor(
        //   indices.map(i => imgData.slice(i, i + step)),
        //   nesColors
        // );
        // e.color = average;
        // console.log('color', `rgb(${e.color.join(',')})`);
        // console.log('average', average);

        // indices.forEach(i => {
        //   for (let j = 0; j < step; j++) {
        //     imgData[i + j] = average[j];
        //   }
        // });
      });

      d3
        .select(svg)
        .append('g')
        .attr('class', 'hexagons')
        .selectAll('path')
        .data(hexagons)
        .enter()
        .append('path')
        .attr('d', Hexbin.hexagon(step))
        .attr('transform', e => `translate(${e.x},${e.y})`)
        .style('fill', e => color(e.mean));
    };
    // getImage("readme.png", function(image) {

    // Rescale the colors.
  }

  update() {
    const { width, height, pixelSize } = this.props;
    const batchSize = pixelSize * 2;

    let imageData;

    const nesColors = rawColors.map(rgbToLab);

    const ctx = ReactDOM.findDOMNode(this.canvas).getContext('2d');

    const img = new Image();

    const batches = [];

    d3.range(0, width, batchSize).map(x => {
      d3.range(0, height, batchSize).map(y => {
        batches.push({ x, y });
      });
    });

    d3.shuffle(batches);

    img.onload = function() {
      ctx.drawImage(img, 0, 0, width, height);

      imageData = ctx.getImageData(0, 0, width, height);
      console.log('imageData');
      // for (let i = img.data.length; --i >= 0; ) imageData.data[i] = 0;

      ctx.putImageData(imageData, 0, 0);

      processBatch(batches, imageData);
    };

    img.src = picSrc;

    d3.select(self.frameElement).style('height', `${height}px`);

    // Process one batch of pixels
    function processBatch(batches) {
      if (!batches.length) return;
      const batch = batches.pop();

      d3.range(0, batchSize, pixelSize).forEach(x => {
        d3.range(0, batchSize, pixelSize).forEach(y => {
          processPixel(
            batch.x + x,
            batch.y + y,
            imageData,
            pixelSize,
            nesColors,
            width
          );
        });
      });

      if (batches.length % 380 === 1) {
        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(() => processBatch(batches));
      } else if (batches.length) {
        processBatch(batches);
      }
      // ctx.putImageData(imageData, 0, 0);
      // requestAnimationFrame(() => processBatch(batches));
      // processBatch(batches);
      // Repaint occasionally
      // ctx.putImageData(imageData, 0, 0);
      // setTimeout(() => {
      // requestAnimationFrame(processBatch);
      // processBatch(batches);
      // }, 0);
      // setTimeout(() => {
      // });
      //
      // }

      // Could do a second pass to re-round colors to most common results
    }

    // Average colors, then round to nearest in palette

    // Closest point from list - faster than sort?

    // Distance between n-dimensional points
  }

  // componentDidUpdate() {
  //   // document.querySelector('body').classList.toggle(style.active);
  //   this.componentDidMount.bind(this)();
  // }

  render() {
    const { width, height } = this.props;
    const { selected } = this.state;
    console.log('render', this.state);
    return (
      <div
        style={{ cursor: 'pointer' }}
        onMouseOver={() =>
          this.setState(oldState => ({
            selected: false
          }))}
        onMouseOut={() =>
          this.setState(oldState => ({
            selected: true
          }))}
      >
        <svg
          ref={svg => (this.svg = svg)}
          style={{
            position: 'absolute',
            left: 7,
            top: 7,
            visibility: selected ? 'hidden' : 'visible'
          }}
          width={width}
          height={height}
        />
        <canvas
          ref={canvas => (this.canvas = canvas)}
          style={{
            visibility: !selected ? 'hidden' : 'visible'
          }}
          width={width}
          height={height}
          style={{ zIndex: 10 }}
        />
      </div>
    );
  }
}

PixelPic.propTypes = {
  // data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  pixelSize: PropTypes.number
};

PixelPic.defaultProps = {
  width: 480,
  height: 640,
  pixelSize: 2
};

export default PixelPic;

// WEBPACK FOOTER //
// ./src/components/AboutVis.jsx
// ./src/components/AboutVis.jsx
