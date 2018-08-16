import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'aphrodite';

import { db } from 'Firebase';

import { addCommentSuccess } from 'Reducers/Cards/actions';

import { CardThemeConsumer } from 'Src/styles/CardThemeContext';

class CommentsWrapper extends Component {
  static propTypes = {
    author: PropTypes.object,
    cardId: PropTypes.string,
    addComment: PropTypes.func
  };
  defaultProps: { author: {}, cardId: '', addComment: d => d };

  state = { comments: [], extended: false };

  componentDidMount() {
    const { cardId } = this.props;
    db.readComments(cardId).then(comments => {
      this.setState({ comments });
      const allProms = comments.map(c =>
        db.getUser(c.uid).then(user => ({ ...c, ...user }))
      );
      Promise.all(allProms).then(commentsWithUser => {
        this.setState({ comments: commentsWithUser });
      });
    });
  }

  render() {
    const { comments } = this.state;
    const { author, cardId, extended } = this.props;
    return (
      <CardThemeConsumer>
        {({ stylesheet }) => (
          <CommentList
            extended={extended}
            data={comments}
            author={author}
            cardId={cardId}
            stylesheet={stylesheet}
            onChange={comment => {
              addCommentSuccess();
              this.setState({ comments: [...comments, comment] });
            }}
          />
        )}
      </CardThemeConsumer>
    );
  }
}

const CommentList = ({
  data,
  author,
  cardId,
  stylesheet,
  onChange,
  extended
}) => {
  const { uid } = author;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
    >
      <div style={{ overflow: 'scroll' }}>
        {data
          .slice(0, extended ? 20 : 2)
          .map(({ date, ...c }) => (
            <OneComment {...c} date="date placeholder" />
          ))}
        {data.length === 0 && (
          <div style={{}}>
            <h4>'No Comments'</h4>
          </div>
        )}
      </div>
      {extended && (
        <AddComment
          user={author}
          stylesheet={stylesheet}
          onClick={text => {
            const comment = { ...author, cardId, text };
            db.addComment({ uid, cardId, text }).then(() =>
              console.log('comment added', comment)
            );
            onChange(comment);
          }}
        />
      )}
    </div>
  );
};

CommentList.defaultProps = {
  data: [],
  author: {},
  cardId: null,
  extended: false,
  stylesheet: {}
};

const OneComment = ({ photoURL, text, username, date }) => (
  <div style={{ display: 'flex' }}>
    <div className="">
      <img
        className=" mr-3"
        width="30"
        height="30"
        src={photoURL}
        style={{
          border: '1px solid black'
          // borderRadius: '50%',
          // border: 'black 2px solid'
        }}
        alt="alt"
      />
    </div>
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

// class CommentFetcher extends Component {
//   static propTypes = {
//     uid: PropTypes.string
//   };
//
//   state = { user: { username: 'deleted user' } };
//   componentDidMount() {
//     const { uid } = this.props;
//     uid &&
//       db.getUser(uid).then(user => {
//         console.log('new fetch');
//         this.setState({ user });
//       });
//   }
//
//   render() {
//     const { user } = this.state;
//     return <OneComment {...user} {...this.props} />;
//   }
// }

Comment.defaultProps = {
  photoURL:
    'https://cyndidale.com/wp-content/uploads/2015/11/user-placeholder-circle.png',
  username: 'testUser',
  text: '',
  date: 'testdate'
};

class AddComment extends Component {
  static propTypes = {
    uid: PropTypes.string,
    onClick: PropTypes.func
  };

  state = { text: null };

  render() {
    const { onClick, stylesheet } = this.props;
    const { text } = this.state;
    return (
      <div style={{}} className="mt-3">
        <input
          className="form-control mb-1"
          type="text"
          onChange={e => this.setState({ text: e.target.value })}
        />{' '}
        <button
          className={`mb-1 ${css(stylesheet.btn)}`}
          style={{ width: '100%' }}
          disabled={text === null || text === ''}
          onClick={() => {
            onClick(text);
            this.setState({ text: null });
          }}
        >
          Submit
        </button>
      </div>
    );
  }
}

// TODO: remove
const mapDispatchToProps = dispatch => ({
  addComment: c => {
    dispatch(addCommentSuccess(c));
  }
});

const mapStateToProps = state => ({ author: state.Session.authUser });

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CommentsWrapper);

// const CommentsCont = connect(
//   null,
//   mapDispatchToProps
// )(CommentsWrapper);
