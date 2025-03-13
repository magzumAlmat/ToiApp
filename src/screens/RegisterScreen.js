import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, registerSuccess, setError } from '../store/authSlice';
import api from '../api/api';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState('Клиент'); // По умолчанию "Клиент"
  const [isPickerVisible, setPickerVisible] = useState(false); // Состояние видимости Picker
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    dispatch(startLoading());
    try {
      const roleId = role === 'Поставщик' ? 2 : 3; // 1 - Клиент, 2 - Поставщик
      const userData = { email, password, phone, name, lastname, roleId };
      await api.register(userData);
      dispatch(registerSuccess());
      Alert.alert('Успех', 'Проверьте email для подтверждения.');
      navigation.navigate('Login');
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Ошибка регистрации'));
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарегистрироваться');
    }
  };

  const handleRoleSelect = (itemValue) => {
    setRole(itemValue);
    setPickerVisible(false); // Закрываем Picker после выбора
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Телефон"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Имя"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Фамилия"
        value={lastname}
        onChangeText={setLastname}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Выберите роль:</Text>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.roleText}>{role}</Text>
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
                selectedValue={role}
                style={styles.picker}
                onValueChange={handleRoleSelect}
              >
                <Picker.Item label="Клиент" value="Клиент" />
                <Picker.Item label="Поставщик" value="Поставщик" />
              </Picker>
              <Button title="Закрыть" onPress={() => setPickerVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={'Зарегистрироваться'}
        onPress={handleRegister}
        // disabled={loading}
      />
      <Button title="Уже есть аккаунт? Войти" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  pickerContainer: { marginBottom: 10 },
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
});