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
// // import { View, Text } from 'react-native';
// // import { useEffect } from 'react';
// // import DetailsScreen from '../screens/DetailsScreen';
// // import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
// // import * as Linking from 'expo-linking';
// // const Stack = createStackNavigator();
// // const Tab = createBottomTabNavigator();

// // // Экран загрузки
// // const LoadingScreen = () => (
// //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //     <Text>Загрузка...</Text>
// //   </View>
// // );

// // // Компонент для авторизованных экранов с нижним меню
// // function AuthenticatedTabs() {
// //   const { user, token } = useSelector((state) => state.auth);
// //   const roleId = user?.roleId; // Безопасно получаем roleId

// //   console.log('user= ', user);

// //   // Общие стили для Tab.Navigator
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

// //   // Если user ещё не загружен, показываем экран загрузки
// //   if (!user || roleId === undefined) {
// //     return <LoadingScreen />;
// //   }

// //   console.log('roleId:', roleId, 'user:', user);

  

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
// //       console.log('Token exists but user is missing, redirecting to Login in 5s');
// //       const timer = setTimeout(() => {
// //         navigationRef.current?.navigate('Login');
// //       }, 2000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [token, user]);

// //   // const linking = {
// //   //   prefixes: ['myapp://', 'exp://172.20.10.7:8081'],
// //   //   config: {
// //   //     screens: {
// //   //       wishlist: 'wishlist/:id',
// //   //     },
// //   //   },
// //   // };

// //   const linking = {
// //     prefixes: ['myapp://', 'exp://172.20.10.7:8081'],
// //     config: {
// //       screens: {
// //         wishlist: 'wishlist/:id', // Только один экран для этого паттерна
// //       },
// //     },
// //   };
  
// //   return (
// //     <NavigationContainer ref={navigationRef} linking={linking}>
// //       <Stack.Navigator initialRouteName={token ? 'Authenticated' : 'Login'} screenOptions={{ headerShown: false }}>
// //       <Stack.Screen
// //           name="Details"
// //           component={DetailsScreen}
// //           options={{ title: "Подробности" }}
// //         />
// //         <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
// //         <Stack.Screen name="Login" component={LoginScreen} />
// //         <Stack.Screen name="Register" component={RegisterScreen} />
// //         <Stack.Screen name="ItemEdit" component={ItemEditScreen} />
// //         <Stack.Screen name="wishlist" component={WeddingWishlistScreen} options={{ title: 'wishlist', headerShown: false }} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }

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
// import { View, Text } from 'react-native';
// import { useEffect } from 'react';
// import DetailsScreen from '../screens/DetailsScreen';
// import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
// import * as Linking from 'expo-linking';
// import { PaperProvider } from 'react-native-paper';
// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const LoadingScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Загрузка...</Text>
//   </View>
// );


// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Authenticated'); // Переход на Authenticated после 3 секунд
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <View style={styles.splashContainer}>
//       <Image
//         source={require('../assets/splashImage.png')} // Укажите путь к вашему изображению
//         style={styles.splashImage}
//         resizeMode="contain"
//       />
//     </View>
//   );
// };

// // Стили для SplashScreen
// const styles = StyleSheet.create({
//   splashContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F1EBDD', // Цвет фона из изображения
//   },
//   splashImage: {
//     width: '100%',
//     height: '100%',
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
//       console.log('Token exists but user is missing, redirecting to Login in 5s');
//       const timer = setTimeout(() => {
//         navigationRef.current?.navigate('Login');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }

//     // Добавляем слушатель для deep links
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
//       <Stack.Navigator initialRouteName={token ? 'Authenticated' : 'Login'} screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Подробности' }} />
//         <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="ItemEdit" component={ItemEditScreen} />
//         <Stack.Screen name="Wishlist" component={WeddingWishlistScreen} options={{ title: 'Wishlist', headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
    
//   );
// }


