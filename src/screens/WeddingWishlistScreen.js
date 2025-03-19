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
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const weddingId = route.params?.id;

  console.log('USER=',userId)
  
  console.log('WeddingWishlistScreen Started | wishlist=', weddingId);

  // Настройка шапки с кнопками
  useEffect(() => {
    navigation.setOptions({
      headerShown: true, // Включаем шапку
      title: `Список подарков `, // Заголовок с weddingId
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()} // Кнопка "Назад"
        >
          <Text style={styles.headerButtonText}>Назад</Text>
        </TouchableOpacity>
      ),
      // headerRight: () => (
      //   <TouchableOpacity
      //     style={styles.headerButton}
      //     onPress={fetchWishlistItems} // Кнопка "Обновить"
      //   >
      //     <Text style={styles.headerButtonText}>Обновить</Text>
      //   </TouchableOpacity>
      // ),
    });
  }, [navigation, weddingId]);

  // Загрузка списка подарков
  useEffect(() => {
    if (weddingId) {
      fetchWishlistItems();
    } else {
      Alert.alert('Ошибка', 'Не удалось загрузить данные свадьбы');
    }
  }, [weddingId]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await api.getWishlistByWeddingIdWithoutToken(weddingId);
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Ошибка при загрузке подарков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список подарков');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveWishlistItem = (wishlistId) => {
    Alert.prompt(
      'Резервирование подарка',
      'Пожалуйста, введите ваше имя:',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Зарезервировать',
          onPress: async (name) => {
            if (!name || name.trim() === '') {
              Alert.alert('Ошибка', 'Имя не может быть пустым');
              return;
            }
            try {
              console.log('Зерезервировано без токена:', wishlistId, name);
              const data = { reserved_by_unknown: name.trim() };
              const response = await api.reserveWishlistItemWithoutToken(wishlistId, data);
              Alert.alert('Успех', 'Подарок зарезервирован');
              setWishlistItems(
                wishlistItems.map((item) =>
                  item.id === wishlistId
                    ? { ...item, is_reserved: true, reserved_by_unknown: name.trim() }
                    : item
                )
              );
            } catch (error) {
              console.error('Ошибка при резервировании подарка:', error);
              Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарезервировать подарок');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <Text style={styles.itemText}>{item.item_name}</Text>
      <Text style={styles.itemStatus}>
        {item.is_reserved
          ? `Зарезервировано${item.reserved_by_unknown ? ` пользователем: ${item.reserved_by_unknown}` : ''}`
          : 'Свободно'}
      </Text>
      {!item.is_reserved && (
        <TouchableOpacity style={styles.actionButton} onPress={() => handleReserveWishlistItem(item.id)}>
          <Text style={styles.actionButtonText}>Зарезервировать</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
  headerButton: {
    padding: 10,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
});