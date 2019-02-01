import CardDb from '~/firebase/db/card_db';
import {getDetailedUserInfo} from '~/firebase/db';

export default ({userEnvId, cardId, playerId, authorId}) => {
  const db = CardDb(userEnvId);

  const commentPromises = db.readComments(cardId);
  const addComment = text =>
    db.addComment({uid: playerId, cardId, text});

  const authorDataPromise = getDetailedUserInfo({
    uid: authorId,
    userEnvId: userEnvId
  });

  return {
    commentPromises,
    addComment,
    authorDataPromise
  };
};
