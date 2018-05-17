import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import * as Icon from 'react-feather';

// import MyGrid from 'mygrid/dist';
import cxs from 'cxs';
import giphyReq from 'giphy-api';
// import fetchJsonp from 'fetch-jsonp';

// import { DDG } from 'node-ddg-api';

import { ScrollView, ScrollElement } from '../utils/ScrollView';
import gapi from './gapi';

import { createShadowStyle } from './styles';
import { UIthemeContext } from 'Cards/styles';

const giphy = giphyReq({ https: true });

const fullDim = cxs({ width: '100%', height: '100%' });

gapi.load('client', () => {
  const discoveryUrl =
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
    // TODO: put in config
    apiKey: 'AIzaSyBgA3WQwm6X8arx4X5sLSXuoM9_TSucgdI',
    discoveryDocs: [discoveryUrl]
    // clientId:
    //   '655124348640-ip7r33kh1vt5lbc2h5rij96mku6unreu.apps.googleusercontent.com',
    // scope: SCOPE
  });
});

const flickr = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
  process.env.FlickrAccessToken
}&tags=football&format=json`;

const searchFlickr = (q = 'dragon') =>
  // new Promise(resolve => {
  $.ajax({
    url: flickr,
    jsonp: 'callback',
    dataType: 'jsonp'
  }).then(({ query: { pages } }) => {
    const values = Object.values(pages);
    // console.log('pages', pages);
    const results = values.map(d => ({
      title: d.title,
      descr: d.extract,
      thumbnail: d.thumbnail ? d.thumbnail.source : null, // d.thumbnail.source,
      url: d.fullurl,
      type: 'article'
    }));

    return new Promise(resolve => resolve(results));
  });
const searchWikipedia = (q = 'dragon') =>
  // new Promise(resolve => {
  $.ajax({
    url: `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${q}&gpslimit=20&prop=info|pageimages|pageterms|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exlimit=max&exintro&inprop=url&explaintext`,
    jsonp: 'callback',
    dataType: 'jsonp'
  }).then(({ query: { pages } }) => {
    const values = Object.values(pages);
    console.log('pages', pages);
    const results = values.map(d => ({
      title: d.title,
      descr: d.extract,
      thumbnail: d.thumbnail ? d.thumbnail.source : null, // d.thumbnail.source,
      url: d.fullurl,
      id: d.fullurl,
      type: 'article'
    }));

    return new Promise(resolve => resolve(results));
  });

const searchYoutube = (q = 'dragon') =>
  new Promise(resolve =>
    gapi.client.youtube.search
      .list({
        part: 'snippet',
        type: 'video',
        q,
        maxResults: 20,
        order: 'viewCount',
        // TODO: change
        publishedAfter: '2015-01-01T00:00:00Z'
      })
      .execute(({ items }) => {
        const res = items.map(d => ({
          url: `http://www.youtube.com/embed/${d.id.videoId}`,
          id: d.id.videoId,
          title: d.snippet.title,
          descr: d.snippet.description,
          thumbnail: d.snippet.thumbnails.default.url,
          type: 'video'
        }));
        resolve(res);
      })
  );

const searchGiphy = (q = 'pokemon') =>
  new Promise(resolve =>
    giphy.search(q, (_, { data }) =>
      resolve(
        data.map(d => ({
          url: d.embed_url,
          id: d.embed_url,
          title: d.title,
          descr: '',
          thumbnail: d.images.downsized_still.url,
          gifurl: d.url,
          type: 'gif'
        }))
      )
    )
  );
//
const Iframe = ({ title, url, onClick, edit, style }) => (
  <div
    className={fullDim}
    style={{
      position: 'relative',
      ...style
      // border: '10px tomato solid'
    }}
  >
    {edit && (
      <button
        onClick={onClick}
        className="btn-danger"
        style={{
          // background: 'white',
          border: 0,
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '5px',
          paddingBottom: '1px',
          position: 'absolute',
          zIndex: 1000,
          right: 8,
          top: 10
        }}
      >
        <i className="fa fa-2x fa-window-close" style={{ color: 'black' }} />
      </button>
    )}
    <div className={fullDim} style={{ position: 'relative' }}>
      <div className={fullDim} style={{ position: 'absolute' }} />
      <iframe
        title={title}
        type="text/html"
        width="100%"
        height="100%"
        src={url}
        frameBorder="0"
        style={{ zIndex: '-1', position: 'absolute' }}
      />
    </div>
  </div>
);

Iframe.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func,
  edit: PropTypes.bool,
  style: PropTypes.object
};

