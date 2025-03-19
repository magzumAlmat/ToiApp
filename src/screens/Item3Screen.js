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
  Share,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import * as Linking from 'expo-linking';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
export default function Item3Screen() {
  const route = useRoute();
  const navigation = useNavigation();
  const selectedItems = route.params?.data || [];
  const userId = useSelector((state) => state.auth.user?.id);
  const token = useSelector((state) => state.auth.token);
  const [weddingItems, setWeddingItems] = useState([]);
  const [weddings, setWeddings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [wishlistModalVisible, setWishlistModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [wishlistViewModalVisible, setWishlistViewModalVisible] = useState(false);
  const [weddingName, setWeddingName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [goods, setGoods] = useState([]);
  const [selectedGoodId, setSelectedGoodId] = useState('');
  const [wishlistFiles, setWishlistFiles] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [errorFiles, setErrorFiles] = useState(null);
  const [loadingWeddings, setLoadingWeddings] = useState(true); // Состояние загрузки свадеб

  const BASE_URL = 'http://localhost:3000';

  useFocusEffect(
    React.useCallback(() => {
      fetchWeddings(); // Перезагружаем данные при фокусе экрана
    }, [])
  );

  useEffect(() => {
    fetchWeddings();
    fetchGoods();
  }, []);

  useEffect(() => {
    console.log('Updated weddings:', weddings);
    console.log('Updated weddingItems:', weddingItems);
  }, [weddings, weddingItems]);

  const fetchWeddings = async () => {
    console.log('Fetching weddings with id=', userId, 'token=', token);
    setLoadingWeddings(true); // Начинаем загрузку
    try {
      const response = await api.getWedding(token);
      console.log('API response for weddings:', response.data);
      setWeddings(response.data.data || []); // Устанавливаем пустой массив, если данных нет
    } catch (error) {
      console.error('Ошибка при загрузке свадеб:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список свадеб');
      setWeddings([]); // Устанавливаем пустой массив в случае ошибки
    } finally {
      setLoadingWeddings(false); // Завершаем загрузку
    }
  };

  const fetchGoods = async () => {
    try {
      const response = await api.getGoods(token);
      setGoods(response.data || []);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список товаров');
    }
  };

  const fetchFiles = async (goodId) => {
    console.log('Starting fetchFiles for good_id:', goodId);
    setLoadingFiles(true);
    setErrorFiles(null);
    try {
      const response = await axios.get(`${BASE_URL}/api/goods/${goodId}/files`);
      console.log('Files response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Ошибка загрузки файлов:', err);
      setErrorFiles('Ошибка загрузки файлов: ' + err.message);
      return [];
    } finally {
      setLoadingFiles(false);
    }
  };

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
      Alert.alert('Успех', 'Свадьба успешно создана');
      setWeddings([...weddings, response.data.data]);
      setModalVisible(false);
      setWeddingName('');
      setWeddingDate('');
    } catch (error) {
      console.error('Ошибка при создании свадьбы:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось создать свадьбу');
    }
  };

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

  const handleAddWishlistItem = async () => {
    if (!selectedGoodId) {
      Alert.alert('Ошибка', 'Выберите подарок из списка');
      return;
    }

    const wishlistData = {
      wedding_id: selectedWedding.id,
      good_id: selectedGoodId,
    };

    try {
      const response = await api.createWish(wishlistData, token);
      Alert.alert('Успех', 'Подарок добавлен');
      setWishlistModalVisible(false);
      setSelectedGoodId('');
      fetchWeddings();
    } catch (error) {
      console.error('Ошибка при добавлении подарка:', error);
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось добавить подарок');
    }
  };

  const fetchWishlistItems = async (weddingId) => {
    try {
      const response = await api.getWishlistByWeddingId(weddingId, token);
      const items = response.data.data;
      setWishlistItems(items);

      const filesPromises = items
        .filter((item) => item.good_id)
        .map((item) =>
          fetchFiles(item.good_id).then((files) => ({
            goodId: item.good_id,
            files,
          }))
        );
      const filesResults = await Promise.all(filesPromises);
      const newWishlistFiles = filesResults.reduce((acc, { goodId, files }) => {
        acc[goodId] = files;
        return acc;
      }, {});
      setWishlistFiles((prev) => ({ ...prev, ...newWishlistFiles }));

      setWishlistViewModalVisible(true);
    } catch (error) {
      console.error('Ошибка при загрузке списка подарков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список подарков');
    }
  };

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

  useEffect(() => {
    const handleDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);
      if (initialUrl) {
        const { path, queryParams } = Linking.parse(initialUrl);
        console.log('Parsed path:', path, 'Params:', queryParams);
      }

      const subscription = Linking.addEventListener('url', ({ url }) => {
        console.log('Received URL:', url);
        const { path, queryParams } = Linking.parse(url);
        console.log('Parsed path:', path, 'Params:', queryParams);
      });

      return () => subscription.remove();
    };

    handleDeepLink();
  }, []);

  const handleShareWeddingLink = async (weddingId) => {
    console.log('handleShareWeddingLink started with weddingId:', weddingId);
    try {
      const appLink = Linking.createURL(`wishlist/${weddingId}`);
      const webLink = `${process.env.EXPO_PUBLIC_API_baseURL}/api/weddingwishes/${weddingId}`;

      console.log('appLink:', appLink);
      console.log('webLink:', webLink);

      const message = webLink;

      const result = await Share.share({
        message,
        title: 'Приглашение на свадьбу',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Поделился через:', result.activityType);
        } else {
          console.log('Поделился успешно');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Поделиться отменено');
      }
    } catch (error) {
      console.error('Ошибка в handleShareWeddingLink:', error.message, error.stack);
      Alert.alert('Ошибка', 'Не удалось поделиться ссылкой: ' + error.message);
    }
  };

  const openEditModal = (wedding) => {
    setSelectedWedding(wedding);
    setWeddingName(wedding.name);
    setWeddingDate(wedding.date);
    setEditModalVisible(true);
  };

  const renderWeddingItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name} ({item.date})</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(item)}>
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
          onPress={() => {
            console.log('Share button pressed for weddingId:', item.id);
            handleShareWeddingLink(item.id);
          }}
        >
          <Text style={styles.actionButtonText}>Поделиться</Text>
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

  const renderFileItem = ({ item: file }) => {
    const fileUrl = `${BASE_URL}/${file.path}`;
    console.log('fileUrl', fileUrl);

    if (file.mimetype.startsWith('image/')) {
      return (
        <View style={styles.card}>
          <TouchableOpacity>
            <Image source={{ uri: fileUrl }} style={styles.media} />
          </TouchableOpacity>
          <Text style={styles.caption}>{file.name}</Text>
        </View>
      );
    } else if (file.mimetype === 'video/mp4') {
      return (
        <View style={styles.card}>
          <Video
            source={{ uri: fileUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <Text style={styles.caption}>{file.name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.card}>
          <Text>Неподдерживаемый формат: {file.mimetype}</Text>
        </View>
      );
    }
  };

  const renderWishlistItem = ({ item }) => {
    console.log('ITEMS=====', item);
    const files = wishlistFiles[item.good_id] || [];

    return (
      <View style={styles.wishlistCard}>
        <ScrollView contentContainerStyle={styles.wishlistCardContent}>
          <Text
            style={[
              styles.wishlistTitle,
              item.is_reserved && styles.strikethroughText,
            ]}
          >
            {item.item_name}
          </Text>
          <Text style={styles.wishlistStatus}>
            {item.is_reserved
              ? `Кто подарит: ${item.Reserver?.username || item.reserved_by_unknown}`
              : 'Свободно'}
          </Text>
          <View style={styles.mediaSection}>
            {loadingFiles ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            ) : errorFiles ? (
              <Text style={styles.errorText}>{errorFiles}</Text>
            ) : files.length > 0 ? (
              <FlatList
                data={files}
                renderItem={renderFileItem}
                keyExtractor={(file) => file.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mediaList}
              />
            ) : (
              <Text style={styles.noFilesText}>Файлы отсутствуют</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderGoodCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.goodCard,
        selectedGoodId === item.id && styles.selectedGoodCard,
      ]}
      onPress={() => setSelectedGoodId(item.id)}
    >
      <Text style={styles.goodCardTitle}>{item.item_name}</Text>
      <Text style={styles.goodCardCategory}>Категория: {item.category}</Text>
      <Text style={styles.goodCardCost}>
        {item.price_range ? `Цена: ${item.price_range}` : 'Цена не указана'}
      </Text>
      {item.description && (
        <Text style={styles.goodCardDescription}>{item.description}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Мои мероприятия</Text>
      {loadingWeddings ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <FlatList
          data={weddings}
          renderItem={renderWeddingItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.noItems}>Свадеб пока нет</Text>}
        />
      )}

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
          <View style={styles.buttonRow}>
            <Button title="Создать" onPress={handleCreateWedding} />
            <Button title="Отмена" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={editModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.subtitle}>Редактирование свадьбы</Text>
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
          <View style={styles.buttonRow}>
            <Button title="Сохранить" onPress={handleUpdateWedding} />
            <Button title="Отмена" onPress={() => setEditModalVisible(false)} />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={wishlistModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.subtitle}>Добавить подарок</Text>
          <FlatList
            data={goods}
            renderItem={renderGoodCard}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noItems}>Товаров пока нет</Text>}
            contentContainerStyle={styles.goodList}
          />
          <View style={styles.buttonRow}>
            <Button title="Добавить" onPress={handleAddWishlistItem} />
            <Button title="Отмена" onPress={() => setWishlistModalVisible(false)} />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={wishlistViewModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.subtitle}>Подарки для свадьбы: {selectedWedding?.name}</Text>
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            ListEmptyComponent={<Text style={styles.noItems}>Подарков пока нет</Text>}
            columnWrapperStyle={styles.columnWrapper}
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
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A202C',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A202C',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#1A202C',
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
    backgroundColor: '#F5F7FA',
  },
  buttonRow: {
    marginTop: 20,
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
  strikethroughText: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#666',
  },
  itemStatus: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  goodList: {
    paddingBottom: 20,
  },
  goodCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGoodCard: {
    borderColor: '#007BFF',
    borderWidth: 2,
    backgroundColor: '#E6F0FA',
  },
  goodCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  goodCardCategory: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  goodCardCost: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },
  goodCardDescription: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
  },
  mediaSection: {
    marginTop: 16,
  },
  mediaList: {
    paddingVertical: 10,
  },
  card: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  media: {
    width: '100%',
    height: 200,
  },
  video: {
    width: '100%',
    height: 200,
  },
  caption: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },

  // Стили для колонок FlatList
  columnWrapper: {
    justifyContent: 'space-between', // Равномерное распределение карточек
  },

  // Стили для карточки вишлиста
  wishlistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 5, // Уменьшенный отступ для двух колонок
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '48%', // Ширина для двух карточек в линию (с учетом отступов)
  },
  wishlistCardContent: {
    padding: 15,
  },
  wishlistTitle: {
    fontSize: 20, // Увеличен с 18
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 8,
  },
  wishlistStatus: {
    fontSize: 16, // Увеличен с 14
    color: '#718096',
    marginBottom: 12,
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },

  // Стили для медиа-секции
  mediaSection: {
    marginTop: 12,
  },
  mediaSubtitle: {
    fontSize: 18, // Увеличен с 16
    fontWeight: '500',
    color: '#1A202C',
    marginBottom: 8,
  },
  mediaList: {
    paddingVertical: 5,
  },
  card: {
    width: 140, // Уменьшено для компактности в двух колонках
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  media: {
    width: '100%',
    height: 120, // Уменьшено для компактности
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  video: {
    width: '100%',
    height: 120,
  },
  caption: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    padding: 5,
  },

  // Стили для дополнительных элементов
  loader: {
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16, // Увеличен с 14
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
  },
  noFilesText: {
    fontSize: 16, // Увеличен с 14
    color: '#718096',
    textAlign: 'center',
    marginVertical: 10,
  },

  // Стили для кнопки "Зарезервировать"
  reserveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // Увеличен с 16
    fontWeight: '500',
  },

  // Стили для пустого списка
  noItems: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});









// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   FlatList,
//   Modal,
//   Alert,
//   TouchableOpacity,
//   Share,
//   ScrollView,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import Video from 'react-native-video';
// import * as Linking from 'expo-linking';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import api from '../api/api';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';

// export default function Item3Screen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const selectedItems = route.params?.data || [];
//   const userId = useSelector((state) => state.auth.user?.id);
//   const token = useSelector((state) => state.auth.token);
//   const [weddingItems, setWeddingItems] = useState([]);
//   const [weddings, setWeddings] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [wishlistModalVisible, setWishlistModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [wishlistViewModalVisible, setWishlistViewModalVisible] = useState(false);
//   const [weddingName, setWeddingName] = useState('');
//   const [weddingDate, setWeddingDate] = useState('');
//   const [selectedWedding, setSelectedWedding] = useState(null);
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [goods, setGoods] = useState([]);
//   const [selectedGoodId, setSelectedGoodId] = useState('');
//   const [wishlistFiles, setWishlistFiles] = useState({}); // Объект для хранения файлов по good_id
//   const [loadingFiles, setLoadingFiles] = useState(false);
//   const [errorFiles, setErrorFiles] = useState(null);

//   const BASE_URL = 'http://localhost:3000'; // Замените на ваш сервер
//   // const BASE_URL = 'https://26d8-85-117-96-82.ngrok-free.app';