import React from 'react';
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
import { View, Image, StyleSheet, TouchableOpacity , ImageBackground} from 'react-native';
import { useEffect } from 'react';
import DetailsScreen from '../screens/DetailsScreen';
import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
import * as Linking from 'expo-linking';
import { PaperProvider } from 'react-native-paper';
import { Text } from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Загрузка...</Text>
  </View>
);

// Компонент SplashScreen
const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('NewScreen'); // Переход на NewScreen после 3 секунд
    }, 500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../../assets/screen.png')} // Укажите путь к вашему изображению
        style={styles.splashImage}
        resizeMode="contain"
      />
    </View>
  );
};

// Компонент NewScreen
const NewScreen = ({ navigation }) => {
  return (
    <View style={styles.newScreenContainer}>
      {/* Верхний узор */}
      <ImageBackground
        source={require('../../assets/footer.png')} // Укажите путь к изображению узора
        style={styles.topPatternContainer}
        imageStyle={styles.topPatternImage}
      />

      {/* Основной контент с нижним узором */}
      {/* <ImageBackground
        source={require('../../assets/footer.png')} // Укажите путь к изображению узора
        style={styles.contentContainer}
        imageStyle={styles.backgroundImage}
      > */}
        {/* Лого в верхней части */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')} // Укажите путь к изображению кастрюли
            style={styles.potIcon}
            resizeMode="contain"
          />
        
        </View>

        {/* Кнопки в центре */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => navigation.replace('Authenticated')}
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
      {/* </ImageBackground> */}
    </View>
  );
};

// Стили для SplashScreen и NewScreen
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1EBDD',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  newScreenContainer: {
    flex: 1,
    backgroundColor: '#F1EBDD',
  },
  topPatternContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '20%', // Высота верхнего узора
  },
  topPatternImage: {
    width: '100%', // Ширина узора равна ширине экрана
    height: '100%',
   marginTop:'180%'
    // Поворачиваем узор для верхней части
  },
  contentContainer: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%', // Ширина узора равна ширине экрана
    height: '20%', // Высота нижнего узора
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60, // Отступ сверху для лого, чтобы не перекрывался верхним узором
  },
  potIcon: {
    marginTop:'20%',
    width: 220,
    height: 140,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1A1A1A', // Темный цвет текста
    marginTop: 10,
  },
  appBadge: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  appBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
});


function AuthenticatedTabs() {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId;

  console.log('AuthenticatedTabs: user=', user);

  const tabBarOptions = {
    tabBarStyle: {
      backgroundColor: '#f8f8f8',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
    },
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#888',
  };

  if (!user || roleId === undefined) {
    return <LoadingScreen />;
  }

  console.log('AuthenticatedTabs: roleId=', roleId, 'user=', user);

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      {roleId === 2 ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
          <Tab.Screen name="Item2" component={Item2Screen} options={{ title: 'Добавить', headerShown: false }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
        </>
      ) : roleId === 3 ? (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
          <Tab.Screen name="Item3" component={Item3Screen} options={{ title: 'Мои мероприятия', headerShown: false }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная', headerShown: false }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль', headerShown: false }} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { token, user } = useSelector((state) => state.auth);
  console.log('Navigation state:', { token, user });

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    // Если есть token, но нет user, перенаправляем на Login
    if (token && !user) {
      console.log('Token exists but user is missing, redirecting to Login in 2s');
      const timer = setTimeout(() => {
        navigationRef.current?.navigate('Login');
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Если пользователь аутентифицирован (есть token и user), перенаправляем на SplashScreen
    if (token && user && navigationRef.current) {
      console.log('User is authenticated, redirecting to SplashScreen');
      navigationRef.current?.navigate('Splash');
    }

    // Добавляем слушатель для deep links
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
      <Stack.Navigator
        initialRouteName="Login" // Начальный экран — Login
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="NewScreen" component={NewScreen} />
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


