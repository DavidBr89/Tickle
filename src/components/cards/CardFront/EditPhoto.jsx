import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PhotoUpload from 'Utils/PhotoUpload';
import TabNav from 'Utils/TabNav';
import { css } from 'aphrodite';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

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
      uiColor = 'grey',
      // stylesheet,
      onChange,
      style = {},
      className = ''
    } = this.props;

    const { imgUrl } = this.state;

    return (
      <CardThemeConsumer>
        {({ stylesheet }) => (
          <div
            className={className}
            style={{ width: '100%', height: '100%', ...style }}
          >
            <div
              style={{
                overflow: 'hidden',
                height: '100%'
              }}
            >
              <div
                style={{
                  // TODO: outsource
                  height: '100%',
                  width: '100%',
                  // minHeight: 80,
                  border: `dashed 3px ${uiColor}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {imgUrl ? (
                  <div
                    style={{
                      overflow: 'hidden',
                      width: '100%',
                      height: 300
                      // height: this.contHeight
                    }}
                  >
                    <img src={imgUrl} width="100%" alt={imgUrl} />
                  </div>
                ) : (
                  <h1
                    className="pl-2 pr-2"
                    style={{
                      background: uiColor,
                      color: 'black',
                      margin: '20%'
                    }}
                  >
                    {'No Image'}
                  </h1>
                )}
              </div>
              <div className="mt-3 mb-2" style={{ display: 'flex' }}>
                <div className="pr-1" style={{ width: '70%' }}>
                  <input
                    className="mr-1"
                    value={imgUrl}
                    placeholder="Add Image Url"
                    style={{
                      border: `${uiColor} 1px solid`,
                      width: '100%',
                      height: '100%'
                    }}
                    type="url"
                    onChange={e => this.setState({ imgUrl: e.target.value })}
                  />
                </div>
                <button
                  className={css(stylesheet.btn)}
                  style={{ width: '30%' }}
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
        )}
      </CardThemeConsumer>
    );
  }
}

class EditPhoto extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    stylesheet: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderSelected = key => {
    switch (key) {
      case 'Upload Image': {
        return <PhotoUpload {...this.props} />;
      }
      case 'Url':
        return <AddUrl {...this.props} />;
    }
  };

  render() {
    const { uiColor, stylesheet } = this.props;
    return (
      <div>
        <TabNav
          uiColor={uiColor}
          stylesheet={stylesheet}
          preSelected="Url"
          keys={['Upload Image', 'Url']}
        >
          {selected => this.renderSelected(selected)}
        </TabNav>
      </div>
    );
  }
}

export default EditPhoto;