//   useEffect(() => {
//     fetchWeddings();
//     fetchGoods();
//     // fetchWeddingItems();
 
//   }, []);

//   useEffect(() => {
//     console.log('Updated weddings:', weddings);
//     console.log('Updated weddingItems:', weddingItems);
//   }, [weddings, weddingItems]);




//   const fetchWeddingItems = async () => {
//     console.log('id=', userId, 'token=', token);
//     const weddingId=selectedWedding.id
//     try {
//       const response = await api.getWeddinItems(weddingId,token);
//       setWeddingItems(response.data);

//     } catch (error) {
//       console.error('Ошибка при загрузке свадеб:', error);
//       Alert.alert('Ошибка', 'Не удалось загрузить список свадеб');
//     }
//   };


//   const fetchWeddings = async () => {
//     console.log('id=', userId, 'token=', token);
//     try {
//       const response = await api.getWedding(token);
//       setWeddings(response.data.data);
//     } catch (error) {
//       console.error('Ошибка при загрузке свадеб:', error);
//       Alert.alert('Ошибка', 'Не удалось загрузить список свадеб');
//     }
//   };

//   const fetchGoods = async () => {
//     try {
//       const response = await api.getGoods(token);
//       setGoods(response.data);
//     } catch (error) {
//       console.error('Ошибка при загрузке товаров:', error);
//       Alert.alert('Ошибка', 'Не удалось загрузить список товаров');
//     }
//   };

