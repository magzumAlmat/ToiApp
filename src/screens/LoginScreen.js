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

  // Проверка токена при загрузке и получение данных пользователя
  const handleLogin = async () => {
    dispatch(startLoading());
    console.log('Login attempt:', { email, password });
    try {
      const loginResponse = await api.login({ email, password });
      console.log('Login response (full):', JSON.stringify(loginResponse.data, null, 2));
      await SecureStore.setItemAsync('token', loginResponse.data.token);
      const userResponse = await api.getUser(); // Запрашиваем данные пользователя
      console.log('Get user response:', userResponse.data);

      dispatch(loginSuccess({ user: userResponse.data, token: loginResponse.data.token }));
      navigation.navigate('Authenticated');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      dispatch(setError(error.response?.data?.error || 'Ошибка входа'));
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось войти');
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      dispatch(setLoading(true));
      const storedToken = await SecureStore.getItemAsync('token');
      console.log('Stored token:', storedToken);
      if (storedToken && !token) { // Проверяем только если token ещё не в сторе
        try {
          const response = await api.getUser();
          console.log('Get user response:', response.data);
          dispatch(loginSuccess({ user: response.data.user, token: storedToken }));
          navigation.navigate('Authenticated');
        } catch (err) {
          console.error('Token check error:', err.response?.data || err.message);
          dispatch(setError('Невалидный токен или ошибка сервера'));
          await SecureStore.deleteItemAsync('token');
          navigation.navigate('Login');
        }
      }
      dispatch(setLoading(false));
    };
    checkToken();
  }, [dispatch, navigation, token]);

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