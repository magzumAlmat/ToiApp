import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { Appbar } from 'react-native-paper';

export default function ItemEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const itemId = route.params?.id; // ID объекта для редактирования
  const type = route.params?.type; // Тип объекта (restaurant, goods и т.д.)
  console.log('Принимаю параметры: id=', itemId, 'type=', type);
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({});
  const [modalVisible, setModalVisible] = useState({
    cuisine: false,
    district: false,
    gender: false,
    category: false, // Для выбора категории в goods
  });
  const [isLoading, setIsLoading] = useState(false);

  const cuisineOptions = ['Русская', 'Итальянская', 'Азиатская', 'Французская', 'Американская'];
  const districtOptions = [
    'Медеуский', 'Бостандыкский', 'Алмалинский', 'Ауэзовский', 'Наурызбайский',
    'Алатауский', 'Жетысуйский', 'За пределами Алматы',
  ];
  const genderOptions = ['мужской', 'женский'];
  const categoryOptions = [
    'Деньги',
    'Бытовая техника',
    'Посуда и кухонные принадлежности',
    'Текстиль для дома',
    'Мебель и элементы интерьера',
    'Подарки для отдыха и путешествий',
    'Электроника и гаджеты',
    'Подарки для хобби и увлечений',
    'Символические и романтические подарки',
    'Сертификаты и подписки',
    'Алкоголь и гастрономия',
    'Традиционные подарки',
  ];

  // Загрузка данных объекта для редактирования
  useEffect(() => {
    if (itemId && token && type) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          let response;
          switch (type) {
            case 'restaurant': response = await api.getRestaurantById(itemId); break;
            case 'clothing': response = await api.getClothingById(itemId); break;
            case 'transport': response = await api.getTransportById(itemId); break;
            case 'tamada': response = await api.getTamadaById(itemId); break;
            case 'program': response = await api.getProgramById(itemId); break;
            case 'traditionalGift': response = await api.getTraditionalGiftById(itemId); break;
            case 'flowers': response = await api.getFlowersById(itemId); break;
            case 'cake': response = await api.getCakeById(itemId); break;
            case 'alcohol': response = await api.getAlcoholById(itemId); break;
            case 'goods': response = await api.getGoodById(itemId); break;
            default: throw new Error('Неизвестный тип объекта');
          }
          const itemData = Array.isArray(response.data) ? response.data[0] : response.data;
          console.log(`Данные ${type} с сервера:`, itemData);

          const formattedData = {
            ...Object.keys(itemData).reduce((acc, key) => {
              acc[key] = itemData[key] !== null && itemData[key] !== undefined ? String(itemData[key]) : '';
              return acc;
            }, {}),
            specs: itemData.specs || { address: '', phone: '', storeName: '' }, // Обеспечиваем наличие specs для goods
          };
          setForm(formattedData);
        } catch (error) {
          console.error('Ошибка загрузки данных:', error.response || error);
          alert('Ошибка загрузки: ' + (error.response?.data?.message || error.message));
        } finally {
          setIsLoading(false);
        }
      };
      fetchItem();
    }
  }, [itemId, token, type]);

  const handleChange = (field, value) => {
    if (field === 'specs') {
      setForm((prev) => ({
        ...prev,
        specs: { ...prev.specs, ...value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) cleaned = '+' + cleaned.replace(/\+/g, '');
    if (!cleaned.startsWith('+7')) cleaned = '+7' + cleaned.replace(/^\+?\d*/g, '');
    const digits = cleaned.slice(2, 12);
    let formatted = '+7';
    if (digits.length > 0) formatted += ' (' + digits.slice(0, 3);
    if (digits.length > 3) formatted += ') ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
    if (digits.length > 8) formatted += '-' + digits.slice(8, 10);
    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formattedPhone = formatPhoneNumber(text);
    handleChange('specs', { phone: formattedPhone });
  };

  const handleSave = async () => {
    if (!token) {
      alert('Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    let formattedForm = { ...form, supplier_id: user.id };
    if (type === 'restaurant') {
      formattedForm.averageCost = parseFloat(form.averageCost) || 0;
      formattedForm.capacity = parseInt(form.capacity, 10) || 0;
    } else if (['clothing', 'tamada', 'program', 'traditionalGift', 'flowers', 'cake', 'alcohol'].includes(type)) {
      formattedForm.cost = parseFloat(form.cost) || 0;
    } else if (type === 'goods') {
      if (!form.category || !form.item_name) {
        alert('Заполните обязательные поля: Категория и Название товара');
        return;
      }
      formattedForm = {
        category: form.category,
        item_name: form.item_name,
        description: form.description || '',
        cost: parseFloat(form.cost) || 0,
        specs: form.specs || { address: '', phone: '', storeName: '' },
        supplier_id: user.id,
      };
    }

    try {
      setIsLoading(true);
      if (itemId) {
        switch (type) {
          case 'restaurant': await api.updateRestaurant(itemId, formattedForm); break;
          case 'clothing': await api.updateClothing(itemId, formattedForm); break;
          case 'transport': await api.updateTransport(itemId, formattedForm); break;
          case 'tamada': await api.updateTamada(itemId, formattedForm); break;
          case 'program': await api.updateProgram(itemId, formattedForm); break;
          case 'traditionalGift': await api.updateTraditionalGift(itemId, formattedForm); break;
          case 'flowers': await api.updateFlowers(itemId, formattedForm); break;
          case 'cake': await api.updateCake(itemId, formattedForm); break;
          case 'alcohol': await api.updateAlcohol(itemId, formattedForm); break;
          case 'goods': await api.updateGoodById(itemId, formattedForm); break;
          default: throw new Error('Неизвестный тип объекта');
        }
        alert(`${type} обновлён!`);
      } else {
        switch (type) {
          case 'restaurant': await api.createRestaurant(formattedForm); break;
          case 'clothing': await api.createClothing(formattedForm); break;
          case 'transport': await api.createTransport(formattedForm); break;
          case 'tamada': await api.createTamada(formattedForm); break;
          case 'program': await api.createProgram(formattedForm); break;
          case 'traditionalGift': await api.createTraditionalGift(formattedForm); break;
          case 'flowers': await api.createFlowers(formattedForm); break;
          case 'cake': await api.createCake(formattedForm); break;
          case 'alcohol': await api.createAlcohol(formattedForm); break;
          case 'goods': await api.postGoodsData(formattedForm); break;
          default: throw new Error('Неизвестный тип объекта');
        }
        alert(`${type} создан!`);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка запроса:', error.response || error);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !itemId) {
      alert('Пожалуйста, войдите в систему или выберите объект');
      navigation.navigate('Login');
      return;
    }
    try {
      setIsLoading(true);
      switch (type) {
        case 'restaurant': await api.deleteRestaurant(itemId); break;
        case 'clothing': await api.deleteClothing(itemId); break;
        case 'transport': await api.deleteTransport(itemId); break;
        case 'tamada': await api.deleteTamada(itemId); break;
        case 'program': await api.deleteProgram(itemId); break;
        case 'traditionalGift': await api.deleteTraditionalGift(itemId); break;
        case 'flowers': await api.deleteFlowers(itemId); break;
        case 'cake': await api.deleteCake(itemId); break;
        case 'alcohol': await api.deleteAlcohol(itemId); break;
        case 'goods': await api.deleteGoodsById(itemId); break;
        default: throw new Error('Неизвестный тип объекта');
      }
      alert(`${type} удалён!`);
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка удаления:', error.response || error);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (isLoading) {
      return <Text style={styles.loadingText}>Загрузка...</Text>;
    }

    switch (type) {
      case 'restaurant':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Название:</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Название"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Вместимость:</Text>
              <TextInput
                style={styles.input}
                value={form.capacity}
                onChangeText={(text) => handleChange('capacity', text)}
                keyboardType="numeric"
                placeholder="Вместимость"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Кухня:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, cuisine: true })}
              >
                <Text style={styles.cuisineText}>{form.cuisine || 'Выберите кухню'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.cuisine}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, cuisine: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите кухню</Text>
                    <Picker
                      selectedValue={form.cuisine}
                      onValueChange={(value) => {
                        handleChange('cuisine', value);
                        setModalVisible({ ...modalVisible, cuisine: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите кухню" value="" />
                      {cuisineOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, cuisine: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Средний чек:</Text>
              <TextInput
                style={styles.input}
                value={form.averageCost}
                onChangeText={(text) => handleChange('averageCost', text)}
                keyboardType="numeric"
                placeholder="Средний чек"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        );
      case 'clothing':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование магазина:</Text>
              <TextInput
                style={styles.input}
                value={form.storeName}
                onChangeText={(text) => handleChange('storeName', text)}
                placeholder="Наименование магазина"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Пол:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, gender: true })}
              >
                <Text style={styles.cuisineText}>{form.gender || 'Выберите пол'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.gender}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, gender: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите пол</Text>
                    <Picker
                      selectedValue={form.gender}
                      onValueChange={(value) => {
                        handleChange('gender', value);
                        setModalVisible({ ...modalVisible, gender: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите пол" value="" />
                      {genderOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, gender: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование товара:</Text>
              <TextInput
                style={styles.input}
                value={form.itemName}
                onChangeText={(text) => handleChange('itemName', text)}
                placeholder="Наименование товара"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'transport':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование салона:</Text>
              <TextInput
                style={styles.input}
                value={form.salonName}
                onChangeText={(text) => handleChange('salonName', text)}
                placeholder="Наименование салона"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование авто:</Text>
              <TextInput
                style={styles.input}
                value={form.carName}
                onChangeText={(text) => handleChange('carName', text)}
                placeholder="Наименование авто"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Цвет:</Text>
              <TextInput
                style={styles.input}
                value={form.color}
                onChangeText={(text) => handleChange('color', text)}
                placeholder="Цвет"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Марка:</Text>
              <TextInput
                style={styles.input}
                value={form.brand}
                onChangeText={(text) => handleChange('brand', text)}
                placeholder="Марка"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'tamada':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Имя/Псевдоним:</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Имя/Псевдоним"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Портфолио:</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={form.portfolio}
                onChangeText={(text) => handleChange('portfolio', text)}
                multiline
                placeholder="Портфолио"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'program':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Название команды:</Text>
              <TextInput
                style={styles.input}
                value={form.teamName}
                onChangeText={(text) => handleChange('teamName', text)}
                placeholder="Название команды"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Вид:</Text>
              <TextInput
                style={styles.input}
                value={form.type}
                onChangeText={(text) => handleChange('type', text)}
                placeholder="Вид"
              />
            </View>
          </>
        );
      case 'traditionalGift':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование салона:</Text>
              <TextInput
                style={styles.input}
                value={form.salonName}
                onChangeText={(text) => handleChange('salonName', text)}
                placeholder="Наименование салона"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование товара:</Text>
              <TextInput
                style={styles.input}
                value={form.itemName}
                onChangeText={(text) => handleChange('itemName', text)}
                placeholder="Наименование товара"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Вид:</Text>
              <TextInput
                style={styles.input}
                value={form.type}
                onChangeText={(text) => handleChange('type', text)}
                placeholder="Вид"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'flowers':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование салона:</Text>
              <TextInput
                style={styles.input}
                value={form.salonName}
                onChangeText={(text) => handleChange('salonName', text)}
                placeholder="Наименование салона"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование цветов:</Text>
              <TextInput
                style={styles.input}
                value={form.flowerName}
                onChangeText={(text) => handleChange('flowerName', text)}
                placeholder="Наименование цветов"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Вид цветов:</Text>
              <TextInput
                style={styles.input}
                value={form.flowerType}
                onChangeText={(text) => handleChange('flowerType', text)}
                placeholder="Вид цветов"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'cake':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование салона:</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Наименование салона"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Вид торта:</Text>
              <TextInput
                style={styles.input}
                value={form.cakeType}
                onChangeText={(text) => handleChange('cakeType', text)}
                placeholder="Вид торта"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'alcohol':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование салона:</Text>
              <TextInput
                style={styles.input}
                value={form.salonName}
                onChangeText={(text) => handleChange('salonName', text)}
                placeholder="Наименование салона"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес:</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Адрес"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, district: true })}
              >
                <Text style={styles.cuisineText}>{form.district || 'Выберите район'}</Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.district}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, district: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите район</Text>
                    <Picker
                      selectedValue={form.district}
                      onValueChange={(value) => {
                        handleChange('district', value);
                        setModalVisible({ ...modalVisible, district: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите район" value="" />
                      {districtOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, district: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Наименование:</Text>
              <TextInput
                style={styles.input}
                value={form.alcoholName}
                onChangeText={(text) => handleChange('alcoholName', text)}
                placeholder="Наименование"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Категория:</Text>
              <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(text) => handleChange('category', text)}
                placeholder="Категория"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость:</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => handleChange('cost', text)}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>
          </>
        );
      case 'goods':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Категория:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible({ ...modalVisible, category: true })}
              >
                <Text style={styles.cuisineText}>
                  {form.category || 'Выберите категорию'}
                </Text>
              </TouchableOpacity>
              <Modal
                visible={modalVisible.category}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible({ ...modalVisible, category: false })}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите категорию</Text>
                    <Picker
                      selectedValue={form.category}
                      onValueChange={(value) => {
                        handleChange('category', value);
                        setModalVisible({ ...modalVisible, category: false });
                      }}
                      style={styles.modalPicker}
                    >
                      <Picker.Item label="Выберите категорию" value="" />
                      {categoryOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible({ ...modalVisible, category: false })}
                    >
                      <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Название товара:</Text>
              <TextInput
                style={styles.input}
                value={form.item_name}
                onChangeText={(text) => handleChange('item_name', text)}
                placeholder="Название товара"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Описание:</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={form.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline
                placeholder="Описание"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Стоимость (₸):</Text>
              <TextInput
                style={styles.input}
                value={form.cost}
                onChangeText={(text) => {
                  const filteredValue = text.replace(/[^0-9.]/g, '');
                  handleChange('cost', filteredValue);
                }}
                keyboardType="numeric"
                placeholder="Стоимость"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Адрес магазина:</Text>
              <TextInput
                style={styles.input}
                value={form.specs?.address || ''}
                onChangeText={(text) => handleChange('specs', { address: text })}
                placeholder="Адрес магазина"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                value={form.specs?.phone || ''}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={18}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Название магазина:</Text>
              <TextInput
                style={styles.input}
                value={form.specs?.storeName || ''}
                onChangeText={(text) => handleChange('specs', { storeName: text })}
                placeholder="Название магазина"
              />
            </View>
          </>
        );
      default:
        return <Text style={styles.noAuthText}>Неизвестный тип объекта. Выберите объект для редактирования.</Text>;
    }
  };

  if (!token) {
    return (
      <View style={styles.noAuthContainer}>
        <Text style={styles.noAuthText}>Пожалуйста, войдите в систему, чтобы продолжить</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Детали" />
      </Appbar.Header>
      <View style={styles.header}>
        <Text style={styles.title}>
          {itemId ? `Редактировать ${type}` : `Создать ${type || 'объект'}`}
        </Text>
      </View>
      <View style={styles.formContainer}>
        {renderForm()}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Сохранение...' : 'Сохранить'}</Text>
        </TouchableOpacity>
        {itemId && (
          <TouchableOpacity
            style={[styles.deleteButton, isLoading && styles.disabledButton]}
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Удаление...' : 'Удалить'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F3F4F6', padding: 16 },
  header: { marginBottom: 0 ,backgroundColor: '#F3F4F6'},
  title: { fontSize: 24, fontWeight: 'bold', color: '#F3F4F6', textAlign: 'center' },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: { marginBottom: 12 },
  inputLabel: { fontSize: 16, color: '#4B5563', marginBottom: 4 },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    color: '#374151',
  },
  cuisineButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
  },
  cuisineText: { fontSize: 16, color: '#374151' },
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalPicker: { height: 150, color: '#374151' },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  closeButtonText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  noAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  noAuthText: { fontSize: 18, color: '#1F2937', textAlign: 'center', marginBottom: 20 },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
});