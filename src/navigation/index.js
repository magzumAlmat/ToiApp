// // import React from 'react';
// // import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { useSelector } from 'react-redux';
// // import HomeScreen from '../screens/HomeScreen';
// // import ItemEditScreen from '../screens/ItemEditScreen';
// // import Item2Screen from '../screens/Item2Screen';
// // import Item3Screen from '../screens/Item3Screen';
// // import Item4Screen from '../screens/Item4Screen';
// // import LoginScreen from '../screens/LoginScreen';
// // import RegisterScreen from '../screens/RegisterScreen';
// // import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList,SafeAreaView } from 'react-native';
// // import { useEffect } from 'react';
// // import DetailsScreen from '../screens/DetailsScreen';
// // import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
// // import * as Linking from 'expo-linking';
// // import { PaperProvider } from 'react-native-paper';
// // import { Text } from 'react-native-paper';
// // import { LinearGradient } from 'expo-linear-gradient';
// // import { useState } from 'react';
// // import ShakingLidAnimation from '../components/ShakingLidAnimation';
// // import { useFonts } from 'expo-font';
// // const Stack = createStackNavigator();
// // const Tab = createBottomTabNavigator();

// // const LoadingScreen = () => (
// //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //     <Text>Загрузка...</Text>
// //   </View>
// // );

// // // Компонент SplashScreen
// // const SplashScreen = ({ navigation }) => {
// //   const [showSecondButton, setShowSecondButton] = useState(false);

// //   const handlePress = () => {
// //     setShowSecondButton(true);
// //     setTimeout(() => {
// //       navigation.replace('NewScreen');
// //     }, 1000); // Переход через 1 секунду после нажатия
// //   };

// //   return (

// //       <LinearGradient
// //         colors={['#F1EBDD', '#897066']}
// //         start={{ x: 0, y: 1 }}
// //         end={{ x: 0, y: 0 }}
// //         style={styles.splashContainer}
// //       >
      
// //         <View style={styles.buttonContainer}>
// //           {!showSecondButton ? (
// //             <TouchableOpacity style={styles.button} onPress={handlePress}>
           
// //                <Image
// //             source={require('../../assets/firstPageTurnOff.png')}
// //             style={styles.splashImage}
// //             resizeMode="contain"
// //           />

// //               {/* </LinearGradient> */}
// //             </TouchableOpacity>
// //           ) : (
// //             <TouchableOpacity style={styles.button} disabled>
// //              <Image
// //                 source={require('../../assets/firstPageTurnOn.png')}
// //                 style={styles.splashImage2}
// //                 resizeMode="contain"
// //               />
            
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </LinearGradient>

// //   );
// // };




// // // Компонент NewScreen
// // const NewScreen = ({ navigation }) => {
// //   return (
// //     <LinearGradient
// //       colors={['#F1EBDD', '#897066']} // Градиент от #F1EBDD к #897066
// //       start={{ x: 0, y: 1 }} // Начало слева
// //       end={{ x: 0, y: 0 }} // Конец справа (0deg)
// //       style={styles.newScreenContainer}
// //     >
// //       {/* Верхний узор */}
// //       <ImageBackground
// //         source={require('../../assets/footer.png')} // Укажите путь к изображению узора
// //         style={styles.topPatternContainer}
// //         imageStyle={styles.topPatternImage}
// //       />

// //       {/* Основной контент */}
// //       <View style={styles.contentContainer}>
// //         {/* Лого в верхней части */}
// //         <View style={styles.logoContainer}>
// //           <Image
// //             source={require('../../assets/logo.png')} // Укажите путь к изображению кастрюли
// //             style={styles.potIcon}
// //             resizeMode="contain"
// //           />
// //         </View>

// //         {/* Кнопки в центре */}
// //         <View style={styles.buttonsContainer}>
          


// //           <TouchableOpacity
// //             style={styles.imageButton}
// //             onPress={() => navigation.navigate('CreateEvent')} // Переход на CreateEvent
// //           >
// //             <Image
// //               source={require('../../assets/create.png')}
// //               style={styles.buttonImage}
// //               resizeMode="contain"
// //             />
// //           </TouchableOpacity>







// //           <TouchableOpacity
// //             style={styles.imageButton}
// //             onPress={() => navigation.replace('Authenticated')}
// //           >
// //             <Image
// //               source={require('../../assets/join.png')}
// //               style={styles.buttonImage}
// //               resizeMode="contain"
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </LinearGradient>
// //   );
// // };


// // // Новый экран CreateEventScreen
// // const CreateEventScreen = ({ navigation }) => {
// //   const [fontsLoaded] = useFonts({
// //     'CustomFont-Regular': require('../../assets/font/Geologica.ttf'),
// //   });

// //   const categories = [
// //     'Традиционное семейное торжество',
// //     'Корпоративное мероприятие',
// //     'Конференции',
// //     'Тимбилдинги',
// //     'Концерты и творческие вечера',
// //     'Предложение руки и сердца',
// //     'Свадьба',
// //     'Вечеринка перед свадьбой',
// //     'Выпускной',
// //     'Национальные праздника',
// //   ];

