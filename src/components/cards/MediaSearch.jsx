import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ajax } from 'jquery';

import * as Icon from 'react-feather';
import { css } from 'aphrodite';

import { uniqBy } from 'lodash';

// import MyGrid from 'mygrid/dist';
import giphyReq from 'giphy-api';
import ScrollList from 'Components/utils/ScrollList';
// import fetchJsonp from 'fetch-jsonp';

// import { DDG } from 'node-ddg-api';
import { db } from 'Firebase';

import gapi from './gapi';

import MediaUpload from 'Utils/MediaUpload';

// import { createShadowStyle } from './styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import { NewTabLink } from 'Components/utils/StyledComps';

const userContentUploadPath = id => `media/${id}`;

const UploadUserContent = ({ onChange, ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <MediaUpload
        style={{ width: '100%' }}
        {...props}
        stylesheet={stylesheet}
        nodeWrapper={({ url, name, loading }) => (
          <div style={{ fontSize: 'large' }}>{!loading? name : 'loading'}</div>
        )}
        onChange={media =>
          onChange(
            media.map(m => ({ ...m, title: m.name, type: USER_CONTENT }))
          )
        }
      />
    )}
  </CardThemeConsumer>
);

const SpanBG = ({ children, style }) => (
  <CardThemeConsumer>
    {({ stylesheet: { shallowBg } }) => (
      <span className={`${css(shallowBg)} p-1 pr-2 pl-2`} style={style}>
        {children}
      </span>
    )}
  </CardThemeConsumer>
);

const GIF = 'gif';
const TEXT = 'text';
const VIDEO = 'video';
const IMAGE = 'Image';
const URL = 'url';
const USER_CONTENT = 'USER_CONTENT';

const giphy = giphyReq({ https: true });

const fullDim = { width: '100%', height: '100%' };

const truncateStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%'
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

const flickrUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
  process.env.FlickrAccessToken
}`;

const searchFlickr = (q = 'dragon') =>
  // new Promise(resolve => {
  //
  ajax({
    url: flickrUrl,
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    /* tags: 'kitten',  */
    data: {
      text: q,
      format: 'json',
      extras: 'url_m,tags,machine_tags',
      page: 1,
      per_page: 25
    }
  }).then(({ photos: { photo: rawResult } }) => {
    // console.log('rawResult', rawResult);

    const results = rawResult.map(
      ({ title, farm, server, id, url_m: imgSrc, secret, tags }) => {
        const url = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        return {
          title,
          descr: tags,
          thumbnail: imgSrc,
          url,
          id,
          type: IMAGE
        };
      }
    );
    //
    return new Promise(resolve => resolve(results));
  });

// TODO: add to params
const wikiUrl = q =>
  `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${q}&gpslimit=20&prop=info|pageimages|pageterms|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exlimit=max&exintro&inprop=url&explaintext`;

const searchWikipedia = q =>
  ajax({
    url: wikiUrl(q),
    jsonp: 'callback',
    dataType: 'jsonp'
  }).then(({ query: { pages } }) => {
    const values = Object.values(pages);
    const results = values.map(d => ({
      title: d.title,
      descr: d.extract,
      thumbnail: d.thumbnail ? d.thumbnail.source : null, // d.thumbnail.source,
      url: d.fullurl,
      id: d.fullurl,
      type: TEXT
    }));

    return new Promise(resolve => resolve(results));
  });

const searchYoutube = (q = 'dragon') =>
  new Promise(resolve =>
    gapi.client.youtube.search
      .list({
        part: 'snippet',
        type: VIDEO,
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
          type: VIDEO
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
          type: GIF
        }))
      )
    )
  );

const pinterestUrl =
  'https://api.pinterest.com/v3/users/jessicamalba/?access_token=2222904fa9e29280188a94b9f940eea54fdc2344f4c666f7aa86a3187d47858d';

//
const Iframe = ({ title, url, onClick, edit, style }) => (
  <div
    style={{
      position: 'relative',
      ...style,
      ...fullDim
      // border: '10px tomato solid'
    }}
  >
    <div style={{ position: 'absolute', ...fullDim }}>
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
    <h3>
      <NewTabLink href={url}>{title} </NewTabLink>
    </h3>
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

const CellDetail = ({
  selected,
  type,
  thumbnail,
  title,
  descr,
  url,
  onClick
}) => (
  <CardThemeConsumer>
    {({ stylesheet: { shallowBg } }) => (
      <div
        onClick={onClick}
        style={{
          overflow: 'hidden',
          backgroundImage: thumbnail !== null && `url('${thumbnail}')`,
          backgroundRepeat: thumbnail !== null && 'no-repeat',
          backgroundSize: thumbnail !== null && '100% 100%',
          ...fullDim,
          minHeight: type !== USER_CONTENT ? 150 : 100,
          maxHeight: 300
        }}
      >
        {thumbnail ? (
          <div
            className="mt-1 ml-1 p-1"
            style={{
              fontSize: '18px',
              overflow: 'hidden',
              maxHeight: '90%',
              width: '85%',
              zIndex: 2
            }}
          >
            <h3
              style={{
                ...(type === GIF || type === VIDEO ? truncateStyle : null)
              }}
            >
              <SpanBG>
                {selected ? <NewTabLink href={url}>{title}</NewTabLink> : title}
              </SpanBG>
            </h3>
            {type === TEXT && (
              <div
                className={`${css(shallowBg)} p-2 mt-2`}
                style={{
                  maxWidth: '80%'
                  // TODO: fix line break
                  // maxHeight: 80
                  // fontSize: 'small'
                }}
              >
                {descr}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              width: '90%',
              height: '100%'
            }}
          >
            <h3>
              <NewTabLink href={url}>{title}</NewTabLink>
            </h3>
            <p>{descr}</p>
          </div>
        )}
      </div>
    )}
  </CardThemeConsumer>
);

CellDetail.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  uiColor: PropTypes.string,
  focusColor: PropTypes.string
};

CellDetail.defaultProps = {
  className: '',
  children: null,
  uiColor: 'grey',
  focusColor: 'black'
};
// props.selected ? css(stylesheet.bigBoxShadow) : css(stylesheet.border)}
const CellWrapper = ({ children, className, focusColor, ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <div
        className={`p-3 mb-3 ${css(stylesheet.extraShallowBg)} ${
          props.selected ? css(stylesheet.bigBoxShadow) : css(stylesheet.border)
        }`}
        style={{
          // height: '40vh',
          width: '100%',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div
          className="mr-3"
          style={{ position: 'absolute', zIndex: 300, right: 0 }}
        >
          <div>{children}</div>
        </div>
        <CellDetail {...props} />
      </div>
    )}
  </CardThemeConsumer>
);

CellWrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  selected: PropTypes.bool,
  uiColor: PropTypes.string,
  focusColor: PropTypes.string
};

CellWrapper.defaultProps = {
  children: null,
  url: '',
  thumbnail: null,
  title: '',
  descr: '',
  selected: false,
  onClick: d => d,
  style: {},
  className: '',
  uiColor: 'grey',
  focusColor: 'black'
};

// const CardThemeHoc = ({ children, ...props }) => (
//   <CardThemeConsumer>
//     {({ stylesheet }) => React.cloneElement(children, { ...props, stylesheet })}
//   </CardThemeConsumer>
// );

class UrlMedia extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    focusColor: PropTypes.string,
    uiColor: PropTypes.string
  };

  state = {
    url: null,
    descr: null,
    title: null,
    data: [...this.props.preSelected]
  };

  onSubmit = event => {
    event.preventDefault();

    const { url, title, descr } = this.state;
    const urlItem = { id: url, url, title, descr, type: 'url' };

    this.setState(({ data: oldData }) => ({
      data: uniqBy([urlItem, ...oldData], 'id'),
      title: '',
      url: '',
      descr: ''
    }));
  };

  removeItem = id => {
    this.setState(({ data: oldData }) => ({
      data: oldData.filter(d => d.id !== id)
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { data: oldData } = prevState;
    const { data } = this.state;

    if (oldData.length !== data.length) {
      onChange(data);
    }
  }

  render() {
    const { focusColor, uiColor } = this.props;
    const { url, title, descr, data } = this.state;

    return (
      <CardThemeConsumer>
        {({ stylesheet }) => (
          <div className="w-100" style={{ height: '100%' }}>
            <div className="mb-3">
              <form className="form-horizontal" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      value={title}
                      onChange={event => {
                        this.setState({ title: event.target.value });
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={descr}
                    onChange={event =>
                      this.setState({ descr: event.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <input
                    type="url"
                    placeholder="Url"
                    className="form-control"
                    value={url}
                    onChange={event =>
                      this.setState({ url: event.target.value })
                    }
                  />
                </div>
                <button type="submit" className={css(stylesheet.btn)}>
                  Add Link
                </button>
              </form>
            </div>
            {data.length > 0 ? (
              <div style={{ width: '100%', height: '100%' }}>
                <ScrollList
                  data={data}
                  maxHeight={300}
                  style={{ paddingLeft: '5%', paddingRight: '5%' }}
                >
                  {(d, isSelected) => (
                    <div
                      className={` mb-3 p-3 ${css(
                        stylesheet.border
                      )} ${isSelected && css(stylesheet.bigBoxShadow)}`}
                      selected={isSelected}
                      style={{
                        height: 150,
                        // width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <h3
                          style={{
                            overflow: 'hidden',
                            whiteSpace: 'no-wrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {d.title}
                        </h3>
                        <MediaBtn
                          selected
                          onClick={() => this.removeItem(d.id)}
                        />
                      </div>
                      <small>{d.url}</small>
                      <div>{d.descr}</div>
                    </div>
                  )}
                </ScrollList>
              </div>
            ) : (
              <div className="m-3 text-muted">
                <h3>No Urls added</h3>
              </div>
            )}
          </div>
        )}
      </CardThemeConsumer>
    );
  }
}

class UnstyledMediaSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  static defaultProps = { onChange: () => null, media: [] };

  state = { selected: 'wikipedia', mySelectedMedia: [] };

  activeTab = sel => {
    const { selectedMedia, onChange } = this.props;
    const selArticles = selectedMedia.filter(m => m.type === TEXT);
    const selVideos = selectedMedia.filter(m => m.type === VIDEO);
    const selGIFs = selectedMedia.filter(m => m.type === GIF);
    const selPhotos = selectedMedia.filter(m => m.type === IMAGE);
    const selURLs = selectedMedia.filter(m => m.type === URL);
    const selUserContent = selectedMedia.filter(m => m.type === USER_CONTENT);

    switch (sel) {
      case 'overview':
        return <MediaOverview data={selectedMedia} edit onChange={onChange} />;
      case 'wikipedia':
        return (
          <MetaSearch
            onChange={newArticles =>
              onChange([
                ...newArticles,
                ...selVideos,
                ...selGIFs,
                ...selPhotos,
                ...selURLs,
                ...selUserContent
              ])
            }
            preSelected={selArticles}
            searchFn={searchWikipedia}
            type={TEXT}
            key="wikipedia"
          />
        );
      case 'youtube':
        return (
          <MetaSearch
            onChange={newVideos =>
              onChange([
                ...newVideos,
                ...selArticles,
                ...selGIFs,
                ...selPhotos,
                ...selURLs,
                ...selUserContent
              ])
            }
            preSelected={selVideos}
            searchFn={searchYoutube}
            type={VIDEO}
            key="youtube"
          />
        );
      case 'giphy':
        return (
          <MetaSearch
            preSelected={selGIFs}
            onChange={newGIFs =>
              onChange([
                ...newGIFs,
                ...selArticles,
                ...selVideos,
                ...selPhotos,
                ...selURLs,
                ...selUserContent
              ])
            }
            searchFn={searchGiphy}
            type={GIF}
            key="giphy"
          />
        );
      case 'flickr':
        return (
          <MetaSearch
            preSelected={selPhotos}
            onChange={newPhotos =>
              onChange([
                ...newPhotos,
                ...selArticles,
                ...selVideos,
                ...selGIFs,
                ...selURLs,
                ...selUserContent
              ])
            }
            searchFn={searchFlickr}
            type={IMAGE}
            key="flickr"
          />
        );
      case 'url':
        return (
          <UrlMedia
            preSelected={selURLs}
            onChange={newUrls =>
              onChange([
                ...newUrls,
                ...selArticles,
                ...selVideos,
                ...selGIFs,
                ...selPhotos,
                ...selUserContent
              ])
            }
            type={URL}
            key={URL}
          />
        );
      case 'upload':
        return (
          <UploadUserContent
            media={selUserContent}
            uploadPath={userContentUploadPath}
            onChange={newUserContent => {
              onChange([
                ...selVideos,
                ...selArticles,
                ...selGIFs,
                ...selPhotos,
                ...selURLs,
                ...newUserContent
              ]);
            }}
            preSelected={selVideos}
            searchFn={searchYoutube}
            key="youtube"
          />
        );
      default:
        return <div>Error selection</div>;
    }
  };

  render() {
    const { selectedMedia, stylesheet, onChange } = this.props;
    const { selected } = this.state;

    const btnClass = sel =>
      sel === selected ? css(stylesheet.btnActive) : css(stylesheet.btn);

    const updState = sel => () => this.setState({ selected: sel });

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          className="mb-3 nav"
          style={{ display: 'flex', justifyContent: 'space-between' }}
          role="tablist"
        >
          <button
            className={btnClass('wikipedia')}
            type="button"
            onClick={updState('wikipedia')}
            id="wikipedia"
          >
            <i
              className="fa fa-wikipedia-w fa-1x"
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </button>
          <button
            className={btnClass('youtube')}
            type="button"
            onClick={updState('youtube')}
            id="youtube"
          >
            <i
              className="fa fa-youtube fa-1x"
              style={{ fontSize: '19px' }}
              aria-hidden="true"
            />
          </button>
          <button
            className={btnClass('giphy')}
            type="button"
            onClick={updState('giphy')}
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
            className={btnClass('url')}
            type="button"
            onClick={updState('url')}
            id="giphy"
          >
            <small
              style={{
                paddingLeft: '13px',
                paddingRight: '13px',
                fontWeight: 'bold'
              }}
            >
              URL
            </small>
          </button>
          <button
            className={btnClass('upload')}
            type="button"
            onClick={updState('upload')}
            id="giphy"
          >
            <small
              style={{
                paddingLeft: '13px',
                paddingRight: '13px',
                fontWeight: 'bold'
              }}
            >
              Upload
            </small>
          </button>
          <button
            type="button"
            className={btnClass('overview')}
            onClick={updState('overview')}
            id="overview"
          >
            <span style={{ fontWeight: 'bold', fontSize: 'large' }}>
              Overview
            </span>
            {
              // <i
              // className="fa fa-link fa-1x col-1"
              // style={{ fontSize: '19px' }}
              // aria-hidden="true"
              // />
            }
          </button>
        </div>
        <div className="tab-content">
          {/* TODO: check fade */}
          <div style={{ width: '100%', height: '100%' }} role="tabpanel">
            {this.activeTab(selected)}
          </div>
        </div>
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
        placeholder="Search..."
        onChange={onSearch}
      />
    </form>
  );
}

function MediaBtn({ selected, onClick }) {
  return (
    <CardThemeConsumer>
      {({ darkerUiColor, shallowBg }) => (
        <div
          className={css(shallowBg)}
          style={{
            color: selected ? 'tomato' : darkerUiColor
          }}
          onClick={onClick}
        >
          <span>
            {selected ? (
              <Icon.Trash2 fill="whitesmoke" size={40} />
            ) : (
              <Icon.PlusSquare fill="whitesmoke" size={40} />
            )}
          </span>
        </div>
      )}
    </CardThemeConsumer>
  );
}

class MetaSearch extends Component {
  static propTypes = {
    searchFn: PropTypes.func,
    type: PropTypes.string,
    onAdd: PropTypes.func,
    preSelected: PropTypes.array,
    defaultQuery: PropTypes.string
  };

  static defaultProps = {
    searchFn: null,
    defaultQuery: 'news',
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
    data: [], // this.props.search === null ? this.props.defaultData : []
    selectedIds: this.props.preSelected.map(d => d.id)
  };

  componentDidMount() {
    const { searchFn, defaultQuery } = this.props;
    searchFn(defaultQuery).then(
      data => this.mounted && this.setState({ data })
    );
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { searchFn, defaultQuery } = this.props;
  //   searchFn(defaultQuery).then(
  //     data => this.mounted && this.setState({ data })
  //   );
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }
  // componentWillReceiveProps(nextProps) {
  //   nextProps.search().then(results => {
  //     this.setState({ results });
  //   });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { type, searchFn, onChange } = this.props;
    const { data, selectedIds } = this.state;

    // console.log('data', data, 'selectedIds', selectedIds);
    if (selectedIds.length !== prevState.selectedIds.length) {
      const newData = data.filter(d => selectedIds.includes(d.id));
      // console.log('newData', newData);
      onChange(newData);
    }

    // search().then(newData => {
    //   this.setState({ data: newData });
    // });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSearch = searchStr => {
    const { searchFn } = this.props;
    searchFn(searchStr).then(items => {
      this.setState({ data: items });
    });
    // else {
    //   this.setState({
    //     // TODO real search query
    //     results: defaultData.filter(d => d.title === searchStr)
    //   });
    // }
  };

  addItem = id => {
    this.setState(oldState => ({
      selectedIds: [...oldState.selectedIds, id]
    }));
  };

  removeItem = id => {
    this.setState(oldState => ({
      selectedIds: oldState.selectedIds.filter(d => d !== id)
    }));
  };

  render() {
    const { onSelect, search, type, onAdd, defaultQuery } = this.props;
    const { data, selectedIds } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '100%' }}>
          <div className="mb-3 w-100">
            <input
              type="text"
              placeholder="Search..."
              onChange={evt => this.onSearch(evt.target.value)}
            />
          </div>
        </div>
        <ScrollList
          data={data}
          itemStyle={{ paddingRight: '10%', paddingLeft: '5%' }}
        >
          {(d, isSelected) => (
            <CellWrapper
              className="mb-3"
              selected={isSelected}
              style={{
                height: '40vh',
                maxHeight: 300,
                paddingLeft: '5%',
                paddingRight: '10%'
              }}
              {...d}
            >
              <MediaBtn
                selected={selectedIds.includes(d.id)}
                onClick={e => {
                  e.stopPropagation();
                  // if (isSelected) {
                  selectedIds.includes(d.id)
                    ? this.removeItem(d.id)
                    : this.addItem(d.id);
                  // }
                }}
              />
            </CellWrapper>
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
//
//
export class MediaPreview extends Component {
  static propTypes = {};
  static defaultProps = {
    data: [],
    edit: false
  };

  render() {
    const { data } = this.props;

    return (
      <div style={{ width: '100%', height: '60vh' }}>
        {data.length === 0 && <h3>{'No media added to this Card!'} </h3>}
        <ScrollList data={data}>
          {(d, selected) => (
            <CellWrapper {...d} selected={selected === d.url} />
          )}
        </ScrollList>
      </div>
    );
  }
}

class MediaOverview extends Component {
  static propTypes = {};
  static defaultProps = {
    data: [],
    edit: false
  };

  state = { data: this.props.data };

  componentDidMount() {
    // $.ajax(options)
    //   .then(resolve)
    //   .fail(reject),
    // ddg.instantAnswer('megaman', {}, (err, response) => {
    //   console.log(response);
    // });
  }

  componentDidUpdate(_, { data: oldData }) {
    const { data } = this.state;
    const { onChange } = this.props;
    if (oldData.length !== data.length) {
      onChange(data);
    }

    // this.scrollTo(this.state.selected);
  }

  removeItem = m => {
    if (m.type === USER_CONTENT) {
      db.removeFromStorage(userContentUploadPath(m.id)).then(() =>
        console.log('removedMediaItem Success', m.id)
      );
    }
    this.setState(oldState => ({
      data: oldState.data.filter(d => d.id !== m.id)
    }));
  };

  render() {
    const { data } = this.state;
    const { edit } = this.props;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height

    return (
      <div style={{ width: '100%', height: '60vh' }}>
        {data.length === 0 && <h3>{'No media added to this Card!'} </h3>}
        <ScrollList data={data}>
          {(d, selected) => (
            <CellWrapper {...d} selected={selected === d.url}>
              {edit && <MediaBtn selected onClick={() => this.removeItem(d)} />}
            </CellWrapper>
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

const MediaSearch = ({ ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <UnstyledMediaSearch {...props} stylesheet={stylesheet} />
    )}
  </CardThemeConsumer>
);

export { MediaSearch, MediaOverview, ChallengeSearch };
