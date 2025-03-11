import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import Item1Screen from '../screens/Item1Screen';
import Item2Screen from '../screens/Item2Screen';
import Item3Screen from '../screens/Item3Screen';
import Item4Screen from '../screens/Item4Screen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Компонент для авторизованных экранов с нижним меню
function AuthenticatedTabs() {
  const { user, token } = useSelector((state) => state.auth);
  const roleId = user?.roleId; // Получаем roleId из пользователя

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

  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      {roleId === 2 ? ( // Меню для Поставщика (roleId = 2)
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
          <Tab.Screen name="Item1" component={Item1Screen} options={{ title: 'Заказы' }} />
          <Tab.Screen name="Item2" component={Item2Screen} options={{ title: 'Товары' }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль' }} />
        </>
      ) : roleId === 3 ? ( // Меню для Клиента (roleId = 3)
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
          <Tab.Screen name="Item1" component={Item1Screen} options={{ title: 'Пункт 2' }} />
          <Tab.Screen name="Item3" component={Item3Screen} options={{ title: 'Пункт 3' }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль' }} />
        </>
      ) : (
        // Если roleId не определён (например, пользователь ещё не загружен)
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
          <Tab.Screen name="Item4" component={Item4Screen} options={{ title: 'Профиль' }} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { token } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'Authenticated' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Authenticated" component={AuthenticatedTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}