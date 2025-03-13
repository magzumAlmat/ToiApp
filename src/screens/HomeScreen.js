import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  });
  const [filteredData, setFilteredData] = useState([]);
  const [quantities, setQuantities] = useState({}); // Хранит количество для каждой записи
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(0);

  // Функция загрузки данных
  const fetchData = async () => {
    if (!token || !user?.id) {
      console.log('Токен или user.id отсутствует:', { token, userId: user?.id });
      return;
    }
    setLoading(true);
    try {
      console.log('Загрузка данных для пользователя с id:', user.id);
      const responses = await Promise.all([
        api.getRestaurans(), // Исправлено на getRestaurants
        api.getAllClothing(),
        api.getAllTamada(),
        api.getAllPrograms(),
        api.getAllTraditionalGifts(),
        api.getAllFlowers(),
        api.getAllCakes(),
        api.getAllAlcohol(),
      ]);

      const userData = responses.map((response) => response.data);

      const newData = {
        restaurants: userData[0] || [],
        clothing: userData[1] || [],
        tamada: userData[2] || [],
        programs: userData[3] || [],
        traditionalGifts: userData[4] || [],
        flowers: userData[5] || [],
        cakes: userData[6] || [],
        alcohol: userData[7] || [],
      };
      setData(newData);
      console.log('Загруженные данные:', newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error.response || error);
      alert('Ошибка загрузки: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login');
    } else {
      fetchData();
    }
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
    setModalVisible(true);
  };

  const handleDeleteItem = async () => {
    // Логика удаления осталась без изменений
  };

  // Функция фильтрации данных по бюджету
  const filterDataByBudget = () => {
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму');
      return;
    }

    const budgetValue = parseFloat(budget);
    let remaining = budgetValue;
    const selectedItems = [];

    const types = [
      { key: 'restaurants', costField: 'averageCost', type: 'restaurant' },
      { key: 'clothing', costField: 'cost', type: 'clothing' },
      { key: 'tamada', costField: 'cost', type: 'tamada' },
      { key: 'programs', costField: 'cost', type: 'program' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
      { key: 'flowers', costField: 'cost', type: 'flowers' },
      { key: 'cakes', costField: 'cost', type: 'cake' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol' },
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

  // Обновление количества и пересчёт общей стоимости
  const handleQuantityChange = (itemKey, value) => {
    // Always update the quantities state with the raw input
    setQuantities((prev) => ({ ...prev, [itemKey]: value }));
  
    // Convert input value to a number for calculations, treat empty string as 0
    const quantity = value === '' ? 0 : parseFloat(value);
  
    // Only proceed with calculations if quantity is valid and within range
    if (isNaN(quantity) || quantity > 1000) {
      // If invalid, reset totalCost to 0 for this item
      const updatedFilteredData = filteredData.map((item) => {
        const key = `${item.type}-${item.id}`;
        if (key === itemKey) {
          return { ...item, totalCost: 0 };
        }
        return item;
      });
      setFilteredData(updatedFilteredData);
    } else {
      // Update filteredData with the new totalCost
      const updatedFilteredData = filteredData.map((item) => {
        const key = `${item.type}-${item.id}`;
        if (key === itemKey) {
          const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
          const totalCost = cost * quantity;
          return { ...item, totalCost };
        }
        return item;
      });
      setFilteredData(updatedFilteredData);
    }
  
    // Recalculate total spent and remaining budget
    const totalSpent = filteredData.reduce((sum, item) => sum + (item.totalCost || 0), 0);
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
          <>
          <ScrollView>
          <Text style={styles.itemText}>{item.type}</Text>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemDetail}>Вместимость: {item.capacity}</Text>
            <Text style={styles.itemDetail}>Кухня: {item.cuisine}</Text>
            <Text style={styles.itemDetail}>Средний чек: {item.averageCost} ₸</Text>
            <Text style={styles.itemDetail}>Адрес: {item.address || 'Не указан'}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone || 'Не указан'}</Text>
            <Text style={styles.itemDetail}>Район: {item.district || 'Не указан'}</Text>
            </ScrollView>
          </>
        );
        break;
      case 'clothing':
        content = (
          <>
            <Text style={styles.itemText}>{item.storeName}</Text>
            <Text style={styles.itemDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.itemDetail}>Пол: {item.gender}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      case 'flowers':
        content = (
          <>
            <Text style={styles.itemText}>{item.salonName}</Text>
            <Text style={styles.itemDetail}>Цветы: {item.flowerName}</Text>
            <Text style={styles.itemDetail}>Тип: {item.flowerType}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} ₸</Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      default:
        content = <Text style={styles.itemText}>Неизвестный тип: {item.type}</Text>;
    }

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          {content}
          <TextInput
            style={styles.quantityInput}
            placeholder="Количество"
            value={quantities[itemKey] || ''} // Use the specific item's quantity from state
            onChangeText={(value) => handleQuantityChange(itemKey, value)}
            keyboardType="numeric"
          />
          <Text style={styles.itemDetail}>Итоговая стоимость: {totalCost} ₸</Text>
        </View>
        {user?.roleId !== 3 && (
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEditItem(item.id, item.type)}>
              <Icon name="edit" size={24} color="#2563EB" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteItem(item.id, item.type)}>
              <Icon name="delete" size={24} color="#EF4444" style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (user?.roleId === 3) {
      return (
        <>
          <TouchableOpacity
            style={styles.budgetButton}
            onPress={() => setBudgetModalVisible(true)}
          >
            <Text style={styles.budgetButtonText}>Ввести бюджет</Text>
          </TouchableOpacity>

          <Modal
            visible={budgetModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setBudgetModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Введите ваш бюджет</Text>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="Сумма в тенге"
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtonContainer}>
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
                    <Text style={styles.modalButtonText}>Подтвердить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Text style={styles.subtitle}>Рекомендации в рамках бюджета ({budget} ₸):</Text>
          <Text style={styles.text}>Остаток бюджета: {remainingBudget} ₸</Text>
          <View style={styles.itemContainer}>
          {loading ? (
            <Text style={styles.text}>Загрузка...</Text>
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              style={styles.itemList}
            />
           
          ) : (
            <Text style={styles.text}>Введите бюджет для получения рекомендаций</Text>
          )}
        </View>
        </>
      );
    } else {
      const combinedData = [
        ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
        ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
        ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
        ...data.programs.map((item) => ({ ...item, type: 'programs' })),
        ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
        ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
        ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
        ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
      ];

      return (
        <View style={styles.itemContainer}>
          {loading ? (
            <Text style={styles.text}>Загрузка...</Text>
          ) : combinedData.length > 0 ? (
            <FlatList
              data={combinedData}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              style={styles.itemList}
            />
          ) : (
            <Text style={styles.text}>У вас пока нет объектов</Text>
          )}
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#4B5563',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1F2937',
  },
  itemList: {
    flex: 1,
    width: '100%',
    height:'400'
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemDetail: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  icon: {
    marginHorizontal: 5,
  },
  budgetButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  budgetInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  quantityInput: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 5,
    marginTop: 10,
    width: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});