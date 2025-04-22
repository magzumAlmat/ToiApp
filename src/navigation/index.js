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
import { View, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { useEffect } from 'react';
import DetailsScreen from '../screens/DetailsScreen';
import WeddingWishlistScreen from '../screens/WeddingWishlistScreen';
import * as Linking from 'expo-linking';
import { PaperProvider } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
    colors={['#F1EBDD', '#897066']} // Градиент от #F1EBDD к #897066
    start={{ x: 0, y: 1 }} // Начало слева
    end={{ x: 0, y: 0 }} // Конец справа (0deg)
    style={styles.splashContainer}
  >
    <Image
      source={require('../../assets/screen.png')} // Укажите путь к вашему изображению
      style={styles.splashImage}
      resizeMode="contain"
    />
  </LinearGradient>
  );
};

// Компонент NewScreen
const NewScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']} // Градиент от #F1EBDD к #897066
      start={{ x: 0, y: 1 }} // Начало слева
      end={{ x: 0, y: 0 }} // Конец справа (0deg)
      style={styles.newScreenContainer}
    >
      {/* Верхний узор */}
      <ImageBackground
        source={require('../../assets/footer.png')} // Укажите путь к изображению узора
        style={styles.topPatternContainer}
        imageStyle={styles.topPatternImage}
      />

      {/* Основной контент */}
      <View style={styles.contentContainer}>
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
            onPress={() => navigation.navigate('CreateEvent')} // Переход на CreateEvent
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


// Новый экран CreateEventScreen
const CreateEventScreen = ({ navigation }) => {
  const categories = [
    'Корпоративное мероприятие',
    'Конференции',
    'Тимбилдинги',
    'Концерты и творческие вечера',
    'Предложение руки и сердца',
    'Свадьба',
    'Вечеринка перед свадьбой',
    'Выпускной',
    'Начало праздника',
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity
    style={styles.categoryButton}
    onPress={() => {
      // Если выбрана категория "Свадьба", перенаправляем на HomeScreen
      if (item === 'Свадьба') {
        navigation.navigate('Authenticated');
      }
      // Здесь можно добавить логику для других категорий, если нужно
    }}
  >
    <Text style={styles.categoryText}>{item}</Text>
  </TouchableOpacity>
  );

  return (
    <LinearGradient
    colors={['#F1EBDD', '#897066']} // Градиент от #F1EBDD к #897066
    start={{ x: 0, y: 1 }} // Начало слева
    end={{ x: 0, y: 0 }} // Конец справа (0deg)
    style={styles.splashContainer}
  >
     

      {/* Лого (кастрюля) */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/kazan.png')} // Укажите путь к изображению кастрюли
          style={styles.potIcon}
          resizeMode="contain"
        />
      </View>

      {/* Заголовок */}
      {/* <Text style={styles.title}>Традиционное семейное торжество</Text> */}

      {/* Список категорий */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        style={styles.categoryList}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Кнопка "Далее" */}
      <View style={styles.bottomContainer}>

        <TouchableOpacity  onPress={() => navigation.navigate('NewScreen')} // Переход на CreateEvent
        style={styles.imageButton}>
         
          <Image
            source={require('../../assets/mainButton.png')} // Используем то же изображение кастрюли для иконки
            style={styles.nextButtonIcon}
            resizeMode="contain"
          />
        
        </TouchableOpacity>
        <Text style={{marginTop:"1%"}} >Главная</Text>

      </View>
</LinearGradient>
  );
};

// Стили для SplashScreen, NewScreen и CreateEventScreen
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  newScreenContainer: {
    flex: 1,
   
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
    marginTop: '180%',
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
    marginTop: '1%',
    width: 180,
    height: 120,

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

  // Стили для CreateEventScreen
  createEventContainer: {
    flex: 1,
    backgroundColor: '#F1EBDD',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  budgetContainer: {
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#8B6F47',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#8B6F47',
    marginTop: 5,
  },
  guestsContainer: {
    alignItems: 'center',
  },
  guestsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#8B6F47',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  guestsLabel: {
    fontSize: 12,
    color: '#8B6F47',
    marginTop: 5,
  },
  searchButton: {
    backgroundColor: '#8B6F47',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  searchButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginVertical: 10,
    backgroundColor: '#D2B48C',
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryList: {
    flex: 1,
    marginTop:"2%",

  },
  categoryButton: {
    
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D2B48C',
  },
  categoryText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B6F47',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  nextButtonIcon: {
    width: 80,
    height: 60,
  },
  bottomText: {
    fontSize: 14,
    color: '#8B6F47',
    marginTop: 10,
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
    if (token && !user) {
      console.log('Token exists but user is missing, redirecting to Login in 2s');
      const timer = setTimeout(() => {
        navigationRef.current?.navigate('Login');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (token && user && navigationRef.current) {
      console.log('User is authenticated, redirecting to SplashScreen');
      navigationRef.current?.navigate('Splash');
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
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="NewScreen" component={NewScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
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