//   const fetchFiles = async (goodId) => {
//     console.log('Starting fetchFiles for good_id:', goodId);
//     setLoadingFiles(true);
//     setErrorFiles(null);
//     try {
     
//         const response = await axios.get( `${BASE_URL}/api/goods/${goodId}/files`);
      
      

//       console.log('Files response:', response.data);

//       return response.data;
//     } catch (err) {
//       console.error('Ошибка загрузки файлов:', err);
//       setErrorFiles('Ошибка загрузки файлов: ' + err.message);
//       return [];
//     } finally {
//       setLoadingFiles(false);
//     }
//   };

//   const handleCreateWedding = async () => {
//     if (!weddingName || !weddingDate) {
//       Alert.alert('Ошибка', 'Заполните имя и дату свадьбы');
//       return;
//     }

//     const weddingData = {
//       name: weddingName,
//       date: weddingDate,
//       items: selectedItems.map((item) => ({
//         id: item.id,
//         type: item.type,
//         totalCost: item.totalCost || 0,
//       })),
//     };

//     try {
//       const response = await api.createWedding(weddingData, token);
//       Alert.alert('Успех', 'Свадьба успешно создана');
//       setWeddings([...weddings, response.data.data]);
//       setModalVisible(false);
//       setWeddingName('');
//       setWeddingDate('');
//     } catch (error) {
//       console.error('Ошибка при создании свадьбы:', error);
//       Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось создать свадьбу');
//     }
//   };

//   const handleUpdateWedding = async () => {
//     if (!selectedWedding || !weddingName || !weddingDate) {
//       Alert.alert('Ошибка', 'Заполните имя и дату свадьбы');
//       return;
//     }
//     console.log('Updating wedding:', selectedWedding.id, token, weddingDate, weddingName);

