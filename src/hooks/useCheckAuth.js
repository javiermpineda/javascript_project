import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FirebaseAuth } from 'src/firebase/firebaseConfig';
import { login, logout } from 'src/store/auth';

export const useCheckAuth = () => {
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(status);
  useEffect(() => {
    onAuthStateChanged(FirebaseAuth, (user) => {
      if (!user) return dispatch(logout());
      const { email, uid, displayName, photoUrl, errorMessage } = user;

      dispatch(login({ email, uid, displayName, photoUrl, errorMessage }));
    });
  }, []);
  return status;
};