// //   const renderCategory = ({ item }) => (
// //     <TouchableOpacity
// //     style={styles.categoryButton}
// //     onPress={() => {
// //       // Если выбрана категория "Свадьба", перенаправляем на HomeScreen
// //       if (item === 'Свадьба') {
// //         navigation.navigate('Authenticated');
// //       }
// //       // Здесь можно добавить логику для других категорий, если нужно
// //     }}
// //   >
// //     <Text style={styles.categoryText}>{item}</Text>
// //   </TouchableOpacity>
// //   );

// //   return (
// //     <LinearGradient
// //     colors={['#F1EBDD', '#897066']} // Градиент от #F1EBDD к #897066
// //     start={{ x: 0, y: 1 }} // Начало слева
// //     end={{ x: 0, y: 0 }} // Конец справа (0deg)
// //     style={styles.splashContainer}
// //   >
     

// //       {/* Лого (кастрюля) */}
// //       <View style={styles.logoContainer}>
// //       <Image
// //           source={require('../../assets/kazan.png')} 
// //           style={styles.potIcon2}
// //           resizeMode="contain"
// //         />
// //          {/* <ShakingLidAnimation/> */}
       
// //       </View>
   

// //       {/* Заголовок */}
// //       {/* <Text style={styles.title}>Традиционное семейное торжество</Text> */}

// //       {/* Список категорий */}
// //       <FlatList
// //         data={categories}
// //         renderItem={renderCategory}
// //         keyExtractor={(item, index) => index.toString()}
// //         style={styles.categoryList}
// //         showsVerticalScrollIndicator={true}
// //         // contentContainerStyle={{}}
// //       />

// //       {/* Кнопка "Далее" */}
// //       <View style={styles.bottomContainer}>

// //         <TouchableOpacity 
// //         //  onPress={() => navigation.navigate('NewScreen')} // Переход на CreateEvent
// //         onPress={() => navigation.navigate('SelectCategoryBeforeHomeScreen')}
// //         style={styles.imageButton}>
         
// //           <Image
// //             source={require('../../assets/mainButton.png')} // Используем то же изображение кастрюли для иконки
// //             style={styles.nextButtonIcon}
// //             resizeMode="contain"
// //           />
        
// //         </TouchableOpacity>
// //         <Text style={{marginTop:"1%"}} >Главная</Text>

// //       </View>
// // </LinearGradient>
// //   );
// // };




// // const SelectCategoryBeforeHomeScreen=({ navigation })=>{

// //   return(<>
// //    <Text>hi</Text>
// //   </>)
// // }



// // // Стили для SplashScreen, NewScreen и CreateEventScreen
// // const styles = StyleSheet.create({
// //   // Стили для SplashScreen
// //   splashContainer: {
// //     flex: 1,
// //     justifyContent: 'center', // Центрируем содержимое по вертикали
// //     alignItems: 'center', // Центрируем содержимое по горизонтали
// //   },
// //   logoContainer: {
    
// //     alignItems: 'center', // Центрируем логотип по горизонтали
// //     marginBottom: 40, // Отступ снизу для разделения логотипа и кнопки
// //   },
// //   splashImage: {
// //     width: '600', // Соответствует размерам potIcon в других экранах для консистентности
// //     height: '400', // Высота логотипа
// //   },
// //   splashImage2: {
// //     width: '600', // Соответствует размерам potIcon в других экранах для консистентности
// //     height: '400', // Высота логотипа
// //   },
// //   buttonContainer: {
// //     justifyContent: 'center', // Центрируем кнопку по вертикали
// //     alignItems: 'center', // Центрируем кнопку по горизонтали
// //   },
// //   button: {
// //     borderRadius: 25, // Округлые углы для кнопки
// //     overflow: 'hidden', // Скрываем содержимое за пределами borderRadius
// //     shadowColor: 'rgba(0, 0, 0, 0.3)', // Тень для визуального эффекта
// //     shadowOffset: { width: 0, height: 5 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 8,
// //     elevation: 5, // Тень для Android
// //   },
// //   buttonGradient: {
// //     paddingVertical: 15, // Внутренний отступ по вертикали
// //     paddingHorizontal: 40, // Внутренний отступ по горизонтали
// //     borderRadius: 25, // Округлые углы для градиента
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2, // Граница кнопки
// //     borderColor: '#5A4032', // Цвет границы, как в CreateEventScreen
// //   },
// //   buttonText: {
// //     fontSize: 18, // Размер текста кнопки
// //     color: '#FFFFFF', // Белый цвет текста
// //     fontWeight: '600', // Полужирный шрифт
// //   },

