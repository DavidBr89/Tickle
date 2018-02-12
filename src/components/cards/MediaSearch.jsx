import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import MyGrid from 'mygrid/dist';
import cxs from 'cxs';
import giphyReq from 'giphy-api';

// import { DDG } from 'node-ddg-api';

import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { ModalBody } from './modal';
import gapi from './gapi';

const giphy = giphyReq();

const fullDim = cxs({ width: '100%', height: '100%' });
const shadow = (color = 'black') =>
  cxs({
    border: `1px solid ${color}`,
    boxShadow: `9px 9px ${color}`
  });

const MediaSearch = ({ media, onSubmit }) => (
  <ModalBody>
    <div style={{ width: '100%' }}>
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            id="pills-home-tab"
            data-toggle="pill"
            href="#pills-home"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            <i
              className={`fa fa-link fa-1x col-1`}
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="pills-profile-tab"
            data-toggle="pill"
            href="#pills-profile"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            <i
              className={`fa fa-wikipedia-w fa-1x col-1`}
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="pills-contact-tab"
            data-toggle="pill"
            href="#pills-contact"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            <i
              className={`fa fa-youtube fa-1x col-1`}
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </a>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            id="giphy-link"
            data-toggle="pill"
            href="#giphy"
            role="tab"
            aria-controls="giphy"
            aria-selected="false"
          >
            <i
              className={`fa fa-amazon fa-1x col-1`}
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className={`tab-pane fade active ${fullDim}`}
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <SearchOverview data={media} onSelect={onSubmit} />
        </div>
        <div
          className={`tab-pane fade ${fullDim}`}
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <WikiSearch data={media} onSelect={onSubmit} />
        </div>
        <div
          className={`tab-pane fade ${fullDim}`}
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <YoutubeSearch data={media} onSelect={onSubmit} />
        </div>
        <div
          className={`tab-pane fade ${fullDim}`}
          id="giphy"
          role="tabpanel"
          aria-labelledby="giphy"
        >
          <GiphySearch data={media} onSelect={onSubmit} />
        </div>
      </div>
    </div>
  </ModalBody>
);

MediaSearch.propTypes = {
  media: PropTypes.array.isRequired,
  onSubmit: PropTypes.func
};

MediaSearch.defaultProps = { onSubmit: () => null };

const searchYoutube = q =>
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
      .execute(res => resolve(res))
  );

