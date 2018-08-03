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
      onUpdate,
      onClose,
      styles,
      stylesheet,
      title,
      onSubmit,
      challengeSubmission
    } = this.props;
    const { media, response, completed } = this.state;

    // const isUploading = media.filter(m => m.url === null).length > 0;
    return (
      <ModalBody
        onClose={() => {
          onClose();
          if (challengeSubmission && response !== challengeSubmission.response)
            onUpdate({ response, completed });
        }}
        title={title}
        footer={
          <Btn
            disabled={completed}
            onClick={() => {
              onSubmit({ media, response, completed: true });
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <div className="mr-1">
                {completed ? 'Challenge submitted' : 'Submit Challenge'}
              </div>
              {completed && (
                <div>
                  <Icon.Lock />
                </div>
              )}
            </div>
          </Btn>
        }
      >
        <div
          className={className}
          style={{ width: '100%', height: '70%', ...styles }}
        >
          <h4>Task</h4>
          <p style={{ width: '100%' }}>{description}</p>
          <h4>Response</h4>
          <textarea
            style={{ width: '100%' }}
            rows="3"
            placeholder="write your response"
            value={response}
            onChange={e => {
              this.setState({
                response: e.target.value,
                completed: false
              });
            }}
          />
          <MediaUpload
            style={{ width: '100%', height: '60%' }}
            uploadPath={id => `challengeSubmissionFiles/${id}`}
            media={media}
            stylesheet={stylesheet}
            onChange={newMedia => {
              this.setState({ media: newMedia, completed: false });
              onUpdate({ media: newMedia, completed: false });
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