// //   // Стили для NewScreen
// //   newScreenContainer: {
// //     flex: 1, // Занимает всё доступное пространство
// //   },
// //   topPatternContainer: {
// //     position: 'absolute', // Абсолютное позиционирование для узора
// //     top: 0, // Располагаем узор вверху экрана
// //     width: '100%', // Ширина равна ширине экрана
// //     height: '20%', // Высота узора (20% экрана)
// //   },
// //   topPatternImage: {
// //     width: '100%', // Ширина узора равна ширине экрана
// //     height: '100%', // Высота узора равна высоте контейнера
// //     marginTop: '180%', // Сдвигаем изображение вниз, чтобы показать нижнюю часть узора
// //   },
// //   contentContainer: {
// //     flex: 1, // Занимает всё доступное пространство, чтобы кнопки были центрированы
// //   },
// //   backgroundImage: {
// //     position: 'absolute', // Абсолютное позиционирование для нижнего узора
// //     bottom: 0, // Располагаем узор внизу экрана
// //     width: '100%', // Ширина равна ширине экрана
// //     height: '20%', // Высота узора (20% экрана)
// //   },
// //   potIcon: {
// //     marginTop: '30%', // Небольшой отступ сверху для логотипа
// //     width: 250, // Ширина логотипа
// //     height: 180, // Высота логотипа
// //   },
// //   potIcon2: {
// //     marginTop: '20%', // Небольшой отступ сверху для логотипа
// //     width: 200, // Ширина логотипа
// //     height: 140, // Высота логотипа
// //   },
// //   logoText: {
// //     fontSize: 40, // Большой размер текста для названия приложения
// //     fontWeight: 'bold', // Полужирный шрифт
// //     color: '#1A1A1A', // Тёмный цвет текста
// //     marginTop: 10, // Отступ сверху от логотипа
// //   },
// //   appBadge: {
// //     backgroundColor: '#1A1A1A', // Тёмный фон для бейджа
// //     borderRadius: 15, // Округлые углы
// //     paddingVertical: 5, // Внутренний отступ по вертикали
// //     paddingHorizontal: 10, // Внутренний отступ по горизонтали
// //     marginTop: 10, // Отступ сверху от текста
// //   },
// //   appBadgeText: {
// //     color: '#FFFFFF', // Белый цвет текста
// //     fontSize: 12, // Маленький размер текста для бейджа
// //     fontWeight: 'bold', // Полужирный шрифт
// //   },
// //   buttonsContainer: {
// //     flex: 1, // Занимает всё доступное пространство
// //     flexDirection: 'row', // Располагаем кнопки горизонтально
// //     justifyContent: 'center', // Центрируем кнопки по горизонтали
// //     alignItems: 'center', // Центрируем кнопки по вертикали
// //   },
// //   imageButton: {
// //     marginHorizontal: 10, // Отступы между кнопками
// //   },
// //   buttonImage: {
// //     width: 150, // Ширина изображения кнопки
// //     height: 150, // Высота изображения кнопки
// //   },

// //   // Стили для CreateEventScreen
// //   createEventContainer: {
// //     flex: 1, // Занимает всё доступное пространство
// //     backgroundColor: '#F1EBDD', // Цвет фона (хотя он перекрывается градиентом)
// //     paddingHorizontal: 20, // Отступы по бокам
// //   },
// //   topBar: {
// //     flexDirection: 'row', // Располагаем элементы горизонтально
// //     justifyContent: 'space-between', // Распределяем элементы по краям
// //     alignItems: 'center', // Центрируем по вертикали
// //     marginTop: 40, // Отступ сверху
// //     marginBottom: 20, // Отступ снизу
// //   },
// //   budgetContainer: {
// //     alignItems: 'center', // Центрируем содержимое по горизонтали
// //   },
// //   budgetText: {
// //     fontSize: 16, // Размер текста
// //     fontWeight: 'bold', // Полужирный шрифт
// //     color: '#FFFFFF', // Белый цвет текста
// //     backgroundColor: '#8B6F47', // Фон для текста бюджета
// //     paddingVertical: 5, // Внутренний отступ по вертикали
// //     paddingHorizontal: 10, // Внутренний отступ по горизонтали
// //     borderRadius: 15, // Округлые углы
// //   },
// //   budgetLabel: {
// //     fontSize: 12, // Маленький размер текста для метки
// //     color: '#8B6F47', // Цвет текста
// //     marginTop: 5, // Отступ сверху
// //   },
// //   guestsContainer: {
// //     alignItems: 'center', // Центрируем содержимое по горизонтали
// //   },
// //   guestsText: {
// //     fontSize: 16, // Размер текста
// //     fontWeight: 'bold', // Полужирный шрифт
// //     color: '#FFFFFF', // Белый цвет текста
// //     backgroundColor: '#8B6F47', // Фон для текста количества гостей
// //     paddingVertical: 5, // Внутренний отступ по вертикали
// //     paddingHorizontal: 10, // Внутренний отступ по горизонтали
// //     borderRadius: 15, // Округлые углы
// //   },
// //   guestsLabel: {
// //     fontSize: 12, // Маленький размер текста для метки
// //     color: '#8B6F47', // Цвет текста
// //     marginTop: 5, // Отступ сверху
// //   },
// //   searchButton: {
// //     backgroundColor: '#8B6F47', // Фон кнопки поиска
// //     paddingVertical: 5, // Внутренний отступ по вертикали
// //     paddingHorizontal: 15, // Внутренний отступ по горизонтали
// //     borderRadius: 15, // Округлые углы
// //   },
// //   searchButtonText: {
// //     fontSize: 16, // Размер текста
// //     color: '#FFFFFF', // Белый цвет текста
// //     fontWeight: 'bold', // Полужирный шрифт
// //   },
// //   title: {
// //     fontSize: 18, // Размер текста заголовка
// //     fontWeight: 'bold', // Полужирный шрифт
// //     color: '#1A1A1A', // Тёмный цвет текста
// //     textAlign: 'center', // Центрируем текст
// //     marginVertical: 10, // Отступы сверху и снизу
// //     backgroundColor: '#D2B48C', // Фон для заголовка
// //     paddingVertical: 10, // Внутренний отступ по вертикали
// //     borderRadius: 10, // Округлые углы
// //   },
// //   categoryList: {
// //  // Занимает всё доступное пространство
// //     marginTop: '0%', // Небольшой отступ сверху
// //     marginBottom:'12%',
// //     // backgroundColor:'yellow'
// //     fontFamily: 'Geologica',
// //   },
// //   categoryButton: {
// //     backgroundColor: '#FFFFFF', // Белый фон для кнопки категории
// //     paddingVertical: 15, // Внутренний отступ по вертикали
// //     paddingHorizontal: 20, // Внутренний отступ по горизонтали
// //     marginVertical: 5, // Отступы между кнопками
// //     borderRadius: 10, // Округлые углы
// //     borderWidth: 1, // Граница кнопки
// //     borderColor: '#D2B48C', // Цвет границы
// //     shadowColor: 'rgba(0, 0, 0, 0.3)', // Тень для кнопки
// //     shadowOffset: { width: 0, height: 5 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 8,
// //     elevation: 5, // Тень для Android
// //   },
// //   categoryText: {
// //     fontSize: 16, // Размер текста
// //     color: '#1A1A1A', // Тёмный цвет текста
// //     textAlign: 'center', // Центрируем текст
// //   },
// //   bottomContainer: {
// //     alignItems: 'center', // Центрируем содержимое по горизонтали
// //     marginBottom: 20, // Отступ снизу
// //   },
// //   nextButton: {
// //     flexDirection: 'row', // Располагаем иконку и текст горизонтально
// //     alignItems: 'center', // Центрируем по вертикали
// //     backgroundColor: '#8B6F47', // Фон кнопки
// //     paddingVertical: 10, // Внутренний отступ по вертикали
// //     paddingHorizontal: 20, // Внутренний отступ по горизонтали
// //     borderRadius: 20, // Округлые углы
// //   },
// //   nextButtonText: {
// //     fontSize: 16, // Размер текста
// //     color: '#FFFFFF', // Белый цвет текста
// //     fontWeight: 'bold', // Полужирный шрифт
// //     marginRight: 10, // Отступ справа от текста
// //   },
// //   nextButtonIcon: {
// //     width: 80, // Ширина иконки
// //     height: 60, // Высота иконки
// //   },
// //   bottomText: {
// //     fontSize: 14, // Размер текста
// //     color: '#8B6F47', // Цвет текста
// //     marginTop: 10, // Отступ сверху
// //   },
// // });

