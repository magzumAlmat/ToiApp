import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
// import GEOLOGICAFONT from '../font'

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
  white: '#FFFFFF',
};

const typeOrder = {
  restaurant: 1,
  clothing: 2,
  tamada: 3,
  program: 4,
  traditionalGift: 5,
  flowers: 6,
  transport: 7,
  cake: 8,
  alcohol: 9,
  goods: 10,
};

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

const AddItemModal = ({ visible, onClose, filteredItems, filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [costRange, setCostRange] = useState('all');

  const uniqueTypes = useMemo(() => {
    const types = [
      { type: 'all', label: 'Все' },
      ...filteredItems
        .map((item) => ({
          type: item.type,
          label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
        }))
        .filter((value, index, self) => self.findIndex((t) => t.type === value.type) === index)
        .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)),
    ];
    return types;
  }, [filteredItems]);

  const districts = useMemo(() => ['all', ...new Set(filteredItems.map((item) => item.district).filter(Boolean))], [filteredItems]);

  const filteredDataMemo = useMemo(() => {
    let result = filteredItems;
    if (searchQuery) {
      result = result.filter((item) =>
        [
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
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      );
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
    return result.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
  }, [filteredItems, searchQuery, selectedTypeFilter, selectedDistrict, costRange]);

  const renderAddItem = useCallback(
    ({ item }) => {
      const isSelected = filteredData.some(
        (selectedItem) => `${selectedItem.type}-${selectedItem.id}` === `${item.type}-${item.id}`
      );
      if (isSelected || (item.type === 'goods' && item.category === 'Прочее')) return null;
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
          break;
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
        <View style={styles.addModalItemCard}>
          <TouchableOpacity style={styles.addModalItemContent} onPress={() => handleAddItem(item)}>
            <Text style={styles.addModalItemText}>{title}</Text>
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
        </View>
      );
    },
    [filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem]
  );

  const closeModal = () => {
    console.log('Closing AddItemModal');
    setSearchQuery('');
    setSelectedTypeFilter('all');
    setSelectedDistrict('all');
    setCostRange('all');
    onClose();
    console.log('AddItemModal state reset:', { searchQuery: '', selectedTypeFilter: 'all', selectedDistrict: 'all', costRange: 'all' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.addModalContainer}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>Добавить элемент</Text>
            <TouchableOpacity style={styles.addModalCloseIcon} onPress={closeModal}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.addModalSearchContainer}>
            <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.addModalSearchIcon} />
            <TextInput
              style={styles.addModalSearchInput}
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.addModalClearIcon} onPress={() => setSearchQuery('')}>
                <Icon name="clear" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addModalFilterContainer}>
            <View style={styles.addModalTypeFilterContainer}>
              <Text style={styles.addModalFilterLabel}>Тип</Text>
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
          <FlatList
            data={filteredDataMemo.slice(0, 50)}
            renderItem={renderAddItem}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={styles.addModalItemList}
            initialNumToRender={10}
            windowSize={5}
            ListEmptyComponent={<Text style={styles.addModalEmptyText}>Ничего не найдено</Text>}
          />
        </View>
      </View>
    </Modal>
  );
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
  const [blockedDays, setBlockedDays] = useState({});
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [occupiedRestaurants, setOccupiedRestaurants] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCalendarModal2, setShowCalendarModal2] = useState(false);
  const [tempRestaurantId, setTempRestaurantId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  
  const restaurantColors = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#45B7D1',
    4: '#96CEB4',
    5: '#FFEEAD',
  };

  const resetWeddingModal = useCallback(() => {
    setWeddingName('');
    setWeddingDate(new Date());
    setShowDatePicker(false);
  }, []);

  const fetchAllBlockedDays = async () => {
    try {
      const response = await api.fetchAllBlockDays();
      const blockedDays = {};
      response.data.forEach((entry) => {
        const { date, restaurantId, restaurantName } = entry;
        if (!blockedDays[date]) {
          blockedDays[date] = { marked: true, dots: [] };
        }
        blockedDays[date].dots.push({
          restaurantId,
          restaurantName,
          color: restaurantColors[restaurantId] || '#CCCCCC',
        });
      });
      setBlockedDays(blockedDays);
    } catch (error) {
      console.error('Ошибка загрузки заблокированных дней:', error);
    }
  };

  useEffect(() => {
    if (data?.restaurants?.length > 0) {
      fetchAllBlockedDays();
    }
  }, [data.restaurants, occupiedRestaurants]);

  const getCalendarPermissions = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  };

  const fetchData = async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    try {
      const responses = await Promise.all([
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
  }, [token, user, navigation]);

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

  const filterDataByBudget = useCallback(() => {
    // Validate budget
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму бюджета');
      return;
    }
  
    // Validate guestCount
    if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
      alert('Пожалуйста, введите корректное количество гостей (положительное число)');
      return;
    }
  
    const budgetValue = parseFloat(budget);
    const guests = parseFloat(guestCount);
  
    // Ensure guests is a reasonable number to prevent unrealistic filtering
    if (guests > 10000) {
      alert('Количество гостей слишком большое. Пожалуйста, введите значение до 10,000.');
      return;
    }
  
    let remaining = budgetValue;
    const selectedItems = [];
  
    // Filter restaurants based on capacity
    const suitableRestaurants = data.restaurants.filter(
      (restaurant) => parseFloat(restaurant.capacity) >= guests
    );
  
    // Check if suitableRestaurants is empty
    if (suitableRestaurants.length === 0) {
      alert('Нет ресторанов с достаточной вместимостью для указанного количества гостей');
      return;
    }
  
    // Filter restaurants by remaining budget and sort by cost
    const sortedRestaurants = suitableRestaurants
      .filter((r) => parseFloat(r.averageCost) <= remaining)
      .sort((a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost));
  
    // Check if any restaurants fit the budget
    if (sortedRestaurants.length === 0) {
      alert('Нет ресторанов, подходящих под ваш бюджет');
      return;
    }
  
    // Select a restaurant based on priceFilter
    let selectedRestaurant;
    if (priceFilter === 'min') {
      selectedRestaurant = sortedRestaurants[0];
    } else if (priceFilter === 'max') {
      selectedRestaurant = sortedRestaurants[sortedRestaurants.length - 1];
    } else {
      selectedRestaurant = sortedRestaurants[Math.floor(sortedRestaurants.length / 2)];
    }
  
    const restaurantCost = parseFloat(selectedRestaurant.averageCost);
    selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
    remaining -= restaurantCost;
  
    // Define item types to filter
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
  
    // Filter and select items for each type
    for (const { key, costField, type } of types) {
      const items = data[key].filter((item) => parseFloat(item[costField]) <= remaining);
      if (items.length > 0) {
        const sortedItems = items.sort((a, b) => parseFloat(a[costField]) - parseFloat(b.averageCost));
        let selectedItem;
        if (priceFilter === 'min') {
          selectedItem = sortedItems[0];
        } else if (priceFilter === 'max') {
          selectedItem = sortedItems[sortedItems.length - 1];
        } else {
          selectedItem = sortedItems[Math.floor(sortedItems.length / 2)];
        }
        const cost = parseFloat(selectedItem[costField]);
        selectedItems.push({ ...selectedItem, type, totalCost: cost });
        remaining -= cost;
      }
    }
  
    // Update state with filtered data
    setFilteredData(selectedItems);
    setRemainingBudget(remaining);
    setQuantities(selectedItems.reduce((acc, item) => ({ ...acc, [`${item.type}-${item.id}`]: '1' }), {}));
    setBudgetModalVisible(false);
  }, [budget, guestCount, priceFilter, data]);







  

  useEffect(() => {
    if (budget && guestCount && !isNaN(parseFloat(budget)) && !isNaN(parseFloat(guestCount))) {
      filterDataByBudget();
    }
  }, [budget, guestCount, priceFilter, filterDataByBudget]);

  const handleQuantityChange = useCallback((itemKey, value) => {
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
  }, [filteredData, budget]);

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

  const handleAddItem = useCallback((item) => {
    const newItem = { ...item, totalCost: item.type === 'restaurant' ? item.averageCost : item.cost };
    setFilteredData((prev) => [...prev, newItem]);
    setQuantities((prev) => ({ ...prev, [`${item.type}-${item.id}`]: '1' }));
    const totalSpent = [...filteredData, newItem].reduce((sum, item) => sum + (item.totalCost || 0), 0);
    setRemainingBudget(parseFloat(budget) - totalSpent);
    setAddItemModalVisible(false);
  }, [filteredData, budget]);

  const handleRemoveItem = useCallback((itemKey) => {
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
  }, [filteredData, budget]);

  const renderItem = useCallback(({ item }) => {
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
            <Text style={styles.cardDetail}>Вместимость: {item.capacity}</Text>
            <Text style={styles.cardDetail}>Средний чек: {item.averageCost} ₸</Text>
          </View>
        );
        break;
      case 'clothing':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Одежда - {item.storeName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'flowers':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Салон цветов - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Цветы: {item.flowerName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'cake':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Кондитерская - {item.name}</Text>
            <Text style={styles.cardDetail}>Тип торта: {item.cakeType}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'alcohol':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Алкогольный магазин - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Напиток: {item.alcoholName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'program':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Программа - {item.teamName}</Text>
            <Text style={styles.cardDetail}>Тип: {item.type}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'tamada':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Тамада - {item.name}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'traditionalGift':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Традиционные подарки - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'transport':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Транспорт - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Авто: {item.carName} Марка: {item.brand}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      case 'goods':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Товар - {item.item_name}</Text>
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
  }, [user, quantities, handleRemoveItem, handleQuantityChange, navigation]);

  const renderSupplierContent = () => {
    const userId = user.id;
    const combinedData = useMemo(() => {
      const dataArray = [
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
      return dataArray.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
    }, [data, userId]);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.supplierContainer}>
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
              initialNumToRender={10}
              windowSize={5}
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

  const createEvent = () => {
    console.log('Opening wedding modal. Current filteredData:', filteredData);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!weddingName) {
      alert('Пожалуйста, заполните имя свадьбы');
      return;
    }
    const dateString = weddingDate.toISOString().split('T')[0];
    const selectedRestaurant = filteredData.find((item) => item.type === 'restaurant');
    if (selectedRestaurant && blockedDays[dateString]) {
      setShowWarningModal(true);
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
      resetWeddingModal();
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
      setShowWarningModal(true);
    }
    setShowDatePicker(false);
  };

  const renderClientContent = () => {
    const combinedData = useMemo(() => {
      const dataArray = [
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
      return dataArray.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
    }, [data]);

    const sortedFilteredData = [...filteredData].sort((a, b) => {
      return (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11);
    });

    return (
      <View style={styles.clientContainer}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetTitle}>Ваш бюджет | Количество гостей</Text>
          {/* <Text style={styles.budgetTitle}>Количество гостей</Text> */}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.budgetInput, styles.inputInline]}
              placeholder="Сумма (₸)"
              value={budget}
              onChangeText={handleBudgetChange}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
             
            <TextInput
              style={[styles.budgetInput, styles.inputInline]}
              placeholder="Гостей"
              value={guestCount}
              onChangeText={handleGuestCountChange}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
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
            onPress={(value) => setPriceFilter(value)}
            buttonColor={COLORS.primary}
            backgroundColor={COLORS.background}
            textColor={COLORS.textSecondary}
            selectedTextStyle={{ color: '#FFFFFF' }}
            style={styles.switchSelector}
          />
        )}
        {budget && (
          <>
            <Text style={styles.sectionTitle}>
              {filteredData.length > 0 ? `Рекомендации (${budget} ₸)` : 'Все объекты'}
            </Text>
            {filteredData.length > 0 && (
              <Text style={styles.budgetInfo}>Остаток: {remainingBudget} ₸</Text>
            )}
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : filteredData.length > 0 ? (
              <FlatList
                data={sortedFilteredData}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                windowSize={5}
              />
            ) : combinedData.length > 0 ? (
              <FlatList
                data={combinedData}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.type}-${item.id}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                windowSize={5}
              />
            ) : (
              <Text style={styles.emptyText}>Нет данных для отображения</Text>
            )}
          </>
        )}
        <AddItemModal
          visible={addItemModalVisible}
          onClose={() => setAddItemModalVisible(false)}
          filteredItems={combinedData}
          filteredData={filteredData}
          handleAddItem={handleAddItem}
          setDetailsModalVisible={setDetailsModalVisible}
          setSelectedItem={setSelectedItem}
        />
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
        {!budget && (
          <View style={styles.noBudgetContainer}>
            <Icon name="attach-money" size={48} color={COLORS.textSecondary} />
            <Text style={styles.noBudgetText}>Пожалуйста, задайте бюджет для отображения записей</Text>
          </View>
        )}
      </View>
    );
  };

  const blockRestaurantDay = async (restaurantId, date) => {
    try {
      const response = await api.addDataBlockToRestaurant(restaurantId, selectedDate);
      alert('Успешно поставлена бронь', response.data.message);
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      alert('В этот день у данного ресторана уже стоит бронь');
    }
  };

  const adminRenderContent = () => {
    const handleBlockDay = async () => {
      if (!selectedRestaurant) {
        alert('Пожалуйста, выберите ресторан');
        return;
      }
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
      const restaurant = data?.restaurants?.find((r) => r.id === restaurantId);
      setSelectedRestaurant(restaurant || null);
      setShowRestaurantModal(false);
      setShowCalendarModal(true);
    };

    return (
      <View style={styles.supplierContainer}>
        <Text style={styles.title}>Панель менеджера</Text>
        <View style={styles.infoCard}>
          <Icon name="restaurant" size={24} color={COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.subtitle}>
            {selectedRestaurant ? `Выбран ресторан: ${selectedRestaurant.name}` : 'Ресторан не выбран'}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Icon name="event" size={24} color={COLORS.secondary} style={styles.infoIcon} />
          <Text style={styles.dateText}>
            Выбранная дата: {selectedDate.toLocaleDateString('ru-RU')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowRestaurantModal(true)}
        >
          <Icon name="calendar-today" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Выбрать дату для бронирования</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRestaurantModal}
          onRequestClose={() => setShowRestaurantModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Выбор ресторана</Text>
                  <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
                    <Icon name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Выберите ресторан:</Text>
                {data?.restaurants?.length > 0 ? (
                  <>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={tempRestaurantId}
                        onValueChange={(itemValue) => setTempRestaurantId(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={COLORS.textPrimary}
                      >
                        <Picker.Item label="Выберите ресторан" value={null} />
                        {data.restaurants.map((item) => (
                          <Picker.Item key={item.id} label={item.name} value={item.id} />
                        ))}
                      </Picker>
                    </View>
                    <TouchableOpacity
                      style={styles.modalActionButton}
                      onPress={handleSelectRestaurant}
                    >
                      <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                      <Text style={styles.modalActionButtonText}>Выбрать ресторан</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.modalText}>Рестораны не найдены</Text>
                )}
              </ScrollView>
            </Animatable.View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCalendarModal}
          onRequestClose={() => setShowCalendarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Выбор даты</Text>
                  <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                    <Icon name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
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
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                  style={styles.calendar}
                />
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={handleBlockDay}
                >
                  <Icon name="lock" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.modalActionButtonText}>Забронировать</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animatable.View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowCalendarModal2(true)}
        >
          <Icon name="visibility" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Просмотр календаря</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCalendarModal2}
          onRequestClose={() => setShowCalendarModal2(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Просмотр календаря</Text>
                  <TouchableOpacity onPress={() => setShowCalendarModal2(false)}>
                    <Icon name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Выберите дату для проверки:</Text>
                <Calendar
                  current={selectedDate.toISOString().split('T')[0]}
                  onDayPress={(day) => {
                    const dateString = day.dateString;
                    setSelectedDate(new Date(day.timestamp));
                    const occupied = blockedDays[dateString]
                      ? blockedDays[dateString].dots.map((entry) => ({
                          id: entry.restaurantId,
                          name: entry.restaurantName,
                        }))
                      : [];
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
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                  style={styles.calendar}
                />
                <View style={styles.occupiedContainer}>
                  {occupiedRestaurants.length > 0 ? (
                    <>
                      <Text style={styles.modalText}>
                        На этот день уже заняты следующие рестораны:
                      </Text>
                      {occupiedRestaurants.map((restaurant) => (
                        <View key={restaurant.id} style={styles.occupiedItem}>
                          <Icon name="restaurant" size={18} color={COLORS.error} />
                          <Text style={styles.occupiedText}>{restaurant.name}</Text>
                        </View>
                      ))}
                    </>
                  ) : (
                    <Text style={styles.modalText}>В этот день нет занятых ресторанов</Text>
                  )}
                </View>
              </ScrollView>
            </Animatable.View>
          </View>
        </Modal>
      </View>
    );
  };

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
        onRequestClose={() => {
          setModalVisible(false);
          resetWeddingModal();
        }}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>Создание мероприятия "Свадьба"</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    resetWeddingModal();
                  }}
                >
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="event-note" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
                  value={weddingName}
                  onChangeText={setWeddingName}
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar-today" size={20} color={COLORS.secondary} style={styles.buttonIcon} />
                <Text style={styles.dateButtonText}>
                  {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <Calendar
                  style={styles.calendar}
                  current={weddingDate.toISOString().split('T')[0]}
                  onDayPress={onDateChange}
                  minDate={new Date().toISOString().split('T')[0]}
                  markedDates={{
                    ...blockedDays,
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
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                  }}
                />
              )}
              <Text style={styles.subtitle}>Выбранные элементы:</Text>
              <View style={styles.itemsContainer}>
                {filteredData.length > 0 ? (
                  [...filteredData]
                    .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11))
                    .map((item) => (
                      <View key={`${item.type}-${item.id}`} style={styles.itemContainer}>
                        <Icon
                          name={
                            item.type === 'restaurant'
                              ? 'restaurant'
                              : item.type === 'clothing'
                              ? 'store'
                              : item.type === 'tamada'
                              ? 'mic'
                              : item.type === 'program'
                              ? 'event'
                              : item.type === 'traditionalGift'
                              ? 'card-giftcard'
                              : item.type === 'flowers'
                              ? 'local-florist'
                              : item.type === 'cake'
                              ? 'cake'
                              : item.type === 'alcohol'
                              ? 'local-drink'
                              : item.type === 'transport'
                              ? 'directions-car'
                              : 'shopping-bag'
                          }
                          size={18}
                          color={COLORS.primary}
                          style={styles.itemIcon}
                        />
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
                                return `${item.itemName} (${item.salonName || 'Не указано'}) - ${item.totalCost || item.cost} тг`;
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
                <Icon name="attach-money" size={20} color={COLORS.accent} style={styles.totalIcon} />
                <Text style={styles.totalText}>
                  Общая стоимость:{' '}
                  {filteredData.reduce((sum, item) => sum + (item.totalCost || item.cost || 0), 0)} тг
                </Text>
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleSubmit}
                >
                  <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.modalButtonText}>Создать свадьбу</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetWeddingModal();
                  }}
                >
                  <Icon name="close" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.modalButtonText}>Закрыть</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>
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
              {blockedDays[weddingDate.toISOString().split('T')[0]]?.dots?.[0]?.restaurantName || 'неизвестно'}.
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetTitle: {
// flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginBottom: 20,
//     gap: 12,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  inputInline: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 12,
  },
  iconButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchSelector: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  budgetInfo: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  clientContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  noBudgetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noBudgetText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
   
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
    color: COLORS.white,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#F7FAFC',
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 15,
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  noItems: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalIcon: {
    marginRight: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  totalCost: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detailsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  addModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: '95%',
    maxHeight: '85%',
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  addModalCloseIcon: {
    padding: 5,
  },
  addModalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    marginBottom: 15,
  },
  addModalSearchIcon: {
    marginHorizontal: 10,
  },
  addModalSearchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
  },
  addModalClearIcon: {
    padding: 10,
  },
  addModalFilterContainer: {
    marginBottom: 15,
  },
  addModalTypeFilterContainer: {
    marginBottom: 10,
  },
  addModalFilterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  addModalTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addModalTypeButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addModalTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addModalTypeButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addModalTypeButtonTextActive: {
    color: COLORS.white,
  },
  addModalDistrictFilterContainer: {
    marginBottom: 10,
  },
  addModalDistrictButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addModalDistrictButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addModalDistrictButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addModalDistrictButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addModalDistrictButtonTextActive: {
    color: COLORS.white,
  },
  addModalPriceFilterContainer: {
    marginBottom: 10,
  },
  addModalPriceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addModalPriceButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addModalPriceButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  addModalPriceButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addModalPriceButtonTextActive: {
    color: COLORS.white,
  },
  addModalItemList: {
    paddingBottom: 20,
  },
  addModalItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addModalItemContent: {
    flex: 1,
  },
  addModalItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  addModalDetailsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addModalDetailsButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  addModalEmptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  detailsModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detailsModalCloseIcon: {
    padding: 5,
  },
  detailsModalContent: {
    marginBottom: 15,
  },
  detailsModalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#F7FAFC',
  },
  picker: {
    height: 48,
    color: COLORS.textPrimary,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  occupiedContainer: {
    marginTop: 10,
  },
  occupiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  occupiedText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});