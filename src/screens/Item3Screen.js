// // // screens/Item1Screen.js
// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';
// // import { useRoute } from '@react-navigation/native';
// // export default function Item3Screen() {
// //    const route = useRoute();
// //     const itemId = route.params?.id; // ID объекта для редактирования
// //     const type = route.params?.data; // Тип объекта (restaurant, clothing, и т.д.)
// //     console.log('Принимаю параметры: id=', itemId, 'type=', type);
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Cоздание мероприятия</Text>
// //       inp

// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   title: { fontSize: 24, marginBottom: 20 },
// // });


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, FlatList } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import api from '../api/api'; // Предполагается, что у вас есть API для отправки данных

// export default function Item3Screen() {
//   const route = useRoute();
//   const selectedItems = route.params?.data;  // Массив выбранных данных
//   console.log('selectedData',selectedItems)
//   const userId = useSelector((state) => state.auth.user?.id); // ID пользователя из Redux
//   const { token } = useSelector((state) => state.auth); // Токен авторизации

//   const [weddingName, setWeddingName] = useState('');
//   const [weddingDate, setWeddingDate] = useState('');

//   // Функция для форматирования даты (например, ввод в формате "2024-12-15")
//   const handleDateChange = (text) => {
//     setWeddingDate(text);
//   };

//   // Функция для отправки данных на сервер
//   const handleSubmit = async () => {
//     if (!weddingName || !weddingDate) {
//       alert('Пожалуйста, заполните имя и дату свадьбы');
//       return;
//     }

//     if (!userId || !token) {
//       alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
//       navigation.navigate('Login');
//       return;
//     }
    

//     const weddingData = {
//       name: weddingName,
//       date: weddingDate,
//       host_id: userId,
//       items: selectedItems.map(item => ({
//         id: item.id,
//         type: item.type,
//         totalCost: item.cost,
//       })),
//     };

//     console.log('weddingData= ',weddingData)

//     try {
//       // Предполагается, что у вас есть метод в api для создания свадьбы
//       const response = await api.createWedding(weddingData);
//       alert('Свадьба успешно создана!');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Ошибка при создании свадьбы:', error);
//       alert('Не удалось создать свадьбу: ' + (error.response?.data?.error || error.message));
//     }
//   };

//   // Рендеринг элементов списка
//   const renderItem = ({ item }) => {
//     console.log(item)
//     let title = '';
//     switch (item.type) {
//       case 'restaurant':
//         title = `${item.name} (${item.cuisine}) - ${item.totalCost} тг`;
//         break;
//       case 'clothing':
//         title = `${item.itemName} (${item.storeName}) - ${item.totalCost} тг`;
//         break;
//       case 'tamada':
//         title = `${item.name} - ${item.totalCost} тг`;
//         break;
//       case 'program':
//         title = `${item.teamName} - ${item.totalCost} тг`;
//         break;
//       case 'traditionalGift':
//         title = `${item.itemName} (${item.salonName}) - ${item.totalCost} тг`;
//         break;
//       case 'flowers':
//         title = `${item.flowerName} (${item.flowerType}) - ${item.totalCost} тг`;
//         break;
//       case 'cake':
//         title = `${item.name} (${item.cakeType}) - ${item.totalCost} тг`;
//         break;
//       case 'alcohol':
//         title = `${item.alcoholName} (${item.category}) - ${item.totalCost} тг`;
//         break;
//       case 'transport':
//         title = `${item.carName} (${item.brand}) - ${item.totalCost} тг`;
//         break;
//       default:
//         title = 'Неизвестный элемент';
//     }

//     return (
//       <View style={styles.itemContainer}>
//         <Text style={styles.itemText}>{title}</Text>
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Создание мероприятия "Свадьба"</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
//         value={weddingName}
//         onChangeText={setWeddingName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Дата свадьбы (например, 2024-12-15)"
//         value={weddingDate}
//         onChangeText={handleDateChange}
//         keyboardType="numeric"
//       />

//       <Text style={styles.subtitle}>Выбранные элементы:</Text>
//       {selectedItems.length > 0 ? (
//         <FlatList
//           data={selectedItems}
//           renderItem={renderItem}
//           keyExtractor={(item) => `${item.type}-${item.id}`}
//           style={styles.list}
//         />
//       ) : (
//         <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
//       )}

//       <View style={styles.totalContainer}>
//         <Text style={styles.totalText}>
//           {/* Общая стоимость: {selectedItems.reduce((sum, item) => sum + item.totalCost, 0)} тг */}
//         </Text>
//       </View>

//       <Button title="Создать свадьбу" onPress={handleSubmit} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   list: {
//     marginBottom: 20,
//   },
//   itemContainer: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   noItems: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   totalContainer: {
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });