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

export default function RestaurantScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const restaurantId = route.params?.id;
  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    capacity: '',
    cuisine: '',
    averageCost: '',
    address: '',
    phone: '',
    district: '',
    supplier_id:user.id,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false); // Новое состояние для модального окна района
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

  useEffect(() => {
    if (restaurantId && token) {
      const fetchRestaurant = async () => {
        try {
          const response = await api.getRestaurant(restaurantId);
          setForm(response.data);
        } catch (error) {
          alert('Ошибка загрузки данных: ' + (error.response?.data?.message || error.message));
        }
      };
      fetchRestaurant();
    }
  }, [restaurantId, token]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Форматирование телефона
  const formatPhoneNumber = (input) => {
    // Удаляем все нечисловые символы, кроме первой "+"
    let cleaned = input.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) cleaned = '+' + cleaned.replace(/\+/g, '');

    // Если начинается не с "+7", добавляем "+7"
    if (!cleaned.startsWith('+7')) {
      cleaned = '+7' + cleaned.replace(/^\+?\d*/g, '');
    }

    // Ограничиваем до 12 символов (+7 и 10 цифр)
    const digits = cleaned.slice(2, 12); // Берем только цифры после +7
    let formatted = '+7';

    if (digits.length > 0) formatted += ' (' + digits.slice(0, 3);
    if (digits.length > 3) formatted += ') ' + digits.slice(3, 6);
    if (digits.length > 6) formatted += '-' + digits.slice(6, 8);
    if (digits.length > 8) formatted += '-' + digits.slice(8, 10);

    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formattedPhone = formatPhoneNumber(text);
    handleChange('phone', formattedPhone);
  };

  const handleSave = async () => {
    if (!token) {
      alert('Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    if (!form.name || !form.capacity || !form.cuisine || !form.averageCost) {
      alert('Пожалуйста, заполните все обязательные поля: Название, Вместимость, Кухня, Средний чек');
      return;
    }

    const formattedForm = {
      ...form,
      averageCost: parseFloat(form.averageCost),
    };

    console.log('Отправляемые данные:', formattedForm);

    try {
      if (restaurantId) {
        await api.updateRestaurant(restaurantId, formattedForm);
        alert('Ресторан обновлён!');
      } else {
        const response = await api.createRestaurant(formattedForm);
        console.log('Ответ сервера:', response.data);
        alert('Ресторан создан!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка запроса:', error.response);
      alert('Ошибка: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    if (!token) {
      alert('Пожалуйста, войдите в систему');
      navigation.navigate('Login');
      return;
    }

    if (restaurantId) {
      try {
        await api.deleteRestaurant(restaurantId);
        alert('Ресторан удалён!');
        navigation.goBack();
      } catch (error) {
        alert('Ошибка: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (!token) {
    return (
      <View style={styles.noAuthContainer}>
        <Text style={styles.noAuthText}>Пожалуйста, войдите в систему, чтобы продолжить</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {restaurantId ? 'Редактировать ресторан' : 'Создать ресторан'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Название:</Text>
          <TextInput
            style={styles.input}
            placeholder="Название"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Вместимость:</Text>
          <TextInput
            style={styles.input}
            placeholder="Вместимость (например, 50 человек)"
            value={form.capacity}
            onChangeText={(text) => handleChange('capacity', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Кухня:</Text>
          <TouchableOpacity
            style={styles.cuisineButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.cuisineText}>
              {form.cuisine || 'Выберите кухню'}
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
                selectedValue={form.cuisine}
                onValueChange={(value) => {
                  handleChange('cuisine', value);
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Средний чек  </Text>
          <TextInput
            style={styles.input}
            placeholder="Средний чек (например, 1500)"
            value={form.averageCost}
            onChangeText={(text) => handleChange('averageCost', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Адрес:</Text>
          <TextInput
            style={styles.input}
            placeholder="Адрес"
            value={form.address}
            onChangeText={(text) => handleChange('address', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Телефон:</Text>
          <TextInput
            style={styles.input}
            placeholder="+7 (XXX) XXX-XX-XX"
            value={form.phone}
            onChangeText={handlePhoneChange} // Используем специальный обработчик
            keyboardType="phone-pad"
            maxLength={18} // Ограничение длины для "+7 (XXX) XXX-XX-XX"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Район:</Text>
          <TouchableOpacity
            style={styles.cuisineButton} // Используем тот же стиль, что для кухни
            onPress={() => setDistrictModalVisible(true)}
          >
            <Text style={styles.cuisineText}>
              {form.district || 'Выберите район'}
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
                selectedValue={form.district}
                onValueChange={(value) => {
                  handleChange('district', value);
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Сохранить</Text>
        </TouchableOpacity>

        {restaurantId && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Удалить</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
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
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
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
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  noAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  noAuthText: {
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});