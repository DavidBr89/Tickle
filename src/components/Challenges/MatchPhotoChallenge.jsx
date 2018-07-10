import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PhotoUpload from 'Utils/PhotoUpload';
import { ModalBody } from 'Utils/Modal';

const FooterBtn = ({ onClick, children, disabled, className, style = {} }) => (
  <button
    className={`${'btn '}${className}`}
    style={{ ...style, fontWeight: 'bold' }}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

class MatchPhotoChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    description: 'Upload a photo to win the challenge',
    onChange: d => d,
    data: {},
    styles: {}
  };

  state = { imgUrl: null,  ...this.props.data };

  render() {
    const { className, description, onChange, styles } = this.props;
    const { imgUrl, response } = this.state;
    return (
      <ModalBody
        footer={
          <FooterBtn onClick={() => onChange({ ...this.state })}>
            Submit Challenge
          </FooterBtn>
        }
      >
        <div
          className={className}
          style={{ width: '100%', height: '100%', ...styles }}
        >
          <h4>Response</h4>
          <textarea
            className="mb-3"
            style={{ width: '100%' }}
            placeholder="write your response"
            value={response}
            onChange={e => this.setState({ response: e.target.value })}
          />
          <PhotoUpload
            style={{ width: '100%' }}
            imgUrl={imgUrl}
            onChange={({ url, file }) => this.setState({ imgUrl: url, file })}
          />
        </div>
      </ModalBody>
    );
  }
}

export default MatchPhotoChallenge;