// // function AuthenticatedTabs() {
// //   const { user, token } = useSelector((state) => state.auth);
// //   const roleId = user?.roleId;

// //   console.log('AuthenticatedTabs: user=', user);

// //   const tabBarOptions = {
// //     tabBarStyle: {
// //       backgroundColor: '#f8f8f8',
// //       borderTopWidth: 1,
// //       borderTopColor: '#e0e0e0',
// //       height: 60,
// //     },
// //     tabBarLabelStyle: {
// //       fontSize: 12,
// //       marginBottom: 5,
// //     },
// //     tabBarActiveTintColor: '#007AFF',
// //     tabBarInactiveTintColor: '#888',
// //   };

// //   if (!user || roleId === undefined) {
// //     return <LoadingScreen />;
// //   }

// //   console.log('AuthenticatedTabs: roleId=', roleId, 'user=', user);

// //   return (
// //     <Tab.Navigator screenOptions={tabBarOptions}>
// //       {roleId === 2 ? (
// //         <>
// //           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
// //           <Tab.Screen name="Item2" component={Item2Screen} options={{ title: 'Добавить', headerShown: false }} />
// //           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
// //         </>
// //       ) : roleId === 3 ? (
// //         <>
// //           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
// //           <Tab.Screen name="Item3" component={Item3Screen} options={{ title: 'Мои мероприятия', headerShown: false }} />
// //           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
// //         </>
// //       ) : (
// //         <>
// //           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
// //           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
// //         </>
// //       )}
// //     </Tab.Navigator>
// //   );
// // }

// // export default function Navigation() {
// //   const { token, user } = useSelector((state) => state.auth);
// //   console.log('Navigation state:', { token, user });

// //   const navigationRef = useNavigationContainerRef();

// //   useEffect(() => {
// //     if (token && !user) {
// //       console.log('Token exists but user is missing, redirecting to Login in 2s');
// //       const timer = setTimeout(() => {
// //         navigationRef.current?.navigate('Login');
// //       }, 2000);
// //       return () => clearTimeout(timer);
// //     }

// //     if (token && user && navigationRef.current) {
// //       console.log('User is authenticated, redirecting to SplashScreen');
// //       navigationRef.current?.navigate('Splash');
// //     }

// //     const subscription = Linking.addEventListener('url', (event) => {
// //       console.log('Deep link received:', event.url);
// //       if (event.url.includes('wishlist')) {
// //         navigationRef.current?.navigate('Wishlist', { id: event.url.split('/').pop() });
// //       }
// //     });

