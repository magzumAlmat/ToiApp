import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Начало запроса (например, регистрация или логин)
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Успешная регистрация (без сохранения токена, так как это обычно просто подтверждение)
    registerSuccess: (state) => {
      state.loading = false;
    },
    // Успешный логин с сохранением данных пользователя и токена
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      SecureStore.setItemAsync('token', action.payload.token); // Сохранение токена
    },
    // Ошибка при запросе
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Выход из системы
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      SecureStore.deleteItemAsync('token'); // Удаление токена
      
    },
  },
});

export const { startLoading, registerSuccess, loginSuccess, setError, logout } = authSlice.actions;
export default authSlice.reducer;