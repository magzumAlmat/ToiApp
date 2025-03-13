import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Custom color palette
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
  });
  const [filteredData, setFilteredData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('');
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);

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
        transport: userData[8] || [],
      };
      setData(newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Ошибка загрузки: ' + (error.response?.data?.message || error.message));
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
      { key: 'transport', costField: 'cost', type: 'transport' },
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
    setQuantities((prev) => ({ ...prev, [itemKey]: value }));
    const quantity = value === '' ? 0 : parseFloat(value);

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
  };

  const handleAddItem = (item) => {
    const newItem = { ...item, totalCost: item.type === 'restaurant' ? item.averageCost : item.cost };
    setFilteredData((prev) => [...prev, newItem]);
    setQuantities((prev) => ({ ...prev, [`${item.type}-${item.id}`]: '1' }));
    const totalSpent = [...filteredData, newItem].reduce((sum, item) => sum + (item.totalCost || 0), 0);
    setRemainingBudget(parseFloat(budget) - totalSpent);
    setAddItemModalVisible(false);
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
      default:
        content = <Text style={styles.cardTitle}>Неизвестный тип: {item.type}</Text>;
    }

    return (
      <View style={styles.card}>
        {content}
        <View style={styles.cardFooter}>
          <TextInput
            style={styles.quantityInput}
            placeholder="Кол-во"
            value={quantities[itemKey] || ''}
            onChangeText={(value) => handleQuantityChange(itemKey, value)}
            keyboardType="numeric"
          />
          <Text style={styles.totalCost}>Итого: {totalCost} ₸</Text>
        </View>
        {user?.roleId !== 3 && (
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
        title = `Одежда: ${item.storeName} -ВАШ - ${item.itemName} (${item.cost} ₸)`;
        break;
      case 'flowers':
        title = `Цветы: ${item.salonName} - ${item.flowerName} (${item.cost} ₸)`;
        break;
      case 'cake':
        title = `Торты: ${item.name} (${item.cost} ₸)`;
        break;
      case 'alcohol':
        title = `Алгоколь: ${item.salonName} - ${item.alcoholName} (${item.cost} ₸)`;
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
      default:
        title = 'Неизвестный элемент';
    }

    return (
      <TouchableOpacity
        style={styles.addItemCard}
        onPress={() => handleAddItem(item)}
      >
        <Text style={styles.addItemText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
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
    ];

    return (
      <>
        <TouchableOpacity
          style={styles.budgetButton}
          onPress={() => setBudgetModalVisible(true)}
        >
          <Text style={styles.budgetButtonText}>Задать бюджет</Text>
        </TouchableOpacity>
        <Modal
          visible={budgetModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ваш бюджет</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="Сумма (₸)"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
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
            </View>
          </View>
        </Modal>
        <Text style={styles.sectionTitle}>
          {filteredData.length > 0 ? `Рекомендации (${budget} ₸)` : 'Все объекты'}
        </Text>
        {filteredData.length > 0 && (
          <Text style={[styles.budgetInfo, remainingBudget < 0 && styles.budgetError]}>
            Остаток: {remainingBudget} ₸
          </Text>
        )}
        {loading ? (
          <Text style={styles.loadingText}>Загрузка...</Text>
        ) : filteredData.length > 0 ? (
          <>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              style={styles.list}
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
            style={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>Нет данных для отображения</Text>
        )}
        <Modal
          visible={addItemModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.addModalContent}>
              <Text style={styles.modalTitle}>Добавить элемент</Text>
              <ScrollView style={styles.addItemList}>
                {combinedData.map((item) => (
                  <View key={`${item.type}-${item.id}`}>
                    {renderAddItem({ item })}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddItemModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Планировщик бюджета</Text>
     
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
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
    color:'#0000000',
    marginBottom: 16,
  },
  budgetError: {
    color: COLORS.error,
  },
  list: {
    flex: 1,
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
    color: '#0000000',
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
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
    padding: 24,
    alignItems: 'center',
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
    marginBottom: 16,
    textAlign: 'center',
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
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    marginTop:"20",
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addItemList: {
    flex: 1,
    marginBottom: 20,
    height:'200',
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
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});