// //     return () => subscription.remove();
// //   }, [token, user]);

// //   const linking = {
// //     prefixes: ['myapp://', 'exp://172.20.10.7:8081'],
// //     config: {
// //       screens: {
// //         Wishlist: 'wishlist/:id',
// //       },
// //     },
// //   };

// //   return (
// //     <NavigationContainer ref={navigationRef} linking={linking}>
// //       <Stack.Navigator
// //         initialRouteName="Login"
// //         screenOptions={{ headerShown: false }}
// //       >
// //         <Stack.Screen name="Splash" component={SplashScreen} />
// //         <Stack.Screen name="NewScreen" component={NewScreen} />
// //         <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
// //         <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Подробности' }} />
// //         <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
// //         <Stack.Screen name="Login" component={LoginScreen} />
// //         <Stack.Screen name="Register" component={RegisterScreen} />
// //         <Stack.Screen name="ItemEdit" component={ItemEditScreen} />
// //         <Stack.Screen name="Wishlist" component={WeddingWishlistScreen} options={{ title: 'Wishlist', headerShown: false }} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }


// import React from 'react';
// import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { useSelector } from 'react-redux';
// import HomeScreen from '../screens/HomeScreen';
// import ItemEditScreen from '../screens/ItemEditScreen';
// import Item2Screen from '../screens/Item2Screen';
// import Item3Screen from '../screens/Item3Screen';
// import Item4Screen from '../screens/Item4Screen';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, SafeAreaView } from 'react-native';
// import { useEffect } from 'react';
// import DetailsScreen from '../screens/DetailsScreen';
// import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
// import * as Linking from 'expo-linking';
// import { Text } from 'react-native-paper';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useState } from 'react';
// import ShakingLidAnimation from '../components/ShakingLidAnimation';
// import { useFonts } from 'expo-font';
// import BeforeHomeScreen from '../components/BeforeHomeScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const LoadingScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Загрузка...</Text>
//   </View>
// );

// // Компонент SplashScreen
// const SplashScreen = ({ navigation }) => {
//   const [showSecondButton, setShowSecondButton] = useState(false);

//   const handlePress = () => {
//     setShowSecondButton(true);
//     setTimeout(() => {
//       navigation.replace('NewScreen');
//     }, 1000);
//   };

//   return (
//     <LinearGradient
//       colors={['#F1EBDD', '#897066']}
//       start={{ x: 0, y: 1 }}
//       end={{ x: 0, y: 0 }}
//       style={styles.splashContainer}
//     >
//       <View style={styles.buttonContainer}>
//         {!showSecondButton ? (
//           <TouchableOpacity style={styles.button} onPress={handlePress}>
//             <Image
//               source={require('../../assets/firstPageTurnOff.png')}
//               style={styles.splashImage}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.button} disabled>
//             <Image
//               source={require('../../assets/firstPageTurnOn.png')}
//               style={styles.splashImage2}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     </LinearGradient>
//   );
// };

// // Компонент NewScreen
// const NewScreen = ({ navigation }) => {
//   return (
//     <LinearGradient
//       colors={['#F1EBDD', '#897066']}
//       start={{ x: 0, y: 1 }}
//       end={{ x: 0, y: 0 }}
//       style={styles.newScreenContainer}
//     >
//       <ImageBackground
//         source={require('../../assets/footer.png')}
//         style={styles.topPatternContainer}
//         imageStyle={styles.topPatternImage}
//       />
//       <View style={styles.contentContainer}>
//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/logo.png')}
//             style={styles.potIcon}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity
//             style={styles.imageButton}
//             onPress={() => navigation.navigate('CreateEvent')}
//           >
//             <Image
//               source={require('../../assets/create.png')}
//               style={styles.buttonImage}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.imageButton}
//             onPress={() => navigation.replace('Authenticated')}
//           >
//             <Image
//               source={require('../../assets/join.png')}
//               style={styles.buttonImage}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// // Экран CreateEventScreen
// const CreateEventScreen = ({ navigation }) => {
//   const [fontsLoaded] = useFonts({
//     'CustomFont-Regular': require('../../assets/font/Geologica.ttf'),
//   });

//   const categories = [
//     'Традиционное семейное торжество',
//     'Корпоративное мероприятие',
//     'Конференции',
//     'Тимбилдинги',
//     'Концерты и творческие вечера',
//     'Предложение руки и сердца',
//     'Свадьба',
//     'Вечеринка перед свадьбой',
//     'Выпускной',
//     'Национальные праздника',
//   ];

