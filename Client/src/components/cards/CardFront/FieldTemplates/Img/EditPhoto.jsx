import React, {useState, Component} from 'react';
import PropTypes from 'prop-types';

import PhotoUpload from 'Utils/PhotoUpload';
import TabNav from 'Utils/TabNav';

const AddUrl = props => {
  const {onChange, style = {}, className = ''} = props;

  const [imgUrl, setImgUrl] = useState(props.imgUrl);

  return (
    <div
      className={`${className} flex flex-col flex-grow`}
      style={{...style}}>
      <div className="flex-grow flex flex-col justify-center items-center">
        {imgUrl ? (
          <img
            src={imgUrl}
            width="100%"
            style={{objectFit: 'cover'}}
            alt={imgUrl}
          />
        ) : (
          <div className="pl-2 pr-2 flex flex-col flex-grow border-dashed border-2 border-black w-full items-center justify-center">
            <div className="text-2xl font-bold">No Image</div>
          </div>
        )}
        <div className="mt-3 mb-2 flex items-center w-full">
          <input
            className="form-control flex-grow mr-1 "
            value={imgUrl}
            placeholder="Add Image Url"
            type="url"
            onChange={e => setImgUrl(e.target.value)}
          />
          <button
            type="button"
            className="flex-no-shrink btn"
            onClick={() => {
              onChange({
                url: imgUrl,
                thumbnail: imgUrl
              });
            }}>
            Add Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default class EditPhoto extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    stylesheet: PropTypes.object
  };

  renderSelected = key => {
    switch (key) {
      case 'Upload Image': {
        return (
          <PhotoUpload
            className="flex-grow flex flex-col "
            {...this.props}
          />
        );
      }
      case 'Url':
        return <AddUrl {...this.props} />;
    }
  };

  render() {
    return (
      <TabNav
        className="flex flex-col flex-grow"
        preSelected="Url"
        keys={['Upload Image', 'Url']}>
        {selected => this.renderSelected(selected)}
      </TabNav>
    );
  }
}
