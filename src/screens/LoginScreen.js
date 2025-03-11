import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, loginSuccess, setError } from '../store/authSlice';
import api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,Alert,Button
} from "react-native";

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
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    color: "#DC2626",
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: "#DC2626",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
  },
});