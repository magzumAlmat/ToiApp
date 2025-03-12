import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function Item2Screen({ navigation }) {
  const [selectedItem, setSelectedItem] = useState(''); // Выбранный элемент
  const [isPickerVisible, setPickerVisible] = useState(false); // Видимость Picker
  const [formData, setFormData] = useState({}); // Данные формы
  const [modalVisible, setModalVisible] = useState(false); // Модал для кухни
  const [districtModalVisible, setDistrictModalVisible] = useState(false); // Модал для района
  const [genderModalVisible, setGenderModalVisible] = useState(false); // Модал для пола (новое)
  const route = useRoute();
  const restaurantId = route.params?.id; // ID ресторана для редактирования
  console.log('Принимаю в скрине ресторан id ресторана - ', restaurantId);
  const { user, token } = useSelector((state) => state.auth);

  const items = [
    'Ресторан',
    'Одежда',
    'Транспорт',
    'Тамада',
    'Программа',
    'Традиционные подарки',
    'Цветы',
    'Торты',
    'Алкоголь',
  ];

  const cuisineOptions = [
    'Русская',
    'Итальянская',
    'Азиатская',
    'Французская',
    'Американская',
  ];

  const districtOptions = [
    'Медеуский',
    'Бостандыкский',
    'Алмалинский',
    'Ауэзовский',
    'Наурызбайский',
    'Алатауский',
    'Жетысуйский',
    'За пределами Алматы',
  ];

  const genderOptions = ['мужской', 'женский']; // Варианты
  // Обновление данных формы
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Форматирование телефона
  const formatPhoneNumber = (input) => {
    let cleaned = input.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) cleaned = '+' + cleaned.replace(/\+/g, '');
    if (!cleaned.startsWith('+7')) {
      cleaned = '+7' + cleaned.replace(/^\+?\d*/g, '');
    }
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
    handleInputChange('phone', formattedPhone);
  };

  // Отправка данных через API
  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Ошибка', 'Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    try {
      let response;
      switch (selectedItem) {
        case 'Ресторан':
          if (!formData.name || !formData.capacity || !formData.cuisine || !formData.averageCost) {
            throw new Error('Заполните все обязательные поля: Название, Вместимость, Кухня, Средний чек');
          }
          const restaurantData = {
            ...formData,
            averageCost: parseFloat(formData.averageCost),
            supplier_id: user.id, // Добавляем ID поставщика из Redux
          };
          response = await api.createRestaurant(restaurantData);
          break;
        case 'Одежда':
          response = await api.createClothing(formData);
          break;
        case 'Транспорт':
          response = await api.createTransport(formData);
          break;
        case 'Тамада':
          response = await api.createTamada(formData);
          break;
        case 'Программа':
          response = await api.createProgram(formData);
          break;
        case 'Традиционные подарки':
          response = await api.createTraditionalGift(formData);
          break;
        case 'Цветы':
          response = await api.createFlowers(formData);
          break;
        case 'Торты':
          response = await api.createCake(formData);
          break;
        case 'Алкоголь':
          response = await api.createAlcohol(formData);
          break;
        default:
          throw new Error('Выберите тип объекта');
      }
      Alert.alert('Успех', `${selectedItem} успешно создан!`);
      setFormData({}); // Сброс формы
      navigation.goBack(); // Возврат на предыдущий экран
    } catch (error) {
      console.error('Ошибка:', error.response?.data || error.message);
      Alert.alert('Ошибка', error.message || error.response?.data?.error || 'Не удалось создать объект');
    }
  };

  // Поля формы в зависимости от выбранного элемента
  const renderForm = () => {
    switch (selectedItem) {
      case 'Ресторан':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Название"
              value={formData.name || ''}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Вместимость"
              value={formData.capacity || ''}
              onChangeText={(value) => handleInputChange('capacity', value)}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Кухня:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.cuisineText}>
                  {formData.cuisine || 'Выберите кухню'}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите кухню</Text>
                  <Picker
                    selectedValue={formData.cuisine}
                    onValueChange={(value) => {
                      handleInputChange('cuisine', value);
                      setModalVisible(false);
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
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TextInput
              style={styles.input}
              placeholder="Средний чек"
              value={formData.averageCost || ''}
              onChangeText={(value) => handleInputChange('averageCost', value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                placeholder="+7 (XXX) XXX-XX-XX"
                value={formData.phone || ''}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={18}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setDistrictModalVisible(true)}
              >
                <Text style={styles.cuisineText}>
                  {formData.district || 'Выберите район'}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={districtModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setDistrictModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите район</Text>
                  <Picker
                    selectedValue={formData.district}
                    onValueChange={(value) => {
                      handleInputChange('district', value);
                      setDistrictModalVisible(false);
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
                    onPress={() => setDistrictModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        );
      case 'Одежда':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование магазина"
              value={formData.storeName || ''}
              onChangeText={(value) => handleInputChange('storeName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput
                style={styles.input}
                placeholder="+7 (XXX) XXX-XX-XX"
                value={formData.phone || ''}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={18}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Пол:</Text>
              <TouchableOpacity
                style={styles.cuisineButton}
                onPress={() => setGenderModalVisible(true)}
              >
                <Text style={styles.cuisineText}>
                  {formData.gender || 'Выберите пол'}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={genderModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setGenderModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите пол</Text>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(value) => {
                      handleInputChange('gender', value);
                      setGenderModalVisible(false);
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
                    onPress={() => setGenderModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TextInput
              style={styles.input}
              placeholder="Наименование товара"
              value={formData.itemName || ''}
              onChangeText={(value) => handleInputChange('itemName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      case 'Транспорт':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование салона"
              value={formData.salonName || ''}
              onChangeText={(value) => handleInputChange('salonName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={formData.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Наименование авто"
              value={formData.carName || ''}
              onChangeText={(value) => handleInputChange('carName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Цвет"
              value={formData.color || ''}
              onChangeText={(value) => handleInputChange('color', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Марка"
              value={formData.brand || ''}
              onChangeText={(value) => handleInputChange('brand', value)}
            />
          </>
        );
      case 'Тамада':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Портфолио"
              value={formData.portfolio || ''}
              onChangeText={(value) => handleInputChange('portfolio', value)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      case 'Программа':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Название команды"
              value={formData.teamName || ''}
              onChangeText={(value) => handleInputChange('teamName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Вид"
              value={formData.type || ''}
              onChangeText={(value) => handleInputChange('type', value)}
            />
          </>
        );
      case 'Традиционные подарки':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование салона"
              value={formData.salonName || ''}
              onChangeText={(value) => handleInputChange('salonName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={formData.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Наименование товара"
              value={formData.itemName || ''}
              onChangeText={(value) => handleInputChange('itemName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Вид"
              value={formData.type || ''}
              onChangeText={(value) => handleInputChange('type', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      case 'Цветы':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование салона"
              value={formData.salonName || ''}
              onChangeText={(value) => handleInputChange('salonName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={formData.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Наименование цветов"
              value={formData.flowerName || ''}
              onChangeText={(value) => handleInputChange('flowerName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Вид цветов"
              value={formData.flowerType || ''}
              onChangeText={(value) => handleInputChange('flowerType', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      case 'Торты':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование салона"
              value={formData.salonName || ''}
              onChangeText={(value) => handleInputChange('salonName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={formData.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Вид торта"
              value={formData.cakeType || ''}
              onChangeText={(value) => handleInputChange('cakeType', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      case 'Алкоголь':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Наименование салона"
              value={formData.salonName || ''}
              onChangeText={(value) => handleInputChange('salonName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес"
              value={formData.address || ''}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={formData.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Район"
              value={formData.district || ''}
              onChangeText={(value) => handleInputChange('district', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Наименование"
              value={formData.alcoholName || ''}
              onChangeText={(value) => handleInputChange('alcoholName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Категория"
              value={formData.category || ''}
              onChangeText={(value) => handleInputChange('category', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
              keyboardType="numeric"
            />
          </>
        );
      default:
        return <Text style={styles.label}>Выберите тип объекта для создания</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создать объект</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Выберите тип объекта:</Text>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.roleText}>{selectedItem || 'Выберите'}</Text>
        </TouchableOpacity>

        <Modal
          visible={isPickerVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={selectedItem}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setSelectedItem(itemValue);
                  setPickerVisible(false);
                  setFormData({}); // Сброс формы при смене типа
                }}
              >
                <Picker.Item label="Выберите" value="" />
                {items.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
              <Button title="Закрыть" onPress={() => setPickerVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      {renderForm()}

      {selectedItem && (
        <Button title="Создать" onPress={handleSubmit} disabled={!selectedItem} />
      )}
    </View>
  );
}

// Стили остаются без изменений
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  pickerContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  roleButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  roleText: { fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  picker: { height: 200, width: '100%' },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  cuisineButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
  },
  cuisineText: {
    fontSize: 16,
    color: '#374151',
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
  modalPicker: {
    height: 150,
    color: '#374151',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});