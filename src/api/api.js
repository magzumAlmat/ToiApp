import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:6666', // Укажите ваш бэкенд URL
});


export default {
  register: (userData) => api.post('/api/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials), // Предполагаемый эндпоинт для логина
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
        getRestaurant: (id) => api.get(`/api/restaurant/${id}`),
};