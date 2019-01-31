import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ModalBody} from '~/components/utils/Modal';

// TODO remove
import {PreviewTags} from '~/components/utils/Tag';

import {StarRating} from '~/components/utils/Rating';

// TODO rewrite
/**
 * review the user response to an activity,
 * TODO it needs to be rewritten in hooks
 * @param {number} input any number
 * @returns {number} that number, plus one.
 */
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
    rating: this.props.feedback ? this.props.feedback.rating : 0,
    text: this.props.feedback ? this.props.feedback.text : '',
    ...this.props,
    feedbackSent: this.props.feedback !== null
  };

  render() {
    const {
      className,
      description,
      onUpdate,
      onClose,
      styles,
      title,
      onSubmit,
      tags,
      media,
      response
    } = this.props;

    const {feedbackSent, text, rating} = this.state;

    return (
      <ModalBody
        onClose={onClose}
        title={title}
        style={{background: 'whitesmoke'}}
        footer={
          <div style={{display: 'flex'}}>
            <button
              disabled={feedbackSent}
              onClick={() => {
                // TODO: maybe change later
                onSubmit({text, rating, accomplished: true});
                this.setState({feedbackSent: true});
              }}>
              <div
                style={{display: 'inline-flex', alignItems: 'center'}}>
                {feedbackSent ? 'Feeback is sent!' : 'Send Feedback'}
              </div>
            </button>
          </div>
        }>
        <div
          className="flex-full flexCol"
          style={{background: 'smokewhite'}}>
          <div>
            <h4>Description</h4>
            <p>{description}</p>
          </div>
          <div>
            <h4>Tags</h4>
            <PreviewTags data={tags} />
          </div>
          <div>
            <h4>Response</h4>
            <p style={{width: '100%'}}>{response}</p>
          </div>
          <div>
            <h4>Submitted Media</h4>
          </div>
          <div>
            <h4>Feedback</h4>
            <textarea
              disabled={feedbackSent}
              placeholder="give Feedback for the challenge"
              onChange={e => this.setState({text: e.target.value})}
              rows="4"
              style={{width: '100%'}}>
              {text}
            </textarea>
          </div>
          <div>
            <h4>Rating</h4>
            <StarRating
              disabled={feedbackSent}
              num={5}
              highlighted={rating}
              onClick={n => this.setState({rating: n})}
            />
          </div>
        </div>
      </ModalBody>
    );
  }
}

export default ReviewMediaChallenge;
