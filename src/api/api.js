// import axios from 'axios';
// import * as SecureStore from 'expo-secure-store';
// // const api = axios.create({
// //   baseURL: process.env.BACKEND_URL || 'http://localhost:6666', // Укажите ваш бэкенд URL
// // });

// const api = axios.create({
//    baseURL: process.env.EXPO_PUBLIC_API_baseURL, 
//   //baseURL: 'https://26d8-85-117-96-82.ngrok-free.app',
//   headers: { 'Content-Type': 'application/json' }, // Добавляем заголовок по умолчанию
// });

// // Интерцептор запроса для добавления токена
// api.interceptors.request.use(async (config) => {
//   // Получаем токен асинхронно
//   const token = await SecureStore.getItemAsync('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default {
//   register: (userData) => api.post('/api/register', userData),
//   //login: (credentials) => api.post('/api/auth/getAuthentificatedUserInfo', credentials), // Предполагаемый эндпоинт для логина
//   login: (credentials) => api.post('/api/auth/login', credentials), // Предполагаемый эндпоинт для логина
//   getUser: (token) => api.get('/api/auth/getAuthentificatedUserInfo', { headers: { Authorization: `Bearer ${token}` } }),
//   setToken: (token) => {
//     // Устанавливаем заголовок Authorization для всех будущих запросов
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   },
//   updateProfile: (data, token) =>
//     api.post('/api/auth/addfullprofile', data, {
//       headers: { Authorization: `Bearer ${token}` },
//     }), // Новый эндпоинт для обновления профиля
//     getProfile: (token) =>
//         api.get('/api/auth/getAuthentificatedUserInfo', {
//           headers: { Authorization: `Bearer ${token}` },
//         }), // Новый метод
   
//         createRestaurant: (data) => api.post('/api/restaurant', data),
//         updateRestaurant: (id, data) => api.put(`/api/restaurant/${id}`, data),
//         deleteRestaurant: (id) => api.delete(`/api/restaurant/${id}`),
//         getRestaurantById: (id) => api.get(`/api/restaurantbyid/${id}`),
//         getRestaurans: () => api.get(`/api/restaurants`),


       
//         createClothing: (data) => api.post('/api/clothing', data),
//         createTransport: (data) => api.post('/api/transport', data),
//         createTamada: (data) => api.post('/api/tamada', data),
//         createProgram: (data) => api.post('/api/programs', data),
//         createTraditionalGift: (data) => api.post('/api/traditional-gifts', data),
//         createFlowers: (data) => api.post('/api/flowers', data),
//         createCake: (data) => api.post('/api/cakes', data),
//         createAlcohol: (data) => api.post('/api/alcohol', data),



        

//         // Одежда
//         getAllClothing: () => api.get('/api/clothing'),
//         deleteClothing: (id) => api.delete(`/api/clothing/${id}`),
//         getClothingById:(id) => api.get(`/api/clothing/${id}`),
//         updateClothing:(id,data)=>api.put(`/api/clothing/${id}`,data),
//         // Транспорт
//         getTransportById: (id) => api.get(`/api/transport/${id}`),
//         getAllTransport: () => api.get('/api/transport'),
//         deleteTransport: (id) => api.delete(`/api/transport/${id}`),
//         updateTransport:(id,data)=>api.put(`/api/transport/${id}`,data),
//         // Тамада
//         getTamadaById: (id) => api.get(`/api/tamada/${id}`),
//         getAllTamada: () => api.get('/api/tamada'),
//         deleteTamada: (id) => api.delete(`/api/tamada/${id}`),
//         updateTamada:(id,data)=>api.put(`/api/tamada/${id}`,data),
//         // Программа
//         getProgramById: (id) => api.get(`/api/programs/${id}`),
//         getAllPrograms: () => api.get('/api/programs'),
//         deleteProgram: (id) => api.delete(`/api/programs/${id}`),
//         updateProgram:(id,data)=>api.put(`/api/programs/${id}`,data),
//         // Традиционные подарки
//         getTraditionalGiftById:(id)=>api.get(`/api/traditional-gifts/${id}`),
//         getAllTraditionalGifts: () => api.get('/api/traditional-gifts'),
//         deleteTraditionalGift: (id) => api.delete(`/api/traditional-gifts/${id}`),
//         updateTraditionalGift:(id,data)=>api.put(`/api/traditional-gifts/${id}`,data),
//         // Цветы
//         getFlowersById: (id) => api.get(`/api/flowers/${id}`),
//         getAllFlowers: () => api.get('/api/flowers'),
//         deleteFlowers: (id) => api.delete(`/api/flowers/${id}`),
//         updateFlowers: (id,data) => api.put(`/api/flowers/${id}`,data),
//         // Торты
//         getCakeById:(id) => api.get(`/api/cakes/${id}`),
//         getAllCakes: () => api.get('/api/cakes'),
//         deleteCake: (id) => api.delete(`/api/cakes/${id}`),
//         updateCake:(id,data)=>api.put(`/api/cakes/${id}`,data),
//         // Алкоголь
//         updateAlcohol:(id,data)=>api.put(`/api/alcohol/${id}`,data),
//         getAlcoholById:(id) => api.get(`/api/alcohol/${id}`),
//         getAllAlcohol: () => api.get('/api/alcohol'),
//         deleteAlcohol: (id) => api.delete(`/api/alcohol/${id}`),

