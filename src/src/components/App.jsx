// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import $ from 'jquery';
import cxx from './app.scss';

import Home from './Home';
import Collage from './Collage';
import Bookmarks from './Bookmarks';
// import LongIslandGirls from './components/LongIslandGirls';
import RecordCollection from './RecordCollection';
import Projects from './Projects';
import CV from './CV';
// import Nav from './components/Nav';
// import cxx from './components/cxx/nav.scss';
// import './global/annotation.scss';
// import './global/index.scss';

const SMALL_HEIGHT = 670;
const SMALL_WIDTH = 890;

const BIG_WIDTH = 1000;
const BIG_HEIGHT = 770;

const selectElement = (path, pr) => {
  switch (path) {
    case '/':
      return <Home {...pr} />;
    case '/CV':
      return <CV {...pr} />;
    case '/Collage':
      return <Collage {...pr} />;
    case '/Bookmarks':
      return <Bookmarks {...pr} />;
    case '/RecordCollection':
      return <RecordCollection {...pr} />;
    case '/Projects':
      return <Projects {...pr} />;
    default:
      return <div>{'Unknown path'}</div>;
  }
};

const resize = win => {
  let width;
  let height;
  let picDim = { pixelSize: 1 };
  if (win.innerWidth > 1500) {
    width = BIG_WIDTH;
    height = BIG_HEIGHT;
    picDim = { ...picDim, width: 108, height: 113, marginLeft: 50 };
  } else {
    width = SMALL_WIDTH;
    height = SMALL_HEIGHT;
    picDim = { ...picDim, width: 85, height: 90, marginLeft: 70 };
  }
  return { width, height, picDim };
};

class App extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  };
  static defaultProps = {
    path: '/'
  };

  constructor(props) {
    super(props);
    const { path } = props;
    this.clickHandler = this.clickHandler.bind(this);

    this.state = {
      path,
      oldPath: path,
      back: false,
      ...resize(window)
    };

    window.addEventListener('resize', () => {
      this.setState(resize(window));
    });
  }

  componentDidMount() {
    // window.onLoad = function() {
    // const width = 800;
    // const height = 600;
    // const fontSize = null;
    // const pad = 20; // this.props;
    // // console.log('window', window.innerWidth);
    // const main = ReactDOM.findDOMNode(this.main);
    // const height = ReactDOM.findDOMNode(this.cont).clientHeight;
    // const width = ReactDOM.findDOMNode(this.cont).clientWidth;
    // this.setState({ height, width });
    // };
  }

  // componentWillReceiveProps({ path: newPath }) {
  //   this.setState({
  //     path: newPath,
  //     oldPath: this.props.path,
  //     back: !this.state.back
  //   });
  // }

  clickHandler(event) {
    event.preventDefault(); // Let's stop this event.
    event.stopPropagation(); // Really this time.
    const path = event.currentTarget.getAttribute('href');
    if (this.state.path !== path) {
      const currentPath = event.currentTarget.getAttribute('href');
      window.history.pushState(path, path, `#${currentPath}`);
      this.setState(oldState => ({
        path,
        oldPath: oldState.path,
        back: !oldState.back
      }));
    }
  }

  render() {
    const { width, height, picDim, path, oldPath, back } = this.state;
    const pathString = p => (p.substring(1) === '' ? 'Home' : p.substring(1));

    const pad = 20;

    const comProps = {
      width: width - pad * 2,
      height: height - pad * 2,
      picDim,
      lessData: width === SMALL_WIDTH
    };
    const ActiveElement = selectElement(path, comProps);
    const PassiveElement = selectElement(oldPath, comProps);
    const marginTop = 20;

    return (
      <div className="container" style={{ marginTop: `${marginTop}px` }}>
        <div className="row">
          <div className={cxx.navCont}>
            <div className={`${cxx.nav} border-3`}>
              <div className={cxx.title}>
                <span>Jan Maushagen</span>&nbsp;/&nbsp; <br />{' '}
                {pathString(path)}
              </div>
              <div className={cxx.list}>
                <ul>
                  <li>
                    <a onClick={this.clickHandler} href="/">
                      Home <small>(...is where I want to be)</small>
                    </a>
                  </li>
                  <li>
                    <a onClick={this.clickHandler} href="/CV">
                      CV <small>(my so called adult life)</small>
                    </a>
                  </li>
                  <li>
                    <a onClick={this.clickHandler} href="/Collage">
                      Collage <small>(friends and spaces)</small>
                    </a>
                  </li>
                  <li>
                    <a onClick={this.clickHandler} href="/RecordCollection">
                      Record Collection
                    </a>
                  </li>
                  <li>
                    <a onClick={this.clickHandler} href="/Projects">
                      Blog{' '}
                      <small>{'(projects, mixtapes and other stuff - unfinished)'}</small>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div id={cxx.right} className={cxx.mainCont}>
            <div className={`${cxx.flipContainer}`}>
              <div
                className={cxx.flipper}
                style={{
                  transformOrigin: `100% ${comProps.height / 2 + marginTop}px`,
                  transform: back ? 'rotateX(180deg)' : null,
                  zIndex: back ? 3 : null
                }}
              >
                <div
                  className={cxx.front}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: back ? -1 : null
                  }}
                >
                  <div>{!back ? ActiveElement : PassiveElement}</div>
                </div>
                <div
                  className={cxx.back}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    //TODO
                    // zIndex: !back ? -1 : null
                  }}
                >
                  <div className={cxx.passiveElement}>
                    {back ? ActiveElement : PassiveElement}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
