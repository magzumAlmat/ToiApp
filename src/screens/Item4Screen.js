// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { startLoading, setError, loginSuccess, logout } from '../store/authSlice';
// import api from '../api/api';
// import * as SecureStore from 'expo-secure-store';

// export default function Item4Screen({ navigation }) {
//   const dispatch = useDispatch();
//   const { user, token, loading, error } = useSelector((state) => state.auth);

//   // Локальное состояние для формы
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [areasOfActivity, setAreasOfActivity] = useState('');

//   // Загрузка данных профиля с сервера при монтировании, если они отсутствуют
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) {
//         navigation.navigate('Login');
//         return;
//       }
//       if (!user || !user.phone) {
//         dispatch(startLoading());
//         try {
//           const response = await api.getProfile(token); // Предполагаемый эндпоинт
//           dispatch(loginSuccess({ user: response.data, token }));
//         } catch (err) {
//           dispatch(setError(err.response?.data?.message || 'Ошибка загрузки профиля'));
//           Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
//         }
//       }
//     };
//     fetchProfile();
//   }, [dispatch, navigation, token, user]);

//   // Заполнение формы текущими данными пользователя
//   useEffect(() => {
//     if (user) {
//       setPassword(''); // Пароль не заполняется
//       setPhone(user.phone || '');
//       setName(user.name || '');
//       setLastname(user.lastname || '');
//       setAreasOfActivity(user.areasofactivity || '');
//     }
//   }, [user]);

//   const handleUpdateProfile = async () => {
//     if (!token) {
//       Alert.alert('Ошибка', 'Токен отсутствует. Пожалуйста, войдите снова.');
//       navigation.navigate('Login');
//       return;
//     }

//     dispatch(startLoading());
//     try {
//       const updatedData = {
//         password,
//         phone,
//         name,
//         lastname,
//         areasofactivity: areasOfActivity,
//       };
//       const response = await api.updateProfile(updatedData, token);
//       dispatch(loginSuccess({ user: response.data, token }));
//       Alert.alert('Успех', 'Профиль успешно обновлён!');
//     } catch (error) {
//       dispatch(setError(error.response?.data?.message || 'Ошибка обновления профиля'));
//       Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось обновить профиль');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       dispatch(startLoading()); // Устанавливаем состояние загрузки
//       await SecureStore.deleteItemAsync('token'); // Удаляем токен асинхронно
//       console.log('Token removed from SecureStore');
//       dispatch(logout()); // Обновляем состояние в Redux
//       navigation.navigate('Login'); // Перенаправляем на экран логина
//     } catch (error) {
//       console.error('Logout error:', error);
//       dispatch(setError('Ошибка при выходе'));
//       Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Профиль</Text>

//         {user ? (
//           <>
//             <Text style={styles.label}>Email: {user.email}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Имя"
//               value={name}
//               onChangeText={setName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Фамилия"
//               value={lastname}
//               onChangeText={setLastname}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Телефон"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />
//             {error && <Text style={styles.error}>{error}</Text>}
//             <Button
//               title={loading ? 'Сохранение...' : 'Сохранить изменения'}
//               onPress={handleUpdateProfile}
//               disabled={loading}
//             />
//             <Button
//               title={loading ? 'Выход...' : 'Выйти'}
//               onPress={handleLogout}
//               disabled={loading}
//               color="#FF6F61" // Опционально: цвет кнопки выхода
//             />
//           </>
//         ) : (
//           <Text style={styles.text}>Данные пользователя недоступны</Text>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: { flexGrow: 1, justifyContent: 'center' },
//   container: { flex: 1, padding: 20, alignItems: 'center' },
//   title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   label: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//     width: '100%',
//   },
//   text: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
//   error: { color: 'red', marginBottom: 10, textAlign: 'center' },
// });





import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, setError, loginSuccess, logout } from '../store/authSlice';
import api from '../api/api';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#FF6F61',
  white: '#FFFFFF',
};

export default function Item4Screen({ navigation }) {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      if (!user || !user.phone) {
        dispatch(startLoading());
        try {
          const response = await api.getProfile(token);
          dispatch(loginSuccess({ user: response.data, token }));
        } catch (err) {
          dispatch(setError(err.response?.data?.message || 'Ошибка загрузки профиля'));
          Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
        }
      }
    };
    fetchProfile();
  }, [dispatch, navigation, token, user]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setName(user.name || '');
      setLastname(user.lastname || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!token) {
      Alert.alert('Ошибка', 'Токен отсутствует. Пожалуйста, войдите снова.');
      navigation.navigate('Login');
      return;
    }

    dispatch(startLoading());
    try {
      const updatedData = {
        phone,
        name,
        lastname,
      };
      const response = await api.updateProfile(updatedData, token);
      dispatch(loginSuccess({ user: response.data, token }));
      Alert.alert('Успех', 'Профиль успешно обновлён!');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Ошибка обновления профиля'));
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось обновить профиль');
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(startLoading()); // Устанавливаем состояние загрузки
      await SecureStore.deleteItemAsync('token'); // Удаляем токен асинхронно
      console.log('Token removed from SecureStore');
      dispatch(logout()); // Обновляем состояние в Redux
      navigation.navigate('Login'); // Перенаправляем на экран логина
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(setError('Ошибка при выходе'));
      Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
    }
  };

  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Image
        source={require('../../assets/footer.png')}
        style={styles.footerPattern}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Text style={styles.title}>Профиль</Text>

      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={40} color="#5A4032" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {user ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email: {user.email}</Text>
            <TextInput
              style={styles.input}
              placeholder="Имя"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#B0BEC5"
            />
            <TextInput
              style={styles.input}
              placeholder="Фамилия"
              value={lastname}
              onChangeText={setLastname}
              placeholderTextColor="#B0BEC5"
            />
            <TextInput
              style={styles.input}
              placeholder="Телефон"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#B0BEC5"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              style={styles.saveButtonContainer}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <LinearGradient
                colors={['#D3C5B7', '#A68A6E']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButtonContainer}
              onPress={handleLogout}
              disabled={loading}
            >
              <LinearGradient
                colors={['#FF6F61', '#E57373']}
                style={styles.logoutButtonGradient}
              >
                <Text style={styles.logoutButtonText}>
                  {loading ? 'Выход...' : 'Выйти'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.text}>Данные пользователя недоступны</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerPattern: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    zIndex: 1,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  backButton: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    padding: 10,
    zIndex: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 80,
    marginBottom: 10,
    textAlign: 'center',
    zIndex: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    zIndex: 2,
  },
  inputContainer: {
    width: '80%',
    zIndex: 2,
  },
  label: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 15,
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 15,
    zIndex: 2,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#5A4032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  logoutButtonContainer: {
    marginBottom: 30,
    zIndex: 2,
  },
  logoutButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    zIndex:5,
  },
  text: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    zIndex: 2,
  },
});