//         createWedding: (data, token) =>
//           api.post('/api/weddings/addwedding', data, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
        
//          getWedding: (token) =>
//           api.get(`/api/getallweddings`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),

       
//           updateWedding: (id, token, data) =>
//             api.put(`/api/updateweddingbyid/${id}`, data, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),

//             deleteWedding: (id, token) => api.delete(`/api/weddings/${id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             }),


           
//             getWeddinItems: (id,token) =>
//               api.get(`/api/wedding-items/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//               }),
    




//           createWish:(wishlistData,token)=>{
//           api.post('/api/wishlist', wishlistData, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         },

//           getWishlistByWeddingId: (weddingId, token) => api.get(`/api/wishlist/${weddingId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),

//           getWishlistByWeddingIdWithoutToken: (weddingId) => api.get(`/api/wishlist/${weddingId}`, ),


//           reserveWishlistItem: (id, token) => api.patch(`/api/wishlist/${id}/reserve`, {}, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),

        
//           reserveWishlistItemWithoutToken: (id,data) => api.patch(`/api/wishlist/${id}/reservebyunknown`, {data}, ),
        
        

//         ),



//           addDataBlockToRestaurant:(restaurantId,date)=>api.post(`/api/block` , {
//             restaurantId,
//             date: date.toISOString().split('T')[0],
//           }),
       
//           fetchBlockedDaysByResaurantId:(id)=>api.get(`/api/${id}/blocked-days`),


//           fetchAllBlockDays:()=>api.get('/api/all-blocked-days'),





//           fetchByEndpoint:(endpoint) => api.get(`${endpoint}`),
//               // console.log('FetchbyEndPOINT FROM API',endpoint)
              
           
//           // router.get(`/goodbyid/:id`, getGoodById)
//         }
      
//         // showWishList:()
      



