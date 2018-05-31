import React from 'react';
import style from './styles/nav.scss';
// import * as d3 from 'd3';
// import ReactDOM from 'react-dom';

const Nav = () => (
  <div id={style.nav}>
    <div id={style.title}>
      <h3><a href="/">Jan Maushagen</a></h3>&nbsp;/&nbsp;About
    </div>
    <div id={style.projects}>
      <ul id={style.projectList}>
        <li><a href="/life">Projects</a></li>
      </ul>
      <ul id={style.pages}>
        <li><a href="/about">About &amp; Contact</a></li>
      </ul>

      <div id={style.dump} />
    </div>
    <div id={style.credit}>
      <a href="http://tumblindex.com"> Tumblindex theme</a>
    </div>
  </div>
  );

export default Nav;
