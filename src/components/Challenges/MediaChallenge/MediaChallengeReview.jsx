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

const StarRating = ({ num = 5, highlighted = 0, onClick }) => (
  <div style={{ display: 'flex' }}>
    {range(1, num + 1).map(i => (
      <div onClick={() => onClick(i)} style={{ cursor: 'pointer' }}>
        <Star size={50} fill={i <= highlighted ? 'gold' : 'white'} />
      </div>
    ))}
  </div>
);

class ReviewMediaChallenge extends Component {
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
    rating: 0,
    text: '',
    ...this.props.challengeSubmission.feedback,
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
        title="Challenge Review"
        footer={
          <div style={{ display: 'flex' }}>
            <Btn
              onClick={() => {
                //TODO: maybe change later
                onSubmit({ text, rating, accomplished: true });
                this.setState({ feedbackSent: true });
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                {feedbackSent ? 'Feeback is sent!' : 'Send Feedback'}
              </div>
            </Btn>
          </div>
        }
      >
        <div className="flex-full flexCol" style={{}}>
          <div>
            <h4>Description</h4>
            <p>{description}</p>
          </div>
          <div>
            <h4>Response</h4>
            <p style={{ width: '100%' }}>{response}</p>
          </div>
          <div>
            <h4>Media</h4>
            <StyledMediaList data={media} className="mb-3" />
          </div>
          <div>
            <h4>Feedback</h4>
            <textarea
              placeholder="give Feedback for the challenge"
              onChange={e => this.setState({ text: e.target.value })}
              rows="4"
              style={{ width: '100%' }}
            >
              {text}
            </textarea>
          </div>
          <div>
            <h4>Rating</h4>
            <StarRating
              num={5}
              highlighted={rating}
              onClick={n => this.setState({ rating: n })}
            />
          </div>
        </div>
      </ModalBody>
    );
  }
}

const StyledMediaChallengeReview = props => (
  <CardThemeConsumer>
    {({ stylesheet }) => (
      <ReviewMediaChallenge {...props} stylesheet={stylesheet} />
    )}
  </CardThemeConsumer>
);

export default StyledMediaChallengeReview;