import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_baseURL,
  headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`
},
});

// Интерцептор запроса для добавления токена
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API методы
export default {
  // Аутентификация и профиль
  register: (userData) =>
    api.post('/api/register', userData).catch((error) => {
      throw new Error(`Ошибка регистрации: ${error.response?.data?.message || error.message}`);
    }),

  login: (credentials) =>
    api.post('/api/auth/login', credentials).catch((error) => {
      throw new Error(`Ошибка входа: ${error.response?.data?.message || error.message}`);
    }),

  getUser: () =>
    api.get('/api/auth/getAuthentificatedUserInfo').catch((error) => {
      throw new Error(`Ошибка получения данных пользователя: ${error.response?.data?.message || error.message}`);
    }),

  setToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  updateProfile: (data) =>
    api.post('/api/auth/addfullprofile', data).catch((error) => {
      throw new Error(`Ошибка обновления профиля: ${error.response?.data?.message || error.message}`);
    }),

  getProfile: () =>
    api.get('/api/auth/getAuthentificatedUserInfo').catch((error) => {
      throw new Error(`Ошибка получения профиля: ${error.response?.data?.message || error.message}`);
    }),

  // Рестораны
  createRestaurant: (data) =>
    api.post('/api/restaurant', data).catch((error) => {
      throw new Error(`Ошибка создания ресторана: ${error.response?.data?.message || error.message}`);
    }),

  updateRestaurant: (id, data) =>
    api.put(`/api/restaurant/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления ресторана: ${error.response?.data?.message || error.message}`);
    }),

  deleteRestaurant: (id) =>
    api.delete(`/api/restaurant/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления ресторана: ${error.response?.data?.message || error.message}`);
    }),

  getRestaurantById: (id) =>
    api.get(`/api/restaurantbyid/${id}`).catch((error) => {
      throw new Error(`Ошибка получения ресторана: ${error.response?.data?.message || error.message}`);
    }),

  getRestaurants: () =>
    api.get('/api/restaurants').catch((error) => {
      throw new Error(`Ошибка получения списка ресторанов: ${error.response?.data?.message || error.message}`);
    }),

  // Одежда
  createClothing: (data) =>
    api.post('/api/clothing', data).catch((error) => {
      throw new Error(`Ошибка создания одежды: ${error.response?.data?.message || error.message}`);
    }),

  getClothing: () =>
    api.get('/api/clothing').catch((error) => {
      throw new Error(`Ошибка получения списка одежды: ${error.response?.data?.message || error.message}`);
    }),

  deleteClothing: (id) =>
    api.delete(`/api/clothing/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления одежды: ${error.response?.data?.message || error.message}`);
    }),

  getClothingById: (id) =>
    api.get(`/api/clothing/${id}`).catch((error) => {
      throw new Error(`Ошибка получения одежды: ${error.response?.data?.message || error.message}`);
    }),

  updateClothing: (id, data) =>
    api.put(`/api/clothing/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления одежды: ${error.response?.data?.message || error.message}`);
    }),

  // Транспорт
  createTransport: (data) =>
    api.post('/api/transport', data).catch((error) => {
      throw new Error(`Ошибка создания транспорта: ${error.response?.data?.message || error.message}`);
    }),

  getTransport: () =>
    api.get('/api/transport').catch((error) => {
      throw new Error(`Ошибка получения списка транспорта: ${error.response?.data?.message || error.message}`);
    }),

  deleteTransport: (id) =>
    api.delete(`/api/transport/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления транспорта: ${error.response?.data?.message || error.message}`);
    }),

  getTransportById: (id) =>
    api.get(`/api/transport/${id}`).catch((error) => {
      throw new Error(`Ошибка получения транспорта: ${error.response?.data?.message || error.message}`);
    }),

  updateTransport: (id, data) =>
    api.put(`/api/transport/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления транспорта: ${error.response?.data?.message || error.message}`);
    }),

  // Тамада
  createTamada: (data) =>
    api.post('/api/tamada', data).catch((error) => {
      throw new Error(`Ошибка создания тамады: ${error.response?.data?.message || error.message}`);
    }),

  getTamada: () =>
    api.get('/api/tamada').catch((error) => {
      throw new Error(`Ошибка получения списка тамады: ${error.response?.data?.message || error.message}`);
    }),

  deleteTamada: (id) =>
    api.delete(`/api/tamada/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления тамады: ${error.response?.data?.message || error.message}`);
    }),

  getTamadaById: (id) =>
    api.get(`/api/tamada/${id}`).catch((error) => {
      throw new Error(`Ошибка получения тамады: ${error.response?.data?.message || error.message}`);
    }),

  updateTamada: (id, data) =>
    api.put(`/api/tamada/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления тамады: ${error.response?.data?.message || error.message}`);
    }),

  // Программы
  createProgram: (data) =>
    api.post('/api/programs', data).catch((error) => {
      throw new Error(`Ошибка создания программы: ${error.response?.data?.message || error.message}`);
    }),

  getPrograms: () =>
    api.get('/api/programs').catch((error) => {
      throw new Error(`Ошибка получения списка программ: ${error.response?.data?.message || error.message}`);
    }),

  deleteProgram: (id) =>
    api.delete(`/api/programs/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления программы: ${error.response?.data?.message || error.message}`);
    }),

  getProgramById: (id) =>
    api.get(`/api/programs/${id}`).catch((error) => {
      throw new Error(`Ошибка получения программы: ${error.response?.data?.message || error.message}`);
    }),

  updateProgram: (id, data) =>
    api.put(`/api/programs/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления программы: ${error.response?.data?.message || error.message}`);
    }),

  // Традиционные подарки
  createTraditionalGift: (data) =>
    api.post('/api/traditional-gifts', data).catch((error) => {
      throw new Error(`Ошибка создания подарка: ${error.response?.data?.message || error.message}`);
    }),

  getTraditionalGifts: () =>
    api.get('/api/traditional-gifts').catch((error) => {
      throw new Error(`Ошибка получения списка подарков: ${error.response?.data?.message || error.message}`);
    }),

  deleteTraditionalGift: (id) =>
    api.delete(`/api/traditional-gifts/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления подарка: ${error.response?.data?.message || error.message}`);
    }),

  getTraditionalGiftById: (id) =>
    api.get(`/api/traditional-gifts/${id}`).catch((error) => {
      throw new Error(`Ошибка получения подарка: ${error.response?.data?.message || error.message}`);
    }),

  updateTraditionalGift: (id, data) =>
    api.put(`/api/traditional-gifts/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления подарка: ${error.response?.data?.message || error.message}`);
    }),

  // Цветы
  createFlowers: (data) =>
    api.post('/api/flowers', data).catch((error) => {
      throw new Error(`Ошибка создания цветов: ${error.response?.data?.message || error.message}`);
    }),

  getFlowers: () =>
    api.get('/api/flowers').catch((error) => {
      throw new Error(`Ошибка получения списка цветов: ${error.response?.data?.message || error.message}`);
    }),

  deleteFlowers: (id) =>
    api.delete(`/api/flowers/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления цветов: ${error.response?.data?.message || error.message}`);
    }),

  getFlowersById: (id) =>
    api.get(`/api/flowers/${id}`).catch((error) => {
      throw new Error(`Ошибка получения цветов: ${error.response?.data?.message || error.message}`);
    }),

  updateFlowers: (id, data) =>
    api.put(`/api/flowers/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления цветов: ${error.response?.data?.message || error.message}`);
    }),

  // Торты
  createCake: (data) =>
    api.post('/api/cakes', data).catch((error) => {
      throw new Error(`Ошибка создания торта: ${error.response?.data?.message || error.message}`);
    }),

  getCakes: () =>
    api.get('/api/cakes').catch((error) => {
      throw new Error(`Ошибка получения списка тортов: ${error.response?.data?.message || error.message}`);
    }),

  deleteCake: (id) =>
    api.delete(`/api/cakes/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления торта: ${error.response?.data?.message || error.message}`);
    }),

  getCakeById: (id) =>
    api.get(`/api/cakes/${id}`).catch((error) => {
      throw new Error(`Ошибка получения торта: ${error.response?.data?.message || error.message}`);
    }),

  updateCake: (id, data) =>
    api.put(`/api/cakes/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления торта: ${error.response?.data?.message || error.message}`);
    }),

  // Алкоголь
  createAlcohol: (data) =>
    api.post('/api/alcohol', data).catch((error) => {
      throw new Error(`Ошибка создания алкоголя: ${error.response?.data?.message || error.message}`);
    }),

  getAlcohol: () =>
    api.get('/api/alcohol').catch((error) => {
      throw new Error(`Ошибка получения списка алкоголя: ${error.response?.data?.message || error.message}`);
    }),

  deleteAlcohol: (id) =>
    api.delete(`/api/alcohol/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления алкоголя: ${error.response?.data?.message || error.message}`);
    }),

  getAlcoholById: (id) =>
    api.get(`/api/alcohol/${id}`).catch((error) => {
      throw new Error(`Ошибка получения алкоголя: ${error.response?.data?.message || error.message}`);
    }),

  updateAlcohol: (id, data) =>
    api.put(`/api/alcohol/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления алкоголя: ${error.response?.data?.message || error.message}`);
    }),


 // Ювелирные изделия
 createJewelry: (data) =>
  api.post('/api/jewelry', data).catch((error) => {
    throw new Error(`Ошибка создания подарка: ${error.response?.data?.message || error.message}`);
  }),

getTJewelry: () =>
  api.get('/api/jewelry').catch((error) => {
    throw new Error(`Ошибка получения списка подарков: ${error.response?.data?.message || error.message}`);
  }),

deleteJewelry: (id) =>
  api.delete(`/api/jewelry/${id}`).catch((error) => {
    throw new Error(`Ошибка удаления подарка: ${error.response?.data?.message || error.message}`);
  }),

getJewelryById: (id) =>
  api.get(`/api/jewelry/${id}`).catch((error) => {
    throw new Error(`Ошибка получения подарка: ${error.response?.data?.message || error.message}`);
  }),

updateJewelry: (id, data) =>
  api.put(`/api/jewelry/${id}`, data).catch((error) => {
    throw new Error(`Ошибка обновления подарка: ${error.response?.data?.message || error.message}`);
  }),







  // postGoodsData:(goodsData) => api.post(`/api/goods`, goodsData),

  // getGoods:(token) => api.get(`/api/goods`,  {
  //   headers: { Authorization: `Bearer ${token}` },
  // }),

  // getGoodById: (id) => api.get(`/api/goodbyid/${id}`),

  // updateGoodById:(id,data) => api.put(`/api/updategoodbyid/${id}`,data),

  //deleteGoodsById: (id) => api.delete(`/api/removegoodbyid/${id}`
  //   ,  {
  //   headers: { Authorization: `Bearer ${token}` },
  // }


  // Товары
  createGood: (data) =>
    api.post('/api/goods', data).catch((error) => {
      throw new Error(`Ошибка создания товара: ${error.response?.data?.message || error.message}`);
    }),

  getGoods: () =>
    api.get('/api/goods').catch((error) => {
      throw new Error(`Ошибка получения списка товаров: ${error.response?.data?.message || error.message}`);
    }),

  getGoodById: (id) =>
    api.get(`/api/goodbyid/${id}`).catch((error) => {
      throw new Error(`Ошибка получения товара: ${error.response?.data?.message || error.message}`);
    }),

  updateGoodById: (id, data) =>
    api.put(`/api/updategoodbyid/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления товара: ${error.response?.data?.message || error.message}`);
    }),

  deleteGoodsById: (id) =>
    api.delete(`/api/removegoodbyid/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления товара: ${error.response?.data?.message || error.message}`);
    }),

  // Удаление элементов (универсальный метод)
  deleteItem: (id, type) =>
    api.delete(`/${type}/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления элемента (${type}): ${error.response?.data?.message || error.message}`);
    }),

  // Свадьбы
  createWedding: (data) =>
    api.post('/api/weddings/addwedding', data).catch((error) => {
      throw new Error(`Ошибка создания свадьбы: ${error.response?.data?.message || error.message}`);
    }),

  getWedding: () =>
    api.get('/api/getallweddings').catch((error) => {
      throw new Error(`Ошибка получения свадеб: ${error.response?.data?.message || error.message}`);
    }),

  updateWedding: (id, data) =>
    api.put(`/api/updateweddingbyid/${id}`, data).catch((error) => {
      throw new Error(`Ошибка обновления свадьбы: ${error.response?.data?.message || error.message}`);
    }),

  deleteWedding: (id) =>
    api.delete(`/api/weddings/${id}`).catch((error) => {
      throw new Error(`Ошибка удаления свадьбы: ${error.response?.data?.message || error.message}`);
    }),

  getWeddinItems: (id) =>
    api.get(`/api/wedding-items/${id}`).catch((error) => {
      throw new Error(`Ошибка получения элементов свадьбы: ${error.response?.data?.message || error.message}`);
    }),

  // Список желаний
  createWish: (wishlistData) =>
    api.post('/api/wishlist', wishlistData).catch((error) => {
      throw new Error(`Ошибка создания желания: ${error.response?.data?.message || error.message}`);
    }),

  getWishlistByWeddingId: (weddingId) =>
    api.get(`/api/wishlist/${weddingId}`).catch((error) => {
      throw new Error(`Ошибка получения списка желаний: ${error.response?.data?.message || error.message}`);
    }),

  getWishlistByWeddingIdWithoutToken: (weddingId) =>
    api.get(`/api/wishlist/${weddingId}`).catch((error) => {
      throw new Error(`Ошибка получения списка желаний без токена: ${error.response?.data?.message || error.message}`);
    }),

  reserveWishlistItem: (id) =>
    api.patch(`/api/wishlist/${id}/reserve`, {}).catch((error) => {
      throw new Error(`Ошибка резервирования желания: ${error.response?.data?.message || error.message}`);
    }),

  reserveWishlistItemWithoutToken: (id, data) =>
    api.patch(`/api/wishlist/${id}/reservebyunknown`, { data }).catch((error) => {
      throw new Error(`Ошибка резервирования желания без токена: ${error.response?.data?.message || error.message}`);
    }),

  // Блокировка дат
  addDataBlockToRestaurant: (restaurantId, date) =>
    api
      .post('/api/block', {
        restaurantId,
        date: date.toISOString().split('T')[0],
      })
      .catch((error) => {
        throw new Error(`Ошибка блокировки даты ресторана: ${error.response?.data?.message || error.message}`);
      }),

  fetchBlockedDaysByResaurantId: (id) =>
    api.get(`/api/${id}/blocked-days`).catch((error) => {
      throw new Error(`Ошибка получения заблокированных дат: ${error.response?.data?.message || error.message}`);
    }),

  fetchAllBlockDays: () =>
    api.get('/api/all-blocked-days').catch((error) => {
      throw new Error(`Ошибка получения всех заблокированных дат: ${error.response?.data?.message || error.message}`);
    }),

  // Универсальный метод для получения данных
  fetchByEndpoint: (endpoint) =>
    api.get(endpoint).catch((error) => {
      throw new Error(`Ошибка получения данных по эндпоинту ${endpoint}: ${error.response?.data?.message || error.message}`);
    }),





};
