import {firestore, Timestamp, storageRef} from '../firebase';
import makeActivityFuncs from './activity_db';

import makeCardFuncs from './card_db';

export * from './utils_db';
export * from './user_db';

export const readCopyUsers = () => {
  firestore
    .collection('users')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        data.push(d);
      });

      data.forEach(d =>
        firestore
          .collection('old_users_2')
          .doc(d.uid)
          .set(d)
      );
    });
};

export const removeFromStorage = path => {
  const imgRef = storageRef.child(path);
  return imgRef.delete().catch(error => {
    throw new Error(`error in deleting file ${path} ${error}`);
  });
};

export const addToStorage = ({file, path}) => {
  console.log('file', file, 'path', path);
  // const metadata = {contentType: file.type};
  const imgRef = storageRef.child(`${path}`);
  return imgRef
    .put(file)
    .then(() => imgRef.getDownloadURL())
    .catch(err => {
      console.log('err', err);
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};
