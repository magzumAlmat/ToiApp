// import React, { useEffect, useState,useCallback } from 'react';
// import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useSelector } from 'react-redux';
// import HomeScreen from '../screens/HomeScreen';
// import ItemEditScreen from '../screens/ItemEditScreen';
// import Item2Screen from '../screens/Item2Screen';
// import Item3Screen from '../screens/Item3Screen';
// import Item4Screen from '../screens/Item4Screen';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, SafeAreaView } from 'react-native';
// import DetailsScreen from '../screens/DetailsScreen';
// import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
// import * as Linking from 'expo-linking';
// import { Text } from 'react-native-paper';
// import AddItemModal from '../components/AddItemModal';
// import { useFocusEffect } from '@react-navigation/native';
// import SupplierContent from '../components/SupplierContent'

// import AsyncStorage from '@react-native-async-storage/async-storage';
// const SupplierScreen = ({ navigation }) => {
//     const [user, setUser] = useState(null);
//   const [data, setData] = useState({
//     restaurants: [],
//     clothing: [],
//     tamada: [],
//     programs: [],
//     traditionalGifts: [],
//     flowers: [],
//     cakes: [],
//     alcohol: [],
//     transport: [],
//     goods: [],
//   });
//   const [filteredData, setFilteredData] = useState([]);
//   const [budget, setBudget] = useState('');
//   const [guestCount, setGuestCount] = useState('');
//   const [remainingBudget, setRemainingBudget] = useState(0);
//   const [priceFilter, setPriceFilter] = useState('average');
//   const [budgetModalVisible, setBudgetModalVisible] = useState(false);
//   const [addItemModalVisible, setAddItemModalVisible] = useState(false);
//   const [weddingModalVisible, setWeddingModalVisible] = useState(false);
//   const [warningModalVisible, setWarningModalVisible] = useState(false);
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [newGoodModalVisible, setNewGoodModalVisible] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [newGoodName, setNewGoodName] = useState('');
//   const [newGoodCost, setNewGoodCost] = useState('');
//   const [weddingName, setWeddingName] = useState('');
//   const [weddingDate, setWeddingDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [blockedDays, setBlockedDays] = useState({});
//   const [quantities, setQuantities] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedRestaurant, setSelectedRestaurant] = useState(null);
//   const [tempRestaurantId, setTempRestaurantId] = useState(null);
//   const [showRestaurantModal, setShowRestaurantModal] = useState(false);
//   const [showCalendarModal, setShowCalendarModal] = useState(false);
//   const [showCalendarModal2, setShowCalendarModal2] = useState(false);
//   const [occupiedRestaurants, setOccupiedRestaurants] = useState([]);


//   useFocusEffect(
//     useCallback(() => {
//       const loadUserData = async () => {
//         try {
//           const storedUser = await AsyncStorage.getItem('user');
//           if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             const fetchedData = await fetchData();
//             setData(fetchedData);

//             const blocked = {};
//             fetchedData.restaurants.forEach((restaurant) => {
//               if (restaurant.blocked_days) {
//                 restaurant.blocked_days.forEach((date) => {
//                   if (!blocked[date]) {
//                     blocked[date] = { dots: [] };
//                   }
//                   blocked[date].dots.push({
//                     restaurantId: restaurant.id,
//                     restaurantName: restaurant.name,
//                     color: COLORS.error,
//                   });
//                 });
//               }
//             });
//             setBlockedDays(blocked);
//           } else {
//             navigation.replace('Login');
//           }
//         } catch (error) {
//           console.error('Ошибка при загрузке данных:', error);
//           Alert.alert('Ошибка', 'Не удалось загрузить данные. Попробуйте снова.');
//         } finally {
//           setLoading(false);
//         }
//       };
//       loadUserData();
//     }, [navigation])
//   );


//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/data'); // Adjust endpoint as needed
//       if (response.ok) {
//         return await response.json();
//       } else {
//         throw new Error('Failed to fetch data');
//       }
//     } catch (error) {
//       console.error('Fetch data error:', error);
//       throw error;
//     }
//   };