//   const renderCategory = ({ item }) => (
//     <TouchableOpacity
//       style={styles.categoryButton}
//       onPress={() => {
//         if (item === 'Свадьба') {
//           navigation.navigate('BeforeHomeScreen');
//         }
//       }}
//     >
//       <Text style={styles.categoryText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <LinearGradient
//       colors={['#F1EBDD', '#897066']}
//       start={{ x: 0, y: 1 }}
//       end={{ x: 0, y: 0 }}
//       style={styles.splashContainer}
//     >
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../../assets/kazan.png')}
//           style={styles.potIcon2}
//           resizeMode="contain"
//         />
//       </View>
//       <FlatList
//         data={categories}
//         renderItem={renderCategory}
//         keyExtractor={(item, index) => index.toString()}
//         style={styles.categoryList}
//         showsVerticalScrollIndicator={true}
//       />
//       <View style={styles.bottomContainer}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('BeforeHomeScreen')}
//           style={styles.imageButton}
//         >
//           <Image
//             source={require('../../assets/mainButton.png')}
//             style={styles.nextButtonIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//         <Text style={{ marginTop: '1%' }}>Главная</Text>
//       </View>
//     </LinearGradient>
//   );
// };

// // Стили
// const styles = StyleSheet.create({
//   splashContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   splashImage: {
//     width: 600,
//     height: 400,
//   },
//   splashImage2: {
//     width: 600,
//     height: 400,
//   },
//   buttonContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     borderRadius: 25,
//     overflow: 'hidden',
//     shadowColor: 'rgba(0, 0, 0, 0.3)',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   buttonGradient: {
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#5A4032',
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   newScreenContainer: {
//     flex: 1,
//   },
//   topPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     width: '100%',
//     height: '20%',
//   },
//   topPatternImage: {
//     width: '100%',
//     height: '100%',
//     marginTop: '180%',
//   },
//   contentContainer: {
//     flex: 1,
//   },
//   potIcon: {
//     marginTop: '30%',
//     width: 250,
//     height: 180,
//   },
//   potIcon2: {
//     marginTop: '20%',
//     width: 200,
//     height: 140,
//   },
//   buttonsContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageButton: {
//     marginHorizontal: 10,
//   },
//   buttonImage: {
//     width: 150,
//     height: 150,
//   },
//   categoryList: {
//     marginTop: '0%',
//     marginBottom: '12%',
//   },
//   categoryButton: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     marginVertical: 5,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#D2B48C',
//     shadowColor: 'rgba(0, 0, 0, 0.3)',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   categoryText: {
//     fontSize: 16,
//     color: '#1A1A1A',
//     textAlign: 'center',
//   },
//   bottomContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   nextButtonIcon: {
//     width: 80,
//     height: 60,
//   },
// });

// function AuthenticatedTabs() {
//   const { user, token } = useSelector((state) => state.auth);
//   const roleId = user?.roleId;

//   console.log('AuthenticatedTabs: user=', user);

//   const tabBarOptions = {
//     tabBarStyle: {
//       backgroundColor: '#f8f8f8',
//       borderTopWidth: 1,
//       borderTopColor: '#e0e0e0',
//       height: 60,
//     },
//     tabBarLabelStyle: {
//       fontSize: 12,
//       marginBottom: 5,
//     },
//     tabBarActiveTintColor: '#007AFF',
//     tabBarInactiveTintColor: '#888',
//   };

//   if (!user || roleId === undefined) {
//     return <LoadingScreen />;
//   }

//   console.log('AuthenticatedTabs: roleId=', roleId, 'user=', user);

//   return (
//     <Tab.Navigator screenOptions={tabBarOptions}>
//       {roleId === 2 ? (
//         <>
//           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
//           <Tab.Screen name="Item2" component={Item2Screen} options={{ title: 'Добавить', headerShown: false }} />
//           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
//         </>
//       ) : roleId === 3 ? (
//         <>
//           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
//           <Tab.Screen name="Item3" component={Item3Screen} options={{ title: 'Мои мероприятия', headerShown: false }} />
//           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
//         </>
//       ) : (
//         <>
//           <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
//           <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
//         </>
//       )}
//     </Tab.Navigator>
//   );
// }

// export default function Navigation() {
//   const { token, user } = useSelector((state) => state.auth);
//   console.log('Navigation state:', { token, user });

//   const navigationRef = useNavigationContainerRef();

//   useEffect(() => {
//     if (token && !user) {
//       console.log('Token exists but user is missing, redirecting to Login in 2s');
//       const timer = setTimeout(() => {
//         navigationRef.current?.navigate('Login');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }

//     if (token && user && navigationRef.current) {
//       console.log('User is authenticated, redirecting to SplashScreen');
//       navigationRef.current?.navigate('Splash');
//     }

//     const subscription = Linking.addEventListener('url', (event) => {
//       console.log('Deep link received:', event.url);
//       if (event.url.includes('wishlist')) {
//         navigationRef.current?.navigate('Wishlist', { id: event.url.split('/').pop() });
//       }
//     });

//     return () => subscription.remove();
//   }, [token, user]);

//   const linking = {
//     prefixes: ['myapp://', 'exp://172.20.10.7:8081'],
//     config: {
//       screens: {
//         Wishlist: 'wishlist/:id',
//       },
//     },
//   };

//   return (
//     <NavigationContainer ref={navigationRef} linking={linking}>
//       <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Splash" component={SplashScreen} /><Stack.Screen name="NewScreen" component={NewScreen} /><Stack.Screen name="CreateEvent" component={CreateEventScreen} /><Stack.Screen name="BeforeHomeScreen" component={BeforeHomeScreen} /><Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Подробности' }} /><Stack.Screen name="Authenticated" component={AuthenticatedTabs} /><Stack.Screen name="Login" component={LoginScreen} /><Stack.Screen name="Register" component={RegisterScreen} /><Stack.Screen name="ItemEdit" component={ItemEditScreen} /><Stack.Screen name="Wishlist" component={WeddingWishlistScreen} options={{ title: 'Wishlist', headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import ItemEditScreen from '../screens/ItemEditScreen';
import Item2Screen from '../screens/Item2Screen';
import Item3Screen from '../screens/Item3Screen';
import Item4Screen from '../screens/Item4Screen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, SafeAreaView } from 'react-native';
import DetailsScreen from '../screens/DetailsScreen';
import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
import * as Linking from 'expo-linking';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import ShakingLidAnimation from '../components/ShakingLidAnimation';
import { useFonts } from 'expo-font';
import BeforeHomeScreen from '../components/BeforeHomeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SupplierScreen from '../screens/SupplierScreen'
import HomeScreenDraft from '../screens/HomeScreenDraft'
import AdminScreen from '../screens/AdminScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Загрузка...</Text>
  </View>
);