//     try {
//       const data = {
//         name: weddingName,
//         date: weddingDate,
//       };
//       const response = await api.updateWedding(selectedWedding.id, token, data);
//       Alert.alert('Успех', 'Свадьба обновлена');
//       setWeddings(weddings.map((w) => (w.id === selectedWedding.id ? response.data.data : w)));
//       setEditModalVisible(false);
//       setWeddingName('');
//       setWeddingDate('');
//       setSelectedWedding(null);
//     } catch (error) {
//       console.error('Ошибка при обновлении свадьбы:', error);
//       Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось обновить свадьбу');
//     }
//   };

//   const handleDeleteWedding = async (id) => {
//     Alert.alert(
//       'Подтверждение',
//       'Вы уверены, что хотите удалить эту свадьбу?',
//       [
//         { text: 'Отмена', style: 'cancel' },
//         {
//           text: 'Удалить',
//           onPress: async () => {
//             try {
//               await api.deleteWedding(id, token);
//               setWeddings(weddings.filter((w) => w.id !== id));
//               Alert.alert('Успех', 'Свадьба удалена');
//             } catch (error) {
//               console.error('Ошибка при удалении свадьбы:', error);
//               Alert.alert('Ошибка', 'Не удалось удалить свадьбу');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleAddWishlistItem = async () => {
//     if (!selectedGoodId) {
//       Alert.alert('Ошибка', 'Выберите подарок из списка');
//       return;
//     }

//     const wishlistData = {
//       wedding_id: selectedWedding.id,
//       good_id: selectedGoodId,
//     };

//     try {
//       const response = await api.createWish(wishlistData, token);
//       Alert.alert('Успех', 'Подарок добавлен');
//       setWishlistModalVisible(false);
//       setSelectedGoodId('');
//       fetchWeddings();
//     } catch (error) {
//       console.error('Ошибка при добавлении подарка:', error);
//       Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось добавить подарок');
//     }
//   };

//   const fetchWishlistItems = async (weddingId) => {
//     try {
//       const response = await api.getWishlistByWeddingId(weddingId, token);
//       const items = response.data.data;
//       setWishlistItems(items);

//       // Загружаем файлы для всех элементов с good_id
//       const filesPromises = items
//         .filter((item) => item.good_id)
//         .map((item) =>
//           fetchFiles(item.good_id).then((files) => ({
//             goodId: item.good_id,
//             files,
//           }))
//         );
//       const filesResults = await Promise.all(filesPromises);
//       const newWishlistFiles = filesResults.reduce((acc, { goodId, files }) => {
//         acc[goodId] = files;
//         return acc;
//       }, {});
//       setWishlistFiles((prev) => ({ ...prev, ...newWishlistFiles }));

//       setWishlistViewModalVisible(true);
//     } catch (error) {
//       console.error('Ошибка при загрузке списка подарков:', error);
//       Alert.alert('Ошибка', 'Не удалось загрузить список подарков');
//     }
//   };

//   const handleReserveWishlistItem = async (wishlistId) => {
//     Alert.alert(
//       'Подтверждение',
//       'Вы хотите зарезервировать этот подарок?',
//       [
//         { text: 'Отмена', style: 'cancel' },
//         {
//           text: 'Зарезервировать',
//           onPress: async () => {
//             try {
//               const response = await api.reserveWishlistItem(wishlistId, token);
//               Alert.alert('Успех', 'Подарок зарезервирован');
//               setWishlistItems(
//                 wishlistItems.map((item) =>
//                   item.id === wishlistId ? response.data.data : item
//                 )
//               );
//             } catch (error) {
//               console.error('Ошибка при резервировании подарка:', error);
//               Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарезервировать подарок');
//             }
//           },
//         },
//       ]
//     );
//   };

//   useEffect(() => {
//     const handleDeepLink = async () => {
//       const initialUrl = await Linking.getInitialURL();
//       console.log('Initial URL:', initialUrl);
//       if (initialUrl) {
//         const { path, queryParams } = Linking.parse(initialUrl);
//         console.log('Parsed path:', path, 'Params:', queryParams);
//       }

//       const subscription = Linking.addEventListener('url', ({ url }) => {
//         console.log('Received URL:', url);
//         const { path, queryParams } = Linking.parse(url);
//         console.log('Parsed path:', path, 'Params:', queryParams);
//       });

//       return () => subscription.remove();
//     };