//   const handleBudgetChange = (value) => setBudget(value);
//   const handleGuestCountChange = (value) => setGuestCount(value);

//   const filterDataByBudget = () => {
//     if (!budget || isNaN(budget)) {
//       Alert.alert('Ошибка', 'Пожалуйста, введите корректный бюджет');
//       return;
//     }

//     const budgetNum = parseFloat(budget);
//     let filtered = [];

//     const addItemToFiltered = (item, type, costField) => {
//       const cost = item[costField];
//       if (type === 'restaurant' && guestCount && item.capacity < parseInt(guestCount)) {
//         return;
//       }
//       if (priceFilter === 'min' && cost <= budgetNum * 0.3) {
//         filtered.push({ ...item, type, totalCost: cost });
//       } else if (priceFilter === 'average' && cost <= budgetNum * 0.6) {
//         filtered.push({ ...item, type, totalCost: cost });
//       } else if (priceFilter === 'max' && cost <= budgetNum) {
//         filtered.push({ ...item, type, totalCost: cost });
//       }
//     };

//     Object.keys(data).forEach((key) => {
//       const typeMap = {
//         restaurants: { type: 'restaurant', costField: 'averageCost' },
//         clothing: { type: 'clothing', costField: 'cost' },
//         tamada: { type: 'tamada', costField: 'cost' },
//         programs: { type: 'program', costField: 'cost' },
//         traditionalGifts: { type: 'traditionalGift', costField: 'cost' },
//         flowers: { type: 'flowers', costField: 'cost' },
//         cakes: { type: 'cake', costField: 'cost' },
//         alcohol: { type: 'alcohol', costField: 'cost' },
//         transport: { type: 'transport', costField: 'cost' },
//         goods: { type: 'goods', costField: 'cost' },
//       };
//       if (typeMap[key]) {
//         data[key].forEach((item) => addItemToFiltered(item, typeMap[key].type, typeMap[key].costField));
//       }
//     });

//     setFilteredData(filtered);
//     setRemainingBudget(
//       budgetNum - filtered.reduce((sum, item) => sum + (item.totalCost || item.cost || 0), 0)
//     );
//     setBudgetModalVisible(false);
//   };

//   const handleQuantityChange = (itemKey, value) => {
//     setQuantities((prev) => {
//       const newQuantities = { ...prev, [itemKey]: value };
//       const totalCost = filteredData.reduce((sum, item) => {
//         const key = `${item.type}-${item.id}`;
//         const quantity = parseInt(newQuantities[key] || 1);
//         const cost = item.totalCost || item.cost || 0;
//         return sum + (isNaN(quantity) ? cost : quantity * cost);
//       }, 0);
//       setRemainingBudget(parseFloat(budget) - totalCost);
//       return newQuantities;
//     });
//   };

//   const handleAddItem = (item) => {
//     setFilteredData((prev) => {
//       const newData = [...prev, { ...item, type: item.type, totalCost: item.cost || item.averageCost }];
//       const totalCost = newData.reduce((sum, item) => {
//         const key = `${item.type}-${item.id}`;
//         const quantity = parseInt(quantities[key] || 1);
//         const cost = item.totalCost || item.cost || 0;
//         return sum + (isNaN(quantity) ? cost : quantity * cost);
//       }, 0);
//       setRemainingBudget(parseFloat(budget) - totalCost);
//       return newData;
//     });
//     setAddItemModalVisible(false);
//   };

//   const handleRemoveItem = (itemKey) => {
//     setFilteredData((prev) => {
//       const newData = prev.filter((item) => `${item.type}-${item.id}` !== itemKey);
//       const totalCost = newData.reduce((sum, item) => {
//         const key = `${item.type}-${item.id}`;
//         const quantity = parseInt(quantities[key] || 1);
//         const cost = item.totalCost || item.cost || 0;
//         return sum + (isNaN(quantity) ? cost : quantity * cost);
//       }, 0);
//       setRemainingBudget(parseFloat(budget) - totalCost);
//       return newData;
//     });
//     setQuantities((prev) => {
//       const newQuantities = { ...prev };
//       delete newQuantities[itemKey];
//       return newQuantities;
//     });
//   };

