import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login');
    }
  }, [token, navigation]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>
      {user && <Text style={styles.text}>Email: {user.email}</Text>}
      {token ? (
        <Text style={styles.text}>Токен: {token}</Text>
      ) : (
        <Text style={styles.text}>Токен отсутствует</Text>
      )}
      <Button title="Выйти" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
});