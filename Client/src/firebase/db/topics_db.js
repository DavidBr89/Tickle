import {firestore, Timestamp, storageRef} from '../firebase';

export const readTopics = (userEnvId) => {
  const TICKLE_ENV_REF = firestore
    .collection('card-environments')
    .doc(userEnvId).collection('topics')
}
