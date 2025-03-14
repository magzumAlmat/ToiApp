import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal, FlatList, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Item2Screen({ navigation }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const route = useRoute();
  const restaurantId = route.params?.id;
  console.log('Received restaurant ID:', restaurantId);
  const { user, token } = useSelector((state) => state.auth);

  const BASE_URL = "http://localhost:6666"; // Для Android эмулятора

  // Обновлённый массив с русскими названиями
  const items = [
    'Ресторан', 'Одежда', 'Транспорт', 'Тамада', 'Программа',
    'Традиционные подарки', 'Цветы', 'Торты', 'Алкоголь',
  ];

  // Маппинг русских названий на английские для URL и API
  const entityTypeMap = {
    'Ресторан': 'restaurant',
    'Одежда': 'clothing',
    'Транспорт': 'transport',
    'Тамада': 'tamada',
    'Программа': 'program',
    'Традиционные подарки': 'traditionalgift',
    'Цветы': 'flowers',
    'Торты': 'cake',
    'Алкоголь': 'alcohol',
  };

  const cuisineOptions = ['Русская', 'Итальянская', 'Азиатская', 'Французская', 'Американская'];
  const districtOptions = ['Медеуский', 'Бостандыкский', 'Алмалинский', 'Ауэзовский', 'Наурызбайский', 'Алатауский', 'Жетысуйский', 'За пределами Алматы'];
  const genderOptions = ['мужской', 'женский'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    handleInputChange('phone', formattedPhone);
  };

  const pickFile = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Требуется разрешение для доступа к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedFiles([...selectedFiles, ...result.assets]);
    }
  };

  const removeFile = (uri) => {
    setSelectedFiles(selectedFiles.filter(file => file.uri !== uri));
  };

  const uploadFiles = async (entityType, entityId) => {
    const entityTypeLower = entityTypeMap[entityType]; // Преобразуем русское название в английское
    console.log('Starting file upload for:', entityTypeLower, 'ID:', entityId);

    for (const file of selectedFiles) {
      console.log('File name:', file.uri.split('/').pop(), 'File URI:', file.uri, 'Type:', file.type);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: file.uri.split('/').pop(),
      });

      try {
        const response = await axios.post(
          `${BASE_URL}/api/${entityTypeLower}/${entityId}/files`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log(`File ${file.uri} uploaded successfully:`, response.data);
      } catch (error) {
        console.error('File upload error:', error.response?.data || error.message);
        throw new Error('Ошибка загрузки файла');
      }
    }
  };

  const handleSubmit = async () => {
    console.log('Сохранение стартовало');
    console.log('User from Redux:', user);
    console.log('User ID:', user.id, 'Type:', typeof user.id);
    console.log('Token:', token);
    console.log('Selected Item:', selectedItem);

    if (!token) {
      Alert.alert('Ошибка', 'Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    try {
      let response;

      switch (selectedItem) {
        case 'Ресторан':
          console.log('Form data before submission:', formData);
          console.log('Types in formData:', Object.keys(formData).map(key => `${key}: ${typeof formData[key]}`));

          if (!formData.name || !formData.capacity || !formData.cuisine || !formData.averageCost) {
            throw new Error('Заполните все обязательные поля: Название, Вместимость, Кухня, Средний чек');
          }

          const restaurantData = {
            ...formData,
            averageCost: parseFloat(formData.averageCost) || 0,
            supplier_id: user.id,
          };

          console.log('restaurantData:', restaurantData);
          console.log('Types in restaurantData:', Object.keys(restaurantData).map(key => `${key}: ${typeof restaurantData[key]}`));

          response = await api.createRestaurant(restaurantData);
          console.log('API response:', response);
          break;

        case 'Одежда':
          response = await api.createClothing({ ...formData, supplier_id: user.id });
          break;

        case 'Транспорт':
          console.log('formdata= ',formData)
          const transportData = {
            ...formData,
            cost: parseFloat(formData.cost) || 0,
            supplier_id: user.id,
          };
          console.log('TD- ',transportData)
          response = await api.createTransport(transportData);
          break;

        case 'Тамада':
          response = await api.createTamada({ ...formData, supplier_id: user.id });
          break;
        case 'Программа':
          response = await api.createProgram({ ...formData, supplier_id: user.id });
          break;
        case 'Традиционные подарки':
          response = await api.createTraditionalGift({ ...formData, supplier_id: user.id });
          break;
        case 'Цветы':
          response = await api.createFlowers({ ...formData, supplier_id: user.id });
          break;
        case 'Торты':
          response = await api.createCake({ ...formData, supplier_id: user.id });
          break;
        case 'Алкоголь':
          response = await api.createAlcohol({ ...formData, supplier_id: user.id });
          break;
        default:
          throw new Error('Выберите тип объекта');
      }

      const entityId = response.data.id;
      console.log('Entity ID:', entityId, 'Type:', typeof entityId);

      if (selectedFiles.length > 0) {
        console.log('Selected Files:', selectedFiles);
        await uploadFiles(selectedItem, entityId); // Передаём русское название
      }

      Alert.alert('Успех', `${selectedItem} успешно создан${selectedFiles.length > 0 ? ' с файлами' : ''}!`);
      setFormData({});
      setSelectedFiles([]);
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка:', error.response?.data || error.message);
      Alert.alert('Ошибка', error.message || error.response?.data?.error || 'Не удалось создать объект');
    }
  };

  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      <Image source={{ uri: item.uri }} style={styles.filePreview} />
      <TouchableOpacity onPress={() => removeFile(item.uri)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  const renderForm = () => {
    switch (selectedItem) {
      case 'Ресторан':
        return (
          <>
            <TextInput style={styles.input} placeholder="Название" value={formData.name || ''} onChangeText={(value) => handleInputChange('name', value)} />
            <TextInput style={styles.input} placeholder="Вместимость" value={formData.capacity || ''} onChangeText={(value) => handleInputChange('capacity', value)} />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Кухня:</Text>
              <TouchableOpacity style={styles.cuisineButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.cuisineText}>{formData.cuisine || 'Выберите кухню'}</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите кухню</Text>
                  <Picker selectedValue={formData.cuisine} onValueChange={(value) => { handleInputChange('cuisine', value); setModalVisible(false); }} style={styles.modalPicker}>
                    <Picker.Item label="Выберите кухню" value="" />
                    {cuisineOptions.map((option) => <Picker.Item key={option} label={option} value={option} />)}
                  </Picker>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TextInput style={styles.input} placeholder="Средний чек" value={formData.averageCost || ''} onChangeText={(value) => handleInputChange('averageCost', value)} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Адрес" value={formData.address || ''} onChangeText={(value) => handleInputChange('address', value)} />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Телефон:</Text>
              <TextInput style={styles.input} placeholder="+7 (XXX) XXX-XX-XX" value={formData.phone || ''} onChangeText={handlePhoneChange} keyboardType="phone-pad" maxLength={18} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Район:</Text>
              <TouchableOpacity style={styles.cuisineButton} onPress={() => setDistrictModalVisible(true)}>
                <Text style={styles.cuisineText}>{formData.district || 'Выберите район'}</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={districtModalVisible} transparent={true} animationType="slide" onRequestClose={() => setDistrictModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите район</Text>
                  <Picker selectedValue={formData.district} onValueChange={(value) => { handleInputChange('district', value); setDistrictModalVisible(false); }} style={styles.modalPicker}>
                    <Picker.Item label="Выберите район" value="" />
                    {districtOptions.map((option) => <Picker.Item key={option} label={option} value={option} />)}
                  </Picker>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setDistrictModalVisible(false)}>
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
                      <TextInput
                        style={styles.input}
                        placeholder="Стоимость"
                        value={formData.cost || ''}
                        onChangeText={(value) => handleInputChange('cost', value)}
                        keyboardType="numeric"
                      />
              </>
            );
          case 'Тамада':
            return (
              <>
                 <TextInput
                style={styles.input}
                placeholder="Имя/Псевдоним"
                value={formData.name || ''}
                onChangeText={(value) => handleInputChange('name', value)}
              />
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
                  value={formData.name || ''}
                  onChangeText={(value) => handleInputChange('name', value)}
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Создать объект</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Выберите тип объекта:</Text>
        <TouchableOpacity style={styles.roleButton} onPress={() => setPickerVisible(true)}>
          <Text style={styles.roleText}>{selectedItem || 'Выберите'}</Text>
        </TouchableOpacity>
        <Modal visible={isPickerVisible} transparent={true} animationType="slide" onRequestClose={() => setPickerVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Picker selectedValue={selectedItem} style={styles.picker} onValueChange={(itemValue) => { setSelectedItem(itemValue); setPickerVisible(false); setFormData({}); }}>
                <Picker.Item label="Выберите" value="" />
                {items.map((item) => <Picker.Item key={item} label={item} value={item} />)}
              </Picker>
              <Button title="Закрыть" onPress={() => setPickerVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
      {renderForm()}
      {selectedItem && (
        <>
          <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
            <Text style={styles.uploadButtonText}>Добавить фото/видео</Text>
          </TouchableOpacity>
          {selectedFiles.length > 0 && (
            <FlatList
              data={selectedFiles}
              renderItem={renderFileItem}
              keyExtractor={(item) => item.uri}
              horizontal
              style={styles.fileList}
            />
          )}
          <Button title="Создать" onPress={handleSubmit} disabled={!selectedItem} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  pickerContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  roleButton: { borderWidth: 1, borderRadius: 5, padding: 10, alignItems: 'center', backgroundColor: '#f0f0f0' },
  roleText: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', marginHorizontal: 20, padding: 40, borderRadius: 10 },
  picker: { height: 300, width: '100%' },
  inputContainer: { marginBottom: 10 },
  inputLabel: { fontSize: 16, color: '#4B5563', marginBottom: 4 },
  cuisineButton: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, justifyContent: 'center' },
  cuisineText: { fontSize: 16, color: '#374151' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 12 },
  modalPicker: { height: 150, color: '#374151' },
  closeButton: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#6B7280', paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  closeButtonText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  uploadButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  fileList: { marginVertical: 10 },
  fileItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  filePreview: { width: 50, height: 50, borderRadius: 5 },
  removeButton: { marginLeft: 10 },
  removeButtonText: { color: 'red', fontSize: 14 },
});