//   const handleCreateGood = async () => {
//     if (!newGoodName || !newGoodCost) {
//       Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
//       return;
//     }
//     try {
//       const newGood = {
//         item_name: newGoodName,
//         cost: parseFloat(newGoodCost),
//         supplier_id: user.id,
//         category: 'Прочее',
//       };
//       const response = await fetch('http://192.168.1.104:3000/goods', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newGood),
//       });
//       if (response.ok) {
//         const createdGood = await response.json();
//         setData((prev) => ({
//           ...prev,
//           goods: [...prev.goods, createdGood],
//         }));
//         setNewGoodName('');
//         setNewGoodCost('');
//         setNewGoodModalVisible(false);
//         Alert.alert('Успех', 'Товар успешно создан');
//       } else {
//         Alert.alert('Ошибка', 'Не удалось создать товар');
//       }
//     } catch (error) {
//       console.error('Ошибка при создании товара:', error);
//       Alert.alert('Ошибка', 'Произошла ошибка при создании товара');
//     }
//   };

//   const handleEditItem = (id, type) => {
//     navigation.navigate('EditItem', { id, type });
//   };

//   const handleDeleteItem = async () => {
//     if (!itemToDelete) return;
//     const { id, type } = itemToDelete;
//     try {
//       const typeMap = {
//         restaurant: 'restaurants',
//         clothing: 'clothing',
//         tamada: 'tamada',
//         program: 'programs',
//         traditionalGift: 'traditionalGifts',
//         flowers: 'flowers',
//         cake: 'cakes',
//         alcohol: 'alcohol',
//         transport: 'transport',
//         goods: 'goods',
//       };
//       const endpoint = typeMap[type];
//       if (!endpoint) {
//         Alert.alert('Ошибка', 'Неверный тип объекта');
//         return;
//       }
//       const response = await fetch(`http://192.168.1.104:3000/${endpoint}/${id}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         setData((prev) => ({
//           ...prev,
//           [endpoint]: prev[endpoint].filter((item) => item.id !== id),
//         }));
//         setDeleteModalVisible(false);
//         setItemToDelete(null);
//         Alert.alert('Успех', 'Объект успешно удален');
//       } else {
//         Alert.alert('Ошибка', 'Не удалось удалить объект');
//       }
//     } catch (error) {
//       console.error('Ошибка при удалении объекта:', error);
//       Alert.alert('Ошибка', 'Произошла ошибка при удалении объекта');
//     }
//   };

//   const handleSelectRestaurant = () => {
//     const restaurant = data.restaurants.find((r) => r.id === tempRestaurantId);
//     if (restaurant) {
//       setSelectedRestaurant(restaurant);
//       setShowRestaurantModal(false);
//       setShowCalendarModal(true);
//     } else {
//       Alert.alert('Ошибка', 'Пожалуйста, выберите ресторан');
//     }
//   };

//   const onDateChange = (day) => {
//     const selected = new Date(day.timestamp);
//     const dateString = selected.toISOString().split('T')[0];
//     if (blockedDays[dateString]?.dots?.some((dot) => dot.restaurantId === selectedRestaurant?.id)) {
//       setWarningModalVisible(true);
//     } else {
//       setWeddingDate(selected);
//       setShowDatePicker(false);
//     }
//   };

//   const handleCreateWedding = async () => {
//     if (!weddingName || !weddingDate || filteredData.length === 0) {
//       Alert.alert('Ошибка', 'Заполните все поля и выберите элементы для свадьбы');
//       return;
//     }

//     const dateString = weddingDate.toISOString().split('T')[0];
//     const isBlocked = blockedDays[dateString]?.dots?.some(
//       (dot) => dot.restaurantId === filteredData.find((item) => item.type === 'restaurant')?.id
//     );

//     if (isBlocked) {
//       setWarningModalVisible(true);
//       return;
//     }