Iframe.defaultProps = {
  title: '',
  url: '',
  onClick: d => d,
  style: {},
  edit: false
};

const Article = ({ url, title, descr, onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}
  >
    <div style={{ fontSize: '18px' }}>
      <a href={url}>{title} </a>
    </div>
    <small>{url}</small>
    <div>{descr}</div>
  </div>
);

Article.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  descr: PropTypes.string,
  onClick: PropTypes.func
};

Article.defaultProps = {
  title: '',
  url: '',
  descr: '',
  onClick: d => d
};

const ThumbNailSwitchDetail = ({
  selected,
  type,
  thumbnail,
  title,
  descr,
  url,
  onClick
}) => {
  if (selected && (type === 'video' || type === 'gif'))
    return (
      <Iframe edit url={url} title={title} descr={descr} onClick={onClick} />
    );

  // if (type === 'challenge')
  //   return (
  //     <div onClick={onClick} className={fullDim}>
  //       <Iframe url={url} title={title} descr={descr} style={{ zIndex: 0 }} />
  //     </div>
  //   );

  return (
    <div
      onClick={onClick}
      className={fullDim}
      style={{
        overflow: 'hidden',
        backgroundImage: thumbnail !== null && `url('${thumbnail}')`,
        backgroundRepeat: thumbnail !== null && 'no-repeat',
        backgroundSize: thumbnail !== null && '100% 100%'
      }}
    >
      {thumbnail ? (
        <div
          className="mt-1 ml-1 p-1"
          style={{
            fontSize: '18px',
            overflow: 'hidden',
            zIndex: 2
          }}
        >
          <span
            style={{
              background: 'whitesmoke'
            }}
          >
            {selected ? <a href={url}>{title} </a> : title}
          </span>
          <div>
            <small style={{ background: 'whitesmoke' }}>{url}</small>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <div style={{ fontSize: '18px' }}>
            <a href={url}>{title} </a>
          </div>
          <small>{url}</small>
          <p>{descr}</p>
        </div>
      )}
    </div>
  );
};

ThumbNailSwitchDetail.propTypes = {
  className: PropTypes.string
};

ThumbNailSwitchDetail.defaultProps = {
  className: ''
};

const ThumbCell = ({ children, className, ...props }) => (
  <UIthemeContext.Consumer>
    {({ uiColor, focusColor }) => (
      <div
        className={`p-3 ${className}`}
        style={{
          height: '40vh',
          width: '100%',
          maxHeight: 300,
          ...props.style,
          cursor: 'pointer',
          position: 'relative',
          ...createShadowStyle(props.selected ? focusColor : uiColor)
        }}
      >
        <div
          className="mr-3"
          style={{ position: 'absolute', zIndex: 300, right: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            {children}
          </div>
        </div>
        <ThumbNailSwitchDetail {...props} />
      </div>
    )}
  </UIthemeContext.Consumer>
);

ThumbCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  selected: PropTypes.bool
};

ThumbCell.defaultProps = {
  children: null,
  url: '',
  thumbnail: null,
  title: '',
  descr: '',
  selected: false,
  onClick: d => d,
  style: {},
  className: ''
};

class MediaSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  static defaultProps = { onChange: () => null, media: [] };

  constructor(props) {
    super(props);
    this.state = { selected: 'wikipedia' };
  }

  render() {
    const { selectedMedia, onChange } = this.props;
    const { selected } = this.state;

    const btnStyle = (sel, uiColor) => ({
      background: sel ? uiColor : null,
      display: 'inline-flex',
      color: sel ? 'white' : null
    });

    const updState = sel => () => this.setState({ selected: sel });

    const activeTab = sel => {
      switch (sel) {
        case 'overview':
          return <MediaOverview data={selectedMedia} onChange={onChange} />;
        case 'wikipedia':
          return (
            <MetaSearch
              onChange={onChange}
              search={searchWikipedia}
              type="Article"
            />
          );
        case 'youtube':
          return (
            <MetaSearch
              onChange={onChange}
              search={searchYoutube}
              type="Video"
            />
          );
        case 'giphy':
          return (
            <MetaSearch onChange={onChange} search={searchGiphy} type="GIF" />
          );
        default:
          return <div>{'Error selection'}</div>;
      }
    };

    return (
      <UIthemeContext.Consumer>
        {({ uiColor }) => (
          <div style={{ width: '100%' }}>
            <div
              className="mb-3 nav"
              style={{ display: 'flex', justifyContent: 'space-between' }}
              role="tablist"
            >
              <button
                className="btn"
                type="button"
                onClick={updState('wikipedia')}
                style={btnStyle(selected === 'wikipedia', uiColor)}
                id="wikipedia"
              >
                <i
                  className={`fa fa-wikipedia-w fa-1x col-1`}
                  style={{ fontSize: '19px' }}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                className="btn"
                onClick={updState('youtube')}
                style={btnStyle(selected === 'youtube', uiColor)}
                id="youtube"
              >
                <i
                  className={`fa fa-youtube fa-1x col-1`}
                  style={{ fontSize: '19px' }}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                className="btn"
                onClick={updState('giphy')}
                style={btnStyle(selected === 'giphy', uiColor)}
                id="giphy"
              >
                <small
                  style={{
                    paddingLeft: '13px',
                    paddingRight: '13px',
                    fontWeight: 'bold'
                  }}
                >
                  GIF
                </small>
              </button>
              <button
                type="button"
                className="btn"
                onClick={updState('overview')}
                style={btnStyle(selected === 'overview', uiColor)}
                id="overview"
              >
                <i
                  className={`fa fa-link fa-1x col-1`}
                  style={{ fontSize: '19px' }}
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="tab-content">
              {/* TODO: check fade */}
              <div className={` ${fullDim}`} role="tabpanel">
                {activeTab(selected)}
              </div>
            </div>
          </div>
        )}
      </UIthemeContext.Consumer>
    );
  }
}

