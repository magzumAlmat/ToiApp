import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../api/api'; // Ваш API-клиент
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Item3Screen() {
  const route = useRoute();
  const navigation = useNavigation();
  const selectedItems = route.params?.data || []; // Массив выбранных данных (items)
  const userId = useSelector((state) => state.auth.user?.id); // ID пользователя из Redux
  const token = useSelector((state) => state.auth.token); // Токен из Redux

  // Состояния
  const [weddings, setWeddings] = useState([]); // Список свадеб
  const [modalVisible, setModalVisible] = useState(false); // Модалка для создания свадьбы
  const [wishlistModalVisible, setWishlistModalVisible] = useState(false); // Модалка для подарков
  const [editModalVisible, setEditModalVisible] = useState(false); // Модалка для редактирования
  const [wishlistViewModalVisible, setWishlistViewModalVisible] = useState(false); // Модалка для просмотра подарков
  const [weddingName, setWeddingName] = useState(''); // Имя свадьбы
  const [weddingDate, setWeddingDate] = useState(''); // Дата свадьбы в формате YYYY-MM-DD
  const [selectedWedding, setSelectedWedding] = useState(null); // Выбранная свадьба
  const [wishlistItemName, setWishlistItemName] = useState(''); // Название подарка
  const [wishlistDescription, setWishlistDescription] = useState(''); // Описание подарка
  const [wishlistItems, setWishlistItems] = useState([]); // Список подарков

  // Загрузка списка свадеб при монтировании
  useEffect(() => {
    fetchWeddings();
  }, []);

  useEffect(() => {
    
  }, [weddings]);
  // Получение всех свадеб пользователя
  const fetchWeddings = async () => {
    console.log('id=',userId,'token=',token)
    try {
      const response = await api.getWedding(userId,token)
      setWeddings(response.data.data);
      // console.log(response.data.data)

    } catch (error) {
      console.error('Ошибка при загрузке свадеб:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список свадеб');
    }
  };

  // Создание новой свадьбы
  const handleCreateWedding = async () => {
    if (!weddingName || !weddingDate) {
      Alert.alert('Ошибка', 'Заполните имя и дату свадьбы');
      return;
    }

    const weddingData = {
      name: weddingName,
      date: weddingDate,
      items: selectedItems.map((item) => ({
        id: item.id,
        type: item.type,
        totalCost: item.totalCost || 0,
      })),
    };

    try {
      const response = await api.createWedding(weddingData, token);
      alert('Успех', 'Свадьба успешно создана');
      setWeddings([...weddings, response.data.data]);
      setModalVisible(false);
      setWeddingName('');
      setWeddingDate('');

    } catch (error) {
      console.error('Ошибка при создании свадьбы:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось создать свадьбу');
    }
  };

  // Обновление свадьбы
  const handleUpdateWedding = async () => {
    if (!selectedWedding || !weddingName || !weddingDate) {
      Alert.alert('Ошибка', 'Заполните имя и дату свадьбы');
      return;
    }
    console.log('Updating wedding:', selectedWedding.id, token, weddingDate, weddingName);

    try {
      const data = {
        name: weddingName,
        date: weddingDate,
      };
      const response = await api.updateWedding(selectedWedding.id, token, data);
      Alert.alert('Успех', 'Свадьба обновлена');
      setWeddings(weddings.map((w) => (w.id === selectedWedding.id ? response.data.data : w)));
      setEditModalVisible(false);
      setWeddingName('');
      setWeddingDate('');
      setSelectedWedding(null);
    } catch (error) {
      console.error('Ошибка при обновлении свадьбы:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось обновить свадьбу');
    }
  };

  // Удаление свадьбы
  const handleDeleteWedding = async (id) => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите удалить эту свадьбу?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          onPress: async () => {
            try {
              await api.deleteWedding(id, token);
              setWeddings(weddings.filter((w) => w.id !== id));
              Alert.alert('Успех', 'Свадьба удалена');
            } catch (error) {
              console.error('Ошибка при удалении свадьбы:', error);
              Alert.alert('Ошибка', 'Не удалось удалить свадьбу');
            }
          },
        },
      ]
    );
  };

  // Добавление подарка
  const handleAddWishlistItem = async () => {
    if (!wishlistItemName) {
      Alert.alert('Ошибка', 'Введите название подарка');
      return;
    }

    const wishlistData = {
      wedding_id: selectedWedding.id,
      item_name: wishlistItemName,
      description: wishlistDescription,
    };

    try {
      const response = await api.createWish(wishlistData, token);
      Alert.alert('Успех', 'Подарок добавлен');
      setWishlistModalVisible(false);
      setWishlistItemName('');
      setWishlistDescription('');
      fetchWeddings(); // Обновляем список свадеб
    } catch (error) {
      console.error('Ошибка при добавлении подарка:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось добавить подарок');
    }
  };

  // Получение списка подарков для свадьбы
  const fetchWishlistItems = async (weddingId) => {
    try {
      const response = await api.getWishlistByWeddingId(weddingId, token);
      setWishlistItems(response.data.data);
      setWishlistViewModalVisible(true);
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

  // Открытие модалки редактирования
  const openEditModal = (wedding) => {
    setSelectedWedding(wedding);
    setWeddingName(wedding.name);
    setWeddingDate(wedding.date);
    setEditModalVisible(true);
  };

  // Рендеринг элемента свадьбы
  const renderWeddingItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name} ({item.date})</Text>
      <Text style={styles.itemText}>
        Элементы: {item.WeddingItems?.length || 0}
        {/* <List>{item}
 </List>        */}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Редактировать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedWedding(item);
            setWishlistModalVisible(true);
          }}
        >
          <Text style={styles.actionButtonText}>Добавить подарок</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedWedding(item);
            fetchWishlistItems(item.id);
          }}
        >
          <Text style={styles.actionButtonText}>Просмотреть подарки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteWedding(item.id)}
        >
          <Text style={styles.actionButtonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <Text style={styles.title}>Мои мероприятия</Text>
      {/* <Button title="Создать свадьбу" onPress={() => setModalVisible(true)} /> */}

      <FlatList
        data={weddings}
        renderItem={renderWeddingItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noItems}>Свадеб пока нет</Text>}
      />

      {/* Модальное окно для создания свадьбы */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.subtitle}>Создание свадьбы</Text>
          <TextInput
            autoComplete="off"
            style={styles.input}
            placeholder="Название свадьбы"
            value={weddingName}
            onChangeText={setWeddingName}
          />
          <TextInput
            autoComplete="off"
            style={styles.input}
            placeholder="Дата свадьбы (YYYY-MM-DD)"
            value={weddingDate}
            onChangeText={setWeddingDate}
          />
          <Button title="Создать" onPress={handleCreateWedding} />
          <Button title="Отмена" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Модальное окно для редактирования свадьбы */}
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.subtitle}>Редактирование свадьбы</Text>
          <TextInput
            autoComplete="falsedasd"
            style={styles.input}
            placeholder="Название свадьбы"
            value={weddingName}
            onChangeText={setWeddingName}
          />
          <TextInput
            autoComplete="off"
            style={styles.input}
            placeholder="Дата свадьбы (YYYY-MM-DD)"
            value={weddingDate}
            onChangeText={setWeddingDate}
          />
          <Button title="Сохранить" onPress={handleUpdateWedding} />
          <Button title="Отмена" onPress={() => setEditModalVisible(false)} />
        </View>
      </Modal>

      {/* Модальное окно для добавления подарка */}
      <Modal visible={wishlistModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.subtitle}>Добавить подарок</Text>
          <TextInput
            autoComplete="off"
            style={styles.input}
            placeholder="Название подарка"
            value={wishlistItemName}
            onChangeText={setWishlistItemName}
          />
          <TextInput
            autoComplete="off"
            style={styles.input}
            placeholder="Описание (опционально)"
            value={wishlistDescription}
            onChangeText={setWishlistDescription}
          />
          <Button title="Добавить" onPress={handleAddWishlistItem} />
          <Button title="Отмена" onPress={() => setWishlistModalVisible(false)} />
        </View>
      </Modal>

      {/* Модальное окно для просмотра подарков */}
      <Modal visible={wishlistViewModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.subtitle}>
            Подарки для свадьбы: {selectedWedding?.name}
          </Text>

          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noItems}>Подарков пока нет</Text>}
          />
          <Button title="Закрыть" onPress={() => setWishlistViewModalVisible(false)} />
        </SafeAreaView>
      </Modal>



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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    margin: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});