import {DB} from 'Firebase';
import {getDetailedUserInfo} from 'Firebase/db';

export default ({userEnv, cardId, playerId, authorId}) => {
  const db = DB(userEnv);

  const commentPromises = db.readComments(cardId);
  const addComment = text => db.addComment({uid: playerId, cardId, text});

  const authorDataPromise = getDetailedUserInfo({
    uid: authorId,
    userEnvId: userEnv,
  });

  return {
    commentPromises,
    addComment,
    authorDataPromise,
  };
};
