import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

import { FirebaseAuth } from './firebaseConfig';

export const signInWhitEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
    const { uid, photoURL, displayName } = resp.user;
    return {
      ok: true,
      uid,
      photoURL,
      displayName,
      email,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

export const logOutFirebase = async () => {
  try {
    signOut(FirebaseAuth);
    return {
      ok: true,
    };
  } catch (error) {
    return error;
  }
};
