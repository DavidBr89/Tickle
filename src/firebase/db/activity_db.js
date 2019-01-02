import {firestore, storageRef} from '../firebase';

const makeActivityFuncs = ENV_STR => {
  const TICKLE_ENV_REF = firestore.collection('card-environments').doc(ENV_STR);

  const getAllActivitySubs = cid => {
    const chSub = TICKLE_ENV_REF.collection('cards')
      .doc(cid)
      .collection('activitySubmissions');

    const activitySubmissions = [];
    return chSub.get().then(snapshot => {
      snapshot.forEach(item => {
        const d = item.data(); // will have 'todo_item.title' and 'todo_item.completed'
        // console.log('challengeSub', item);
        activitySubmissions.push({...d, cardId: cid, playerId: item.id});
      });
      return new Promise(resolve => resolve(activitySubmissions));
    });
  };

  const getOneActivitySub = ({cardId, playerId}) =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cardId)
      .collection('activitySubmissions')
      .doc(playerId)
      .get()
      .then(doc => new Promise(resolve => resolve(doc.data() || null)));

  const addActivitySubmission = ({cardId, playerId, ...challengeData}) =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cardId)
      .collection('activitySubmissions')
      .doc(playerId)
      .set({
        ...challengeData,
        date: new Date(),
        playerId,
        cardId,
      })
      .catch(err => {
        throw new Error(
          `error adding challengesubmission for ${playerId} ${err}`,
        );
        // Handle any error that occurred in any of the previous
        // promises in the chain.
      });

  const removeChallengeSubmission = ({cardId, playerId}) =>
    TICKLE_ENV_REF.collection('cards')
      .doc(cardId)
      .collection('activitySubmissions')
      .doc(playerId)
      .delete()
      .catch(err => {
        throw new Error(
          `error adding challengesubmission for ${playerId} ${cardId} ${err}`,
        );
      });

  return {
    getAllActivitySubs,
    getOneActivitySub,
    addActivitySubmission,
    removeChallengeSubmission,
  };
};

export default makeActivityFuncs;
