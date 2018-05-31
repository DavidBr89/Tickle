import React from 'react';
import style from './styles/postcard.scss';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import d3sketchy from '../lib/d3.sketchy.js';

const NavGraph = class NavGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const self = ReactDOM.findDOMNode(this);
    console.log('self', self);
    const sketchy = d3sketchy();
    sketchy.circleStroke({
      svg: d3.select(self),
      x: 100,
      y: 100,
      r: 50,
      density: 2,
      sketch: 0.3
    });
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height} />
    );
  }
};

NavGraph.defaultProps = {
  width: 200,
  height: 200
};

const Home = React.createClass({
  componentDidMount() {

  },

  render() {
    return (
      <div id={style.postcard}>
        <div id={style.container}>
          <div id={style.branding}>
            <h2>Vrije Universiteit Brussel</h2>
            <h1>Jan Maushagen</h1>
            <ul className={style.socialMedia}>
              <li><a href="">Email</a></li>
              <li><a href="">Facebook</a></li>
              <li><a href="">Twitter</a></li>
            </ul>
            <div />
          </div>
          <div id={style.border} />
          <div id={style.content}>
            <ul>
              <li id={style.message}>
                <div>
                  <h3>Partie réservée a la correspondance</h3>
                  <p>Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction.</p>
                  <p>Oscar Wilde</p>
                </div>
              </li>
              <li id={style.sender}>
                <div>
                  <h3>Adresse du destinataire</h3>
                  <NavGraph />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});


export default Home;
