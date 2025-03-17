import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WeddingWishlistScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const weddingId = route.params?.weddingId; // ID свадьбы из deep link
  const token = useSelector((state) => state.auth.token); // Токен из Redux

  // Состояния
  const [wedding, setWedding] = useState(null); // Информация о свадьбе
  const [wishlistItems, setWishlistItems] = useState([]); // Список подарков

  // Загрузка данных свадьбы и подарков
  useEffect(() => {
    if (weddingId) {
      fetchWeddingDetails();
      fetchWishlistItems();
    }
  }, [weddingId]);

  // Получение информации о свадьбе
  const fetchWeddingDetails = async () => {
    try {
      const response = await api.getWeddingById(weddingId, token); // Предполагается, что такой метод будет добавлен
      setWedding(response.data.data);
    } catch (error) {
      console.error('Ошибка при загрузке свадьбы:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить информацию о свадьбе');
    }
  };

  // Получение списка подарков
  const fetchWishlistItems = async () => {
    try {
      const response = await api.getWishlistByWeddingId(weddingId, token);
      setWishlistItems(response.data.data);
    } catch (error) {
      console.error('Ошибка при загрузке списка подарков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список подарков');
    }
  };

  // Резервирование подарка
  const handleReserveWishlistItem = async (wishlistId) => {
    Alert.alert(
      'Подтверждение',
      'Вы хотите зарезервировать этот подарок?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Зарезервировать',
          onPress: async () => {
            try {
              const response = await api.reserveWishlistItem(wishlistId, token);
              Alert.alert('Успех', 'Подарок зарезервирован');
              setWishlistItems(
                wishlistItems.map((item) =>
                  item.id === wishlistId ? response.data.data : item
                )
              );
            } catch (error) {
              console.error('Ошибка при резервировании подарка:', error);
              Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарезервировать подарок');
            }
          },
        },
      ]
    );
  };

  // Рендеринг элемента списка подарков
  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItemContainer}>
      <Text style={styles.itemText}>{item.item_name}</Text>
      <Text style={styles.itemText}>
        {item.description || 'Без описания'} -{' '}
        {item.is_reserved ? `Зарезервировано: ${item.Reserver?.username || 'Кем-то'}` : 'Свободно'}
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

  return (
    <SafeAreaView style={styles.container}>
      {wedding ? (
        <>
          <Text style={styles.title}>{wedding.name}</Text>
          <Text style={styles.subtitle}>Дата: {wedding.date}</Text>
          <Text style={styles.subtitle}>Список подарков:</Text>
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noItems}>Подарков пока нет</Text>}
          />
        </>
      ) : (
        <Text style={styles.noItems}>Загрузка...</Text>
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
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  wishlistItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
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