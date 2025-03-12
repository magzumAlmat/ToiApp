import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
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
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [budget, setBudget] = useState('');
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

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
        api.getAllTransport(),
        api.getAllTamada(),
        api.getAllPrograms(),
        api.getAllTraditionalGifts(),
        api.getAllFlowers(),
        api.getAllCakes(),
        api.getAllAlcohol(),
      ]);

      // Извлекаем данные из каждого ответа и фильтруем по supplier_id
      const userData = responses.map((response, index) => {
        const items = response.data; // Предполагаем, что API возвращает { data: [...] }
        console.log(`Сырые данные для типа ${index}:`, items);
        const filteredItems = items
        console.log(`Отфильтровано для типа ${index}:`, filteredItems);
        return filteredItems;
      });

      const newData = {
        restaurants: userData[0] || [],
        clothing: userData[1] || [],
        // transport: userData[2] || [], // Раскомментируйте, если нужен transport
        tamada: userData[3] || [],
        programs: userData[4] || [],
        traditionalGifts: userData[5] || [],
        flowers: userData[6] || [],
        cakes: userData[7] || [],
        alcohol: userData[8] || [],
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
        default:
          throw new Error('Неизвестный тип объекта');
      }
      alert('Объект успешно удалён!');
    } catch (error) {
      console.error('Ошибка удаления:', error.response || error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
    } finally {
      setModalVisible(false);
      setItemToDelete(null);
    }
  };

  // Функция фильтрации данных по бюджету
  const filterDataByBudget = () => {
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму');
      return;
    }

    const budgetValue = parseFloat(budget);
    let remainingBudget = budgetValue;
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

    console.log('Фильтрация с бюджетом:', budgetValue);
    console.log('Текущие данные:', data);

    for (const { key, costField, type } of types) {
      const items = data[key] || [];
      console.log(`Проверка ${type}, items:`, items);

      if (items.length > 0) {
        const affordableItem = items
          .filter((item) => {
            const cost = parseFloat(item[costField]);
            console.log(`Элемент ${type}:`, { item, cost, remainingBudget });
            return !isNaN(cost) && cost <= remainingBudget;
          })
          .sort((a, b) => parseFloat(b[costField]) - parseFloat(a[costField]))[0];

        if (affordableItem) {
          console.log(`Выбран ${type}:`, affordableItem);
          selectedItems.push({ ...affordableItem, type });
          remainingBudget -= parseFloat(affordableItem[costField]);
        } else {
          console.log(`Нет подходящего элемента для ${type}`);
        }
      } else {
        console.log(`Нет данных для ${type}`);
      }
    }

    console.log('Отфильтрованные данные:', selectedItems);
    setFilteredData(selectedItems);
    setBudgetModalVisible(false);
  };

  const renderItem = ({ item, type }) => {
    let content;
    switch (type) {
      case 'restaurant':
        content = (
          <>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemDetail}>Вместимость: {item.capacity}</Text>
            <Text style={styles.itemDetail}>Кухня: {item.cuisine}</Text>
            <Text style={styles.itemDetail}>Средний чек: {item.averageCost} </Text>
            <Text style={styles.itemDetail}>Адрес: {item.address || 'Не указан'}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone || 'Не указан'}</Text>
            <Text style={styles.itemDetail}>Район: {item.district || 'Не указан'}</Text>
          </>
        );
        break;
      case 'clothing':
        content = (
          <>
            <Text style={styles.itemText}>{item.storeName}</Text>
            <Text style={styles.itemDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.itemDetail}>Пол: {item.gender}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} ₽</Text>
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
            <Text style={styles.itemDetail}>Стоимость: {item.cost} ₽</Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      // Добавьте остальные кейсы (tamada, programs, etc.), если они используются
      default:
        content = <Text style={styles.itemText}>Неизвестный тип: {type}</Text>;
    }
  
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => handleEditItem(item.id, type)}
        >
          {content}
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEditItem(item.id, type)}>
            <Icon name="edit" size={24} color="#2563EB" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteItem(item.id, type)}>
            <Icon name="delete" size={24} color="#EF4444" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // Логика отображения в зависимости от roleId
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
          <Text style={styles.subtitle}>Рекомендации в рамках бюджета ({budget} ):</Text>
          <View style={styles.itemContainer}>
            {loading ? (
              <Text style={styles.text}>Загрузка...</Text>
            ) : filteredData.length > 0 ? (
              <>
              
                {console.log('FD = ', filteredData)}
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => {
                    console.log('Рендеринг элемента:', item); // Отладка
                    return renderItem({ item, type: item.type });
                  }}
                  keyExtractor={(item) => `${item.type}-${item.id}`}
                  style={styles.itemList}
                  ListEmptyComponent={<Text style={styles.text}>Нет данных для отображения</Text>}
                />
              </>
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
        ...data.programs.map((item) => ({ ...item, type: 'program' })),
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
              renderItem={({ item }) => {
                console.log('Рендеринг элемента (combined):', item); // Отладка
                return renderItem({ item, type: item.type });
              }}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              style={styles.itemList}
              ListEmptyComponent={<Text style={styles.text}>Нет данных для отображения</Text>}
            />
          ) : (
            <Text style={styles.text}>У вас пока нет объектов</Text>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение удаления</Text>
            <Text style={styles.modalText}>
              Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
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
          </View>
        </View>
      </Modal>
    </View>
  );
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
    width: '100%', // Убедитесь, что контейнер занимает всю ширину
  },
});