import { DB } from 'Firebase';

export default ({
  userEnv, cardId, playerId, authorId
}) => {
  const db = DB(userEnv);

  const commentPromises = db.readComments(cardId);
  const addComment = text => db.addComment({ uid: playerId, cardId, text });

  const authorDataPromise = db.getDetailedUserInfo(authorId);


  return {
    commentPromises, addComment, authorDataPromise
  };
};
