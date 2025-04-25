import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

export default function HomeScreenDraft({ navigation }) {

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
    goods: [],
  });
  const [loading, setLoading] = useState(false);
  const [newGoodModalVisible, setNewGoodModalVisible] = useState(false);
  const [newGoodName, setNewGoodName] = useState('');
  const [newGoodCost, setNewGoodCost] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    if (!token || !user?.id || user?.roleId !== 2) return;
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
        api.getGoods(token),
      ]);

      const userData = responses.map((response) =>
        response.data.filter((item) => item.supplier_id === user.id)
      );

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
        goods: userData[9] || [],
      };
      setData(newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Ошибка загрузки данных: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.roleId !== 2) {
      navigation.navigate('Login');
    } else {
      fetchData();
    }
  }, [token, user, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handleEditItem = (id, type) => {
    navigation.navigate('ItemEdit', { id, type });
  };

  const confirmDeleteItem = (id, type) => {
    setItemToDelete({ id, type });
    setDeleteModalVisible(true);
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
        case 'transport':
          await api.deleteTransport(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            transport: prev.transport.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        case 'goods':
          await api.deleteGoodsById(itemToDelete.id);
          setData((prev) => ({
            ...prev,
            goods: prev.goods.filter((item) => item.id !== itemToDelete.id),
          }));
          break;
        default:
          throw new Error('Неизвестный тип объекта');
      }
      alert('Объект успешно удален');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleCreateGood = async () => {
    if (!newGoodName || !newGoodCost) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const goodData = {
      item_name: newGoodName,
      cost: parseFloat(newGoodCost),
      supplier_id: user.id,
    };

    try {
      const response = await api.postGoodsData(goodData);
      setData((prev) => ({
        ...prev,
        goods: [...prev.goods, response.data],
      }));
      setNewGoodModalVisible(false);
      setNewGoodName('');
      setNewGoodCost('');
      alert('Товар успешно создан');
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  const renderItem = ({ item }) => {
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
      case 'goods':
        content = (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Товар</Text>
            <Text style={styles.cardTitle}>{item.item_name}</Text>
            <Text style={styles.cardDetail}>Описание: {item.description || 'Не указано'}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
        break;
      default:
        content = <Text style={styles.cardTitle}>Неизвестный тип: {item.type}</Text>;
    }

    return (
      <View style={styles.card}>
        {content}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditItem(item.id, item.type)}>
            <Icon name="edit" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteItem(item.id, item.type)}>
            <Icon name="delete" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSupplierContent = () => {
    const userId = user.id;
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
      ...data.goods.map((item) => ({ ...item, type: 'goods' })),
    ].filter((item) => item.supplier_id === userId);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.supplierContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setNewGoodModalVisible(true)}
          >
            <Text style={styles.createButtonText}>Добавить товар</Text>
          </TouchableOpacity>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Загрузка данных...</Text>
            </View>
          ) : combinedData.length > 0 ? (
            <FlatList
              data={combinedData}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="business" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>У вас пока нет объектов</Text>
            </View>
          )}
          <Modal visible={deleteModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
                <Text style={styles.modalTitle}>Подтверждение удаления</Text>
                <Text style={styles.modalText}>
                  Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setDeleteModalVisible(false);
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
              </Animatable.View>
            </View>
          </Modal>
          <Modal visible={newGoodModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
                <Text style={styles.modalTitle}>Добавить новый товар</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Название товара"
                  value={newGoodName}
                  onChangeText={setNewGoodName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Стоимость (₸)"
                  value={newGoodCost}
                  onChangeText={setNewGoodCost}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setNewGoodModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleCreateGood}
                  >
                    <Text style={styles.modalButtonText}>Создать</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  };

  return <SafeAreaView style={styles.container}>{renderSupplierContent()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    position: 'relative',
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
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
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
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
});