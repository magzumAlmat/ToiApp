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
  setToken: (token) => {
    // Устанавливаем заголовок Authorization для всех будущих запросов
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
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


       
        createClothing: (data) => api.post('/api/clothing', data),
        createTransport: (data) => api.post('/api/transport', data),
        createTamada: (data) => api.post('/api/tamada', data),
        createProgram: (data) => api.post('/api/programs', data),
        createTraditionalGift: (data) => api.post('/api/traditional-gifts', data),
        createFlowers: (data) => api.post('/api/flowers', data),
        createCake: (data) => api.post('/api/cakes', data),
        createAlcohol: (data) => api.post('/api/alcohol', data),



        

        // Одежда
        getAllClothing: () => api.get('/api/clothing'),
        deleteClothing: (id) => api.delete(`/api/clothing/${id}`),
        getClothingById:(id) => api.get(`/api/clothing/${id}`),
        updateClothing:(id,data)=>api.put(`/api/clothing/${id}`,data),
        // Транспорт
        getTransportById: (id) => api.get(`/api/transport/${id}`),
        getAllTransport: () => api.get('/api/transport'),
        deleteTransport: (id) => api.delete(`/api/transport/${id}`),
        updateTransport:(id,data)=>api.put(`/api/transport/${id}`,data),
        // Тамада
        getTamadaById: (id) => api.get(`/api/tamada/${id}`),
        getAllTamada: () => api.get('/api/tamada'),
        deleteTamada: (id) => api.delete(`/api/tamada/${id}`),
        updateTamada:(id,data)=>api.put(`/api/tamada/${id}`,data),
        // Программа
        getProgramById: (id) => api.get(`/api/programs/${id}`),
        getAllPrograms: () => api.get('/api/programs'),
        deleteProgram: (id) => api.delete(`/api/programs/${id}`),
        updateProgram:(id,data)=>api.put(`/api/programs/${id}`,data),
        // Традиционные подарки
        getTraditionalGiftById:(id)=>api.get(`/api/traditional-gifts/${id}`),
        getAllTraditionalGifts: () => api.get('/api/traditional-gifts'),
        deleteTraditionalGift: (id) => api.delete(`/api/traditional-gifts/${id}`),
        updateTraditionalGift:(id,data)=>api.put(`/api/traditional-gifts/${id}`,data),
        // Цветы
        getFlowersById: (id) => api.get(`/api/flowers/${id}`),
        getAllFlowers: () => api.get('/api/flowers'),
        deleteFlowers: (id) => api.delete(`/api/flowers/${id}`),
        updateFlowers: (id,data) => api.put(`/api/flowers/${id}`,data),
        // Торты
        getCakeById:(id) => api.get(`/api/cakes/${id}`),
        getAllCakes: () => api.get('/api/cakes'),
        deleteCake: (id) => api.delete(`/api/cakes/${id}`),
        updateCake:(id,data)=>api.put(`/api/cakes/${id}`,data),
        // Алкоголь
        updateAlcohol:(id,data)=>api.put(`/api/alcohol/${id}`,data),
        getAlcoholById:(id) => api.get(`/api/alcohol/${id}`),
        getAllAlcohol: () => api.get('/api/alcohol'),
        deleteAlcohol: (id) => api.delete(`/api/alcohol/${id}`),



};