//     try {
//       const weddingData = {
//         user_id: user.id,
//         name: weddingName,
//         date: weddingDate.toISOString().split('T')[0],
//         items: filteredData.map((item) => ({
//           type: item.type,
//           id: item.id,
//           quantity: parseInt(quantities[`${item.type}-${item.id}`] || 1),
//           totalCost: item.totalCost || item.cost || item.averageCost,
//         })),
//       };
//       const response = await createWedding(weddingData);
//       if (response.ok) {
//         Alert.alert('Успех', 'Свадьба успешно создана');
//         setWeddingModalVisible(false);
//         setWeddingName('');
//         setWeddingDate(new Date());
//         setFilteredData([]);
//         setQuantities({});
//         setBudget('');
//         setGuestCount('');
//         setRemainingBudget(0);
//       } else {
//         Alert.alert('Ошибка', 'Не удалось создать свадьбу');
//       }
//     } catch (error) {
//       console.error('Ошибка при создании свадьбы:', error);
//       Alert.alert('Ошибка', 'Произошла ошибка при создании свадьбы');
//     }
//   };

//   const handleBlockRestaurantDay = async (restaurantId, date) => {
//     try {
//       const response = await blockRestaurantDay(restaurantId, date.toISOString().split('T')[0]);
//       if (response.ok) {
//         const updatedBlockedDays = { ...blockedDays };
//         const dateString = date.toISOString().split('T')[0];
//         if (!updatedBlockedDays[dateString]) {
//           updatedBlockedDays[dateString] = { dots: [] };
//         }
//         updatedBlockedDays[dateString].dots.push({
//           restaurantId,
//           restaurantName: selectedRestaurant.name,
//           color: COLORS.error,
//         });
//         setBlockedDays(updatedBlockedDays);
//         Alert.alert('Успех', 'Дата успешно забронирована');
//       } else {
//         Alert.alert('Ошибка', 'Не удалось забронировать дату');
//       }
//     } catch (error) {
//       console.error('Ошибка при бронировании даты:', error);
//       Alert.alert('Ошибка', 'Произошла ошибка при бронировании даты');
//     }
//   };







//   return (
//     <>

//         <View style={{ marginTop: "20%" }}>
       

//         </View>

//     </>
//   );
// };
// export default SupplierScreen;



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api'
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#FF6F61',
  secondary: '#4A90E2',
  background: '#FDFDFD',
  card: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  accent: '#FBBF24',
  shadow: 'rgba(0, 0, 0, 0.1)',
  error: '#FF0000',
};

