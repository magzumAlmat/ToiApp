import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
  const host = process.env.BACKEND_URL || 'http://localhost:6666';

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login');
    }
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

  const handleDeleteRestaurant = async (id) => {
    try {
      await api.deleteRestaurant(id);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
      alert('Ресторан успешно удалён!');
    } catch (error) {
      console.error('Ошибка удаления ресторана:', error.response || error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
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
          <TouchableOpacity onPress={() => handleDeleteRestaurant(item.id)}>
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
});