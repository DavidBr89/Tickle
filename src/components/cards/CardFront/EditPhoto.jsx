import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PhotoUpload from 'Utils/PhotoUpload';
import TabNav from 'Utils/TabNav';

class AddUrl extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    stylesheet: PropTypes.object
  };

  static defaultProps = {};

  state = { imgUrl: null, ...this.props };

  render() {
    const {
      onChange,
      style = {},
      className = ''
    } = this.props;

    const { imgUrl } = this.state;

    return (
      <div
        className={`${className} flex flex-col flex-grow`}
        style={{ ...style }}
      >
        <div
          className="flex-grow flex flex-col justify-center items-center"
        >
          {imgUrl ? (
            <img
              src={imgUrl}
              width="100%"
              style={{ objectFit: 'cover' }}
              alt={imgUrl}
            />
          ) : (
            <div
              className="pl-2 pr-2 flex flex-col flex-grow border-dashed border-2 border-black w-full items-center justify-center"
            >
              <div className="text-2xl font-bold">No Image</div>
            </div>
          )}
          <div className="mt-3 mb-2 flex items-center w-full">
            <input
              className="form-control flex-grow mr-1 "
              value={imgUrl}
              placeholder="Add Image Url"
              type="url"
              onChange={e => this.setState({ imgUrl: e.target.value })}
            />
            <button
              type="button"
              className="flex-no-shrink btn"
              onClick={() => {
                onChange({
                  url: imgUrl,
                  thumbnail: imgUrl
                });
              }}
            >
                  Add Image
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class EditPhoto extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    stylesheet: PropTypes.object
  };

  renderSelected = (key) => {
    switch (key) {
      case 'Upload Image': {
        return <PhotoUpload className="flex-grow flex flex-col " {...this.props} />;
      }
      case 'Url':
        return <AddUrl {...this.props} />;
    }
  };

  render() {
    const { uiColor, stylesheet } = this.props;
    return (
      <TabNav
        className="flex flex-col flex-grow"
        uiColor={uiColor}
        stylesheet={stylesheet}
        preSelected="Url"
        keys={['Upload Image', 'Url']}
      >
        {selected => this.renderSelected(selected)}
      </TabNav>
    );
  }
}

export default EditPhoto;
