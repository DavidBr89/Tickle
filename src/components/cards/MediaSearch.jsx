import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetchJsonp from 'fetch-jsonp';

import PlusSquare from 'react-feather/dist/icons/plus';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Youtube from 'react-feather/dist/icons/youtube';
import AlignLeft from 'react-feather/dist/icons/align-left';

import uniqBy from 'lodash/uniqBy';

// import MyGrid from 'mygrid/dist';
import giphyReq from 'giphy-api';
import ScrollList from 'Components/utils/ScrollList';
// import fetchJsonp from 'fetch-jsonp';

// import { DDG } from 'node-ddg-api';
import { db } from 'Firebase';
import { mediaScale } from 'Constants/mediaTypes';

import MediaUpload from 'Utils/MediaUpload';
// import DimWrapper from 'Utils/DimensionsWrapper';

// import { createShadowStyle } from './styles';

import { NewTabLink } from 'Components/utils/StyledComps';

import {
  GIF, TEXT, VIDEO, IMG, URL
} from 'Constants/mediaTypes';

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
        Upload
      </div>
    )
  },
  {
    key: OVERVIEW,
    node: <span style={{ fontWeight: 'bold', fontSize: 'large' }}>Overview</span>
  }
];

const userContentUploadPath = id => `media/${id}`;

const UploadUserContent = ({
  onChange, addToStorage, removeFromStorage, className, ...props
}) => (
  <MediaUpload
    className="flex flex-col flex-grow"
    onAdd={addToStorage}
    onRemove={removeFromStorage}
    onChange={(media) => {
      onChange(
        media.map(m => ({
          ...m,
          title: m.name,
          thumbnail: m.url,
          source: USER_CONTENT,
          date: new Date()
        })),
      );
    }}
  />
);

UploadUserContent.propTypes = {
  onChange: PropTypes.func.isRequired,
  addToStorage: PropTypes.func.isRequired,
  removeFromStorage: PropTypes.func.isRequired,
  className: PropTypes.string
};

UploadUserContent.defaultProps = { className: '' };

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

const youtubeUrl = ({
  part, q, type, maxResults, order
}) => `https://www.googleapis.com/youtube/v3/search?part=${part}&q=${q}&type=${type}&maxResult=${maxResults}&order=${order}&key=${
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
const wikiUrl = q => `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${q}&gpslimit=20&prop=info|pageimages|pageterms|extracts&piprop=thumbnail&pithumbsize=200&pilimit=10&exlimit=max&exintro&inprop=url&explaintext`;

const searchWikipedia = q => fetchJsonp(wikiUrl(q), {})
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

const searchYoutube = (q = '') => new Promise(resolve => fetch(
  youtubeUrl({
    part: 'snippet',
    q,
    type: 'video',
    maxResults: 20,
    order: 'viewCount'
    // publishedAfter: '2015-01-01T00:00:00Z'
  }),
)
  .then(res => res.json())
  .then(({ items }) => {
    console.log('items', items);
    const res = items.map(d => ({
      // url2: `http://www.youtube.com/embed/${d.id.videoId}`,
      url: `https://www.youtube.com/watch?v=${d.id.videoId}`,
      id: d.id.videoId,
      title: d.snippet.title,
      descr: d.snippet.description,
      thumbnail: d.snippet.thumbnails.default.url,
      source: YOUTUBE,
      type: VIDEO
    }));
    resolve(res);
  }), );

const searchGiphy = (q = 'pokemon') => new Promise(resolve => giphy.search(q, (_, { data }) => resolve(
  data.map(d => ({
    url: d.embed_url,
    id: d.embed_url,
    title: d.title,
    descr: '',
    thumbnail: d.images.downsized_still.url,
    gifurl: d.url,
    source: GIPHY,
    type: IMG
  })),
), ), );

const pinterestUrl = 'https://api.pinterest.com/v3/users/jessicamalba/?access_token=2222904fa9e29280188a94b9f940eea54fdc2344f4c666f7aa86a3187d47858d';