//     handleDeepLink();
//   }, []);

//   const handleShareWeddingLink = async (weddingId) => {
//     console.log('handleShareWeddingLink started with weddingId:', weddingId);
//     try {
//       const appLink = Linking.createURL(`wishlist/${weddingId}`);
//       const webLink = `${process.env.EXPO_PUBLIC_API_baseURL}/api/weddingwishes/${weddingId}`;

//       console.log('appLink:', appLink);
//       console.log('webLink:', webLink);

//       const message = webLink;

//       const result = await Share.share({
//         message,
//         title: 'Приглашение на свадьбу',
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           console.log('Поделился через:', result.activityType);
//         } else {
//           console.log('Поделился успешно');
//         }
//       } else if (result.action === Share.dismissedAction) {
//         console.log('Поделиться отменено');
//       }
//     } catch (error) {
//       console.error('Ошибка в handleShareWeddingLink:', error.message, error.stack);
//     Alert.alert('Ошибка', 'Не удалось поделиться ссылкой: ' + error.message);
//     }
//   };

//   const openEditModal = (wedding) => {
//     setSelectedWedding(wedding);
//     setWeddingName(wedding.name);
//     setWeddingDate(wedding.date);
//     setEditModalVisible(true);
//   };

//   const renderWeddingItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <Text style={styles.itemText}>{item.name} ({item.date})</Text>
//       {/* <Text style={styles.itemText}>Количество добавленных подарков: {item.WeddingItems?.length || 0}</Text> */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(item)}>
//           <Text style={styles.actionButtonText}>Редактировать</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => {
//             setSelectedWedding(item);
//             setWishlistModalVisible(true);
//           }}
//         >
//           <Text style={styles.actionButtonText}>Добавить подарок</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => {
//             setSelectedWedding(item);
//             fetchWishlistItems(item.id);
//           }}
//         >
//           <Text style={styles.actionButtonText}>Просмотреть подарки</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => {
//             console.log('Share button pressed for weddingId:', item.id);
//             handleShareWeddingLink(item.id);
//           }}
//         >
//           <Text style={styles.actionButtonText}>Поделиться</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => handleDeleteWedding(item.id)}
//         >
//           <Text style={styles.actionButtonText}>Удалить</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderFileItem = ({ item: file }) => {
//     const fileUrl = `${BASE_URL}/${file.path}`;
//     console.log('fileUrl', fileUrl);

//     if (file.mimetype.startsWith('image/')) {
//       return (
//         <View style={styles.card}>
//           <TouchableOpacity>
//             <Image source={{ uri: fileUrl }} style={styles.media} />
//           </TouchableOpacity>
//           <Text style={styles.caption}>{file.name}</Text>
//         </View>
//       );
//     } else if (file.mimetype === 'video/mp4') {
//       return (
//         <View style={styles.card}>
//           <Video
//             source={{ uri: fileUrl }}
//             style={styles.video}
//             useNativeControls
//             resizeMode="contain"
//             isLooping
//           />
//           <Text style={styles.caption}>{file.name}</Text>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.card}>
//           <Text>Неподдерживаемый формат: {file.mimetype}</Text>
//         </View>
//       );
//     }
//   };

//   const renderWishlistItem = ({ item }) => {
//     console.log('ITEMS=====', item);
//     const files = wishlistFiles[item.good_id] || [];
  
//     return (
//       <View style={styles.wishlistCard}>
//         <ScrollView contentContainerStyle={styles.wishlistCardContent}>
//           {/* Заголовок с названием подарка */}
//           <Text
//             style={[
//               styles.wishlistTitle,
//               item.is_reserved && styles.strikethroughText,
//             ]}
//           >
//             {item.item_name}
//           </Text>
  
//           {/* Статус резервации */}
//           <Text style={styles.wishlistStatus}>
//             {item.is_reserved
//               ? `Кто подарит: ${item.Reserver?.username || item.reserved_by_unknown}`
//               : 'Свободно'}
//           </Text>
  
