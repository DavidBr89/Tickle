import {firestore} from '../firebase';

export default function topicDb(userEnvStr) {
  const dbRef = firestore
    .collection('card-environments')
    .doc(userEnvStr)
    .collection('topics');

  return {
    doReadTopics() {
      return dbRef
        .get()
        .then(querySnapshot =>
          querySnapshot.docs.map(envDoc => envDoc.data())
        );
    },
    doCreateTopic(topic) {
      return dbRef.doc(topic.id).set(topic);
    },
    doDeleteTopic(id) {
      return dbRef.doc(id).delete();
    }
  };
}
