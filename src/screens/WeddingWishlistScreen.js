import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WeddingWishlistScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token); // Токен из Redux
  const userId = useSelector((state) => state.auth.user?.id); // ID пользователя из Redux

  // Состояния
  const [wishlistItems, setWishlistItems] = useState([]); // Список подарков
  const [loading, setLoading] = useState(true); // Статус загрузки
  const weddingId = route.params?.id; // Для теста, позже можно вернуть route.params?.id

  console.log('wishlist= ',weddingId)
  // Загрузка списка подарков при монтировании
  useEffect(() => {
    if (weddingId) {
      fetchWishlistItems();
    } else {
      Alert.alert('Ошибка', 'Не удалось загрузить данные свадьбы');
    }
  }, [weddingId]);

  // Получение списка подарков
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await api.getWishlistByWeddingId(weddingId, token);
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Ошибка при загрузке подарков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список подарков');
    } finally {
      setLoading(false);
    }
  };

  // Резервирование подарка с запросом имени
  const handleReserveWishlistItem = (wishlistId) => {
    Alert.prompt(
      'Резервирование подарка',
      'Пожалуйста, введите ваше имя:',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Зарезервировать',
          onPress: async (name) => {
            if (!name || name.trim() === '') {
              Alert.alert('Ошибка', 'Имя не может быть пустым');
              return;
            }

            try {
              // Передаём имя в API-запрос
              console.log('зерезрирование без токена ',wishlistId,name)
              const data={reserved_by_unknown: name.trim(),}
              const response = await api.reserveWishlistItemWithoutToken(wishlistId, data);
              Alert.alert('Успех', 'Подарок зарезервирован',wishlistId);
              // Обновляем локальный список подарков
              setWishlistItems(
                wishlistItems.map((item) =>
                  item.id === wishlistId
                    ? { ...item, is_reserved: true, reserved_by_unknown: name.trim() }
                    : item
                )
              );
            } catch (error) {
              console.error('Ошибка при резервировании подарка:', error);
              Alert.alert(
                'Ошибка',
                error.response?.data?.error || 'Не удалось зарезервировать подарок'
              );
            }
          },
        },
      ],
      'plain-text' // Тип ввода — обычный текст
    );
  };

  // Рендеринг элемента списка подарков
  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <Text style={styles.itemText}>{item.item_name}</Text>
      <Text style={styles.itemStatus}>
        {item.is_reserved
          ? `Зарезервировано${item.reserved_by_unknown ? ` пользователем: ${item.reserved_by_unknown}` : ''}`
          : 'Свободно'}
      </Text>
      {!item.is_reserved && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleReserveWishlistItem(item.id)}
        >
          <Text style={styles.actionButtonText}>Зарезервировать</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Отображение экрана
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Список подарков для свадьбы #{weddingId}</Text>
      {loading ? (
        <Text style={styles.noItems}>Загрузка...</Text>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.noItems}>Подарков пока нет</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  wishlistItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noItems: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});