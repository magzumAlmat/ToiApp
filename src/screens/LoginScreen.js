import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, loginSuccess, setError, setLoading } from '../store/authSlice';
import api from '../api/api';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  // Обработка логина
  const handleLogin = async () => {
    dispatch(startLoading());
    console.log('Login attempt:', { email, password },'link--------',process.env.EXPO_PUBLIC_API_baseURL);
    try {
      const loginResponse = await api.login({ email, password });
      console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));
      const authToken = loginResponse.data.token;

      // Сохраняем токен
      await SecureStore.setItemAsync('token', authToken);
      console.log('Token saved to SecureStore:', authToken);

      // Устанавливаем токен в api для последующих запросов
      api.setToken(authToken);

      // Получаем данные пользователя
      const userResponse = await api.getUser();
      console.log('Get user response:', JSON.stringify(userResponse.data, null, 2));

      // Сохраняем в Redux
      dispatch(loginSuccess({ user: userResponse.data, token: authToken }));
      navigation.navigate('Authenticated');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      dispatch(setError(error.response?.data?.error || 'Ошибка входа'));
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось войти');
    }
  };

  // Проверка токена при загрузке компонента
  useEffect(() => {
    const checkToken = async () => {
      console.log('Checking stored token...');
      dispatch(setLoading(true));
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        console.log('Stored token found:', storedToken);

        if (storedToken) {
          // Устанавливаем токен в api
          api.setToken(storedToken);

          // Проверяем валидность токена через запрос пользователя
          const userResponse = await api.getUser();
          console.log('User data from token:', JSON.stringify(userResponse.data, null, 2));

          dispatch(loginSuccess({ user: userResponse.data, token: storedToken }));
          navigation.navigate('Authenticated');
        } else {
          console.log('No token found, staying on Login screen');
        }
      } catch (err) {
        console.error('Token validation error:', err.response?.data || err.message);
        dispatch(setError('Невалидный токен или ошибка сервера'));
        await SecureStore.deleteItemAsync('token');
        console.log('Token removed from SecureStore due to invalidity');
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkToken();
  }, [dispatch, navigation]); // Убрал token из зависимостей, чтобы избежать лишних вызовов

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
      <Button
        title={ 'Войти'}
        onPress={handleLogin}
       
      />
      <Button
        title="Нет аккаунта? Зарегистрироваться"
        onPress={() => navigation.navigate('Register')}
      />


{/* <Button
        title="страница "
        onPress={() => navigation.navigate('wishlist')}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});