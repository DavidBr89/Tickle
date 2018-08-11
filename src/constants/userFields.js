import { isEqual } from 'lodash';

export const userFields = ({
  interests,
  uid,
  name = null,
  username,
  email,
  photoURL,
  admin = false
}) => ({
  interests,
  uid,
  name,
  username,
  email,
  photoURL,
  admin: admin || admin
});

export const compareUserFields = (
  {
    interests: interestsA,
    uid: uidA,
    name: nameA,
    username: usernameA,
    email: emailA,
    photoURL: photoURLA
  },
  {
    interests: interestsB,
    name: nameB,
    uid: uidB,
    username: usernameB,
    email: emailB,
    photoURL: photoURLB
  }
) => {
  if (!isEqual(interestsA, interestsB)) {
    // console.log('interests unequal');
    return false;
  }
  if (uidA !== uidB) {
    // console.log('uid unequal');
    return false;
  }
  if (nameA !== nameB) {
    // console.log('name unequal');
    return false;
  }
  if (usernameA !== usernameB) {
    return false;
  }
  if (emailA !== emailB) {
    // console.log('email unequal');
    return false;
  }
  if (photoURLA !== photoURLB) {
    // console.log('photo unequal');
    return false;
  }
  // if (passwordOneA !== passwordOneB) {
  //   // console.log('photo unequal');
  //   return false;
  // }
  // if (passwordTwoA !== passwordTwoB) {
  //   // console.log('photo unequal');
  //   return false;
  // }
  return true;
};
