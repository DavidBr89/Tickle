import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
// import MyGrid from 'mygrid/dist';
import cxs from 'cxs';
import giphyReq from 'giphy-api';

// import { DDG } from 'node-ddg-api';

import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { ModalBody } from '../utils/modal';
import gapi from './gapi';

const giphy = giphyReq();

const fullDim = cxs({ width: '100%', height: '100%' });
const shadow = (color = 'black') =>
  cxs({
    border: `1px solid ${color}`,
    boxShadow: `6px 6px ${color}`
  });

const shadowStyle = {
  boxShadow: '4px 4px grey',
  border: '1px solid grey'
};

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

const flickr = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FlickrAccessToken}&tags=football&format=json`

const searchFlickr = (q = 'dragon') =>
  // new Promise(resolve => {
  $.ajax({
    url: flickr,
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
const Iframe = ({ title, url, onClick }) => (
  <div
    className={fullDim}
    style={{
      position: 'relative'
      // border: '10px tomato solid'
    }}
  >
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
    <iframe
      title={title}
      type="text/html"
      width="100%"
      height="100%"
      src={url}
      frameBorder="0"
      style={{ zIndex: '4000' }}
    />
  </div>
);

Iframe.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func
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
    return <Iframe url={url} title={title} descr={descr} onClick={onClick} />;

  return (
    <div
      onClick={onClick}
      className={fullDim}
      style={{
        overflow: 'hidden',
        backgroundImage: thumbnail !== null && `url('${thumbnail}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
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
Iframe.defaultProps = {
  title: '',
  url: '',
  onClick: d => d
};

const ThumbCell = props => (
  <div
    className={`p-3 ${shadow(
      props.selected ? 'grey' : 'lightgrey'
    )} ${fullDim} ${props.className}`}
    style={props.style}
  >
    <ThumbNailSwitchDetail {...props} />
  </div>
);

ThumbCell.propTypes = {
  url: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  descr: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.oneOf(['video', 'article', 'gif']).isRequired
};

ThumbCell.defaultProps = {
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
    media: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    color: PropTypes.string
  };

  static defaultProps = { onSubmit: () => null, media: [], color: 'tomato' };

  constructor(props) {
    super(props);
    this.state = { selected: 'overview' };
  }

  render() {
    const { media, onSubmit, color } = this.props;
    const { selected } = this.state;

    const btnStyle = (sel, context) => ({
      background: sel === context ? color : null,
      display: 'inline-flex',
      color: sel === context ? 'white' : null
    });

    const updState = sel => () => this.setState({ selected: sel });

    const activeTab = sel => {
      switch (sel) {
        case 'overview':
          return (
            <MediaOverview data={media} onSelect={onSubmit} color={color} />
          );
        case 'wikipedia':
          return (
            <MetaSearch
              data={media}
              onSelect={onSubmit}
              color={color}
              search={searchWikipedia}
              type="Article"
            />
          );
        case 'youtube':
          return (
            <MetaSearch
              data={media}
              onSelect={onSubmit}
              color={color}
              search={searchYoutube}
              type="Video"
            />
          );
        case 'giphy':
          return (
            <MetaSearch
              data={media}
              onSelect={onSubmit}
              color={color}
              search={searchGiphy}
              type="GIF"
            />
          );
        default:
          return <div>{'Error selection'}</div>;
      }
    };

    return (
      <ModalBody>
        <div style={{ width: '100%' }}>
          <div
            className="mb-3 nav"
            style={{ display: 'flex', justifyContent: 'space-between' }}
            role="tablist"
          >
            <button
              type="button"
              className="btn"
              onClick={updState('overview')}
              style={btnStyle(selected, 'overview')}
              id="overview"
            >
              <i
                className={`fa fa-link fa-1x col-1`}
                style={{ fontSize: '19px' }}
                aria-hidden="true"
              />
            </button>
            <button
              className="btn"
              type="button"
              onClick={updState('wikipedia')}
              style={btnStyle(selected, 'wikipedia')}
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
              style={btnStyle(selected, 'youtube')}
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
              style={btnStyle(selected, 'giphy')}
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
          </div>
          <div className="tab-content">
            {/* TODO: check fade */}
            <div className={` ${fullDim}`} role="tabpanel">
              {activeTab(selected)}
            </div>
          </div>
        </div>
      </ModalBody>
    );
  }
}

