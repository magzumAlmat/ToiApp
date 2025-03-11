import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, loginSuccess, setError } from '../store/authSlice';
import api from '../api/api';
import * as SecureStore from 'expo-secure-store';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  // Проверка токена при загрузке
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await SecureStore.getItemAsync('token');
      if (storedToken) {
        // Здесь можно добавить запрос к API для проверки валидности токена
        dispatch(loginSuccess({ user: { email: 'loaded' }, token: storedToken })); // Пример
        navigation.navigate('Authenticated');
      }
    };
    checkToken();
  }, [dispatch, navigation]);

  const handleLogin = async () => {
    dispatch(startLoading());
    try {
      const response = await api.login({ email, password });
      dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
      await SecureStore.setItemAsync('token', response.data.token); // Сохраняем токен
      Alert.alert('Успех', 'Вы вошли в систему!');
      navigation.navigate('Authenticated');
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Ошибка входа'));
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось войти');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
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
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Загрузка...' : 'Войти'} onPress={handleLogin} disabled={loading} />
      <Button title="Нет аккаунта? Зарегистрироваться" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});