// Компонент SplashScreen
// const SupplierContent = ({ navigation }) => {
//   const { user, token } = useSelector((state) => state.auth);
//   const [showSecondButton, setShowSecondButton] = useState(false);
//   const handlePress = () => {
//     setShowSecondButton(true);
//     setTimeout(() => {
//       navigation.replace("Supplier");
//     }, 1000);
//   };
//   const roleId = user?.roleId;

//   return (
//     <>
//       {/* <View style={{marginTop:'50%'}}>
//         <TouchableOpacity style={styles.button} onPress={handlePress}>
//           <Text>Go to next screen</Text>
//           <Text>{roleId}</Text>
//         </TouchableOpacity>
//       </View> */}
//       <SupplierScreen/>
//     </>
//   );
// };


const SupplierContent = ({ navigation }) => {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId;

  if (!user || !token) {
    return <LoadingScreen />;
  }

  return <SupplierScreen navigation={navigation} />;
};


const AdminContent = ({ navigation }) => {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId;

  if (!user || !token) {
    return <LoadingScreen />;
  }

  return <AdminScreen navigation={navigation} />;
};


const SplashScreen = ({ navigation }) => {
  const [showSecondButton, setShowSecondButton] = useState(false);

  const handlePress = () => {
    setShowSecondButton(true);
    setTimeout(() => {
      navigation.replace('NewScreen');
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.splashContainer}
    >
      <View style={styles.buttonContainer}>
        {!showSecondButton ? (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Image
              source={require('../../assets/firstPageTurnOff.png')}
              style={styles.splashImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} disabled>
            <Image
              source={require('../../assets/firstPageTurnOn.png')}
              style={styles.splashImage2}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

// Компонент NewScreen
const NewScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.newScreenContainer}
    >
      <ImageBackground
        source={require('../../assets/footer.png')}
        style={styles.topPatternContainer}
        imageStyle={styles.topPatternImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.potIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Image
              source={require('../../assets/create.png')}
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigation.replace('Authenticated')}
          >
            <Image
              source={require('../../assets/join.png')}
              style={styles.buttonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// Экран CreateEventScreen
const CreateEventScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'CustomFont-Regular': require('../../assets/font/Geologica.ttf'),
  });

  const categories = [
    'Традиционное семейное торжество',
    'Корпоративное мероприятие',
    'Конференции',
    'Тимбилдинги',
    'Концерты и творческие вечера',
    'Предложение руки и сердца',
    'Свадьба',
    'Вечеринка перед свадьбой',
    'Выпускной',
    'Национальные праздника',
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={() => {
        if (item === 'Свадьба') {
          navigation.navigate('BeforeHomeScreen');
        }
      }}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.splashContainer}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/kazan.png')}
          style={styles.potIcon2}
          resizeMode="contain"
        />
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        style={styles.categoryList}
        showsVerticalScrollIndicator={true}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewScreen')}
          style={styles.imageButton}
        >
          <Image
            source={require('../../assets/mainButton.png')}
            style={styles.nextButtonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ marginTop: '1%' }}>Главная</Text>
      </View>
    </LinearGradient>
  );
};

