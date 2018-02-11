import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import MyGrid from 'mygrid/dist';
import cxs from 'cxs';
import { DDG } from 'node-ddg-api';

import { ScrollView, ScrollElement } from '../utils/ScrollView';
import gapi from './gapi';

// const ddg = new DDG('tickle');

const fullDim = cxs({ width: '100%', height: '100%' });
const shadow = (color = 'black') =>
  cxs({
    border: `1px solid ${color}`,
    boxShadow: `9px 9px ${color}`
  });

const SmallModal = ({ visible, title, children, onClose }) =>
  ReactDOM.createPortal(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: visible ? '4000' : '-10',
        left: 0,
        top: 0,
        position: 'absolute'
      }}
    >
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          opacity: visible ? 1 : 0,
          display: visible ? 'block' : 'none'
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('body')
  );

SmallModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};
SmallModal.defaultProps = {
  visible: true,
  title: '-',
  children: <div>{'test'}</div>,
  onClose: () => null,
  onSave: () => null
};

const ModalBody = ({ children, onSubmit, submitText }) => (
  <div>
    <div className="modal-body">{children}</div>
    <div className="modal-footer">
      <button type="button" className="btn btn-primary" onClick={onSubmit}>
        {submitText}
      </button>
    </div>
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func,
  submitText: PropTypes.text
};

ModalBody.defaultProps = {
  onSubmit: () => null,
  submitText: 'Save Changes'
};

const MediaSearch = ({ media, onSubmit }) => (
  <ModalBody submitText={'Add media'}>
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
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className={`tab-pane fade active ${fullDim}`}
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <DuckDuckGo onSelect={onSubmit} />
        </div>
        <div
          className={`tab-pane fade ${fullDim}`}
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <WikiSearch onSelect={onSubmit} />
        </div>
        <div
          className={`tab-pane fade ${fullDim}`}
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <YoutubeSearch onSelect={onSubmit} />
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
          apiKey: 'AIzaSyBgA3WQwm6X8arx4X5sLSXuoM9_TSucgdI',
          discoveryDocs: [discoveryUrl]
          // clientId:
          //   '655124348640-ip7r33kh1vt5lbc2h5rij96mku6unreu.apps.googleusercontent.com',
          // scope: SCOPE
        })
        .then(() =>
          searchYoutube('the clash').then(({ items }) =>
            this.setState({ results: items })
          )
        );
    });
  }

  scrollTo = name => {
    this._scroller.scrollTo(name);
  };

  componentDidUpdate() {
    this.scrollTo(this.state.selected);
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
                searchYoutube(this.searchBar.value).then(({ items }) => {
                  this.setState({ results: items });
                })
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
                    key={d.id.videoId}
                    selected={selected === d.id.videoId}
                    colSpan={selected === d.id.videoId ? 2 : 1}
                    rowSpan={selected === d.id.videoId ? 2 : 1}
                    style={{
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    <ScrollElement name={d.id.videoId}>
                      <div
                        style={{ width: '100%', height: '100%' }}
                        onClick={() => {
                          if (selected !== d.id.videoId)
                            this.setState({ selected: d.id.videoId });
                        }}
                      >
                        {selected === d.id.videoId ? (
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
                              title={d.id.videoId}
                              type="text/html"
                              width="100%"
                              height="100%"
                              src={`http://www.youtube.com/embed/${
                                d.id.videoId
                              }`}
                              frameBorder="0"
                              style={{ zIndex: '4000' }}
                            />
                          </div>
                        ) : (
                          <div className={fullDim}>
                            <img
                              className={shadow('lightgrey')}
                              alt="pix"
                              src={d.snippet.thumbnails.default.url}
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
      </div>
    );
  }
}

// const myHeaders = new Headers();

const searchWikipedia = () =>
  // new Promise(resolve => {
  $.ajax({
    url:
      'https://en.wikipedia.org/w/api.php?action=opensearch&search=dragon&format=json&namespace=0',

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
      header: h,
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
                searchWikipedia(this.searchBar.value).then(({ items }) => {
                  console.log('new res', results);
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
                          <a href={d.url}>{d.header} </a>
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

const duckSearch = q =>
  new Promise(resolve =>
    $.ajax({
      url: `https://api.duckduckgo.com/?q=${q}&pretty=1&no_html=0&no_redirect=0&skip_disambig=1&format=json&t=tickle&callback=callback`,
      jsonp: true
    }).then(r => resolve(r))
  );

class DuckDuckGo extends Component {
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
    duckSearch('cooking').then(r => console.log('res', r))
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

  render() {
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
                searchWikipedia(this.searchBar.value).then(({ items }) => {
                  console.log('new res', results);
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
                          <a href={d.url}>{d.header} </a>
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

export { SmallModal, ModalBody, MediaSearch, DuckDuckGo };
