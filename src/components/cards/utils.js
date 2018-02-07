import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import gapi from './gapi';
import MyGrid from 'mygrid/dist';

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

const ModalBody = ({ children, onSubmit }) => (
  <div>
    <div className="modal-body">{children}</div>
    <div className="modal-footer">
      <button type="button" className="btn btn-primary" onClick={onSubmit}>
        Save changes
      </button>
    </div>
  </div>
);

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func
};

ModalBody.defaultProps = {
  onSubmit: () => null
};

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
            <i className={`fa fa-link fa-2x col-1`} aria-hidden="true" />
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
            <i className={`fa fa-camera fa-2x col-1`} aria-hidden="true" />
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
              className={`fa fa-video-camera fa-2x col-1`}
              aria-hidden="true"
            />
          </a>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        />
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <YoutubeSearch />
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
        publishedAfter: '2015-01-01T00:00:00Z'
      })
      .execute(res => resolve(res))
  );

class YoutubeSearch extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = { results: [], selected: null };
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

  render() {
    const { results, selected } = this.state;
    // let GoogleAuth;
    // const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    // }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className="mb-3" style={{ display: 'flex' }}>
          <form>
            <input type="text" placeholder={'Search...'} />
            <button className="ml-3 ">
              <i className="fa fa-search" />
            </button>
          </form>
        </div>
        <div style={{ width: '100%', height: '200px', overflowY: 'scroll' }}>
          <div style={{ width: '100%', height: '400%' }}>
            <MyGrid cols={2} rows={results.length / 2} gap={1}>
              {results.map(d => (
                <div
                  style={{ border: 'black solid 1px' }}
                  onClick={() =>
                    this.setState(({ selected: oldSelected }) => ({
                      selected: !oldSelected ? d.id.videoId : null
                    }))
                  }
                  selected={selected === d.id.videoId }
                  colSpan={selected === d.id.videoId ? 2 : 1}
                  rowSpan={selected === d.id.videoId ? 2 : 1}
                >
                  <img
                    src={d.snippet.thumbnails.default.url}
                    alt="pix"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ))}
            </MyGrid>
          </div>
        </div>
      </div>
    );
  }
}

export { SmallModal, ModalBody, MediaSearch };
