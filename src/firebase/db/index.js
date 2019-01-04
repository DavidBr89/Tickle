import {firestore, Timestamp, storageRef} from '../firebase';
import makeActivityFuncs from './activity_db';

import makeCardFuncs from './card_db';

export * from './utils_db';
export * from './user_db';

const pruneFields = fields => {
  const isNotFileOrFunc = val =>
    !(val instanceof File) && !(val instanceof Function);

  const pruneObject = obj =>
    Object.keys(obj).reduce((acc, attr) => {
      const val = obj[attr];
      if (isNotFileOrFunc(val)) acc[attr] = val;
      return acc;
    }, {});

  return Object.keys(fields).reduce((acc, attr) => {
    const val = fields[attr];
    if (val instanceof Array) {
      acc[attr] = val;
      return acc;
    }
    if (val instanceof Object) {
      acc[attr] = pruneObject(val);
      return acc;
    }
    if (isNotFileOrFunc(val)) acc[attr] = val;
    return acc;
  }, {});
};

// const thumbFileName = fileName => `thumb_${fileName}`;

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
          .set(d),
      );
    });
};

const removeFromStorage = path => {
  const imgRef = storageRef.child(path);
  return imgRef.delete().catch(error => {
    throw new Error(`error in deleting file${path} ${error}`);
  });
};

export const addToStorage = ({file, path, id}) => {
  const metadata = {contentType: file.type};
  const imgRef = storageRef.child(`${path}/${id}`);
  return imgRef
    .put(file, metadata)
    .then(() => new Promise(resolve => resolve(imgRef.getDownloadURL())))
    .catch(err => {
      console.log('err', err);
      throw new Error(`error in uploading img for ${file.name}`);
      // Handle any error that occurred in any of the previous
      // promises in the chain.
    });
};

export default function CardDB(ENV_STR = 'default') {
  const activityFuncs = makeActivityFuncs(ENV_STR);
  const cardFuncs = makeCardFuncs(ENV_STR);

  const addFileToEnv = ({file, path, id}) =>
    addToStorage({file, path: `${ENV_STR}/${path}`, id});

  const removeFileFromEnv = ({path, id}) =>
    removeFromStorage({path: `${ENV_STR}/${path}`, id});

  return {
    ...activityFuncs,
    ...cardFuncs,
    removeFileFromEnv,
    addFileToEnv,
  };
}