//           {/* Медиа-секция */}
//           <View style={styles.mediaSection}>
//             {/* <Text style={styles.mediaSubtitle}>Фото и видео:</Text> */}
//             {loadingFiles ? (
//               <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//             ) : errorFiles ? (
//               <Text style={styles.errorText}>{errorFiles}</Text>
//             ) : files.length > 0 ? (
//               <FlatList
//                 data={files}
//                 renderItem={renderFileItem}
//                 keyExtractor={(file) => file.id.toString()}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.mediaList}
//               />
//             ) : (
//               <Text style={styles.noFilesText}>Файлы отсутствуют</Text>
//             )}
//           </View>
  
//           {/* Кнопка "Зарезервировать" */}
//           {/* {!item.is_reserved && (
//             <TouchableOpacity
//               style={styles.reserveButton}
//               onPress={() => handleReserveWishlistItem(item.id)}
//             >
//               <Text style={styles.reserveButtonText}>Зарезервировать</Text>
//             </TouchableOpacity>
//           )} */}
//         </ScrollView>
//       </View>
//     );
//   };
//   const renderGoodCard = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.goodCard,
//         selectedGoodId === item.id && styles.selectedGoodCard,
//       ]}
//       onPress={() => setSelectedGoodId(item.id)}
//     >
//       <Text style={styles.goodCardTitle}>{item.item_name}</Text>
//       <Text style={styles.goodCardCategory}>Категория: {item.category}</Text>
//       <Text style={styles.goodCardCost}>
//         {item.price_range ? `Цена: ${item.price_range}` : 'Цена не указана'}
//       </Text>
//       {item.description && (
//         <Text style={styles.goodCardDescription}>{item.description}</Text>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Мои мероприятия</Text>
//       <FlatList
//         data={weddings}
//         renderItem={renderWeddingItem}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={<Text style={styles.noItems}>Свадеб пока нет</Text>}
//       />

//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalContainer}>
//           <Text style={styles.subtitle}>Создание свадьбы</Text>
//           <TextInput
//             autoComplete="off"
//             style={styles.input}
//             placeholder="Название свадьбы"
//             value={weddingName}
//             onChangeText={setWeddingName}
//           />
//           <TextInput
//             autoComplete="off"
//             style={styles.input}
//             placeholder="Дата свадьбы (YYYY-MM-DD)"
//             value={weddingDate}
//             onChangeText={setWeddingDate}
//           />
//           <View style={styles.buttonRow}>
//             <Button title="Создать" onPress={handleCreateWedding} />
//             <Button title="Отмена" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>

//       <Modal visible={editModalVisible} animationType="slide">
//         <SafeAreaView style={styles.modalContainer}>
//           <Text style={styles.subtitle}>Редактирование свадьбы</Text>
//           <TextInput
//             autoComplete="off"
//             style={styles.input}
//             placeholder="Название свадьбы"
//             value={weddingName}
//             onChangeText={setWeddingName}
//           />
//           <TextInput
//             autoComplete="off"
//             style={styles.input}
//             placeholder="Дата свадьбы (YYYY-MM-DD)"
//             value={weddingDate}
//             onChangeText={setWeddingDate}
//           />
//           <View style={styles.buttonRow}>
//             <Button title="Сохранить" onPress={handleUpdateWedding} />
//             <Button title="Отмена" onPress={() => setEditModalVisible(false)} />
//           </View>
//         </SafeAreaView>
//       </Modal>

//       <Modal visible={wishlistModalVisible} animationType="slide">
//         <SafeAreaView style={styles.modalContainer}>
//           <Text style={styles.subtitle}>Добавить подарок</Text>
//           <FlatList
//             data={goods}
//             renderItem={renderGoodCard}
//             keyExtractor={(item) => item.id.toString()}
//             ListEmptyComponent={<Text style={styles.noItems}>Товаров пока нет</Text>}
//             contentContainerStyle={styles.goodList}
//           />
//           <View style={styles.buttonRow}>
//             <Button title="Добавить" onPress={handleAddWishlistItem} />
//             <Button title="Отмена" onPress={() => setWishlistModalVisible(false)} />
//           </View>
//         </SafeAreaView>
//       </Modal>

//       <Modal visible={wishlistViewModalVisible} animationType="slide">
 