class YoutubeSearch extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = { results: [], selected: null };
    this._scroller = null;
    this.searchBar = null;
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    gapi.load('client', () => {
      const discoveryUrl =
        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

      // Initialize the gapi.client object, which app uses to make API requests.
      // Get API key and client ID from API Console.
      // 'scope' field specifies space-delimited list of access scopes.
      gapi.client
        .init({
          // TODO: put in config
          apiKey: 'AIzaSyBgA3WQwm6X8arx4X5sLSXuoM9_TSucgdI',
          discoveryDocs: [discoveryUrl]
          // clientId:
          //   '655124348640-ip7r33kh1vt5lbc2h5rij96mku6unreu.apps.googleusercontent.com',
          // scope: SCOPE
        })
        .then(() => searchYoutube('the clash').then(this.updateState));
    });
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
  }

  updateState({ items }) {
    console.log('items', items);
    const res = items.map(d => ({
      url: `http://www.youtube.com/embed/${d.id.videoId}`,
      title: d.snippet.title,
      descr: d.snippet.description,
      thumbnail: d.snippet.thumbnails.default.url
    }));
    this.setState({ results: res });
  }

  selectHandler() {
    const { data, onSelect } = this.props;
    const { results, selected } = this.state;
    onSelect([
      ...data,
      { ...results.find(d => d.url === selected), type: 'video' }
    ]);
  }

  render() {
    const { results, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    return (
      <div style={{ width: '100%', height: '60vh' }}>
        <div className="mb-3" style={{ display: 'flex' }}>
          <form>
            <input
              ref={searchBar => (this.searchBar = searchBar)}
              type="text"
              placeholder={'Search...'}
            />
            <button
              className="ml-3 btn btn-outline-primary"
              onClick={() =>
                searchYoutube(this.searchBar.value).then(this.updateState)
              }
            >
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
        <div style={{ width: '100%', height: '90%', overflowY: 'scroll' }}>
          <div
            style={{
              width: '100%',
              height: results.length < 8 ? '100%' : '400%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ScrollView ref={scroller => (this._scroller = scroller)}>
              <MyGrid
                cols={2}
                rows={results.length / 2}
                style={{ justifyItems: 'center' }}
              >
                {results.map(d => (
                  <div
                    key={d.url}
                    selected={selected === d.url}
                    colSpan={selected === d.url ? 2 : 1}
                    rowSpan={selected === d.url ? 2 : 1}
                    style={{
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    <ScrollElement name={d.url}>
                      <div
                        style={{ width: '100%', height: '100%' }}
                        onClick={() => {
                          if (selected !== d.url)
                            this.setState({ selected: d.url });
                        }}
                      >
                        {selected === d.url ? (
                          <div
                            className={shadow('grey')}
                            style={{
                              position: 'relative',
                              height: '90%',
                              width: '95%'
                              // border: '10px tomato solid'
                            }}
                          >
                            <button
                              onClick={() => this.setState({ selected: null })}
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
                                top: 3
                              }}
                            >
                              <i
                                className="fa fa-2x fa-window-close"
                                style={{ color: 'black' }}
                              />
                            </button>
                            <iframe
                              title={d.title}
                              type="text/html"
                              width="100%"
                              height="100%"
                              src={d.url}
                              frameBorder="0"
                              style={{ zIndex: '4000' }}
                            />
                          </div>
                        ) : (
                          <div className={fullDim}>
                            <img
                              className={shadow('lightgrey')}
                              alt="pix"
                              src={d.thumbnail}
                              style={{
                                width: '90%',
                                height: '90%'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </ScrollElement>
                  </div>
                ))}
              </MyGrid>
            </ScrollView>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            marginTop: '10px'
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.selectHandler()}
          >
            {selected ? 'Submit Video' : 'Select Video'}
          </button>
        </div>
      </div>
    );
  }
}

// const myHeaders = new Headers();

const searchWikipedia = (q = 'dragon') =>
  // new Promise(resolve => {
  $.ajax({
    url: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${q}&format=json&namespace=0`,

    // The name of the callback parameter, as specified by the YQL service
    jsonp: 'callback',

    // Tell jQuery we're expecting JSONP
    dataType: 'jsonp'

    // Tell YQL what we want and that we want JSON
    // Work with the response
    // done(response) {
    //   console.log('results', response);
    //   // resolve(response); // server response
    // }
  }).then(([, headers, descriptions, links]) => {
    const results = headers.map((h, i) => ({
      title: h,
      descr: descriptions[i],
      url: links[i]
    }));

    return new Promise(resolve => resolve(results));
  });
// });

// $.get(
//   'https://en.wikipedia.org/w/api.php?action=opensearch&search=dragon&format=json&namespace=0',
//   myInit
// );

class WikiSearch extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = { results: [], selected: null };
    this._scroller = null;
    this.searchBar = null;
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidMount() {
    searchWikipedia().then(results => this.setState({ results }));
  }

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
  }

  render() {
    const { onSelect, data } = this.props;
    const { results, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '60vh' }}>
        <div className="mb-3" style={{ display: 'flex' }}>
          <form>
            <input
              ref={searchBar => (this.searchBar = searchBar)}
              type="text"
              placeholder={'Search...'}
            />
            <button
              className="ml-3 btn btn-outline-primary"
              onClick={() =>
                searchWikipedia(this.searchBar.value).then(items => {
                  console.log('new res', items);
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
              <div style={{ width: '100%', height: '400%' }}>
                {results.map(d => (
                  <div
                    style={{ width: '90%' }}
                    className={`p-2 mb-3 mr-3 ${shadow(
                      selected === d.url ? 'grey' : 'lightgrey'
                    )} ${fullDim}`}
                  >
                    <ScrollElement name={d.url}>
                      <div
                        onClick={() => this.setState({ selected: d.url })}
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ fontSize: '18px' }}>
                          <a href={d.url}>{d.title} </a>
                        </div>
                        <small>{d.url} </small>
                        <div>{d.descr} </div>
                      </div>
                    </ScrollElement>
                  </div>
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
            className="btn btn-primary"
            onClick={() => {
              if (selected)
                onSelect([
                  ...data,
                  { ...results.find(d => d.url === selected), type: 'article' }
                ]);
            }}
          >
            {selected ? 'Add wiki' : 'Select wiki'}
          </button>
        </div>
      </div>
    );
  }
}

class GiphySearch extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = { results: [], selected: null };
    this._scroller = null;
    this.searchBar = null;
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidMount() {
    // searchWikipedia().then(results => this.setState({ results }));
    giphy.search('pokemon', (_, res) => this.updateState(res));
  }

  updateState({ data }) {
    console.log('data', data);
    const res = data.map(d => ({
      url: d.embed_url,
      title: d.title,
      descr: '',
      thumbnail: d.images.downsized_still.url
    }));
    this.setState({ results: res });
  }

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
  }

  render() {
    const { onSelect, data } = this.props;
    const { results, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '60vh' }}>
        <div className="mb-3" style={{ display: 'flex' }}>
          <form>
            <input
              ref={searchBar => (this.searchBar = searchBar)}
              type="text"
              placeholder={'Search...'}
            />
            <button
              className="ml-3 btn btn-outline-primary"
              onClick={() =>
                giphy.search(this.searchBar.value, (_, res) =>
                  this.updateState(res)
                )
              }
            >
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
        <div style={{ width: '100%', height: '90%', overflowY: 'scroll' }}>
          <div>
            <ScrollView ref={scroller => (this._scroller = scroller)}>
              <div style={{ width: '100%', height: '400%' }}>
                <MyGrid cols={2} rows={results.length / 2} gap={1}>
                  {results.map(d => (
                    <div
                      style={{ width: '90%' }}
                      className={`p-2 mb-3 mr-3 ${shadow(
                        selected === d.url ? 'grey' : 'lightgrey'
                      )} ${fullDim}`}
                      colSpan={selected === d.url ? 2 : 1}
                      rowSpan={selected === d.url ? 12 : 1}
                    >
                      <ScrollElement name={d.url}>
                        <div
                          onClick={() => this.setState({ selected: d.url })}
                          style={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            backgroundImage: `url('${d.thumbnail}')`
                          }}
                        >
                          <div
                            className="mt-1 ml-1 p-1"
                            style={{
                              fontSize: '18px',
                              overflow: 'hidden'
                            }}
                          >
                            <span
                              style={{
                                background: 'white',
                              }}
                            >
                              {selected === d.url ? (
                                <a href={d.url}>{d.title} </a>
                              ) : (
                                d.title
                              )}
                            </span>
                          </div>
                        </div>
                      </ScrollElement>
                    </div>
                  ))}
                </MyGrid>
              </div>
            </ScrollView>
          </div>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'flex-end', marginTop: '10px' }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (selected)
                onSelect([
                  ...data,
                  { ...results.find(d => d.url === selected), type: 'article' }
                ]);
            }}
          >
            {selected ? 'Add wiki' : 'Select wiki'}
          </button>
        </div>
      </div>
    );
  }
}

const duckSearch = q =>
  new Promise(resolve =>
    $.ajax({
      url: `https://api.duckduckgo.com/?q=${q}&pretty=1&no_html=0&no_redirect=0&skip_disambig=1&format=json&t=tickle&callback=callback`,
      jsonp: true
    }).then(r => resolve(r))
  );

class SearchOverview extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    const { data } = props;
    this.state = { data, selected: null };
    this._scroller = null;
    this.searchBar = null;
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidMount() {
    duckSearch('cooking').then(r => console.log('res', r));
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
                {data.map(d => (
                  <div
                    style={{ width: '90%' }}
                    className={`p-2 mb-3 mr-3 ${shadow(
                      selected === d.url ? 'grey' : 'lightgrey'
                    )} ${fullDim}`}
                  >
                    <ScrollElement name={d.url}>
                      <div
                        onClick={() => this.setState({ selected: d.url })}
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ fontSize: '18px' }}>
                          <a href={d.url}>{d.title} </a>
                        </div>
                        <small>{d.url} </small>
                        <div>{d.descr} </div>
                      </div>
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

export default MediaSearch;