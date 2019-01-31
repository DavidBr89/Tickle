import CardDb from '~/firebase/db/card_db';
import {getDetailedUserInfo} from '~/firebase/db';

export default ({userEnv, cardId, playerId, authorId}) => {
  const db = CardDb(userEnv);

  const commentPromises = db.readComments(cardId);
  const addComment = text =>
    db.addComment({uid: playerId, cardId, text});

  const authorDataPromise = getDetailedUserInfo({
    uid: authorId,
    userEnvId: userEnv
  });

  return {
    commentPromises,
    addComment,
    authorDataPromise
  };
};
