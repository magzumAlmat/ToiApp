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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';
import * as ExpoCalendar from 'expo-calendar';
import SwitchSelector from 'react-native-switch-selector';
import { Picker } from '@react-native-picker/picker';

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

export default function HomeScreen({ navigation }) {
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
  });
  const [filteredData, setFilteredData] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [remainingBudget, setRemainingBudget] = useState(0);

  const [loading, setLoading] = useState(false);

  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [weddingName, setWeddingName] = useState('');
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newGoodModalVisible, setNewGoodModalVisible] = useState(false);
  const [newGoodName, setNewGoodName] = useState('');
  const [newGoodCost, setNewGoodCost] = useState('');
  const [priceFilter, setPriceFilter] = useState('average');
  const [blockedDays, setBlockedDays] = useState({}); // Добавляем состояние для заблокированных дней
  const [showWarningModal, setShowWarningModal] = useState(false); // Модальное окно предупреждения
  const [occupiedRestaurants, setOccupiedRestaurants] = useState([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  // Цвета для каждого ресторана
  const restaurantColors = {
    1: '#FF6B6B', // Красный
    2: '#4ECDC4', // Бирюзовый
    3: '#45B7D1', // Голубой
    4: '#96CEB4', // Зеленый
    5: '#FFEEAD', // Желтый
  };

  // Функция загрузки заблокированных дней для всех ресторанов
  const fetchAllBlockedDays = async () => {
    try {
      const response = await api.fetchAllBlockDays();
      const blockedDays = {};
  
      // Предполагаемый формат ответа: [{ date: "2025-03-28", restaurantId: 1, restaurantName: "Уютный дом" }, ...]
      response.data.forEach((entry) => {
        const { date, restaurantId, restaurantName } = entry;
  
        // Если дата еще не существует в blockedDays, создаем массив
        if (!blockedDays[date]) {
          blockedDays[date] = {
            marked: true,
            dots: [],
          };
        }
  
        // Добавляем ресторан в массив dots
        blockedDays[date].dots.push({
          restaurantId,
          restaurantName,
          color: restaurantColors[restaurantId] || '#CCCCCC',
        });
      });
  
      setBlockedDays(blockedDays);
      console.log('Fetched blocked days:', blockedDays);
    } catch (error) {
      console.error('Ошибка загрузки заблокированных дней:', error);
    }
  };

  // Загружаем заблокированные дни при изменении данных ресторанов
  useEffect(() => {
    if (data?.restaurants?.length > 0) {
      fetchAllBlockedDays();
    }
  }, [data.restaurants,occupiedRestaurants]);

  const getCalendarPermissions = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') return false;
    return true;
  };

  const fetchData = async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    try {
      const responses = await Promise.all([
        api.getRestaurans(),
        api.getAllClothing(),
        api.getAllTamada(),
        api.getAllPrograms(),
        api.getAllTraditionalGifts(),
        api.getAllFlowers(),
        api.getAllCakes(),
        api.getAllAlcohol(),
        api.getAllTransport(),
        api.getGoods(token),
      ]);

      const userData = responses.map((response, index) =>
        user.roleId === 2 && index < 9
          ? response.data.filter((item) => item.supplier_id === user.id)
          : response.data
      );

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
      setData(newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigation.navigate('Login');
    else fetchData();
  }, [token, user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, token, user]);

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
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  const filterDataByBudget = () => {
    console.log('=== filterDataByBudget started ===');
    console.log('Budget:', budget, 'Guest Count:', guestCount, 'Price Filter:', priceFilter);

    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      console.log('Invalid budget');
      alert('Пожалуйста, введите корректную сумму бюджета');
      return;
    }
    if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
      console.log('Invalid guest count');
      alert('Пожалуйста, введите корректное количество гостей');
      return;
    }

    const budgetValue = parseFloat(budget);
    const guests = parseFloat(guestCount);
    let remaining = budgetValue;
    const selectedItems = [];

    console.log('Filtering restaurants...');
    const suitableRestaurants = data.restaurants.filter(
      (restaurant) => parseFloat(restaurant.capacity) >= guests
    );
    console.log('Suitable Restaurants:', suitableRestaurants.map(r => ({ name: r.name, capacity: r.capacity, averageCost: r.averageCost })));

    if (suitableRestaurants.length === 0) {
      console.log('No suitable restaurants found');
      alert('Нет ресторанов с достаточной вместимостью');
      return;
    }

    const sortedRestaurants = suitableRestaurants
      .filter(r => parseFloat(r.averageCost) <= remaining)
      .sort((a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost));

    if (sortedRestaurants.length === 0) {
      console.log('No affordable restaurants found');
      alert('Нет ресторанов, подходящих под ваш бюджет');
      return;
    }

    let selectedRestaurant;
    if (priceFilter === 'min') {
      selectedRestaurant = sortedRestaurants[0];
    } else if (priceFilter === 'max') {
      selectedRestaurant = sortedRestaurants[sortedRestaurants.length - 1];
    } else {
      selectedRestaurant = sortedRestaurants[Math.floor(sortedRestaurants.length / 2)];
    }

    const restaurantCost = parseFloat(selectedRestaurant.averageCost);
    console.log(`Selected Restaurant:`, { name: selectedRestaurant.name, cost: restaurantCost });

    selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
    remaining -= restaurantCost;
    console.log('Restaurant added. Remaining budget:', remaining);

    const types = [
      { key: 'clothing', costField: 'cost', type: 'clothing' },
      { key: 'tamada', costField: 'cost', type: 'tamada' },
      { key: 'programs', costField: 'cost', type: 'program' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
      { key: 'flowers', costField: 'cost', type: 'flowers' },
      { key: 'cakes', costField: 'cost', type: 'cake' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol' },
      { key: 'transport', costField: 'cost', type: 'transport' },
    ];

    for (const { key, costField, type } of types) {
      console.log(`Filtering ${type}...`);
      const items = data[key]
        .filter(item => parseFloat(item[costField]) <= remaining);

      console.log(`${type} items:`, items.map(i => ({ name: i.name || i.item_name || i.teamName || i.salonName, cost: i[costField] })));

      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));
        let selectedItem;

        if (priceFilter === 'min') {
          selectedItem = sortedItems[0];
        } else if (priceFilter === 'max') {
          selectedItem = sortedItems[sortedItems.length - 1];
        } else {
          selectedItem = sortedItems[Math.floor(sortedItems.length / 2)];
        }

        const cost = parseFloat(selectedItem[costField]);
        console.log(`Selected ${type}:`, { name: selectedItem.name || selectedItem.item_name || selectedItem.teamName || selectedItem.salonName, cost });

        selectedItems.push({ ...selectedItem, type, totalCost: cost });
        remaining -= cost;
        console.log(`${type} added. Remaining budget:`, remaining);
      } else {
        console.log(`No affordable items found for ${type}`);
      }
    }

    console.log('Selected Items:', selectedItems.map(i => ({ type: i.type, name: i.name || i.item_name || i.teamName || i.salonName, totalCost: i.totalCost })));
    console.log('Remaining Budget:', remaining);
    setFilteredData(selectedItems);
    setRemainingBudget(remaining);
    setQuantities(selectedItems.reduce((acc, item) => ({ ...acc, [`${item.type}-${item.id}`]: '1' }), {}));
    setBudgetModalVisible(false);
    console.log('=== filterDataByBudget completed ===');
  };

  useEffect(() => {
    if (budget && guestCount) {
      filterDataByBudget();
    }
  }, [priceFilter, budget, guestCount]);

  const handleQuantityChange = (itemKey, value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setQuantities((prev) => ({ ...prev, [itemKey]: filteredValue }));
      const quantity = filteredValue === '' ? 0 : parseFloat(filteredValue);

      const updatedFilteredData = filteredData.map((item) => {
        const key = `${item.type}-${item.id}`;
        if (key === itemKey) {
          const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
          const totalCost = isNaN(quantity) || quantity > 1000 ? 0 : cost * quantity;
          return { ...item, totalCost };
        }
        return item;
      });
      setFilteredData(updatedFilteredData);

      const totalSpent = updatedFilteredData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      setRemainingBudget(parseFloat(budget) - totalSpent);
    }
  };

  const handleBudgetChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setBudget(filteredValue);
    }
  };

  const handleGuestCountChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setGuestCount(filteredValue);
    }
  };

  const handleAddItem = (item) => {
    const newItem = { ...item, totalCost: item.type === 'restaurant' ? item.averageCost : item.cost };
    setFilteredData((prev) => [...prev, newItem]);
    setQuantities((prev) => ({ ...prev, [`${item.type}-${item.id}`]: '1' }));
    const totalSpent = [...filteredData, newItem].reduce((sum, item) => sum + (item.totalCost || 0), 0);
    setRemainingBudget(parseFloat(budget) - totalSpent);
    setAddItemModalVisible(false);
  };

  const handleRemoveItem = (itemKey) => {
    const updatedFilteredData = filteredData.filter(
      (item) => `${item.type}-${item.id}` !== itemKey
    );
    setFilteredData(updatedFilteredData);

    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[itemKey];
      return newQuantities;
    });

    const totalSpent = updatedFilteredData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    setRemainingBudget(parseFloat(budget) - totalSpent);
  };

  const renderItem = ({ item }) => {
    const itemKey = `${item.type}-${item.id}`;
    const quantity = quantities[itemKey] || '1';
    const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
    const totalCost = item.totalCost || cost;

    let content;
    switch (item.type) {
      case 'restaurant':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ресторан - {item.name}</Text>
            {/* <Text style={styles.cardTitle}>{item.name}</Text> */}
            <Text style={styles.cardDetail}>Вместимость: {item.capacity}</Text>
            {/* <Text style={styles.cardDetail}>Кухня: {item.cuisine}</Text> */}
            <Text style={styles.cardDetail}>Средний чек: {item.averageCost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address || 'Не указан'}</Text> */}
          </View>
        );
        break;
      case 'clothing':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Одежда - {item.storeName}</Text>
            {/* <Text style={styles.cardTitle}>{item.storeName}</Text> */}
            {/* <Text style={styles.cardDetail}>Товар: {item.itemName}</Text> */}
            {/* <Text style={styles.cardDetail}>Пол: {item.gender}</Text> */}
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address}</Text> */}
          </View>
        );
        break;
      case 'flowers':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Салон цветов - {item.salonName}</Text>
            {/* <Text style={styles.cardTitle}>{item.salonName}</Text> */}
            <Text style={styles.cardDetail}>Цветы: {item.flowerName}</Text>
            {/* <Text style={styles.cardDetail}>Тип: {item.flowerType}</Text> */}
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address}</Text> */}
          </View>
        );
        break;
      case 'cake':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Кондитерская - {item.name} </Text>
            {/* <Text style={styles.cardTitle}>{item.name}</Text> */}
            <Text style={styles.cardDetail}>Тип торта: {item.cakeType}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address}</Text> */}
          </View>
        );
        break;
      case 'alcohol':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Алкогольный магазин - {item.salonName} </Text>
            {/* <Text style={styles.cardTitle}>{item.salonName}</Text> */}
            <Text style={styles.cardDetail}>Напиток: {item.alcoholName}</Text>
            {/* <Text style={styles.cardDetail}>Категория: {item.category}</Text> */}
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address}</Text> */}
          </View>
        );
        break;
      case 'program':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Программа - {item.teamName}</Text>
            {/* <Text style={styles.cardTitle}>{item.teamName}</Text> */}
            <Text style={styles.cardDetail}>Тип: {item.type}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'tamada':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Тамада {item.name}</Text>
            {/* <Text style={styles.cardTitle}></Text> */}
            {/* <Text style={styles.cardDetail}>Портфолио: {item.portfolio}</Text> */}
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'traditionalGift':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Традиционные подарки - {item.salonName}</Text>
            {/* <Text style={styles.cardTitle}>{item.salonName}</Text> */}
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            {/* <Text style={styles.cardDetail}>Тип: {item.type}</Text> */}
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
            {/* <Text style={styles.cardDetail}>Адрес: {item.address}</Text> */}
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
            <Text style={styles.cardTitle}>Товар - {item.item_name}</Text>
            {/* <Text style={styles.cardTitle}></Text> */}
            {/* <Text style={styles.cardDetail}>Описание: {item.description} </Text> */}
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
        {user?.roleId === 3 && (
          <>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(itemKey)}
            >
              <Icon name="close" size={20} color={COLORS.error} />
            </TouchableOpacity>
            <View style={styles.cardFooter}>
              <TextInput
                style={styles.quantityInput}
                placeholder="Кол-во"
                value={quantities[itemKey] || ''}
                
                onChangeText={(value) => handleQuantityChange(itemKey, value)}
                keyboardType="numeric"
              />
              <Text style={styles.totalCost}>Итого: {totalCost} ₸</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Details', { item })}
              >
                <Button style={styles.detailsButtonText}>Подробнее</Button>
              </TouchableOpacity>
            </View>
          </>
        )}
        {user?.roleId === 2 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleEditItem(item.id, item.type)}>
              <Icon name="edit" size={20} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteItem(item.id, item.type)}>
              <Icon name="delete" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderAddItem = ({ item }) => {
    const isSelected = filteredData.some(
      (selectedItem) => `${selectedItem.type}-${selectedItem.id}` === `${item.type}-${item.id}`
    );

    if (isSelected) return null;
    if (item.type === 'goods' && item.category === 'Прочее') return null;

    const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
    let title;
    switch (item.type) {
      case 'restaurant':
        title = `Ресторан: ${item.name} (${cost} ₸)`;
        break;
      case 'clothing':
        title = `Одежда: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
        break;
      case 'flowers':
        title = `Цветы: ${item.salonName} - ${item.flowerName} (${cost} ₸)`;
        break;
      case 'cake':
        title = `Торты: ${item.name} (${cost} ₸)`;
        break;
      case 'alcohol':
        title = `Алкоголь: ${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
        break;
      case 'program':
        title = `Программа: ${item.teamName} (${cost} ₸)`;
    
      case 'tamada':
        title = `Тамада: ${item.name} (${cost} ₸)`;
        break;
      case 'traditionalGift':
        title = `Традиц. подарки: ${item.salonName} - ${item.itemName} (${cost} ₸)`;
        break;
      case 'transport':
        title = `Транспорт: ${item.salonName} - ${item.carName} (${cost} ₸)`;
        break;
      case 'goods':
        title = `Товар: ${item.item_name} (${cost} ₸)`;
        break;
      default:
        title = 'Неизвестный элемент';
    }

    return (
      <TouchableOpacity style={styles.addItemCard} onPress={() => handleAddItem(item)}>
        <Text style={styles.addItemText}>{title}</Text>
      </TouchableOpacity>
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка данных...</Text>
            </View>
          ) : combinedData.length > 0 ? (
            <>
              <FlatList
                data={combinedData}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </>
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

  const createEvent = () => {
    console.log('CreateEvent currentUserId=', user?.id);
    console.log('CreateEvent all Selected data=', filteredData);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!weddingName) {
      alert('Пожалуйста, заполните имя свадьбы');
      return;
    }

    const dateString = weddingDate.toISOString().split('T')[0];
    const selectedRestaurant = filteredData.find(item => item.type === 'restaurant');
    if (selectedRestaurant && blockedDays[dateString]) {
      setShowWarningModal(true); // Показываем предупреждение, если ресторан забронирован
      return;
    }

    if (!user?.id || !token) {
      alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
      navigation.navigate('Login');
      return;
    }

    const weddingData = {
      name: weddingName,
      date: dateString,
      host_id: user.id,
      items: filteredData.map((item) => ({
        id: item.id,
        type: item.type,
        totalCost: parseFloat(item.totalCost || item.cost),
      })),
    };

    try {
      const response = await api.createWedding(weddingData, token);
      const hasPermission = await getCalendarPermissions();
      if (hasPermission) {
        const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
        const eventDetails = {
          title: weddingName,
          startDate: weddingDate,
          endDate: new Date(weddingDate.getTime() + 2 * 60 * 60 * 1000),
          allDay: true,
          notes: 'Свадьба создана через приложение',
          calendarId: defaultCalendar.id,
        };
        await ExpoCalendar.createEventAsync(defaultCalendar.id, eventDetails);
      }
      alert('Успех', 'Свадьба успешно создана и добавлена в календарь!');
      setModalVisible(false);
      setWeddingName('');
      setWeddingDate(new Date());
    } catch (error) {
      console.error('Ошибка при создании свадьбы:', error);
      alert('Ошибка: ' + (error.response?.data?.error || error.message));
    }
  };

  const onDateChange = (day) => {
    const selectedDate = new Date(day.timestamp);
    const dateString = day.dateString;
    setWeddingDate(selectedDate);
    if (blockedDays[dateString]) {
      setShowWarningModal(true); // Показываем предупреждение, если день забронирован
    }
    setShowDatePicker(false);
  };


  //----------------------------------------------------------------------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [costRange, setCostRange] = useState('all');


  const renderClientContent = () => {
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
    ].filter((item) => item.type !== 'goods' || item.category !== 'Прочее');
  



    const typesMapping = [
      { key: 'clothing', costField: 'cost', type: 'clothing', label: 'Одежда' },
      { key: 'tamada', costField: 'cost', type: 'tamada', label: 'Тамада' },
      { key: 'programs', costField: 'cost', type: 'program', label: 'Программа' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift', label: 'Традиционные подарки' },
      { key: 'flowers', costField: 'cost', type: 'flowers', label: 'Цветы' },
      { key: 'cakes', costField: 'cost', type: 'cake', label: 'Торты' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol', label: 'Алкоголь' },
      { key: 'transport', costField: 'cost', type: 'transport', label: 'Транспорт' },
      { key: 'restaurants', costField: 'averageCost', type: 'restaurant', label: 'Ресторан' },
    ];
  
    const allTypes = [
      { type: 'all', label: 'Все' },
      ...combinedData.map((item) => ({
        type: item.type,
        label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
      })),
    ];
  
    const uniqueTypes = Array.from(new Set(allTypes.map((t) => t.type))).map((type) =>
      allTypes.find((t) => t.type === type)
    );


    console.log('Combined Data:', combinedData.map(i => ({ type: i.type, name: i.name || i.item_name || i.teamName || i.salonName, cost: i.cost || i.averageCost })));
  
    // Состояния для поиска и фильтров
  
    const typeOrder = {
      restaurant: 1,
      clothing: 2,
      tamada: 3,
      program: 4,
      traditionalGift: 5,
      flowers: 6,
      transport: 7,
    };
  
    // Сортировка данных
    const sortedFilteredData = [...filteredData].sort((a, b) => {
      return (typeOrder[a.type] || 8) - (typeOrder[b.type] || 8);
    });
  
    const sortedCombinedData = [...combinedData].sort((a, b) => {
      return (typeOrder[a.type] || 8) - (typeOrder[b.type] || 8);
    });

    // Уникальные значения для фильтров
    const types = ['all', ...new Set(combinedData.map((item) => item.type))];
    const districts = ['all', ...new Set(combinedData.map((item) => item.district).filter(Boolean))];
  
    // Функция фильтрации данных
    const getFilteredData = () => {
      let result = combinedData;
  
      if (searchQuery) {
        result = result.filter((item) => {
          const fieldsToSearch = [
            item.name,
            item.itemName,
            item.flowerName,
            item.alcoholName,
            item.carName,
            item.teamName,
            item.salonName,
            item.storeName,
            item.address,
            item.phone,
            item.cuisine,
            item.category,
            item.brand,
            item.gender,
            item.portfolio,
            item.cakeType,
            item.flowerType,
          ].filter(Boolean);
  
          return fieldsToSearch.some((field) =>
            field.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }
  
      if (selectedType !== 'all') {
        result = result.filter((item) => item.type === selectedType);
      }
      if (selectedTypeFilter !== 'all') {
        result = result.filter((item) => item.type === selectedTypeFilter);
      }
  
      if (selectedDistrict !== 'all') {
        result = result.filter((item) => item.district === selectedDistrict);
      }
  
      if (costRange !== 'all') {
        result = result.filter((item) => {
          const cost = item.averageCost || item.cost;
          if (costRange === '0-10000') return cost <= 10000;
          if (costRange === '10000-50000') return cost > 10000 && cost <= 50000;
          if (costRange === '50000+') return cost > 50000;
          return true;
        });
      }
  
      return result;
    };
  
    const filteredItems = getFilteredData();
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
    return (
      <View style={styles.clientContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setBudgetModalVisible(true)}
          >
            <Icon name="attach-money" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setAddItemModalVisible(true)}
            disabled={!budget}
          >
            <Icon name="add" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={createEvent}
            disabled={!budget}
          >
            <Icon name="event" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
     

        {budget && (
          <SwitchSelector
            options={[
              { label: 'Мин', value: 'min' },
              { label: 'Сред', value: 'average' },
              { label: 'Макс', value: 'max' },
            ]}
            initial={1}
            onPress={(value) => {
              console.log('SwitchSelector changed to:', value);
              setPriceFilter(value);
            }}
            buttonColor={COLORS.primary}
            backgroundColor={COLORS.background}
            textColor={COLORS.textSecondary}
            selectedTextStyle={{ color: '#FFFFFF' }}
            style={styles.switchSelector}
          />
        )}
  
        <Modal visible={budgetModalVisible} transparent animationType="slide">
          <SafeAreaView style={styles.modalOverlay}>
            <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
              <Text style={styles.modalTitle}>Ваш бюджет</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="Введите сумму (₸)"
                value={budget}
                onChangeText={handleBudgetChange}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
              <TextInput
                style={styles.budgetInput}
                placeholder="Количество гостей"
                value={guestCount}
                onChangeText={handleGuestCountChange}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton2, styles.cancelButton]}
                  onPress={() => setBudgetModalVisible(false)}
                >
                  <Text style={styles.modalButtonText2}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton2, styles.confirmButton]}
                  onPress={filterDataByBudget}
                >
                  <Text style={styles.modalButtonText2}>Применить</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </SafeAreaView>
        </Modal>
        <Text> </Text>
        {budget && (
          <>
            <Text style={styles.sectionTitle}>
              {filteredData.length > 0 ? `Рекомендации (${budget} ₸)` : 'Все объекты'}
            </Text>
            {filteredData.length > 0 && (
              <Text style={[styles.budgetInfo, remainingBudget < 0 && styles.budgetError]}>
                Остаток: {remainingBudget} ₸
              </Text>
            )}
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : filteredData.length > 0 ? (
              
            //   <FlatList
            //     data={filteredData}
            //     renderItem={renderItem}
            //     keyExtractor={(item) => `${item.type}-${item.id}`}
            //     contentContainerStyle={styles.listContent}
            //     showsVerticalScrollIndicator={false}
            //   />
            // ) : combinedData.length > 0 ? (
            //   <FlatList
            //     data={combinedData}
            //     renderItem={renderItem}
            //     keyExtractor={(item) => `${item.type}-${item.id}`}
            //     contentContainerStyle={styles.listContent}
            //     showsVerticalScrollIndicator={false}
            //   />
            <FlatList 
              data={sortedFilteredData} // Используем отсортированные данные
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : combinedData.length > 0 ? (
            <FlatList
              data={sortedCombinedData} // Используем отсортированные данные
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            ) : (
              <Text style={styles.emptyText}>Нет данных для отображения</Text>
            )}
          </>
        )}
  
        {/* Обновлённое модальное окно "Добавить элемент" */}
      

<Modal visible={addItemModalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <Animatable.View style={styles.addModalContainer} animation="zoomIn" duration={300}>
      {/* Заголовок и кнопка закрытия */}
      <View style={styles.addModalHeader}>
        <Text style={styles.addModalTitle}>Добавить элемент</Text>
        <TouchableOpacity
          style={styles.addModalCloseIcon}
          onPress={() => {
            setAddItemModalVisible(false);
            setSearchQuery('');
            setSelectedType('all');
            setSelectedDistrict('all');
            setCostRange('all');
            setSelectedTypeFilter('all');
          }}
        >
          <Icon name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Поиск */}
      <View style={styles.addModalSearchContainer}>
        <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.addModalSearchIcon} />
        <TextInput
          style={styles.addModalSearchInput}
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.addModalClearIcon}
            onPress={() => setSearchQuery('')}
          >
            <Icon name="clear" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>


      {/* Фильтры */}
      <View style={styles.addModalFilterContainer}>
        {/* Фильтр "Тип" в виде кнопок */}
        <View style={styles.addModalTypeFilterContainer}>
          <Text style={styles.addModalFilterLabel}>Тип</Text>
          {/* <View style={styles.addModalTypeButtons}>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.addModalTypeButton,
                  selectedType === type && styles.addModalTypeButtonActive,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.addModalTypeButtonText,
                    selectedType === type && styles.addModalTypeButtonTextActive,
                  ]}
                >
                  {type === 'all' ? 'Все' : type}
                </Text>
              </TouchableOpacity>
            ))}
          </View> */}
           <View style={styles.addModalTypeButtons}>
                    {uniqueTypes.map((typeObj) => (
                      <TouchableOpacity
                        key={typeObj.type}
                        style={[
                          styles.addModalTypeButton,
                          selectedTypeFilter === typeObj.type && styles.addModalTypeButtonActive,
                        ]}
                        onPress={() => setSelectedTypeFilter(typeObj.type)}
                      >
                        <Text
                          style={[
                            styles.addModalTypeButtonText,
                            selectedTypeFilter === typeObj.type && styles.addModalTypeButtonTextActive,
                          ]}
                        >
                          {typeObj.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
        </View>

        {/* Фильтр "Район" в виде кнопок */}
        <View style={styles.addModalDistrictFilterContainer}>
          <Text style={styles.addModalFilterLabel}>Район</Text>
          <View style={styles.addModalDistrictButtons}>
            {districts.map((district) => (
              <TouchableOpacity
                key={district}
                style={[
                  styles.addModalDistrictButton,
                  selectedDistrict === district && styles.addModalDistrictButtonActive,
                ]}
                onPress={() => setSelectedDistrict(district)}
              >
                <Text
                  style={[
                    styles.addModalDistrictButtonText,
                    selectedDistrict === district && styles.addModalDistrictButtonTextActive,
                  ]}
                >
                  {district === 'all' ? 'Все' : district}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Фильтр "Цена" в виде кнопок */}
        <View style={styles.addModalPriceFilterContainer}>
          <Text style={styles.addModalFilterLabel}>Цена</Text>
          <View style={styles.addModalPriceButtons}>
            {[
              { label: 'Все', value: 'all' },
              { label: '0-10k', value: '0-10000' },
              { label: '10k-50k', value: '10000-50000' },
              { label: '50k+', value: '50000+' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.addModalPriceButton,
                  costRange === option.value && styles.addModalPriceButtonActive,
                ]}
                onPress={() => setCostRange(option.value)}
              >
                <Text
                  style={[
                    styles.addModalPriceButtonText,
                    costRange === option.value && styles.addModalPriceButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Список элементов */}
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <View style={styles.addModalItemCard}>
            <TouchableOpacity
              style={styles.addModalItemContent}
              onPress={() => handleAddItem(item)}
            >
              <Text style={styles.addModalItemText}>
                {(() => {
                  const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
                  switch (item.type) {
                    case 'restaurant':
                      return `Ресторан: ${item.name} (${cost} ₸)`;
                    case 'clothing':
                      return `Одежда: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
                    case 'flowers':
                      return `Цветы: ${item.salonName} - ${item.flowerName} (${cost} ₸)`;
                    case 'cake':
                      return `Торты: ${item.name} (${cost} ₸)`;
                    case 'alcohol':
                      return `Алкоголь: ${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
                    case 'program':
                      return `Программа: ${item.teamName} (${cost} ₸)`;
                    case 'tamada':
                      return `Тамада: ${item.name} (${cost} ₸)`;
                    case 'traditionalGift':
                      return `Традиц. подарки: ${item.salonName} - ${item.itemName} (${cost} ₸)`;
                    case 'transport':
                      return `Транспорт: ${item.salonName} - ${item.carName} (${cost} ₸)`;
                    case 'goods':
                      return `Товар: ${item.item_name} (${cost} ₸)`;
                    default:
                      return 'Неизвестный элемент';
                  }
                })()}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addModalDetailsButton}
              onPress={() => {
                setSelectedItem(item);
                setDetailsModalVisible(true);
              }}
            >
              <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Details', { item })}
              >
                <Button style={styles.detailsButtonText}>Подробнее</Button>
              </TouchableOpacity> */}


          </View>
        )}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.addModalItemList}
        ListEmptyComponent={<Text style={styles.addModalEmptyText}>Ничего не найдено</Text>}
      />

      {/* Модальное окно с подробной информацией */}
      <Modal visible={detailsModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.detailsModalContainer} animation="zoomIn" duration={300}>
            <View style={styles.detailsModalHeader}>
              <Text style={styles.detailsModalTitle}>Подробности</Text>
              <TouchableOpacity
                style={styles.detailsModalCloseIcon}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Icon name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            {selectedItem && (
              <View style={styles.detailsModalContent}>
                {(() => {
                  switch (selectedItem.type) {
                    case 'restaurant':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Ресторан</Text>
                          <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
                          <Text style={styles.detailsModalText}>Вместимость: {selectedItem.capacity}</Text>
                          <Text style={styles.detailsModalText}>Кухня: {selectedItem.cuisine}</Text>
                          <Text style={styles.detailsModalText}>Средний чек: {selectedItem.averageCost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address || 'Не указан'}</Text>
                        </>
                      );
                    case 'clothing':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Одежда</Text>
                          <Text style={styles.detailsModalText}>Магазин: {selectedItem.storeName}</Text>
                          <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
                          <Text style={styles.detailsModalText}>Пол: {selectedItem.gender}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'flowers':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Цветы</Text>
                          <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                          <Text style={styles.detailsModalText}>Цветы: {selectedItem.flowerName}</Text>
                          <Text style={styles.detailsModalText}>Тип цветов: {selectedItem.flowerType}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'cake':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Торты</Text>
                          <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
                          <Text style={styles.detailsModalText}>Тип торта: {selectedItem.cakeType}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'alcohol':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Алкоголь</Text>
                          <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                          <Text style={styles.detailsModalText}>Напиток: {selectedItem.alcoholName}</Text>
                          <Text style={styles.detailsModalText}>Категория: {selectedItem.category}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'program':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Программа</Text>
                          <Text style={styles.detailsModalText}>Команда: {selectedItem.teamName}</Text>
                          <Text style={styles.detailsModalText}>Тип программы: {selectedItem.type}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                        </>
                      );
                    case 'tamada':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Тамада</Text>
                          <Text style={styles.detailsModalText}>Имя: {selectedItem.name}</Text>
                          <Text style={styles.detailsModalText}>Портфолио: {selectedItem.portfolio}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                        </>
                      );
                    case 'traditionalGift':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Традиционные подарки</Text>
                          <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                          <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
                          <Text style={styles.detailsModalText}>Тип: {selectedItem.type}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'transport':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Транспорт</Text>
                          <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                          <Text style={styles.detailsModalText}>Авто: {selectedItem.carName}</Text>
                          <Text style={styles.detailsModalText}>Марка: {selectedItem.brand}</Text>
                          <Text style={styles.detailsModalText}>Цвет: {selectedItem.color}</Text>
                          <Text style={styles.detailsModalText}>Телефон: {selectedItem.phone}</Text>
                          <Text style={styles.detailsModalText}>Район: {selectedItem.district}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                        </>
                      );
                    case 'goods':
                      return (
                        <>
                          <Text style={styles.detailsModalText}>Тип: Товар</Text>
                          <Text style={styles.detailsModalText}>Название: {selectedItem.item_name}</Text>
                          <Text style={styles.detailsModalText}>Описание: {selectedItem.description || 'Не указано'}</Text>
                          <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                        </>
                      );
                    default:
                      return <Text style={styles.detailsModalText}>Неизвестный тип</Text>;
                  }
                })()}
              </View>
            )}
          </Animatable.View>
        </View>
      </Modal>
    </Animatable.View>
  </View>
</Modal>


  
        {!budget && (
          <View style={styles.noBudgetContainer}>
            <Icon name="attach-money" size={48} color={COLORS.textSecondary} />
            <Text style={styles.noBudgetText}>Пожалуйста, задайте бюджет для отображения записей</Text>
          </View>
        )}
      </View>
    );
  };

 
