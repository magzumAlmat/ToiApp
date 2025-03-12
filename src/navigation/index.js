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
import { View, Text } from 'react-native';
import { useEffect } from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Экран загрузки
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Загрузка...</Text>
  </View>
);

// Компонент для авторизованных экранов с нижним меню
function AuthenticatedTabs() {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId; // Безопасно получаем roleId

  console.log('user= ', user);

  // Общие стили для Tab.Navigator
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

  // Если user ещё не загружен, показываем экран загрузки
  if (!user || roleId === undefined) {
    return <LoadingScreen />;
  }

  console.log('roleId:', roleId, 'user:', user);

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
          <Tab.Screen name="Item3" component={Item3Screen} options={{ title: 'Пункт 3', headerShown: false }} />
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
    if (token && !user) {
      console.log('Token exists but user is missing, redirecting to Login in 5s');
      const timer = setTimeout(() => {
        navigationRef.current?.navigate('Login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [token, user]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={token ? 'Authenticated' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ItemEdit" component={ItemEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}