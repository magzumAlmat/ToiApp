import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
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
    transport: [],
    tamada: [],
    programs: [],
    traditionalGifts: [],
    flowers: [],
    cakes: [],
    alcohol: [],
  });
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Объект для удаления: { id, type }
  const [modalVisible, setModalVisible] = useState(false);

  // Функции загрузки данных
  const fetchData = async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    try {
      const responses = await Promise.all([
        api.getRestaurans(),
        api.getAllClothing(),
        api.getAllTransport(),
        api.getAllTamada(),
        api.getAllPrograms(),
        api.getAllTraditionalGifts(),
        api.getAllFlowers(),
        api.getAllCakes(),
        api.getAllAlcohol(),
      ]);

      const userData = responses.map((response) =>
        response.data.filter((item) => item.supplier_id === user.id)
      );

      setData({
        restaurants: userData[0],
        clothing: userData[1],
        transport: userData[2],
        tamada: userData[3],
        programs: userData[4],
        traditionalGifts: userData[5],
        flowers: userData[6],
        cakes: userData[7],
        alcohol: userData[8],
      });
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
    // Здесь можно настроить навигацию на соответствующий экран редактирования
    // Пока предполагаем, что все редактируются через один экран, например 'ItemEdit'
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
        case 'transport':
          await api.deleteTransport(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            transport: prev.transport.filter((item) => item.id !== itemToDelete.id),
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
      // alert('Объект успешно удалён!');
    } catch (error) {
      console.error('Ошибка удаления:', error.response || error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
    } finally {
      setModalVisible(false);
      setItemToDelete(null);
    }
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
            <Text style={styles.itemDetail}>Средний чек: {item.averageCost} ₽</Text>
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
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      case 'transport':
        content = (
          <>
            <Text style={styles.itemText}>{item.salonName}</Text>
            <Text style={styles.itemDetail}>Авто: {item.carName}</Text>
            <Text style={styles.itemDetail}>Марка: {item.brand}</Text>
            <Text style={styles.itemDetail}>Цвет: {item.color}</Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      case 'tamada':
        content = (
          <>
            <Text style={styles.itemText}>Тамада #{item.id}</Text>
            <Text style={styles.itemDetail}>Портфолио: {item.portfolio}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
          </>
        );
        break;
      case 'program':
        content = (
          <>
            <Text style={styles.itemText}>{item.teamName}</Text>
            <Text style={styles.itemDetail}>Тип: {item.type}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
          </>
        );
        break;
      case 'traditionalGift':
        content = (
          <>
            <Text style={styles.itemText}>{item.salonName}</Text>
            <Text style={styles.itemDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.itemDetail}>Тип: {item.type}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
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
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      case 'cake':
        content = (
          <>
            <Text style={styles.itemText}>{item.salonName}</Text>
            <Text style={styles.itemDetail}>Тип торта: {item.cakeType}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
      case 'alcohol':
        content = (
          <>
            <Text style={styles.itemText}>{item.salonName}</Text>
            <Text style={styles.itemDetail}>Алкоголь: {item.alcoholName}</Text>
            <Text style={styles.itemDetail}>Категория: {item.category}</Text>
            <Text style={styles.itemDetail}>Стоимость: {item.cost} </Text>
            <Text style={styles.itemDetail}>Адрес: {item.address}</Text>
            <Text style={styles.itemDetail}>Телефон: {item.phone}</Text>
            <Text style={styles.itemDetail}>Район: {item.district}</Text>
          </>
        );
        break;
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

  // Собираем все данные в один массив для FlatList
  const combinedData = [
    ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
    ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
    ...data.transport.map((item) => ({ ...item, type: 'transport' })),
    ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
    ...data.programs.map((item) => ({ ...item, type: 'program' })),
    ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
    ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
    ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
    ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
  ];

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Добро пожаловать!</Text>
      {user && <Text style={styles.text}>Email: {user.email}</Text>}
      {token ? (
        <Text style={styles.text}>Токен: {token}</Text>
      ) : (
        <Text style={styles.text}>Токен отсутствует</Text>
      )} */}

      {/* <Button title="Выйти" onPress={handleLogout} /> */}

   
      <View style={styles.itemContainer}>
       
        {loading ? (
          <Text style={styles.text}>Загрузка...</Text>
        ) : combinedData.length > 0 ? (
          <FlatList
            data={combinedData}
            renderItem={({ item }) => renderItem({ item, type: item.type })}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            style={styles.itemList}
          />
        ) : (
          <Text style={styles.text}>У вас пока нет объектов</Text>
        )}
      </View>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
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
  // itemContainer: {
  //   marginTop: 20,
  //   flex: 1,
  // },
  itemList: {
    flex: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
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