//----------------------------------------------------------------------

  
  
 
  
  const [showRestaurantModal, setShowRestaurantModal] = useState(false); // Для модального окна ресторана
  const [showCalendarModal, setShowCalendarModal] = useState(false); // Для модального окна календаря
  const [showCalendarModal2, setShowCalendarModal2] = useState(false); // Для модального окна календаря
  const [tempRestaurantId, setTempRestaurantId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const blockRestaurantDay = async (restaurantId, date) => {
    try {
      const response = await api.addDataBlockToRestaurant(restaurantId,selectedDate
       );
      alert('Успешно поставлена бронь',response.data.message);
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      // alert('Ошибка: ' + (error.response?.data?.message || error.message));
      alert('В этот день у данного ресторана уже стоит бронь')
    }
  };

 
  useEffect(() => {
    if (data?.restaurants?.length > 0) {
      fetchAllBlockedDays();
    }
    console.log(occupiedRestaurants)
  }, [data.restaurants,occupiedRestaurants]);



 

  useEffect(() => {
    if (!token) navigation.navigate('Login');
    else fetchData();
  }, [token, user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, token, user]);

  const adminRenderContent = () => {
    const handleBlockDay = async () => {
      if (!selectedRestaurant) {
        alert('Пожалуйста, выберите ресторан');
        return;
      }

      // const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      // if (status !== 'granted') {
      //   alert('Доступ к календарю не предоставлен');
      //   return;
      // }

      const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
      await ExpoCalendar.createEventAsync(defaultCalendar.id, {
        title: `Забронирован день для ${selectedRestaurant.name}`,
        startDate: selectedDate,
        endDate: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
        allDay: true,
        notes: `Ресторан ${selectedRestaurant.name} забронирован менеджером`,
        availability: 'busy',
      });

      await blockRestaurantDay(selectedRestaurant.id, selectedDate);
      setShowCalendarModal(false);
    };

    const handleSelectRestaurant = () => {
      
      const restaurantId = Number(tempRestaurantId);

  // Проверяем, существует ли data.restaurants и ищем ресторан
      const restaurant = data?.restaurants?.find((r) => r.id === restaurantId);

      console.log('Найденный ресторан:', restaurant);

  if (!restaurant) {
    console.log('Ресторан не найден. Проверьте ID или данные.');
  }
      console.log('Выбранный ресторан ID:', tempRestaurantId,'data=',data?.restaurants);
      console.log('Найденный ресторан:', restaurant);
      setSelectedRestaurant(restaurant || null);
      setShowRestaurantModal(false); // Закрываем модальное окно ресторана
      setShowCalendarModal(true); // Открываем модальное окно календаря
    };



    return (
      <View style={styles.supplierContainer}>
        <Text style={styles.title}>Панель менеджера</Text>

        <Text style={styles.subtitle}>
          {selectedRestaurant
            ? `Выбран ресторан: ${selectedRestaurant.name}`
            : 'Ресторан не выбран'}
        </Text>
       
        <Text style={styles.dateText}>
          Выбранная дата: {selectedDate.toLocaleDateString('ru-RU')}
        </Text>

        {/* Кнопка для открытия модального окна ресторана */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowRestaurantModal(true)}
        >
          <Text style={styles.actionButtonText}>Выбрать дату для бронирования</Text>
        </TouchableOpacity>

        {/* Модальное окно для выбора ресторана */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRestaurantModal}
          onRequestClose={() => setShowRestaurantModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.modalTitle}>Выбор ресторана</Text>

                <Text style={styles.modalSubtitle}>Выберите ресторан:</Text>
                {data?.restaurants?.length > 0 ? (
                  <>
                    <Picker
                      selectedValue={tempRestaurantId}
                      onValueChange={(itemValue) => setTempRestaurantId(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#000000"
                    >
                      <Picker.Item label="Выберите ресторан" value={null} />
                      {data.restaurants.map((item) => (
                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleSelectRestaurant}
                    >
                      <Text style={styles.actionButtonText}>Выбрать ресторан</Text>
                    </TouchableOpacity>
                    <Text/>
                    <Text/>
                    <Text/>
                  </>
                ) : (
                  <Text style={styles.modalText}>Рестораны не найдены</Text>
                )}

<Text/>
                  
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowRestaurantModal(false)}
                >
                   
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для выбора даты */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCalendarModal}
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.modalTitle}>Выбор даты</Text>

                <Text style={styles.modalSubtitle}>Выберите дату:</Text>
                
                <Calendar
                  current={selectedDate.toISOString().split('T')[0]}
                  onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
                  minDate={new Date().toISOString().split('T')[0]}
                  markedDates={{
                    [selectedDate.toISOString().split('T')[0]]: {
                      selected: true,
                      selectedColor: COLORS.primary,
                    },
                  }}
                  theme={{
                    selectedDayBackgroundColor: COLORS.primary,
                    todayTextColor: COLORS.accent,
                    arrowColor: COLORS.secondary,
                  }}
                />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleBlockDay}
                >
                  <Text style={styles.actionButtonText}>Забронировать</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCalendarModal(false)}
                >
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>



       
       
       
       
        <TouchableOpacity
  style={styles.actionButton}
  onPress={() => setShowCalendarModal2(true)}
>
  <Text style={styles.actionButtonText}>Просмотр календаря</Text>
</TouchableOpacity>

<Modal
  animationType="slide"
  transparent={true}
  visible={showCalendarModal2}
  onRequestClose={() => setShowCalendarModal2(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.modalTitle}>Просмотр календаря</Text>
        <Text style={styles.modalSubtitle}>Выберите дату для проверки:</Text>
        <Calendar
          current={selectedDate.toISOString().split('T')[0]}
          onDayPress={(day) => {
            const dateString = day.dateString;
            setSelectedDate(new Date(day.timestamp));

            // Получаем рестораны для выбранной даты из blockedDays (было blockedDates)
            const occupied = blockedDays[dateString]
              ? blockedDays[dateString].dots.map((entry) => ({
                  id: entry.restaurantId,
                  name: entry.restaurantName,
                }))
              : [];

            console.log('Selected date:', dateString, 'Occupied:', occupied);
            setOccupiedRestaurants(occupied);
          }}
          minDate={new Date().toISOString().split('T')[0]}
          markedDates={Object.keys(blockedDays).reduce((acc, date) => {
            acc[date] = {
              marked: true,
              dots: blockedDays[date].dots.map((dot) => ({
                key: dot.restaurantId.toString(),
                color: dot.color,
              })),
            };
            return acc;
          }, {})}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            todayTextColor: COLORS.accent,
            arrowColor: COLORS.secondary,
          }}
        />

        {/* Отображение занятых ресторанов под календарем */}
        <View style={styles.occupiedContainer}>
          {/* <Text style={styles.modalSubtitle}>
            Дата: {selectedDate.toLocaleDateString('ru-RU')}
          </Text> */}
          {occupiedRestaurants.length > 0 ? (
            <>
              <Text style={styles.modalText}>
                На этот день уже заняты следующие рестораны:
              </Text>
              {occupiedRestaurants.map((restaurant) => (
                <Text key={restaurant.id} style={styles.modalText}>
                  {restaurant.name} 
                </Text>
              ))}
            </>
          ) : (
            <Text style={styles.modalText}>В этот день нет занятых ресторанов</Text>
          )}
          {/* <Text style={styles.modalText}>
            Отладка: {JSON.stringify(occupiedRestaurants)}
          </Text> */}
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowCalendarModal2(false)}
        >
          <Text style={styles.closeButtonText}>Закрыть</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</Modal>


      </View>
    );
  };
