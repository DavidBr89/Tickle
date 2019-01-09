import {auth} from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () => {
  //TODO: clear storage here?
  localStorage.clear();
  auth.signOut();
};

// Password Reset
export const doPasswordReset = email => auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = password =>
  auth.currentUser.updatePassword(password);

export const doEmailUpdate = email => auth.currentUser.updateEmail(email);

export const getEmail = () => auth.currentUser.email;
// export const getUserProfile = auth.currentUser;
//
// export const updateUserProfile = userProfile =>
//   auth.currentUser.updateProfile(userProfile);

export const getUserInfo = () => auth.currentUser;
