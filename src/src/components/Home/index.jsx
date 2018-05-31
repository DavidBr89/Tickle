// import * as d3 from 'd3-jetpack/build/d3v4+jetpack';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import { timeFormat, timeParse, timeYear, timeMonth, timeDay } from 'd3';
// import _ from 'lodash';
import AboutVis from './AboutVis';
import style from '../styles/postcard.scss';
import cx from './index.scss';

import beerIcon from './pics/beer-icon.png';
import coffeeIcon from './pics/take-away.svg';
import jsLogo from './pics/js_logo.svg';
import reactLogo from './pics/react_logo.svg';
import d3Logo from './pics/d3_logo.svg';
import vinylIcon from './pics/music.svg';
import headphonesIcon from './pics/headphones.svg';
import astroIcon from './pics/astro.png';

import PixelPic from './PixelPic';

const ft = '%d/%m/%Y';
const formatTime = timeFormat(ft);
const parseTime = timeParse(ft);
const birthdate = parseTime('26/04/1988');
const todayDate = new Date();
const thisYearBdate = parseTime(`26/04/${new Date().getFullYear()}`);
const BelgiumArrivalDate = parseTime('22/09/2013');

class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { textWidth: 0, textHeight: 0 };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.text);
    const [textWidth, textHeight] = [node.offsetWidth, node.offsetHeight];
    this.setState({ textWidth, textHeight });
  }

  render() {
    const { children, width, height, style } = this.props;
    const { textWidth, textHeight } = this.state;

    const w0 = 25;
    const w1 = 20;
    const w2 = 15;
    return (
      <div
        style={{
          ...style,
          position: 'absolute',
          // border: 'black solid 1px',
          width,
          height
        }}
      >
        <div
          ref={text => (this.text = text)}
          className={`${cx.speechBubble} border-5`}
        >
          {children}
        </div>
        <div style={{ position: 'absolute', left: textWidth, top: textHeight }}>
          <div
            className={`${cx.bubble0} border-4`}
            style={{
              width: w0,
              height: w0,
              position: 'absolute',
              top: -w0 * 3 / 4
            }}
          />
          <div
            className={`${cx.bubble1} border-5`}
            style={{
              width: w1,
              height: w1,
              position: 'absolute',
              left: w0,
              top: -w1 / 2
            }}
          />
          <div
            className={`${cx.bubble2} border-6`}
            style={{
              width: w2,
              height: w2,
              position: 'absolute',
              left: w0 + w1,
              top: 0
            }}
          />
        </div>
      </div>
    );
  }
}

// import d3sketchy from '../lib/d3.sketchy';
const Home = ({ width, height, picDim }) => (
  <div>
    <div className={cx.header}>
      <div className={cx.branding}>
        <h2>Vrije Universiteit Brussel</h2>
        <h1>Jan Maushagen</h1>
        <ul className={style.socialMedia}>
          <li>
            <a href="">Email</a>
          </li>
          <li>
            <a href="">Facebook</a>
          </li>
          <li>
            <a href="">Twitter</a>
          </li>
        </ul>
      </div>
      <div className={cx.portrait}>
        <Tooltip
          width={picDim.width}
          height={picDim.height}
          style={{ right: picDim.width + picDim.marginLeft }}
        >
          {'Alright...'}
        </Tooltip>
        <div className={cx.polaroid}>
          <PixelPic
            width={picDim.width}
            height={picDim.height}
            pixelSize={picDim.pixelSize}
          />
        </div>
      </div>
    </div>

    <div id={style.border} />
    <div className="row" id={style.content}>
      <div className="col-md-6 col-xs-12">
        <div id={style.message}>
          <div>
            <h3>Something about me</h3>
            <p>
              PhD student, orginally from Germany, (
              {timeYear.count(birthdate, timeYear.offset(todayDate, -1))} years{
                ' and '
              }
              {timeMonth.count(timeYear.offset(thisYearBdate, -1), todayDate)}{' '}
              months old), in Belgium for almost{' '}
              {timeYear.count(BelgiumArrivalDate, todayDate)} years now. Getting
              my head around research, programming and languages. Drinking
              cappucino in the morning, jogging and doing Diss-co music in the
              evening. As part of my day job I work on data visualization and
              educational games!
            </p>
            <p>
              <table className={style.centerTable}>
                <tr>
                  <th>
                    Day{' '}
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      🌇
                    </span>
                  </th>
                  <th>
                    Night*{' '}
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      🌃
                    </span>
                  </th>
                </tr>

                <tr>
                  <td>
                    Gazing at{' '}
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      💻
                    </span>
                  </td>
                  <td>
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      🏃
                    </span>{' '}
                    in park
                  </td>
                </tr>
                <tr>
                  <td>
                    Visualizing data{' '}
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      📊
                    </span>
                  </td>
                  <td>
                    <img
                      alt="headphones"
                      style={{ width: '33px', height: '33px' }}
                      src={headphonesIcon}
                    />{' '}
                    <img
                      alt="mixing"
                      style={{ width: '33px', height: '33px' }}
                      src={vinylIcon}
                    />{' '}
                    music{' '}
                    <span role="img" aria-label="emoji" className={cx.emoji}>
                      😎
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    getting lost in hyperspace{' '}
                    <img
                      style={{ width: '33px', height: '33px' }}
                      alt="astro"
                      src={astroIcon}
                    />
                  </td>
                  <td>scratching my head about real life </td>
                </tr>
                <tr>
                  <td>
                    fiddling with{' '}
                    <img
                      alt="js"
                      src={jsLogo}
                      style={{
                        width: '22px',
                        height: '22px',
                        verticalAlign: 'top'
                      }}
                    />
                    {' ,'}
                    <img
                      alt="react"
                      src={reactLogo}
                      style={{
                        width: '22px',
                        height: '22px',
                        verticalAlign: 'top'
                      }}
                    />{' '}
                    and{' '}
                    <img
                      src={d3Logo}
                      alt="d3"
                      style={{
                        width: '22px',
                        height: '22px',
                        verticalAlign: 'top'
                      }}
                    />
                  </td>
                  <td>learning French and Dutch, forgetting German</td>
                </tr>
                <tr>
                  <td>
                    <img
                      style={{ width: '33px', height: '33px' }}
                      alt="coffee"
                      src={coffeeIcon}
                    />{' '}
                    Bonjour
                  </td>
                  <td>
                    <img
                      style={{ width: '33px', height: '33px' }}
                      alt="beer"
                      src={beerIcon}
                    />{' '}
                    Prost!
                  </td>
                </tr>
              </table>
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xs-12" id={style.interests}>
        <div>
          <h3>Interests</h3>
          <AboutVis width={width / 2 - 10} height={height - 170} />
        </div>
      </div>
    </div>
  </div>
);

export default Home;
