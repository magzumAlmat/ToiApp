import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
// const api = axios.create({
//   baseURL: process.env.BACKEND_URL || 'http://localhost:6666', // Укажите ваш бэкенд URL
// });

const api = axios.create({
  baseURL: 'http://localhost:6666', // Ваш URL
  headers: { 'Content-Type': 'application/json' }, // Добавляем заголовок по умолчанию
});

// Интерцептор запроса для добавления токена
api.interceptors.request.use(async (config) => {
  // Получаем токен асинхронно
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  register: (userData) => api.post('/api/register', userData),
  //login: (credentials) => api.post('/api/auth/getAuthentificatedUserInfo', credentials), // Предполагаемый эндпоинт для логина
  login: (credentials) => api.post('/api/auth/login', credentials), // Предполагаемый эндпоинт для логина
  getUser: (token) => api.get('/api/auth/getAuthentificatedUserInfo', { headers: { Authorization: `Bearer ${token}` } }),
  updateProfile: (data, token) =>
    api.post('/api/auth/addfullprofile', data, {
      headers: { Authorization: `Bearer ${token}` },
    }), // Новый эндпоинт для обновления профиля
    getProfile: (token) =>
        api.get('/api/auth/getAuthentificatedUserInfo', {
          headers: { Authorization: `Bearer ${token}` },
        }), // Новый метод
   
        createRestaurant: (data) => api.post('/api/restaurant', data),
        updateRestaurant: (id, data) => api.put(`/api/restaurant/${id}`, data),
        deleteRestaurant: (id) => api.delete(`/api/restaurant/${id}`),
        getRestaurantById: (id) => api.get(`/api/restaurantbyid/${id}`),
        getRestaurans: () => api.get(`/api/restaurants`),
};