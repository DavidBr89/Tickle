import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { db } from 'Firebase';

import { asyncAddComment } from 'Reducers/Cards/async_actions';

class CommentsWrapper extends Component {
  static propTypes = {
    author: PropTypes.object,
    cardId: PropTypes.string,
    addComment: PropTypes.func
  };
  defaultProps: { author: {}, cardId: '', addComment: d => d };

  state = { comments: [], extended: false };

  componentDidMount() {
    const { author, cardId } = this.props;
    const { uid: authorId } = author;
    db.readComments({ authorId, cardId }).then(comments => {
      console.log('comments', comments);
      this.setState({ comments });
    });
  }

  render() {
    const { comments } = this.state;
    const { author, cardId, addComment, extended } = this.props;
    const { uid: authorId } = author;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Comments
          data={comments}
          author={author}
          cardId={cardId}
          extended={extended}
        />
      </div>
    );
  }
}

const Comments = ({ data, author, cardId, extended }) => {
  const { uid } = author;
  if (extended) {
    return (
      <div>
        {data.map(({ date, ...c }) => (
          <Comment {...c} date={date.toString()} />
        ))}
        <AddComment
          user={author}
          onClick={text => {
            db.addComment({ authorId: uid, cardId, text }).then(d =>
              console.log('success')
            );
          }}
        />
      </div>
    );
  }
  return (
    <div>
      {data
        .slice(0, 2)
        .map(({ date, ...c }) => <Comment {...c} date={date.toString()} />)}
    </div>
  );
};

Comments.defaultProps = {
  data: [],
  author: {},
  cardId: null,
  extended: false
};

const Comment = ({ photoURL, text, username, date }) => (
  <div style={{ display: 'flex' }}>
    <img
      className=" mr-3"
      width="20"
      height="20"
      src={photoURL}
      style={{
        borderRadius: '50%',
        border: 'black 2px solid'
      }}
      alt="alt"
    />
    <div className="media-body">
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <small>{text}</small>
      </div>
      <div>
        <small className="font-italic">
          - {username}, {date}
        </small>
      </div>
    </div>
  </div>
);

Comment.defaultProps = {
  photoURL:
    'https://cyndidale.com/wp-content/uploads/2015/11/user-placeholder-circle.png',
  username: 'testUser',
  text: '',
  date: 'testdate'
};

const AddComment = ({ uid, onClick }) => (
  <div className="mt-3">
    <input type="text" />{' '}
    <button onClick={() => onClick('testcomment')}>Submit</button>
  </div>
);

const mapDispatchToProps = dispatch => ({
  addComment: c => {
    dispatch(asyncAddComment(c));
  }
});

export default CommentsWrapper;
// const CommentsCont = connect(
//   null,
//   mapDispatchToProps
// )(CommentsWrapper);
