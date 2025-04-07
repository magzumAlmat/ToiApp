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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [formDataId, setFormDataId] = useState(''); // Исправлено имя
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const restaurantId = route.params?.id;
  console.log('Received restaurant ID:', restaurantId);
  const { user, token } = useSelector((state) => state.auth);

  const BASE_URL = process.env.EXPO_PUBLIC_API_baseURL;

  const items = [
    'Ресторан', 'Одежда', 'Транспорт', 'Тамада', 'Программа',
    'Традиционные подарки', 'Цветы', 'Торты', 'Алкоголь', 'Товары',
  ];

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
    'Товары': 'goods',
  };

  const categoryOptions = [
    'Деньги', 'Бытовая техника', 'Посуда и кухонные принадлежности', 'Текстиль для дома',
    'Мебель и элементы интерьера', 'Подарки для отдыха и путешествий', 'Электроника и гаджеты',
    'Подарки для хобби и увлечений', 'Символические и романтические подарки', 'Сертификаты и подписки',
    'Алкоголь и гастрономия', 'Традиционные подарки',
  ];
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
    const entityTypeLower = entityTypeMap[entityType];
    console.log('6 entityTypeLower= ', entityTypeLower);
    console.log('7 Starting file upload for:', entityTypeLower, 'ID:', entityId);

    for (const file of selectedFiles) {
      console.log('File name:', file.uri.split('/').pop(), 'File URI:', file.uri, 'Type:', file.type);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: file.uri.split('/').pop(),
      });

      console.log('8 formdata', formData);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/${entityTypeLower}/${entityId}/files`,
          formData, // Исправлено
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
    console.log('1 Сохранение стартовало');
    console.log('2 User from Redux:', user);
    console.log('3 User ID:', user.id, 'Type:', typeof user.id);
    console.log('4 Token:', token);
    console.log('5 Selected Item:', selectedItem);

    if (!token) {
      Alert.alert('Ошибка', 'Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    try {
      setIsLoading(true);
      let response;
      let entityId;

      switch (selectedItem) {
        case 'Товары':
          if (!formData.category || !formData.item_name) {
            throw new Error('Заполните обязательные поля: Категория и Название товара');
          }
          const goodsData = {
            category: formData.category,
            item_name: formData.item_name,
            description: formData.description || '',
            cost: formData.cost || '',
          };
          const newGoodsData = { ...goodsData, supplier_id: user.id };
          console.log('goodsData=', newGoodsData);

          response = await axios.post(`${BASE_URL}/api/goods`, newGoodsData);
          console.log('0 response=', response.data);

          if (!response.data || !response.data.data || !response.data.data.id) {
            throw new Error('Сервер не вернул ID созданного товара');
          }

          entityId = response.data.data.id;
          setFormDataId(response.data.data.id);
          console.log('9 RESPONSE=', response.data.data.id, 'FORMDATAID= ', formDataId);
          console.log('Entity ID:', entityId, 'Type:', typeof entityId);
          break;
        // Добавьте остальные case с entityId
        default:
          throw new Error('Выберите тип объекта');
      }

      if (selectedFiles.length > 0) {
        console.log('Selected Files:', selectedFiles);
        await uploadFiles(selectedItem, entityId);
      }

      Alert.alert('Успех', `${selectedItem} успешно создан${selectedFiles.length > 0 ? ' с файлами' : ''}!`);
      setFormData({});
      setSelectedFiles([]);
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка:', error.response?.data || error.message);
      Alert.alert('Ошибка', error.message || error.response?.data?.error || 'Не удалось создать объект');
    } finally {
      setIsLoading(false);
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
      case 'Товары':
        return (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Категория:</Text>
              <TouchableOpacity style={styles.cuisineButton} onPress={() => setCategoryModalVisible(true)}>
                <Text style={styles.cuisineText}>{formData.category || 'Выберите категорию'}</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={categoryModalVisible} transparent={true} animationType="slide" onRequestClose={() => setCategoryModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Выберите категорию</Text>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) => {
                      handleInputChange('category', value);
                      setCategoryModalVisible(false);
                    }}
                    style={styles.modalPicker}
                  >
                    <Picker.Item label="Выберите категорию" value="" />
                    {categoryOptions.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <TextInput
              style={styles.input}
              placeholder="Название товара"
              value={formData.item_name || ''}
              onChangeText={(value) => handleInputChange('item_name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Описание"
              value={formData.description || ''}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Диапазон цен (например, 1000-5000 руб)"
              value={formData.cost || ''}
              onChangeText={(value) => handleInputChange('cost', value)}
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
          <Button
            title={isLoading ? 'Создание...' : 'Создать'}
            onPress={handleSubmit}
            disabled={!selectedItem || isLoading}
          />
        </>
      )}
    </ScrollView>
  );
}

// Стили остаются без изменений
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






const typesMapping = [
  { key: 'clothing', costField: 'cost', type: 'clothing', label: 'Одежда' },
  { key: 'tamada', costField: 'cost', type: 'tamada', label: 'Тамада' },
  { key: 'programs', costField: 'cost', type: 'program', label: 'Программа' },
  { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift', label: 'Традиционные подарки' },
  { key: 'flowers', costField: 'cost', type: 'flowers', label: 'Цветы' },
  { key: 'cakes', costField: 'cost', type: 'cake', label: 'Торты' },
  { key: 'alcohol', costField: 'cost', type: 'alcohol', label: 'Алкоголь' },
  { key: 'transport', costField: 'cost', type: 'transport', label: 'Транспорт' },
  { key: 'restaurants', costField: 'averageCost', type: 'restaurant', label: 'Ресторан' },
  { key: 'goods', costField: 'cost', type: 'goods', label: 'Товары' },
];

const allTypes = [
  { type: 'all', label: 'Все' },
  ...combinedData.map((item) => ({
    type: item.type,
    label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
  })),
];