class MetaSearch extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    data: PropTypes.array,
    type: PropTypes.string,
    color: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = { results: [], selected: null };
    this._scroller = null;
    this.searchBar = null;
    this.mounted = true;
    this.scrollTo = this.scrollTo.bind(this);
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidMount() {
    const { search } = this.props;
    search().then(results => this.mounted && this.setState({ results }));
  }

  componentWillReceiveProps(nextProps) {
    nextProps.search().then(results => {
      this.setState({ results });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
  }
  render() {
    const { onSelect, data, color, search, type } = this.props;
    const { results, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '60vh' }}>
        <div className="mb-3">
          <form style={{ display: 'flex', justifyContent: 'space-between' }}>
            <input
              ref={searchBar => (this.searchBar = searchBar)}
              type="text"
              placeholder={'Search...'}
            />
            <button
              className="ml-3 btn btn-active"
              style={{ background: color }}
              onClick={() =>
                search(this.searchBar.value).then(items => {
                  this.setState({ results: items });
                })
              }
            >
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
        <div style={{ width: '100%', height: '90%', overflowY: 'scroll' }}>
          <div>
            <ScrollView ref={scroller => (this._scroller = scroller)}>
              <div style={{ width: '95%', height: '400%' }}>
                {results.map(d => (
                  <ScrollElement name={d.url}>
                    <div className="mb-3" style={{ height: '40vh' }}>
                      <ThumbCell
                        {...d}
                        selected={selected === d.url}
                        onClick={() =>
                          this.setState(oldState => ({
                            selected: oldState.selected !== d.url ? d.url : null
                          }))
                        }
                      />
                    </div>
                  </ScrollElement>
                ))}
              </div>
            </ScrollView>
          </div>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'flex-end', marginTop: '10px' }}
        >
          <button
            type="button"
            className="btn"
            style={{ background: color, color: 'black' }}
            onClick={() => {
              if (selected)
                onSelect([
                  ...data,
                  { ...results.find(d => d.url === selected), type: 'article' }
                ]);
            }}
          >
            {selected ? `Add ${type}` : `Select ${type}`}
          </button>
        </div>
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

  constructor(props) {
    super(props);

    const { data, selected } = props;
    this.state = { data, selected };
    this._scroller = null;
    this.searchBar = null;
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidMount() {
    // $.ajax(options)
    //   .then(resolve)
    //   .fail(reject),
    // ddg.instantAnswer('megaman', {}, (err, response) => {
    //   console.log(response);
    // });
  }

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ data });
  }

  render() {
    const { data, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '60vh' }}>
        <div style={{ width: '100%', height: '90%', overflowY: 'scroll' }}>
          <div>
            <ScrollView ref={scroller => (this._scroller = scroller)}>
              <div style={{ width: '100%', height: '400%' }}>
                {data.length === 0 && (
                  <h3>{'No media added to this Card!'} </h3>
                )}
                {data.map(d => (
                  <div>
                    <ScrollElement name={d.url}>
                      <ThumbCell
                        {...d}
                        selected={selected === d.url}
                        onClick={() =>
                          this.setState(oldState => ({
                            selected: oldState.selected !== d.url ? d.url : null
                          }))
                        }
                      />
                    </ScrollElement>
                  </div>
                ))}
              </div>
            </ScrollView>
          </div>
        </div>
      </div>
    );
  }
}

export { MediaSearch, MediaOverview };
