import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';
import { css } from 'aphrodite/no-important';

import { ModalBody } from 'Utils/Modal';
import MediaUpload from 'Utils/MediaUpload';
// import ScrollList from 'Utils/ScrollList';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
// TODO: untangle later
import { Btn } from 'Components/cards/layout';

class MediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    onChange: PropTypes.func,
    stylesheet: PropTypes.object,
    challengeSubmission: PropTypes.oneOf([PropTypes.object, null])
  };

  static defaultProps = {
    className: '',
    description: 'placeholder challenge',
    challengeSubmission: null,
    onChange: d => d,
    data: {},
    styles: {},
    stylesheet: {}
  };

  state = { media: [], response: null, ...this.props.challengeSubmission };

  render() {
    const {
      className,
      description,
      onChange,
      onClose,
      styles,
      stylesheet,
      title
    } = this.props;
    const { media, response } = this.state;

    // const isUploading = media.filter(m => m.url === null).length > 0;
    return (
      <ModalBody
        onClose={onClose}
        title={title}
        footer={
          <Btn
            onClick={() => {
              onChange({ media, response });
            }}
          >
            Submit Challenge
          </Btn>
        }
      >
        <div
          className={className}
          style={{ width: '100%', height: '100%', ...styles }}
        >
          <h4>Task</h4>
          <p style={{ width: '100%' }}>{description}</p>
          <h4>Response</h4>
          <textarea
            style={{ width: '100%' }}
            rows="3"
            placeholder="write your response"
            value={response}
            onChange={e => this.setState({ response: e.target.value })}
          />
          <MediaUpload
            style={{ width: '100%' }}
            uploadPath={id => `challengeSubmissionFiles/${id}`}
            media={media}
            stylesheet={stylesheet}
            onChange={newMedia => {
              this.setState({ media: newMedia });
            }}
          />
        </div>
      </ModalBody>
    );
  }
}

const StyledMediaChallenge = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <MediaChallenge {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

export default StyledMediaChallenge;
