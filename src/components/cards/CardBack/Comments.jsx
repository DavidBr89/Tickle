import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { timeFormat } from 'd3';
import User from 'react-feather/dist/icons/user';

import { firebase } from 'Firebase';

class CommentsWrapper extends Component {
  static propTypes = {
    author: PropTypes.object,
    cardId: PropTypes.string,
    addComment: PropTypes.func
  };

  static defaultProps = {
    author: {},
    cardId: null,
    addComment: d => d
  };

  state = { comments: [], extended: false };

  componentDidMount() {
    const { cardId, commentPromises } = this.props;
    commentPromises.then((comments) => {
      console.log('fetchComments', comments);
      this.setState({ comments });
      // const allProms = comments.map(c =>
      //   db.getUser(c.uid).then(user => ({...c, ...user})),
      // );
      //
      // Promise.all(allProms).then(commentsWithUser => {
      //   this.setState({comments: commentsWithUser});
      // });
    });
  }

  render() {
    const { comments } = this.state;
    const {
      author, cardId, addComment, extended, userInfoPromise
    } = this.props;
    const { uid } = author;
    return (
      <CommentList
        extended={extended}
        userInfoPromise={userInfoPromise}
        data={comments}
        author={author}
        cardId={cardId}
        onAdd={(text) => {
          addComment(text)
            .then(err => console.log('comment added', err));

          const comment = {
            text, cardId, uid, date: new Date()
          };

          this.setState({ comments: [...comments, comment] });
        }}
      />
    );
  }
}

const CommentList = ({
  data, author, onAdd, extended
}) => (
  <div
    className="m-2 flex flex-col flex-grow flex-shrink"
  >
    <div className="flex mb-2">
      <h2 className="tag-label bg-black">Comments</h2>
    </div>

    {data.length === 0 && (<div className="tex-lg">No Comments</div>)}
    <div className="mb-auto overflow-y-auto">
      {data.map(({ ...c }) => (<OneComment {...c} />))}
    </div>
    {extended && (<AddComment onClick={onAdd} />)}
  </div>
);

CommentList.defaultProps = {
  data: [],
  author: {},
  cardId: null,
  extended: false,
  stylesheet: {}
};


class OneComment extends Component {
  static propTypes = {
    date: PropTypes.object,
    text: PropTypes.string
  };

  static defaultProps ={ date: new Date(), text: '' }


  render() {
    const {
      text, username, photoURL, date
    } = this.props;

    const formatTime = timeFormat('%B %d, %Y');

    return (<div className="flex mb-2">
      <div className="mr-2 border-2 border-black flex-col-wrapper justify-center">
        {photoURL !== null
          ? <img
            width="30"
            height="30"
            src={photoURL}
            alt="alt"
          /> : <User />

        }
      </div>
      <div>
        <div className="mb-1">
          {text}
        </div>
        <div className="italic text-sm">
          {' '}
          <span className="font-bold">{username}</span>
          {', '}
          {formatTime(date)}
        </div>
      </div>
            </div>
    );
  }
}


OneComment.defaultProps = {
  photoURL: null
};
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
    const { onClick } = this.props;
    const { text } = this.state;
    return (
      <div className="mt-5">
        <input
          className="mb-2 form-control mb-1 w-full"
          placeholder="Write a comment"
          type="text"
          onChange={e => this.setState({ text: e.target.value })}
        />
        <button
          className="btn w-full"
          type="button"
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

export default CommentsWrapper;


// const CommentsCont = connect(
//   null,
//   mapDispatchToProps
// )(CommentsWrapper);
