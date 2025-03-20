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
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as ExpoCalendar from 'expo-calendar';

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
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(0);
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

  const getCalendarPermissions = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      alert('Доступ к календарю не предоставлен.');
      return false;
    }
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
          await api.deleteGood(itemToDelete.id, token);
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
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму бюджета');
      return;
    }
    if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
      alert('Пожалуйста, введите корректное количество гостей');
      return;
    }

    const budgetValue = parseFloat(budget);
    const guests = parseFloat(guestCount);
    let remaining = budgetValue;
    const selectedItems = [];

    const suitableRestaurants = data.restaurants.filter(
      (restaurant) => parseFloat(restaurant.capacity) >= guests
    );

    if (suitableRestaurants.length === 0) {
      alert('Нет ресторанов с достаточной вместимостью для указанного количества гостей');
      return;
    }

    const sortedRestaurants = suitableRestaurants.sort(
      (a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost)
    );

    const medianIndex = Math.floor(sortedRestaurants.length / 2);
    const selectedRestaurant = sortedRestaurants[medianIndex];
    const restaurantCost = parseFloat(selectedRestaurant.averageCost);

    if (!isNaN(restaurantCost) && restaurantCost <= remaining) {
      selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
      remaining -= restaurantCost;
    }

    const types = [
      { key: 'clothing', costField: 'cost', type: 'clothing' },
      { key: 'tamada', costField: 'cost', type: 'tamada' },
      { key: 'programs', costField: 'cost', type: 'program' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
      { key: 'flowers', costField: 'cost', type: 'flowers' },
      { key: 'cakes', costField: 'cost', type: 'cake' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol' },
      { key: 'transport', costField: 'cost', type: 'transport' },
      { key: 'goods', costField: 'cost', type: 'goods' },
    ];

    for (const { key, costField, type } of types) {
      const items = data[key] || [];
      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));
        const middleItem = sortedItems[Math.floor(sortedItems.length / 2)];
        const cost = parseFloat(middleItem[costField]);
        if (!isNaN(cost) && cost <= remaining) {
          selectedItems.push({ ...middleItem, type, totalCost: cost });
          remaining -= cost;
        }
      }
    }

    setFilteredData(selectedItems);
    setRemainingBudget(remaining);
    setQuantities(selectedItems.reduce((acc, item) => ({ ...acc, [`${item.type}-${item.id}`]: '1' }), {}));
    setBudgetModalVisible(false);
  };

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
    // Удаляем элемент из filteredData
    const updatedFilteredData = filteredData.filter(
      (item) => `${item.type}-${item.id}` !== itemKey
    );
    setFilteredData(updatedFilteredData);

    // Обновляем quantities, удаляя ключ
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[itemKey];
      return newQuantities;
    });

    // Пересчитываем оставшийся бюджет
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
            <Text style={styles.cardDetail}>Описание: {item.description} </Text>
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

    let title;
    switch (item.type) {
      case 'restaurant':
        title = `Ресторан: ${item.name} (${item.averageCost} ₸)`;
        break;
      case 'clothing':
        title = `Одежда: ${item.storeName} - ${item.itemName} (${item.cost} ₸)`;
        break;
      case 'flowers':
        title = `Цветы: ${item.salonName} - ${item.flowerName} (${item.cost} ₸)`;
        break;
      case 'cake':
        title = `Торты: ${item.name} (${item.cost} ₸)`;
        break;
      case 'alcohol':
        title = `Алкоголь: ${item.salonName} - ${item.alcoholName} (${item.cost} ₸)`;
        break;
      case 'program':
        title = `Программа: ${item.teamName} (${item.cost} ₸)`;
        break;
      case 'tamada':
        title = `Тамада: ${item.name} (${item.cost} ₸)`;
        break;
      case 'traditionalGift':
        title = `Традиц. подарки: ${item.salonName} - ${item.itemName} (${item.cost} ₸)`;
        break;
      case 'transport':
        title = `Транспорт: ${item.salonName} - ${item.carName} (${item.cost} ₸)`;
        break;
      case 'goods':
        title = `Товар: ${item.item_name} (${item.cost} ₸)`;
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

    if (!user?.id || !token) {
      alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
      navigation.navigate('Login');
      return;
    }

    const weddingData = {
      name: weddingName,
      date: weddingDate.toISOString().split('T')[0],
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
    setWeddingDate(selectedDate);
    setShowDatePicker(false);
  };

  const renderWeddingItem = ({ item }) => {
    let title = '';
    switch (item.type) {
      case 'restaurant':
        title = `${item.name} (${item.cuisine}) - ${item.totalCost || item.averageCost} тг`;
        break;
      case 'clothing':
        title = `${item.itemName} (${item.storeName}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'tamada':
        title = `${item.name} - ${item.totalCost || item.cost} тг`;
        break;
      case 'program':
        title = `${item.teamName} - ${item.totalCost || item.cost} тг`;
        break;
      case 'traditionalGift':
        title = `${item.itemName} (${item.salonName}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'flowers':
        title = `${item.flowerName} (${item.flowerType}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'cake':
        title = `${item.name} (${item.cakeType}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'alcohol':
        title = `${item.alcoholName} (${item.category}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'transport':
        title = `${item.carName} (${item.brand}) - ${item.totalCost || item.cost} тг`;
        break;
      case 'goods':
        title = `${item.item_name} - ${item.totalCost || item.cost} тг`;
        break;
      default:
        title = 'Неизвестный элемент';
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{title}</Text>
      </View>
    );
  };

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
    ];

    return (
      <View style={styles.clientContainer}>
        <TouchableOpacity style={styles.budgetButton} onPress={() => setBudgetModalVisible(true)}>
          <Text style={styles.budgetButtonText}>Задать бюджет</Text>
        </TouchableOpacity>

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
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setBudgetModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={filterDataByBudget}
                >
                  <Text style={styles.modalButtonText}>Применить</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </SafeAreaView>
        </Modal>

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
              <>
                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={(item) => `${item.type}-${item.id}`}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setAddItemModalVisible(true)}
                >
                  <Text style={styles.addButtonText}>Добавить еще</Text>
                </TouchableOpacity>
              </>
            ) : combinedData.length > 0 ? (
              <FlatList
                data={combinedData}
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

        <Modal visible={addItemModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <Animatable.View style={styles.addModalContent} animation="zoomIn" duration={300}>
              <Text style={styles.modalTitle}>Добавить элемент</Text>
              <FlatList
                data={combinedData}
                renderItem={renderAddItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                contentContainerStyle={styles.addItemList}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddItemModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>

        {!budget && (
          <View style={styles.noBudgetContainer}>
            <Icon name="attach-money" size={48} color={COLORS.textSecondary} />
            <Text style={styles.noBudgetText}>Пожалуйста, задайте бюджет для отображения записей</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={createEvent}>
          <Text style={styles.addButtonText}>Создать мероприятие</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {user?.roleId === 2 ? renderSupplierContent() : renderClientContent()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Создание мероприятия "Свадьба"</Text>

            <TextInput
              style={styles.input}
              placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
              value={weddingName}
              onChangeText={setWeddingName}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <Calendar
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  height: '80%',
                }}
                current={weddingDate.toISOString().split('T')[0]}
                onDayPress={onDateChange}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={{
                  [weddingDate.toISOString().split('T')[0]]: {
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
            )}

            <Text style={styles.subtitle}>Выбранные элементы:</Text>
            {filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
                renderItem={renderWeddingItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                style={styles.list}
              />
            ) : (
              <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
            )}

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Общая стоимость: {filteredData.reduce((sum, item) => sum + (item.totalCost || item.cost), 0)} тг
              </Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.modalButtonText}>Создать свадьбу</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: COLORS.textPrimary,
  },
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
  list: {
    flexGrow: 1,
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
    position: 'relative', // Для позиционирования крестика
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
  budgetButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    maxHeight: '80%',
  },
  addModalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addItemList: {
    flexGrow: 1,
    marginBottom: 20,
  },
  addItemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  addItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  supplierTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
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
  clientContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  noBudgetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBudgetText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  noItems: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  totalContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});