/* eslint-disable */
import { logOutFirebase, signInWhitEmailPassword } from 'src/firebase/providers';
import { checkingCredentiasl, login, logout } from './authSlice';

export const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentiasl());
  };
};

export const startEmailPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(checkingCredentiasl());

    const result = await signInWhitEmailPassword({ email, password });
    if (result.ok) return dispatch(login(result));
    dispatch(logout(result));
    console.log(first);
  };
};

export const startLogOut = () => {
  return async (dispatch) => {
    const result = await logOutFirebase();
    console.log('result logout ', result);
    dispatch(logout());
  };
};
