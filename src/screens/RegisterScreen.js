// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { startLoading, registerSuccess, setError } from '../store/authSlice';
// import api from '../api/api';
// import { Picker } from '@react-native-picker/picker';

// export default function RegisterScreen({ navigation }) {
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [role, setRole] = useState('Клиент'); // По умолчанию "Клиент"
//   const [isPickerVisible, setPickerVisible] = useState(false); // Состояние видимости Picker
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);

//   const handleRegister = async () => {
//     dispatch(startLoading());
//     try {
//       const roleId = role === 'Поставщик' ? 2 : 3; // 1 - Клиент, 2 - Поставщик
//       const userData = { email, password, phone, name, lastname, roleId };
//       await api.register(userData);
//       dispatch(registerSuccess());
//       Alert.alert('Успех', 'Проверьте email для подтверждения.');
//       navigation.navigate('Login');
//     } catch (error) {
//       dispatch(setError(error.response?.data?.error || 'Ошибка регистрации'));
//       Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарегистрироваться');
//     }
//   };

//   const handleRoleSelect = (itemValue) => {
//     setRole(itemValue);
//     setPickerVisible(false); // Закрываем Picker после выбора
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Регистрация</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Пароль"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Телефон"
//         value={phone}
//         onChangeText={setPhone}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Имя"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Фамилия"
//         value={lastname}
//         onChangeText={setLastname}
//       />

//       <View style={styles.pickerContainer}>
//         <Text style={styles.label}>Выберите роль:</Text>
//         <TouchableOpacity
//           style={styles.roleButton}
//           onPress={() => setPickerVisible(true)}
//         >
//           <Text style={styles.roleText}>{role}</Text>
//         </TouchableOpacity>

//         <Modal
//           visible={isPickerVisible}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setPickerVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Picker
//                 selectedValue={role}
//                 style={styles.picker}
//                 onValueChange={handleRoleSelect}
//               >
//                 <Picker.Item label="Клиент" value="Клиент" />
//                 <Picker.Item label="Поставщик" value="Поставщик" />
//               </Picker>
//               <Button title="Закрыть" onPress={() => setPickerVisible(false)} />
//             </View>
//           </View>
//         </Modal>
//       </View>

//       {error && <Text style={styles.error}>{error}</Text>}
//       <Button
//         title={'Зарегистрироваться'}
//         onPress={handleRegister}
//         // disabled={loading}
//       />
//       <Button title="Уже есть аккаунт? Войти" onPress={() => navigation.navigate('Login')} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: 'center' },
//   title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
//   error: { color: 'red', marginBottom: 10, textAlign: 'center' },
//   pickerContainer: { marginBottom: 10 },
//   label: { fontSize: 16, marginBottom: 5 },
//   roleButton: {
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   roleText: { fontSize: 16 },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     marginHorizontal: 20,
//     padding: 20,
//     borderRadius: 10,
//   },
//   picker: { height: 200, width: '100%' },
// });





import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, registerSuccess, setError } from '../store/authSlice';
import api from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const COLORS = {
  primary: '#FF6F61',
  white: '#FFFFFF',
};

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState('Клиент');
  const [showPassword, setShowPassword] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    dispatch(startLoading());
    try {
      const roleId = role === 'Поставщик' ? 2 : 3;
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
    setPickerVisible(false);
  };

  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {/* <Image
        source={require('../../assets/footer.png')}
        style={styles.footerPattern}
      /> */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Text style={styles.title}>Регистрация</Text>

      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={40} color="#5A4032" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#B0BEC5"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#B0BEC5"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#5A4032"
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#B0BEC5"
        />
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
            <LinearGradient
              colors={['#F1EBDD', '#897066']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.modalContent}
            >
              <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={handleRoleSelect}
              >
                <Picker.Item label="Клиент" value="Клиент" />
                <Picker.Item label="Поставщик" value="Поставщик" />
              </Picker>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPickerVisible(false)}
              >
                <LinearGradient
                  colors={['#D3C5B7', '#A68A6E']}
                  style={styles.closeButtonGradient}
                >
                  <Text style={styles.closeButtonText}>Закрыть</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <TouchableOpacity style={styles.registerButtonContainer} onPress={handleRegister}>
        <LinearGradient
          colors={['#D3C5B7', '#A68A6E']}
          style={styles.registerButtonGradient}
        >
          <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 40,
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
    zIndex: 2,
  },
  inputContainer: {
    width: '80%',
    zIndex: 2,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  roleButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  roleText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 200,
    color: '#1A1A1A',
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#5A4032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  registerButtonContainer: {
    marginTop: 20,
    marginBottom: 30,
    zIndex: 2,
  },
  registerButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#5A4032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  linkText: {
    fontSize: 14,
    color: '#5A4032',
    marginVertical: 5,
    textDecorationLine: 'underline',
    zIndex: 2,
  },
});