// Компонент AuthenticatedTabs с новым дизайном
function AuthenticatedTabs() {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId;

  console.log('AuthenticatedTabs: user=', user);

  const tabBarOptions = {
    tabBarStyle: styles.tabBar,
    tabBarShowLabel: true,
    tabBarLabelStyle: styles.tabLabel,
    tabBarActiveTintColor: '#897066', // Цвет активной вкладки соответствует вашей теме
    tabBarInactiveTintColor: '#666666', // Цвет неактивной вкладки

  };

  if (!user || roleId === undefined) {
    return <LoadingScreen />;
  }

  console.log('AuthenticatedTabs: roleId=', roleId, 'user=', user);

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      {
      roleId === 1 ? (<>
       <Tab.Screen
            name="Admin"
            component={AdminContent} // Используем SupplierContent, который рендерит SupplierScreen
            options={{
              title: 'Admin',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Icon name="home" size={24} color={color} style={styles.tabIcon} />
              ),
            }}
          />
      </>):
      
      
      roleId === 2 ? (
        <>
         <Tab.Screen
            name="Supplier"
            component={SupplierContent} // Используем SupplierContent, который рендерит SupplierScreen
            options={{
              title: 'Главная',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Icon name="home" size={24} color={color} style={styles.tabIcon} />
              ),
            }}
          />
          <Tab.Screen
            name="Item2"
            component={Item2Screen}
            options={{
              title: 'Добавить',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Item4"
            component={Item4Screen}
            options={{
              title: 'Профиль',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
        </>
      ) : roleId === 3 ? (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Главная',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  name="home"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Item3"
            component={Item3Screen}
            options={{
              title: 'Мои мероприятия',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  name="event"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Item4"
            component={Item4Screen}
            options={{
              title: 'Профиль',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Главная',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  name="home"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Item4"
            component={Item4Screen}
            options={{
              title: 'Профиль',
              headerShown: false,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={color}
                  style={styles.tabIcon}
                />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

// Основной компонент навигации
export default function Navigation() {
  const { token, user } = useSelector((state) => state.auth);
  console.log('Navigation state:', { token, user });

  const navigationRef = useNavigationContainerRef();

  // useEffect(() => {
  //   if (token && !user) {
  //     console.log('Token exists but user is missing, redirecting to Login in 2s');
  //     const timer = setTimeout(() => {
  //       navigationRef.current?.navigate('Login');
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }

  //   if (token && user && navigationRef.current) {
  //     if (user.roleId === 2) {
  //       console.log('User is authenticated with roleId 2, redirecting to Supplier');
  //       navigationRef.current?.navigate('Supplier');
  //     } else {
  //       console.log('User is authenticated, redirecting to SplashScreen');
  //       navigationRef.current?.navigate('Splash');
  //     }
  //   }

  //   if (token && user && navigationRef.current) {
  //     if (user.roleId === 1) {
  //       console.log('User is authenticated with roleId 1, redirecting to Supplier');
  //       navigationRef.current?.navigate('Admin');
  //     } else {
  //       console.log('User is authenticated, redirecting to SplashScreen');
  //       navigationRef.current?.navigate('Splash');
  //     }
  //   }



    
  //   const subscription = Linking.addEventListener('url', (event) => {
  //     console.log('Deep link received:', event.url);
  //     if (event.url.includes('wishlist')) {
  //       navigationRef.current?.navigate('Wishlist', { id: event.url.split('/').pop() });
  //     }
  //   });

  //   return () => subscription.remove();
  // }, [token, user]);


  useEffect(() => {
    if (token && !user) {
      console.log('Token exists but user is missing, redirecting to Login in 2s');
      const timer = setTimeout(() => {
        navigationRef.current?.navigate('Login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  
    if (token && user && navigationRef.current) {
      if (user.roleId === 1) {
        console.log('User is authenticated with roleId 1, redirecting to Admin');
        navigationRef.current?.navigate('Authenticated', { screen: 'Admin' });
      } else if (user.roleId === 2) {
        console.log('User is authenticated with roleId 2, redirecting to Supplier');
        navigationRef.current?.navigate('Authenticated', { screen: 'Supplier' });
      } else {
        console.log('User is authenticated, redirecting to SplashScreen');
        navigationRef.current?.navigate('Splash');
      }
    }
  
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('Deep link received:', event.url);
      if (event.url.includes('wishlist')) {
        navigationRef.current?.navigate('Wishlist', { id: event.url.split('/').pop() });
      }
    });
  
    return () => subscription.remove();
  }, [token, user]);



  
  const linking = {
    prefixes: ['myapp://', 'exp://172.20.10.7:8081'],
    config: {
      screens: {
        Wishlist: 'wishlist/:id',
      },
    },
  };

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Supplier" component={SupplierScreen} /> */}
        
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="NewScreen" component={NewScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="BeforeHomeScreen" component={BeforeHomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Подробности' }} />
        <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ItemEdit" component={ItemEditScreen} />
        <Stack.Screen name="Wishlist" component={WeddingWishlistScreen} options={{ title: 'Wishlist', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Стили
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  splashImage: {
    width: 600,
    height: 400,
  },
  splashImage2: {
    width: 600,
    height: 400,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5A4032',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  newScreenContainer: {
    flex: 1,
  },
  topPatternContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '20%',
  },
  topPatternImage: {
    width: '100%',
    height: '100%',
    marginTop: '180%',
  },
  contentContainer: {
    flex: 1,
  },
  potIcon: {
    marginTop: '30%',
    width: 250,
    height: 180,
  },
  potIcon2: {
    marginTop: '20%',
    width: 200,
    height: 140,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    marginHorizontal: 10,
  },
  buttonImage: {
    width: 150,
    height: 150,
  },
  categoryList: {
    marginTop: '0%',
    marginBottom: '12%',
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D2B48C',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonIcon: {
    width: 80,
    height: 60,
  },
  // Стили для нового дизайна TabBar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Полупрозрачный белый фон
    height: 60,
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 30, // Закругленные углы
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#f8f8f8',
    //        borderTopWidth: 1,
    //        borderTopColor: '#e0e0e0',
    //        height: 60,
    //  marginBottom:25,
  },
  tabIcon: {
    marginBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});