export default function SupplierScreen({ navigation }) {

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    restaurants: [],
    clothing: [],
    tamada: [],
    programs: [],
    traditionalGifts: [],
    flowers: [],
    cakes: [],
    alcohol: [],
    transport: [],
    goods: [],
    jewelry: [], // Добавляем jewelry
  });
  const [loading, setLoading] = useState(false);
  const [newGoodModalVisible, setNewGoodModalVisible] = useState(false);
  const [newGoodName, setNewGoodName] = useState('');
  const [newGoodCost, setNewGoodCost] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // const fetchData = async () => {
  //   if (!token || !user?.id || user?.roleId !== 2) return;
  //   setLoading(true);
  //   try {
  //     const responses = await Promise.all([
  //       api.getRestaurans,
  //       api.getAllClothing,
  //       api.getAllTamada,
  //       api.getAllPrograms,
  //       api.getAllTraditionalGifts,
  //       api.getAllFlowers,
  //       api.getAllCakes,
  //       api.getAllAlcohol,
  //       api.getAllTransport,
  //       api.getGoods(token),
  //     ]);
  
  //     // Логирование ответов для отладки
  //     console.log('API responses:', responses);
  
  //     const userData = responses.map((response, index) => {
  //       if (!response || !response.data) {
  //         console.warn(`Response ${index} is invalid or has no data:`, response);
  //         return []; // Возвращаем пустой массив, если response.data отсутствует
  //       }
  //       return response.data.filter((item) => item.supplier_id === user.id) || [];
  //     });
  
  //     const newData = {
  //       restaurants: userData[0] || [],
  //       clothing: userData[1] || [],
  //       tamada: userData[2] || [],
  //       programs: userData[3] || [],
  //       traditionalGifts: userData[4] || [],
  //       flowers: userData[5] || [],
  //       cakes: userData[6] || [],
  //       alcohol: userData[7] || [],
  //       transport: userData[8] || [],
  //       goods: userData[9] || [],
  //     };
  //     setData(newData);
  //   } catch (error) {
  //     console.error('Ошибка загрузки данных:', error);
  //     alert('Ошибка загрузки данных: ' + (error.response?.data?.message || error.message));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    console.log('fetchData: user=', user, 'token=', token);
    if (!token || !user?.id || user?.roleId !== 2) {
      console.warn('Missing token or user data, skipping fetch');
      return;
    }
    setLoading(true);
    try {
      const responses = await Promise.allSettled([
        api.getRestaurants(),
        api.getClothing(),
        api.getTamada(),
        api.getPrograms(),
        api.getTraditionalGifts(),
        api.getFlowers(),
        api.getCakes(),
        api.getAlcohol(),
        api.getTransport(),
        api.getGoods(token),
      ]);
  
      console.log('API responses:', responses);
  
      const userData = responses.map((result, index) => {
        if (result.status === 'fulfilled' && result.value?.data) {
          console.log(`Response ${index} data:`, result.value.data);
          return (
            result.value.data.filter((item) => {
              const supplierId = item.supplier_id || item.supplierId || item.user_id;
              return supplierId === user.id;
            }) || []
          );
        }
        console.warn(`Request ${index} failed or has no data:`, result);
        return [];
      });
  
      const newData = {
        restaurants: userData[0] || [],
        clothing: userData[1] || [],
        tamada: userData[2] || [],
        programs: userData[3] || [],
        traditionalGifts: userData[4] || [],
        flowers: userData[5] || [],
        cakes: userData[6] || [],
        alcohol: userData[7] || [],
        transport: userData[8] || [],
        goods: userData[9] || [],
      };
      console.log('Processed data:', newData);
      setData(newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Ошибка загрузки данных: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    if (!token || user?.roleId !== 2) {
      navigation.navigate('Login');
    } else {
      fetchData();
    }
  }, [token, user, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handleEditItem = (id, type) => {
    navigation.navigate('ItemEdit', { id, type });
  };

  const confirmDeleteItem = (id, type) => {
    setItemToDelete({ id, type });
    setDeleteModalVisible(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case 'restaurant':
          await api.deleteRestaurant(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            restaurants: prev.restaurants.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'clothing':
          await api.deleteClothing(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            clothing: prev.clothing.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'tamada':
          await api.deleteTamada(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            tamada: prev.tamada.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'program':
          await api.deleteProgram(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            programs: prev.programs.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'traditionalGift':
          await api.deleteTraditionalGift(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            traditionalGifts: prev.traditionalGifts.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'flowers':
          await api.deleteFlowers(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            flowers: prev.flowers.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'cake':
          await api.deleteCake(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            cakes: prev.cakes.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'alcohol':
          await api.deleteAlcohol(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            alcohol: prev.alcohol.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'transport':
          await api.deleteTransport(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            transport: prev.transport.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'goods':
          await api.deleteGoodsById(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            goods: prev.goods.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        default:
          throw new Error('Неизвестный тип объекта');
      }
      alert('Объект успешно удален');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleCreateGood = async () => {
    if (!newGoodName || !newGoodCost) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const goodData = {
      item_name: newGoodName,
      cost: parseFloat(newGoodCost),
      supplier_id: user.id,
    };

    try {
      const response = await api.postGoodsData(goodData);
      setData((prev) => ({
        ...prev,
        goods: [...prev.goods, response.data],
      }));
      setNewGoodModalVisible(false);
      setNewGoodName('');
      setNewGoodCost('');
      alert('Товар успешно создан');
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  const renderItem = ({ item }) => {
    let content;
    switch (item.type) {
      case 'restaurant':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ресторан</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDetail}>Вместимость: {item.capacity}</Text>
            <Text style={styles.cardDetail}>Кухня: {item.cuisine}</Text>
            <Text style={styles.cardDetail}>Средний чек: {item.averageCost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address || 'Не указан'}</Text>
          </View>
        );
        break;
      case 'clothing':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Одежда</Text>
            <Text style={styles.cardTitle}>{item.storeName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Пол: {item.gender}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'flowers':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Цветы</Text>
            <Text style={styles.cardTitle}>{item.salonName}</Text>
            <Text style={styles.cardDetail}>Цветы: {item.flowerName}</Text>
            <Text style={styles.cardDetail}>Тип: {item.flowerType}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'cake':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Торты</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDetail}>Тип торта: {item.cakeType}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'alcohol':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Алкоголь</Text>
            <Text style={styles.cardTitle}>{item.salonName}</Text>
            <Text style={styles.cardDetail}>Напиток: {item.alcoholName}</Text>
            <Text style={styles.cardDetail}>Категория: {item.category}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'program':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Программы</Text>
            <Text style={styles.cardTitle}>{item.teamName}</Text>
            <Text style={styles.cardDetail}>Тип: {item.type}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'tamada':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Тамада</Text>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDetail}>Портфолио: {item.portfolio}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'traditionalGift':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Традиционные подарки</Text>
            <Text style={styles.cardTitle}>{item.salonName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Тип: {item.type}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'transport':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Транспорт</Text>
            <Text style={styles.cardTitle}>{item.salonName}</Text>
            <Text style={styles.cardDetail}>Авто: {item.carName}</Text>
            <Text style={styles.cardDetail}>Марка: {item.brand}</Text>
            <Text style={styles.cardDetail}>Цвет: {item.color}</Text>
            <Text style={styles.cardDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.cardDetail}>Район: {item.district}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.cardDetail}>Адрес: {item.address}</Text>
          </View>
        );
        break;
      case 'goods':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Товар</Text>
            <Text style={styles.cardTitle}>{item.item_name}</Text>
            <Text style={styles.cardDetail}>Описание: {item.description || 'Не указано'}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      default:
        content = <Text style={styles.cardTitle}>Неизвестный тип: {item.type}</Text>;
    }

    return (
      <View style={styles.card}>
        {content}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditItem(item.id, item.type)}>
            <Icon name="edit" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteItem(item.id, item.type)}>
            <Icon name="delete" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSupplierContent = () => {
    const userId = user.id;
    const combinedData = [
      ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
      ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
      ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
      ...data.programs.map((item) => ({ ...item, type: 'program' })),
      ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
      ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
      ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
      ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
      ...data.transport.map((item) => ({ ...item, type: 'transport' })),
      ...data.goods.map((item) => ({ ...item, type: 'goods' })),
    ].filter((item) => item.supplier_id === userId);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.supplierContainer}>
          {/* <TouchableOpacity
            style={styles.createButton}
            onPress={() => setNewGoodModalVisible(true)}
          >
            <Text style={styles.createButtonText}>Добавить товар</Text>
          </TouchableOpacity> */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка данных...</Text>
            </View>
          ) : combinedData.length > 0 ? (
            <FlatList
              data={combinedData}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="business" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>У вас пока нет объектов</Text>
            </View>
          )}
          <Modal visible={deleteModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
                <Text style={styles.modalTitle}>Подтверждение удаления</Text>
                <Text style={styles.modalText}>
                  Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setDeleteModalVisible(false);
                      setItemToDelete(null);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleDeleteItem}
                  >
                    <Text style={styles.modalButtonText}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
          </Modal>
          <Modal visible={newGoodModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
                <Text style={styles.modalTitle}>Добавить новый товар</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Название товара"
                  value={newGoodName}
                  onChangeText={setNewGoodName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Стоимость (₸)"
                  value={newGoodCost}
                  onChangeText={setNewGoodCost}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setNewGoodModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleCreateGood}
                  >
                    <Text style={styles.modalButtonText}>Создать</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  };

  return <SafeAreaView style={styles.container}>{renderSupplierContent()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
});