//----------------------------------------------------------------------








  return (
    <SafeAreaView style={styles.container}>
      {user?.roleId === 1
        ? adminRenderContent()
        : user?.roleId === 2
        ? renderSupplierContent()
        : renderClientContent()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.title}>Создание мероприятия "Свадьба"</Text>
              <TextInput
                style={styles.input}
                placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
                value={weddingName}
                onChangeText={setWeddingName}
              />
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>
                  {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <Calendar
                  style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10 }}
                  current={weddingDate.toISOString().split('T')[0]}
                  onDayPress={onDateChange}
                  minDate={new Date().toISOString().split('T')[0]}
                  markedDates={{
                    ...blockedDays, // Отображаем заблокированные дни
                    [weddingDate.toISOString().split('T')[0]]: {
                      selected: true,
                      selectedColor: blockedDays[weddingDate.toISOString().split('T')[0]]
                        ? blockedDays[weddingDate.toISOString().split('T')[0]].dotColor
                        : COLORS.primary,
                    },
                  }}
                  theme={{
                    selectedDayBackgroundColor: COLORS.primary,
                    todayTextColor: COLORS.accent,
                    arrowColor: COLORS.secondary,
                  }}
                />
              )}
              <Text style={styles.subtitle}>Выбранные элементы:</Text>
              <View style={styles.itemsContainer}>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    console.log('item= ',item),
                    <View key={`${item.type}-${item.id}`} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        {(() => {
                          switch (item.type) {
                            case 'restaurant':
                              return `${item.name} (${item.cuisine}) - ${item.totalCost || item.averageCost} тг`;
                            case 'clothing':
                              return `${item.itemName} (${item.storeName}) - ${item.totalCost || item.cost} тг`;
                            case 'tamada':
                              return `${item.name} - ${item.totalCost || item.cost} тг`;
                            case 'program':
                              return `${item.teamName} - ${item.totalCost || item.cost} тг`;
                            case 'traditionalGift':
                              return `${item.itemName} (${item.sallonName}) - ${item.totalCost || item.cost} тг`;
                            case 'flowers':
                              return `${item.flowerName} (${item.flowerType}) - ${item.totalCost || item.cost} тг`;
                            case 'cake':
                              return `${item.name} (${item.cakeType}) - ${item.totalCost || item.cost} тг`;
                            case 'alcohol':
                              return `${item.alcoholName} (${item.category}) - ${item.totalCost || item.cost} тг`;
                            case 'transport':
                              return `${item.carName} (${item.brand}) - ${item.totalCost || item.cost} тг`;
                            case 'goods':
                              return `${item.item_name} - ${item.totalCost || item.cost} тг`;
                            default:
                              return 'Неизвестный элемент';
                          }
                        })()}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
                )}
              </View>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  Общая стоимость:{' '}
                  {filteredData.reduce((sum, item) => sum + (item.totalCost || item.cost), 0)} тг
                </Text>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton2, styles.confirmButton]} onPress={handleSubmit}>
                  <Text style={styles.modalButtonText2}>Создать свадьбу</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton2, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText2}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>

      {/* Модальное окно предупреждения для клиента */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWarningModal}
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Внимание</Text>
            <Text style={styles.modalSubtitle}>
              Этот день ({weddingDate.toLocaleDateString('ru-RU')}) уже забронирован для ресторана{' '}
              {blockedDays[weddingDate.toISOString().split('T')[0]]?.restaurantName}.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWarningModal(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Основные контейнеры
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  clientContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  // Кнопки и панель
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Текст и информация
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  budgetInfo: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
  },
  budgetError: {
    color: COLORS.error,
  },

  // Карточки
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Инпуты и элементы управления
  quantityInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  totalCost: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Общие стили для модальных окон
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    maxHeight: '80%',
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  budgetInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
    backgroundColor: '#F7FAFC',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: COLORS.secondary,
  },
  modalButton2: {
    flex: 1,
    paddingVertical: 10,
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
  modalButtonText2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  // Стили для модального окна "Добавить элемент"
  addModalContainer: {
    width: '92%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  addModalCloseIcon: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
  addModalSearchContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  addModalSearchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 36,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  addModalSearchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  addModalClearIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  addModalFilterContainer: {
    marginBottom: 12,
  },
  addModalTypeFilterContainer: {
    marginBottom: 10,
  },
  addModalTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalTypeButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalTypeButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalDistrictFilterContainer: {
    marginBottom: 10,
  },
  addModalDistrictButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalDistrictButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalDistrictButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalDistrictButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalDistrictButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalPriceFilterContainer: {
    marginBottom: 12,
  },
  addModalPriceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalPriceButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalPriceButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalPriceButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalPriceButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalItemList: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  addModalItemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addModalItemContent: {
    flex: 1,
    marginRight: 10,
  },
  addModalItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalDetailsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addModalDetailsButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Стили для модального окна "Подробности"
  detailsModalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  detailsModalCloseIcon: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
  detailsModalContent: {
    paddingVertical: 8,
  },
  detailsModalText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  addModalEmptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },



});