class ScrollList extends Component {
  static propTypes = {
    data: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    data: [],
    style: {},
    className: '',
    children: d => d
  };

  state = { selected: null };

  componentDidUpdate() {
    const { selected } = this.state;

    this.scrollTo(selected);
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  render() {
    const { data, children, className, style } = this.props;
    const { selected } = this.state;
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          maxHeight: 500,
          overflowY: 'scroll',
          ...style
        }}
      >
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            className={className}
            style={{ paddingRight: '5%', height: '400%', ...style }}
          >
            {data.map(d => (
              <ScrollElement name={d.url}>
                <div
                  onClick={() =>
                    this.setState(oldState => ({
                      selected: oldState.selected !== d.url ? d.url : null
                    }))
                  }
                >
                  {children(d, d.url === selected)}
                </div>
              </ScrollElement>
            ))}
          </div>
        </ScrollView>
      </div>
    );
  }
}

function SearchBar({ onSearch }) {
  return (
    <form style={{ display: 'flex', justifyContent: 'space-between' }}>
      <input
        ref={searchBar => (this.searchBar = searchBar)}
        type="text"
        placeholder={'Search...'}
        onChange={onSearch}
      />
      <button
        className="ml-3 btn btn-active pl-3 pr-3"
        style={{ background: 'blue' }}
      >
        <i className="fa fa-search" />
      </button>
    </form>
  );
}

function ActiveBtn({ selected, onClick }) {
  return (
    <UIthemeContext.Consumer>
      {({ focusColor }) => (
        <div
          style={{ color: selected ? 'tomato' : focusColor, lineHeight: 0 }}
          onClick={onClick}
        >
          {selected ? <Icon.Trash2 size={40} /> : <Icon.PlusSquare size={40} />}
        </div>
      )}
    </UIthemeContext.Consumer>
  );
}

class MetaSearch extends Component {
  static propTypes = {
    search: PropTypes.oneOf(null, PropTypes.func),
    type: PropTypes.string,
    onAdd: PropTypes.func,
    preSelected: PropTypes.array
  };

  static defaultProps = {
    search: null,
    type: null,
    onAdd: d => d,
    selected: null,
    preSelected: []
  };

  constructor(props) {
    super(props);

    this._scroller = null;
    this.searchBar = null;
    this.mounted = true;
  }

  state = {
    data: this.props.preSelected, // this.props.search === null ? this.props.defaultData : []
    selected: []
  };

  componentDidMount() {
    const { search } = this.props;
    if (search !== null)
      search().then(data => this.mounted && this.setState({ data }));
  }