//   <SafeAreaView style={styles.modalContainer}>
//     <Text style={styles.subtitle}>Подарки для свадьбы: {selectedWedding?.name}</Text>
//     <FlatList
//       data={wishlistItems}
//       renderItem={renderWishlistItem}
//       keyExtractor={(item) => item.id.toString()}
//       numColumns={2} // Две карточки в линию
//       ListEmptyComponent={<Text style={styles.noItems}>Подарков пока нет</Text>}
//       columnWrapperStyle={styles.columnWrapper} // Добавляем стиль для колонок
//     />
//     <Button title="Закрыть" onPress={() => setWishlistViewModalVisible(false)} />
//   </SafeAreaView>
// </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F7FA',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#1A202C',
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#1A202C',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   itemContainer: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     marginBottom: 10,
//   },
//   wishlistItemContainer: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#1A202C',
//   },
//   noItems: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F7FA',
//   },
//   buttonRow: {
//     marginTop: 20,
//   },
//   actionButton: {
//     padding: 5,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//     margin: 2,
//   },
//   actionButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   strikethroughText: {
//     fontSize: 16,
//     textDecorationLine: 'line-through',
//     color: '#666',
//   },
//   itemStatus: {
//     fontSize: 14,
//     color: '#333',
//     marginTop: 5,
//   },
//   goodList: {
//     paddingBottom: 20,
//   },
//   goodCard: {
//     padding: 15,
//     marginVertical: 8,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   selectedGoodCard: {
//     borderColor: '#007BFF',
//     borderWidth: 2,
//     backgroundColor: '#E6F0FA',
//   },
//   goodCardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1A202C',
//   },
//   goodCardCategory: {
//     fontSize: 14,
//     color: '#718096',
//     marginTop: 5,
//   },
//   goodCardCost: {
//     fontSize: 14,
//     color: '#718096',
//     marginTop: 5,
//   },
//   goodCardDescription: {
//     fontSize: 12,
//     color: '#718096',
//     marginTop: 5,
//   },
//   mediaSection: {
//     marginTop: 16,
//   },
//   mediaList: {
//     paddingVertical: 10,
//   },
//   card: {
//     width: 200,
//     marginRight: 16,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//   },
//   media: {
//     width: '100%',
//     height: 200,
//   },
//   video: {
//     width: '100%',
//     height: 200,
//   },
//   caption: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//   },
//   detail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5F7FA',
//   },

//   // Стили для колонок FlatList
//   columnWrapper: {
//     justifyContent: 'space-between', // Равномерное распределение карточек
//   },

//   // Стили для карточки вишлиста
//   wishlistCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     margin: 5, // Уменьшенный отступ для двух колонок
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     width: '48%', // Ширина для двух карточек в линию (с учетом отступов)
//   },
//   wishlistCardContent: {
//     padding: 15,
//   },
//   wishlistTitle: {
//     fontSize: 20, // Увеличен с 18
//     fontWeight: '600',
//     color: '#1A202C',
//     marginBottom: 8,
//   },
//   wishlistStatus: {
//     fontSize: 16, // Увеличен с 14
//     color: '#718096',
//     marginBottom: 12,
//   },
//   strikethroughText: {
//     textDecorationLine: 'line-through',
//     color: '#666',
//   },

//   // Стили для медиа-секции
//   mediaSection: {
//     marginTop: 12,
//   },
//   mediaSubtitle: {
//     fontSize: 18, // Увеличен с 16
//     fontWeight: '500',
//     color: '#1A202C',
//     marginBottom: 8,
//   },
//   mediaList: {
//     paddingVertical: 5,
//   },
//   card: {
//     width: 140, // Уменьшено для компактности в двух колонках
//     marginRight: 12,
//     borderRadius: 8,
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     elevation: 2,
//   },
//   media: {
//     width: '100%',
//     height: 120, // Уменьшено для компактности
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   video: {
//     width: '100%',
//     height: 120,
//   },
//   caption: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     padding: 5,
//   },

//   // Стили для дополнительных элементов
//   loader: {
//     marginVertical: 10,
//   },
//   errorText: {
//     fontSize: 16, // Увеличен с 14
//     color: '#FF3B30',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   noFilesText: {
//     fontSize: 16, // Увеличен с 14
//     color: '#718096',
//     textAlign: 'center',
//     marginVertical: 10,
//   },

//   // Стили для кнопки "Зарезервировать"
//   reserveButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 15,
//   },
//   reserveButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18, // Увеличен с 16
//     fontWeight: '500',
//   },

//   // Стили для пустого списка
//   noItems: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });