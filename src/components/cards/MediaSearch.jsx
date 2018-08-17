import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchJsonp from 'fetch-jsonp';

import { Trash2, PlusSquare, Youtube, AlignLeft } from 'react-feather';
import { css } from 'aphrodite/no-important';

import { uniqBy } from 'lodash';

// import MyGrid from 'mygrid/dist';
import giphyReq from 'giphy-api';
import ScrollList from 'Components/utils/ScrollList';
// import fetchJsonp from 'fetch-jsonp';

// import { DDG } from 'node-ddg-api';
import { db } from 'Firebase';
import { mediaScale } from 'Constants/mediaTypes';

import MediaUpload from 'Utils/MediaUpload';
import DimWrapper from 'Utils/DimensionsWrapper';

// import { createShadowStyle } from './styles';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
import { NewTabLink } from 'Components/utils/StyledComps';

import { GIF, TEXT, VIDEO, IMG, URL } from 'Constants/mediaTypes';

const WIKIPEDIA = 'wikipedia';
const GIPHY = 'giphy';
const YOUTUBE = 'youtube';
const FLICKR = 'flickr';
const USER_CONTENT = 'user-content';

const OVERVIEW = 'Overview';

const navIcons = [
  {
    key: WIKIPEDIA,
    node: <AlignLeft size={30} />
  },
  {
    key: YOUTUBE,
    node: <Youtube size={30} />
  },
  {
    key: GIPHY,
    node: (
      <small
        style={{
          paddingLeft: '13px',
          paddingRight: '13px',
          fontWeight: 'bold'
        }}
      >
        GIF
      </small>
    )
  },

  {
    key: USER_CONTENT,
    node: (
      <div
        style={{
          fontweight: 'bold'
        }}
      >
        upload
      </div>
    )
  },
  {
    key: OVERVIEW,
    node: (
      <span style={{ fontWeight: 'bold', fontSize: 'large' }}>Overview</span>
    )
  }
];

const userContentUploadPath = id => `media/${id}`;

const UploadUserContent = ({ onChange, ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <div style={{ height: '100%' }}>
        <MediaUpload
          style={{ width: '100%', height: '60%' }}
          {...props}
          stylesheet={stylesheet}
          nodeWrapper={({ url, name, loading }) => (
            <div style={{ fontSize: 'large' }}>
              {!loading ? name : 'loading'}
            </div>
          )}
          onChange={media => {
            onChange(
              media.map(m => ({
                ...m,
                title: m.name,
                thumbnail: m.url,
                source: USER_CONTENT,
                date: new Date()
              }))
            );
          }}
        />
      </div>
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

const giphy = giphyReq({ https: true });

const fullDim = { width: '100%', height: '100%' };

const truncateStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%'
};

const flickrUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
  process.env.FlickrAccessToken
}`;

const youtubeUrl = ({ part, q, type, maxResults, order }) =>
  `https://www.googleapis.com/youtube/v3/search?part=${part}&q=${q}&type=${type}&maxResult=${maxResults}&order=${order}&key=${
    process.env.youtube
  }`;

// const searchFlickr = (q = 'dragon') =>
// new Promise(resolve => {
//
// ajax({
//   url: flickrUrl,
//   dataType: 'jsonp',
//   jsonp: 'jsoncallback',
//   #<{(| tags: 'kitten',  |)}>#
//   data: {
//     text: q,
//     format: 'json',
//     extras: 'url_m,tags,machine_tags',
//     page: 1,
//     per_page: 25
//   }
// }).then(({ photos: { photo: rawResult } }) => {
//   // console.log('rawResult', rawResult);
//
//   const results = rawResult.map(
//     ({ title, farm, server, id, url_m: imgSrc, secret, tags }) => {
//       const url = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
//       return {
//         title,
//         descr: tags,
//         thumbnail: imgSrc,
//         url,
//         id,
//         source: IMG
//       };
//     }
//   );
//   //
//   return new Promise(resolve => resolve(results));
// });

// TODO: add to params
const wikiUrl = q =>
  `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${q}&gpslimit=20&prop=info|pageimages|pageterms|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exlimit=max&exintro&inprop=url&explaintext`;

const searchWikipedia = q =>
  fetchJsonp(wikiUrl(q), {})
    .then(res => res.json())
    .then(({ query: { pages } }) => {
      const values = Object.values(pages);
      const results = values.map(d => ({
        title: d.title,
        descr: d.extract,
        thumbnail: d.thumbnail ? d.thumbnail.source : null, // d.thumbnail.source,
        url: d.fullurl,
        id: d.fullurl,
        source: WIKIPEDIA,
        type: TEXT
      }));

      return new Promise(resolve => resolve(results));
    });

const searchYoutube = (q = '') =>
  new Promise(resolve =>
    fetch(
      youtubeUrl({
        part: 'snippet',
        q,
        type: 'video',
        maxResults: 20,
        order: 'viewCount'
        // publishedAfter: '2015-01-01T00:00:00Z'
      })
    )
      .then(res => res.json())
      .then(({ items }) => {
        const res = items.map(d => ({
          url: `http://www.youtube.com/embed/${d.id.videoId}`,
          id: d.id.videoId,
          title: d.snippet.title,
          descr: d.snippet.description,
          thumbnail: d.snippet.thumbnails.default.url,
          source: YOUTUBE,
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
          source: GIPHY,
          type: IMG
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
      <NewTabLink href={url}>{title}</NewTabLink>
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
  source,
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
          // backgroundImage: thumbnail !== null && `url('${thumbnail}')`,
          // backgroundRepeat: thumbnail !== null && 'no-repeat',
          // backgroundSize: thumbnail !== null && '100% 100%',
          ...fullDim,
          // height: 200
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4 style={{ ...truncateStyle, width: '100%' }}>
            <NewTabLink
              href={url}
              style={{
                display: 'inline-flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div className="mr-1" style={{ ...truncateStyle, width: '100%' }}>
                {title}
              </div>
            </NewTabLink>
          </h4>
          <div>{/* React.createElement(mediaScale(type)) */}</div>
        </div>
        {thumbnail ? (
          <div
            onClick={onClick}
            style={{
              overflow: 'hidden',
              backgroundImage: thumbnail !== null && `url('${thumbnail}')`,
              backgroundRepeat: thumbnail !== null && 'no-repeat',
              backgroundSize: thumbnail !== null && '100% 100%',
              ...fullDim
              // height: 200
              // width: '80%'
            }}
          />
        ) : (
          <p>{descr}</p>
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
const CellWrapper = ({ btn, className, focusColor, style, ...props }) => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <div
        className={`p-3 mb-3 ${css(stylesheet.extraShallowBg)} ${
          props.selected ? css(stylesheet.bigBoxShadow) : css(stylesheet.border)
        }`}
        style={{
          height: '100%',
          width: '100%',
          ...style,
          cursor: 'pointer',
          position: 'relative',
          display: 'flex'
        }}
      >
        <CellDetail {...props} />
        <div className="ml-3">{btn}</div>
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
    const urlItem = {
      id: url,
      url,
      title,
      descr,
      source: URL,
      type: TEXT,
      date: new Date()
    };

    // TODO: check later
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
                  maxHeight="90%"
                  style={{ paddingLeft: '5%', paddingRight: '10%' }}
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

  // componentDidMount() {
  //   gapi.load('client', () => {
  //     const discoveryUrl =
  //       'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
  //
  //     // Initialize the gapi.client object, which app uses to make API requests.
  //     // Get API key and client ID from API Console.
  //     // 'scope' field specifies space-delimited list of access scopes.
  //     gapi.client.init({
  //       // TODO: put in config
  //       apiKey: 'AIzaSyBgA3WQwm6X8arx4X5sLSXuoM9_TSucgdI',
  //       discoveryDocs: [discoveryUrl]
  //       // clientId:
  //       //   '655124348640-ip7r33kh1vt5lbc2h5rij96mku6unreu.apps.googleusercontent.com',
  //       // scope: SCOPE
  //     });
  //   });
  // }

  activeTab = sel => {
    const { selectedMedia, onChange } = this.props;
    const selArticles = selectedMedia.filter(m => m.source === WIKIPEDIA);
    const selVideos = selectedMedia.filter(m => m.source === YOUTUBE);
    const selGIFs = selectedMedia.filter(m => m.source === GIPHY);
    // const selPhotos = selectedMedia.filter(m => m.source === FLICKR);
    const selURLs = selectedMedia.filter(m => m.source === URL);
    const selUserContent = selectedMedia.filter(m => m.source === USER_CONTENT);

    const sortByDate = arr =>
      arr.sort((a, b) => new Date(b.date) - new Date(a.date));

    switch (sel) {
      case OVERVIEW:
        return <MediaOverview data={selectedMedia} edit onChange={onChange} />;
      case WIKIPEDIA:
        return (
          <MetaSearch
            style={{ height: '85%' }}
            onChange={newArticles =>
              onChange(
                sortByDate([
                  ...newArticles,
                  ...selVideos,
                  ...selGIFs,
                  // ...selPhotos,
                  ...selURLs,
                  ...selUserContent
                ])
              )
            }
            preSelected={selArticles}
            searchFn={searchWikipedia}
            source={WIKIPEDIA}
            type={TEXT}
            key="wikipedia"
          />
        );
      case YOUTUBE:
        return (
          <MetaSearch
            style={{ height: '85%' }}
            onChange={newVideos =>
              onChange(
                sortByDate([
                  ...newVideos,
                  ...selArticles,
                  ...selGIFs,
                  // ...selPhotos,
                  ...selURLs,
                  ...selUserContent
                ])
              )
            }
            preSelected={selVideos}
            searchFn={searchYoutube}
            source={YOUTUBE}
            type={VIDEO}
            key="youtube"
          />
        );
      case GIPHY:
        return (
          <MetaSearch
            style={{ height: '85%' }}
            preSelected={selGIFs}
            onChange={newGIFs =>
              onChange(
                sortByDate([
                  ...newGIFs,
                  ...selArticles,
                  ...selVideos,
                  // ...selPhotos,
                  ...selURLs,
                  ...selUserContent
                ])
              )
            }
            searchFn={searchGiphy}
            source={GIPHY}
            type={VIDEO}
            key="giphy"
          />
        );
      // case FLICKR:
      //   return (
      //     <MetaSearch
      //       style={{ height: '85%' }}
      //       preSelected={selPhotos}
      //       onChange={newPhotos =>
      //         onChange(
      //           sortByDate([
      //             ...newPhotos,
      //             ...selArticles,
      //             ...selVideos,
      //             ...selGIFs,
      //             ...selURLs,
      //             ...selUserContent
      //           ])
      //         )
      //       }
      //       searchFn={searchFlickr}
      //       source={FLICKR}
      //       type={IMG}
      //       key="flickr"
      //     />
      //   );
      case URL:
        return (
          <UrlMedia
            style={{ height: '85%' }}
            preSelected={selURLs}
            onChange={newUrls =>
              onChange(
                sortByDate([
                  ...newUrls,
                  ...selArticles,
                  ...selVideos,
                  ...selGIFs,
                  // ...selPhotos,
                  ...selUserContent
                ])
              )
            }
            source={URL}
            type={TEXT}
            key={URL}
          />
        );
      case USER_CONTENT:
        return (
          <UploadUserContent
            style={{ height: '65%' }}
            media={selUserContent}
            uploadPath={userContentUploadPath}
            onChange={newUserContent => {
              onChange(
                sortByDate([
                  ...selVideos,
                  ...selArticles,
                  ...selGIFs,
                  // ...selPhotos,
                  ...selURLs,
                  ...newUserContent
                ])
              );
            }}
            preSelected={selVideos}
            source={USER_CONTENT}
            searchFn={searchYoutube}
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

    const navBtn = ({ key, node }) => (
      <button
        className={`${btnClass(key)} m-1`}
        type="button"
        onClick={() => this.setState({ selected: key })}
        id={key}
      >
        {node}
      </button>
    );

    return (
      <div>
        <div className="mb-3" role="tablist">
          <div style={{ display: 'flex' }}>{navIcons.map(navBtn)}</div>
        </div>
        <div className="tab-content" style={{ height: '100%' }}>
          {this.activeTab(selected)}
        </div>
      </div>
    );
  }
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
              <Trash2 fill="whitesmoke" size={40} />
            ) : (
              <PlusSquare fill="whitesmoke" size={40} />
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
    defaultQuery: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    searchFn: null,
    defaultQuery: 'Belgium',
    type: null,
    onAdd: d => d,
    selected: null,
    preSelected: [],
    style: {}
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

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { data, selectedIds } = this.state;

    if (selectedIds.length !== prevState.selectedIds.length) {
      const newData = data
        .filter(d => selectedIds.includes(d.id))
        .map(d => ({ ...d, date: new Date() }));
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
    const { searchFn, source, type } = this.props;
    searchFn(searchStr).then(items => {
      this.setState({ data: items.map(d => ({ ...d, source, type })) });
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
    const { data, selectedIds } = this.state;
    const { defaultQuery, style } = this.props;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    // TODO: fix view height
    return (
      <div style={{ width: '100%', height: '100%', ...style }} role="tabpanel">
        <div style={{ width: '100%' }}>
          <div className="mb-3 w-100">
            <input
              type="text"
              className="form-control"
              placeholder={`Search...for instance ${defaultQuery}`}
              onChange={evt => this.onSearch(evt.target.value)}
            />
          </div>
        </div>
        <ScrollList
          data={data}
          maxHeight="90%"
          itemStyle={{ paddingRight: '10%', paddingLeft: '5%' }}
        >
          {(d, isSelected) => (
            <CellWrapper
              className="mb-3"
              selected={isSelected}
              style={{
                height: '40vh',
                maxHeight: 300,
                marginLeft: '5%',
                paddingRight: '10%'
              }}
              {...d}
              btn={
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
              }
            />
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
      <div style={{ width: '100%' }}>
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

  componentDidUpdate(_, { data: oldData }) {
    const { data } = this.state;
    const { onChange } = this.props;
    if (oldData.length !== data.length) {
      onChange(data);
    }
  }

  removeItem = m => {
    if (m.source === USER_CONTENT) {
      db.removeFromStorage(userContentUploadPath(m.id)).then(() =>
        // TODO: action
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

    // TODO: fix view height

    return (
      <div style={{}}>
        {data.length === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 className="text-muted">{'No media added to this Card!'} </h3>
            </div>
          </div>
        )}
        <ScrollList
          data={data}
          maxHeight="100%"
          itemStyle={{ paddingRight: '10%', paddingLeft: '5%' }}
        >
          {(d, selected) => (
            <CellWrapper
              {...d}
              selected={selected === d.url}
              btn={
                edit && <MediaBtn selected onClick={() => this.removeItem(d)} />
              }
              style={{ height: '30vh', minHeight: 200 }}
            />
          )}
        </ScrollList>
      </div>
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

export { MediaSearch, MediaOverview };