//
const Iframe = ({
  title, url, onClick, edit, style
}) => (
  <div
    className="relative"
    style={{ ...style }}
  >
    <div className="absolute w-full h-full">
      <iframe
        className="absolute"
        title={title}
        type="text/html"
        width="100%"
        height="100%"
        src={url}
        frameBorder="0"
        style={{ zIndex: -1 }}
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

const Article = ({
  url, title, descr, onClick
}) => (
  <div className="relative overflow-hidden w-full h-full" onClick={onClick}>
    <h2><NewTabLink href={url}>{title}</NewTabLink></h2>
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
  thumbnail, title, descr, url, onClick
}) => (
  <div className="overflow-hidden w-full" onClick={onClick}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h2 className="truncate-text mb-2">
        <NewTabLink href={url}>{title}</NewTabLink>
      </h2>
    </div>
    {thumbnail ? (
      <img
        className="overflow-hidden w-full h-full"
        onClick={onClick}
        src={thumbnail}
        style={{ objectFit: 'cover' }}
      />
    ) : (
      <p>{descr}</p>
    )}
  </div>
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
const CellWrapper = ({
  btn, className, focusColor, style, ...props
}) => (
  <div
    className="flex relative p-3 mb-3 border border-2 w-full h-full"
    style={{ ...style, cursor: 'pointer' }}
  >
    <CellDetail {...props} />
    {' '}
    <div className="ml-3">{btn}</div>
  </div>
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
    onChange: PropTypes.func
  };

  state = {
    url: null,
    descr: null,
    title: null,
    data: [...this.props.preSelected]
  };


  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;
    const { data: oldData } = prevState;
    const { data } = this.state;

    if (oldData.length !== data.length) {
      onChange(data);
    }
  }

  onSubmit = (event) => {
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

  removeItem = (id) => {
    this.setState(({ data: oldData }) => ({
      data: oldData.filter(d => d.id !== id)
    }));
  };

  render() {
    const {
      url, title, descr, data
    } = this.state;

    return (
      <div className="w-full h-full">
        <div className="mb-3">
          <form className="form-horizontal" onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(event) => {
                  this.setState({ title: event.target.value });
                }}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={descr}
                onChange={event => this.setState({ descr: event.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                placeholder="Url"
                className="form-control"
                value={url}
                onChange={event => this.setState({ url: event.target.value })}
              />
            </div>
            <button type="submit" className="btn">
              Add Link
            </button>
          </form>
        </div>
        {data.length > 0 ? (
          <div style={{ width: '100%', height: '100%' }}>
            <ScrollList data={data} maxHeight="90%">
              {(d, isSelected) => (
                <div
                  className={`mb-3 p-3 border ${isSelected && 'shadow'}`}
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
                    <MediaBtn selected onClick={() => this.removeItem(d.id)} />
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
    );
  }
}

class MediaSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func, selectedMedia: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = { onChange: () => null, selectedMedia: [] };

  state = { selected: WIKIPEDIA };

  activeTab = (sel) => {
    const {
      selectedMedia, addToStorage, removeFromStorage, onChange
    } = this.props;

    const changeMedia = src => (newMedia) => {
      const sortByDate = arr => arr.sort((a, b) => new Date(b.date) - new Date(a.date));
      const splitMedia = selectedMedia.filter(m => m.source !== src);
      return onChange(sortByDate([...splitMedia, ...newMedia]));
    };

    const selArticles = selectedMedia.filter(m => m.source === WIKIPEDIA);
    const selVideos = selectedMedia.filter(m => m.source === YOUTUBE);
    const selGIFs = selectedMedia.filter(m => m.source === GIPHY);
    const selURLs = selectedMedia.filter(m => m.source === URL);
    const selUserContent = selectedMedia.filter(m => m.source === USER_CONTENT);
    // const selPhotos = selectedMedia.filter(m => m.source === FLICKR);


    switch (sel) {
      case OVERVIEW:
        return (
          <MediaOverview
            removeFromStorage={removeFromStorage}
            className="flex-grow flex flex-col"
            data={selectedMedia}
            edit
            onChange={onChange}
          />
        );
      case WIKIPEDIA:
        return (
          <MetaSearch
            className="flex-grow flex flex-col"
            onChange={changeMedia(WIKIPEDIA)}
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
            className="flex-grow flex flex-col"
            onChange={changeMedia(YOUTUBE)}
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
            className="flex-grow flex flex-col"
            preSelected={selGIFs}
            onChange={changeMedia(GIPHY)}
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
            className="flex-grow flex flex-col"
            preSelected={selURLs}
            onChange={changeMedia(URL)}
            source={URL}
            type={TEXT}
            key={URL}
          />
        );
      case USER_CONTENT:
        return (
          <UploadUserContent
            addToStorage={addToStorage}
            removeFromStorage={removeFromStorage}
            className="flex flex-col flex-grow"
            media={selUserContent}
            onChange={changeMedia(USER_CONTENT)}
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
    const { selected } = this.state;

    const btnClass = sel => (sel === selected ? 'btn btn-black' : 'btn');

    const navBtn = ({ key, node }) => (
      <button
        className={`${btnClass(key)} flex-grow m-1`}
        type="button"
        onClick={() => this.setState({ selected: key })}
        id={key}
      >
        {node}
      </button>
    );

    return (
      <div className="flex-grow flex flex-col">
        <div className="mb-3 flex-no-shrink flex" role="tablist">
          {navIcons.map(navBtn)}
        </div>
        {this.activeTab(selected)}
      </div>
    );
  }
}

function MediaBtn({ selected, onClick }) {
  return (
    <div
      className="bg-light-grey"
      style={{
        color: selected ? 'tomato' : 'black'
      }}
      onClick={onClick}
    >
      <span>
        {selected ? (
          <Trash2 fill="whitesmoke" size={40} />
        ) : (
          <PlusSquare className="border-4 border-black" fill="whitesmoke" size={40} />
        )}
      </span>
    </div>
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
    searchFn(defaultQuery).then(data => this.mounted && this.setState({ data }));
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

  // componentWillUnmount() {
  //   this.mounted = false;
  // }

  onSearch = (searchStr) => {
    const { searchFn, source, type } = this.props;
    searchFn(searchStr).then((items) => {
      this.setState({ data: items.map(d => ({ ...d, source, type })) });
    });
    // else {
    //   this.setState({
    //     // TODO real search query
    //     results: defaultData.filter(d => d.title === searchStr)
    //   });
    // }
  };

  addItem = (id) => {
    this.setState(oldState => ({
      selectedIds: [...oldState.selectedIds, id]
    }));
  };

  removeItem = (id) => {
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
      <div className="flex flex-col" role="tabpanel">
        <div style={{ width: '100%' }}>
          <input
            type="text"
            className="form-control mb-3 w-full"
            placeholder={`Search...for instance ${defaultQuery}`}
            onChange={evt => this.onSearch(evt.target.value)}
          />
        </div>
        <ScrollList data={data} maxHeight="100%" className="flex flex-col p-1">
          {(d, isSelected) => (
            <CellWrapper
              className="mb-3"
              selected={isSelected}
              style={{
                height: '40vh',
                maxHeight: 300
                // marginLeft: '5%',
                // paddingRight: '10%'
              }}
              {...d}
              btn={
                <MediaBtn
                  selected={selectedIds.includes(d.id)}
                  onClick={(e) => {
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
class MediaPreview extends Component {
  static propTypes = {};

  static defaultProps = {
    data: [],
    edit: false
  };

  render() {
    const { data } = this.props;

    return (
      <div style={{ width: '100%' }}>
        {data.length === 0 && <h3>
          {'No media added to this Card!'}
          {' '}
        </h3>}
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

  state = { ...this.props };

  componentDidUpdate(_, { data: oldData }) {
    const { data } = this.state;
    const { onChange } = this.props;
    if (oldData.length !== data.length) {
      onChange(data);
    }
  }

  removeItem = (m) => {
    const { removeFromStorage } = this.props;
    if (m.source === USER_CONTENT) {
      removeFromStorage(m.id)
        .then(() => console.log('removedMediaItem Success', m.id), );
    }
    this.setState(oldState => ({
      data: oldState.data.filter(d => d.id !== m.id)
    }));
  };

  render() {
    const { data } = this.state;
    const { edit, className } = this.props;

    // TODO: fix view height

    return (
      <div
        className={className}
        style={{
          justifyContent: data.length === 0 ? 'center' : null,
          alignItems: 'center'
        }}
      >
        {data.length === 0 && (
          <h3 className="text-muted">
            {'No media added to this Card!'}
            {' '}
          </h3>
        )}
        <ScrollList data={data} maxHeight="100%">
          {(d, selected) => (
            <CellWrapper
              {...d}
              selected={selected === d.url}
              btn={
                edit && <MediaBtn selected onClick={() => this.removeItem(d)} />
              }
              style={{ height: 300 }}
            />
          )}
        </ScrollList>
      </div>
    );
  }
}

export { MediaSearch, MediaOverview, MediaPreview };
