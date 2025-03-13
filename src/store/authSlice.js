// import { createSlice } from '@reduxjs/toolkit';
// import * as SecureStore from 'expo-secure-store';

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//     isLoading: true, // Флаг загрузки
//   },
//   reducers: {
//     startLoading: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     registerSuccess: (state) => {
//       state.loading = false;
//     },
//     loginSuccess: (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isLoading = false;
//       console.log(state.user)
//       console.log('loginSuccess - New state:', {
//         user: state.user,
//         token: state.token,
//       }); // Логируем состояние после обновления
//       SecureStore.setItemAsync('token', action.payload.token);
//     },
//     setError: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.error = null;
      
//       SecureStore.deleteItemAsync('token'); // Удаление токена
//       state.isLoading = false;
//     },
//     setCredentials: (state, action) => {
//       state.token = action.payload.token;
//       state.user = action.payload.user;
//       state.isLoading = false;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//   },
// });

// export const { startLoading, registerSuccess, loginSuccess, setError, setCredentials, logout, setLoading } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isLoading: true,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      console.log('loginSuccess - New state:', {
        user: state.user,
        token: state.token,
      });
      SecureStore.setItemAsync('token', action.payload.token).catch((err) =>
        console.error('Failed to save token:', err)
      ); // Обработка ошибки
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
      // Удаление токена перенесем в компонент для асинхронной обработки
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { startLoading, registerSuccess, loginSuccess, setError, setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;