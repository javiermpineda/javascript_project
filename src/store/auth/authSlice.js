import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'Checking', //  athenticated Notauthenticated
    uid: null,
    email: null,
    displayName: null,
    photoUrl: null,
    errorMessage: null,
  },
  reducers: {
    login: (state, { payload }) => {
      console.log('LogIn', payload);
      state.status = 'Authenticated';
      state.uid = payload.uid;
      state.email = payload.email;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = null;
    },
    logout: (state, { payload }) => {
      console.log('Logout');
      console.log(payload);
      state.status = 'Not-authenticated'; //  athenticated Notauthenticated
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoUrl = null;
      state.errorMessage = payload?.errorMessage;
    },
    checkingCredentiasl: (state) => {
      state.status = 'checking';
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, checkingCredentiasl } = authSlice.actions;