  componentWillReceiveProps(nextProps) {
    const { search } = nextProps;
    search().then(data => {
      this.setState({ data });
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }
  // componentWillReceiveProps(nextProps) {
  //   nextProps.search().then(results => {
  //     this.setState({ results });
  //   });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { type, onChange } = this.props;
    const { data, selected } = this.state;

    if (selected.length !== prevState.selected.length) {
      onChange(selected.map(id => data.find(d => d.id === id)));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { onSelect, search, type, defaultData, onAdd } = this.props;
    const { data, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }
    const onSearch = () => {
      const searchVal = this.searchBar.value;
      if (search !== null) {
        search().then(items => {
          this.setState({ data: items });
        });
      } else {
        // TODO real search
        this.setState({
          results: defaultData.filter(d => d.title === searchVal)
        });
      }
    };
    const addItem = id => {
      this.setState(oldState => ({
        selected: [...oldState.selected, id]
      }));
    };
    const removeItem = id =>
      this.setState(oldState => ({
        selected: oldState.selected.filter(d => d !== id)
      }));

    // TODO: fix view height
    return (
      <div>
        <div style={{ width: '100%' }}>
          <div className="mb-3">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        <ScrollList data={data}>
          {(d, isSelected) => (
            <ThumbCell
              className="mb-3"
              selected={isSelected}
              style={{ height: '40vh', maxHeight: 300 }}
              {...d}
            >
              <ActiveBtn
                selected={selected.includes(d.id)}
                onClick={() =>
                  selected.includes(d.id) ? removeItem(d.id) : addItem(d.id)
                }
              />
            </ThumbCell>
          )}
        </ScrollList>
      </div>
    );
  }
}

// const duckSearch = q => new Promise(resolve =>
//     $.ajax({
//       url: `https://api.duckduckgo.com/?q=${q}&pretty=1&no_html=0&no_redirect=0&skip_disambig=1&format=json&t=tickle`,
//       jsonp: true
//     }).then(r => resolve(r))
//   );
//
class MediaOverview extends Component {
  static propTypes = {};
  static defaultProps = {
    data: []
  };

  constructor(props) {
    super(props);

    const { data, selected } = props;
    this.state = { data, selected };
    this._scroller = null;
    this.searchBar = null;
  }

  componentDidMount() {
    // $.ajax(options)
    //   .then(resolve)
    //   .fail(reject),
    // ddg.instantAnswer('megaman', {}, (err, response) => {
    //   console.log(response);
    // });
  }

  componentDidUpdate() {
    // this.scrollTo(this.state.selected);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ data });
  }

  render() {
    const { data } = this.props;
    const { selected } = this.state;
    console.log('data', data);
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    const removeItem = id =>
      this.setState(oldState => ({
        selected: oldState.selected.filter(d => d !== id)
      }));
    return (
      <div style={{ width: '100%', height: '60vh' }}>
        {data.length === 0 && <h3>{'No media added to this Card!'} </h3>}
        <ScrollList data={data}>
          {d => (
            <ThumbCell
              {...d}
              selected={selected === d.url}
              onClick={() =>
                this.setState(oldState => ({
                  selected: oldState.selected !== d.url ? d.url : null
                }))
              }
            >
              <ActiveBtn selected onClick={() => removeItem(d.id)} />
            </ThumbCell>
          )}
        </ScrollList>
      </div>
    );
  }
}

class ChallengeSearch extends Component {
  static propTypes = {
    data: PropTypes.array,
    selected: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    data: [],
    selected: '',
    onChange: d => d
  };

  constructor(props) {
    super(props);
    this.state = { defaultData: [] };
  }

  componentDidMount() {
    const { data } = this.props;

    // TODO: fetch thumbnails
    setTimeout(() => {
      const defaultData = data.map(d => ({
        url: d.url,
        title: d.url,
        descr: '',
        thumbnail: null,
        type: 'hangman'
      }));
      this.setState({ defaultData });
    }, 1);
    // Promise.all(
    //   data.map(d =>
    //     fetchJsonp(
    //         d.url
    //       }&r=http://your-homepage.com/computer-news.php&e=7jnoaudset42xsp5s&t=json`
    //     )
    //   )
    // )
    //   .then(results => {
    //     const defaultData = data.map((d, i) => ({
    //       url: d.url,
    //       title: results[i].title,
    //       descr: '',
    //       thumbnail: results[i].img,
    //       type: 'hangman'
    //     }));
    //     this.setState({ defaultData });
    //   })
    //   .catch(() => {
    //     const defaultData = data.map(d => ({
    //       url: d.url,
    //       title: d.url,
    //       descr: '',
    //       thumbnail: null,
    //       type: 'hangman'
    //     }));
    //     this.setState({ defaultData });
    //   });
  }

  render() {
    const { selected, onChange } = this.props;
    const { defaultData } = this.state;
    return (
      <MetaSearch
        onSelect={([ch]) => onChange(ch)}
        selected={selected}
        type="Challenge"
        defaultData={defaultData}
      />
    );
  }
}

export { MediaSearch, MediaOverview, ChallengeSearch };
