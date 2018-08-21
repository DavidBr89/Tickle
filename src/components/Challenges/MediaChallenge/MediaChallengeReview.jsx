import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Star } from 'react-feather';
import { range } from 'd3';
// import { css } from 'aphrodite/no-important';

import { ModalBody } from 'Utils/Modal';
// import ScrollList from 'Utils/ScrollList';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';
// TODO: untangle later
import { Btn } from 'Components/cards/layout';

import { MediaList } from 'Utils/MediaUpload';

const StyledMediaList = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => <MediaList {...props} stylesheet={stylesheet} />}
  </CardThemeConsumer>
);

const StarRating = ({ highlighted }) => (
  <div style={{ display: 'flex' }}>
    {range(0, 5).map(i => (
      <Star size={50} fill={i < highlighted ? 'gold' : 'white'} />
    ))}
  </div>
);

class MediaChallenge extends Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    styles: PropTypes.object,
    stylesheet: PropTypes.object,
    challengeSubmission: PropTypes.oneOf([PropTypes.object, null]),
    bookmarkable: PropTypes.boolean
  };

  static defaultProps = {
    className: '',
    challengeSubmission: null,
    feedback: null,
    styles: {},
    stylesheet: {}
  };

  state = {
    response: null,
    rating: null,
    text: '',
    ...this.props.feedback,
    feedbackSent: this.props.feedback !== null
  };

  render() {
    const {
      className,
      description,
      onUpdate,
      onClose,
      response,
      media,
      styles,
      title,
      onSubmit
    } = this.props;

    const { feedbackSent, text, rating } = this.state;

    return (
      <ModalBody
        onClose={onClose}
        title={'Challenge Review'}
        footer={
          <div style={{ display: 'flex' }}>
            <Btn
              disabled={feedbackSent || rating === null}
              onClick={() => {
                onSubmit({});
                this.setState({ feedbackSent: true });
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Sent Feedback!
              </div>
            </Btn>
          </div>
        }
      >
        <div className="flex-full flexCol" style={{}}>
          <div>
            <h5>Description</h5>
            <p>{description}</p>
          </div>
          <div>
            <h5>Response</h5>
            <p style={{ width: '100%' }}>{response}</p>
          </div>
          <div>
            <h5>Media</h5>
            <StyledMediaList data={media} className="mb-3" />
          </div>
          <div>
            <h5>Feedback</h5>
            <textArea
              placeholder="give Feedback for the challenge"
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
              rows="4"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <h5>Rating</h5>
            <StarRating highlighted={3} />
          </div>
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
