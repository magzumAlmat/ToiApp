import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const host = process.env.BACKEND_URL || 'http://localhost:6666';

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login');
    }
    console.log(restaurants)
  }, [token, navigation,restaurants]);

  useEffect(() => {
    if (token && user?.id) {
      const fetchRestaurants = async () => {
        setLoading(true);
        try {
          const response = await api.getRestaurans(); // Исправлено на getRestaurants
          console.log('Ответ список всех ресторанов:', response.data);
          const userRestaurants = response.data.filter(
            (restaurant) => restaurant.supplier_id === user.id
          );
          console.log('Отфильтрованные рестораны пользователя:', userRestaurants);
          setRestaurants(userRestaurants);
        } catch (error) {
          console.error('Ошибка загрузки ресторанов:', error.response || error);
          alert('Ошибка загрузки ресторанов: ' + (error.response?.data?.message || error.message));
        } finally {
          setLoading(false);
        }
      };
      fetchRestaurants();
    }
  }, [token, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditRestaurant = (id) => {
    console.log('id ресторана= ', id);
    navigation.navigate('Restaurant', { id });
  };

  const confirmDeleteRestaurant = (id) => {
    setRestaurantToDelete(id); // Устанавливаем ID ресторана для удаления
    setModalVisible(true); // Показываем модальное окно
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurantToDelete) return;

    try {
      await api.deleteRestaurant(restaurantToDelete);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== restaurantToDelete));
      // alert('Ресторан успешно удалён!');
    } catch (error) {
      console.error('Ошибка удаления ресторана:', error.response || error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
    } finally {
      setModalVisible(false); // Закрываем модальное окно
      setRestaurantToDelete(null); // Сбрасываем ID
    }
  };

  const renderRestaurant = ({ item }) => {
    console.log('Рендеринг ресторана:', item);
    return (
      <View style={styles.restaurantItem}>
        <TouchableOpacity
          style={styles.restaurantContent}
          onPress={() => handleEditRestaurant(item.id)}
        >
          <Text style={styles.restaurantText}>{item.name}</Text>
          <Text style={styles.restaurantDetail}>Вместимость: {item.capacity}</Text>
          <Text style={styles.restaurantDetail}>Кухня: {item.cuisine}</Text>
          <Text style={styles.restaurantDetail}>Средний чек: {item.averageCost} ₽</Text>
          <Text style={styles.restaurantDetail}>Адрес: {item.address || 'Не указан'}</Text>
          <Text style={styles.restaurantDetail}>Телефон: {item.phone || 'Не указан'}</Text>
          <Text style={styles.restaurantDetail}>Район: {item.district || 'Не указан'}</Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEditRestaurant(item.id)}>
            <Icon name="edit" size={24} color="#2563EB" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteRestaurant(item.id)}>
            <Icon name="delete" size={24} color="#EF4444" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>
      {user && <Text style={styles.text}>Email: {user.email}</Text>}
      {token ? (
        <Text style={styles.text}>Токен: {token}</Text>
      ) : (
        <Text style={styles.text}>Токен отсутствует</Text>
      )}

      <Button title="Выйти" onPress={handleLogout} />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Restaurant')}
      >
        <Text style={styles.createButtonText}>Создать новый ресторан</Text>
      </TouchableOpacity>

      <View style={styles.restaurantContainer}>
        <Text style={styles.subtitle}>Ваши рестораны:</Text>
        {loading ? (
          <Text style={styles.text}>Загрузка...</Text>
        ) : restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id.toString()}
            style={styles.restaurantList}
          />
        ) : (
          <Text style={styles.text}>У вас пока нет ресторанов</Text>
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
              Вы уверены, что хотите удалить этот ресторан? Это действие нельзя отменить.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setRestaurantToDelete(null);
                }}
              >
                <Text style={styles.modalButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeleteRestaurant}
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
  restaurantContainer: {
    marginTop: 20,
    flex: 1,
  },
  restaurantList: {
    flex: 1,
  },
  restaurantItem: {
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
  restaurantContent: {
    flex: 1,
  },
  restaurantText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  restaurantDetail: {
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
  createButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
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