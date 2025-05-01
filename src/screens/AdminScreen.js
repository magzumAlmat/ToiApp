


import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';
import * as ExpoCalendar from 'expo-calendar';
import { Picker } from '@react-native-picker/picker';

import { startLoading, setError, loginSuccess, logout } from '../store/authSlice';

import * as SecureStore from 'expo-secure-store';
const COLORS = {
  primary: '#FF6F61',
  secondary: '#4A90E2',
  background: '#FDFDFD',
  card: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  accent: '#FBBF24',
  shadow: 'rgba(0, 0, 0, 0.3)',
  error: '#FF0000',
  white: '#FFFFFF',
  buttonGradientStart: '#D3C5B7',
  buttonGradientEnd: '#A68A6E',
};

const categoryImages = {
  'Ресторан': {
    inactive: require('../../assets/restaurantTurnOff.png'),
    active: require('../../assets/restaurantOn.png'),
  },
  'Ведущий': {
    inactive: require('../../assets/vedushieOff.png'),
    active: require('../../assets/vedushieOn.png'),
  },
  'Шоу программа': {
    inactive: require('../../assets/showTurnOff.png'),
    active: require('../../assets/show.png'),
  },
  'Свадебный салон': {
    inactive: require('../../assets/svadeblyisalonOff.png'),
    active: require('../../assets/svadebnyisalon.png'),
  },
  'Прокат авто': {
    inactive: require('../../assets/prokatAutooff.png'),
    active: require('../../assets/prokatAvtoOn.png'),
  },
  'Традиционные подарки': {
    inactive: require('../../assets/noFile.png'),
    active: require('../../assets/noFile.png'),
  },
  'Ювелирные изделия': {
    inactive: require('../../assets/uvIzdeliyaOff.png'),
    active: require('../../assets/uvizdeliyaOn.png'),
  },
  'Торты': {
    inactive: require('../../assets/tortyTurnOff.png'),
    active: require('../../assets/torty.png'),
  },
  'Алкоголь': {
    inactive: require('../../assets/alcoholOff.png'),
    active: require('../../assets/alcoholOn.png'),
  },
  'Цветы': {
    inactive: require('../../assets/cvetyOff.png'),
    active: require('../../assets/cvetyOn.png'),
  },
};

export default function AdminScreen({ navigation ,route}) {
  const dispatch = useSelector((state) => state.auth);
    const dispatch2= useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [data, setData] = useState({ restaurants: [] });
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const selectedCategories = route?.params?.selectedCategories || [];
  const [blockedDays, setBlockedDays] = useState({});
  const [occupiedRestaurants, setOccupiedRestaurants] = useState([]);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCalendarModal2, setShowCalendarModal2] = useState(false);
  const [tempRestaurantId, setTempRestaurantId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
const {  loading, error } = useSelector((state) => state.auth);
  const restaurantColors = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#45B7D1',
    4: '#96CEB4',
    5: '#FFEEAD',
  };

  const defaultCategories = [
    'Ресторан',
    'Ведущий',
    'Шоу программа',
    'Свадебный салон',
    'Прокат авто',
    'Традиционные подарки',
    'Ювелирные изделия',
    'Торты',
    'Алкоголь',
    'Цветы',
  ];

  const [activeCategories, setActiveCategories] = useState(() => {
    const initialCategories = {};
    selectedCategories.forEach((category) => {
      if (defaultCategories.includes(category)) {
        initialCategories[category] = true;
      }
    });
    return initialCategories;
  });

  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const categories = [...new Set([...defaultCategories, ...selectedCategories])];

  const ITEMS_PER_PAGE = 9;
  const paginatedCategories = [];
  for (let i = 0; i < categories.length; i += ITEMS_PER_PAGE) {
    paginatedCategories.push(categories.slice(i, i + ITEMS_PER_PAGE));
  }

  // const fetchAllBlockedDays = async () => {
  //   try {
  //     const response = await api.fetchAllBlockDays();
  //     const blockedDays = {};
  //     response.data.forEach((entry) => {
  //       const { date, restaurantId, restaurantName } = entry;
  //       if (!blockedDays[date]) {
  //         blockedDays[date] = {
  //           marked: true,
  //           dots: [],
  //         };
  //       }
  //       blockedDays[date].dots.push({
  //         restaurantId,
  //         restaurantName,
  //         color: restaurantColors[restaurantId] || '#CCCCCC',
  //       });
  //     });
  //     setBlockedDays(blockedDays);
  //   } catch (error) {
  //     console.error('Ошибка загрузки заблокированных дней:', error);
  //   }
  // };


  const fetchAllBlockedDays = async () => {
    try {
      const response = await api.fetchAllBlockDays();
      console.log('Ответ API fetchAllBlockDays:', response.data);
      const blockedDays = {};
      response.data.forEach((entry) => {
        const { date, restaurantId, restaurantName } = entry;
        if (!blockedDays[date]) {
          blockedDays[date] = {
            marked: true,
            dots: [],
          };
        }
        blockedDays[date].dots.push({
          restaurantId,
          restaurantName,
          color: restaurantColors[restaurantId] || '#CCCCCC',
        });
      });
      console.log('Сформированные blockedDays:', blockedDays);
      setBlockedDays(blockedDays);
    } catch (error) {
      console.error('Ошибка загрузки заблокированных дней:', error.message);
    }
  };


  const fetchData = async () => {
    if (!token || !user?.id) {
      console.log('Токен или user.id отсутствуют:', { token, userId: user?.id });
      return;
    }
    try {
      const response = await api.getRestaurants();
      console.log('Ответ API getRestaurants:', response.data);
      setData((prev) => ({
        ...prev,
        restaurants: response.data || [],
      }));
      fetchAllBlockedDays();
    } catch (error) {
      console.error('Ошибка загрузки данных ресторанов:', error.message);
    }
  };
  
  const handleSelectRestaurant = () => {
    if (!tempRestaurantId) {
      alert('Пожалуйста, выберите ресторан');
      return;
    }
    const restaurantId = Number(tempRestaurantId);
    const restaurant = data?.restaurants?.find((r) => r.id === restaurantId);
    if (!restaurant) {
      console.error('Ресторан не найден:', { restaurantId, restaurants: data.restaurants });
      alert('Ошибка: ресторан не найден');
      return;
    }
    console.log('Выбран ресторан:', restaurant);
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(false);
    setShowCalendarModal(true);
  };

  useEffect(() => {
    if (user?.roleId === 1) {
      fetchData();
    }
  }, [token, user]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / Dimensions.get('window').width);
    setCurrentPage(page);
  };

  const handleCategoryPress = (category) => {
    if (category === 'Добавить') {
      return;
    }
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const selectedCategoriesList = Object.keys(activeCategories).filter(
    (category) => activeCategories[category]
  );

  const handleBudgetChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    setBudget(filteredValue);
  };

  const handleGuestCountChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    setGuestCount(filteredValue);
  };

  const handleProceed = () => {
    if (selectedCategoriesList.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну категорию.');
      return;
    }
    navigation.navigate('Authenticated', {
      screen: 'Home',
      params: { selectedCategories: selectedCategoriesList },
    });
  };

  const blockRestaurantDay = async (restaurantId, date) => {
    try {
      const response = await api.addDataBlockToRestaurant(restaurantId, selectedDate);
      alert('Успешно поставлена бронь', response.data.message);
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      alert('В этот день у данного ресторана уже стоит бронь');
    }
  };

  const getCalendarPermissions = async () => {
    const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  };

  const handleBlockDay = async () => {
    if (!selectedRestaurant) {
      alert('Пожалуйста, выберите ресторан');
      return;
    }

    const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
    await ExpoCalendar.createEventAsync(defaultCalendar.id, {
      title: `Забронирован день для ${selectedRestaurant.name}`,
      startDate: selectedDate,
      endDate: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      allDay: true,
      notes: `Ресторан ${selectedRestaurant.name} забронирован менеджером`,
      availability: 'busy',
    });

    await blockRestaurantDay(selectedRestaurant.id, selectedDate);
    setShowCalendarModal(false);
  };



  const renderCategory = (item) => {
    const isActive = activeCategories[item];

    if (item === 'Добавить') {
      return (
        <TouchableOpacity style={styles.categoryButton}>
          <LinearGradient
            colors={['#D3C5B7', '#A68A6E']}
            style={styles.categoryButtonGradient}
          >
            <Icon name="add" size={24} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    const imageSource = isActive
      ? categoryImages[item]?.active
      : categoryImages[item]?.inactive;

    return (
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => handleCategoryPress(item)}
      >
        <Image
          source={imageSource}
          style={styles.categoryImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderPage = ({ item }) => (
    <View style={styles.pageContainer}>
      {item.map((category, index) => (
        <View key={index} style={styles.citiesItem}>
          {renderCategory(category)}
        </View>
      ))}
    </View>
  );


   const handleLogout = async () => {
      try {
        // dispatch(startLoading()); // Устанавливаем состояние загрузки
        await SecureStore.deleteItemAsync('token'); // Удаляем токен асинхронно
        console.log('Token removed from SecureStore');
        await dispatch2(logout()); // Обновляем состояние в Redux
        navigation.navigate('Login'); // Перенаправляем на экран логина
      } catch (error) {
        console.error('Logout error:', error);
        dispatch2(setError('Ошибка при выходе'));
        Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
      }
    };


  const renderAdminContent = () => (
    <LinearGradient
    colors={['#F1EBDD', '#897066']}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
    style={styles.splashContainer}
  >
    <Image
      source={require('../../assets/footer.png')}
      style={styles.topPatternContainer}
    />
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="left" size={24} color="black" />
    </TouchableOpacity>
    <View style={styles.headerContainer}></View>
    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/kazanRevert.png')}
        style={styles.potIcon}
        resizeMode="contain"
      />
    </View>
    <View style={styles.supplierContainer}>
      <Text style={styles.title}>Панель менеджера</Text>
      <View style={styles.infoCard}>
        <Icon name="restaurant" size={24} color={COLORS.primary} style={styles.infoIcon} />
        <Text style={styles.subtitle}>
          {selectedRestaurant ? `Выбран ресторан: ${selectedRestaurant.name}` : 'Ресторан не выбран'}
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Icon name="event" size={24} color={COLORS.secondary} style={styles.infoIcon} />
        <Text style={styles.dateText}>
          Выбранная дата: {selectedDate.toLocaleDateString('ru-RU')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          console.log('Открытие модального окна выбора ресторана');
          setShowRestaurantModal(true);
        }}
      >
        <LinearGradient
          colors={['#D3C5B7', '#A68A6E']}
          style={styles.actionButtonGradient}
        >
          <Icon name="calendar-today" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Выбрать дату для бронирования</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setShowCalendarModal2(true)}
      >
        <LinearGradient
          colors={['#D3C5B7', '#A68A6E']}
          style={styles.actionButtonGradient}
        >
          <Icon name="visibility" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.actionButtonText}>Просмотр календаря</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
              style={styles.logoutButtonContainer}
              onPress={()=>{handleLogout()}}
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRestaurantModal}
      onRequestClose={() => setShowRestaurantModal(false)}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выбор ресторана</Text>
              <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
                <Icon name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Выберите ресторан:</Text>
            {data?.restaurants?.length > 0 ? (
              <>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempRestaurantId}
                    onValueChange={(itemValue) => {
                      console.log('Выбран restaurantId:', itemValue);
                      setTempRestaurantId(itemValue);
                    }}
                    style={styles.picker}
                    dropdownIconColor={COLORS.textPrimary}
                  >
                    <Picker.Item label="Выберите ресторан" value={null} />
                    {data.restaurants.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={item.name}
                        value={item.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity
                  style={[styles.modalActionButton, !tempRestaurantId && styles.disabledButton]}
                  onPress={handleSelectRestaurant}
                  disabled={!tempRestaurantId}
                >
                  <LinearGradient
                    colors={['#D3C5B7', '#A68A6E']}
                    style={styles.modalActionButtonGradient}
                  >
                    <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                    <Text style={styles.modalActionButtonText}>Выбрать ресторан</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.modalText}>Рестораны не найдены. Попробуйте позже.</Text>
            )}
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendarModal}
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Выбор даты</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите дату:</Text>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={{
                  [selectedDate.toISOString().split('T')[0]]: {
                    selected: true,
                    selectedColor: COLORS.primary,
                  },
                }}
                theme={{
                  selectedDayBackgroundColor: COLORS.primary,
                  todayTextColor: COLORS.accent,
                  arrowColor: COLORS.secondary,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={handleBlockDay}
              >
                <LinearGradient
                  colors={['#D3C5B7', '#A68A6E']}
                  style={styles.modalActionButtonGradient}
                >
                  <Icon name="lock" size={20} color={COLORS.white} style={styles.buttonIcon} />
                  <Text style={styles.modalActionButtonText}>Забронировать</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendarModal2}
        onRequestClose={() => setShowCalendarModal2(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Просмотр календаря</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal2(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите дату для проверки:</Text>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => {
                  const dateString = day.dateString;
                  setSelectedDate(new Date(day.timestamp));
                  const occupied = blockedDays[dateString]
                    ? blockedDays[dateString].dots.map((entry) => ({
                        id: entry.restaurantId,
                        name: entry.restaurantName,
                      }))
                    : [];
                  setOccupiedRestaurants(occupied);
                }}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={Object.keys(blockedDays).reduce((acc, date) => {
                  acc[date] = {
                    marked: true,
                    dots: blockedDays[date].dots.map((dot) => ({
                      key: dot.restaurantId.toString(),
                      color: dot.color,
                    })),
                  };
                  return acc;
                }, {})}
                markingType={'multi-dot'}
                theme={{
                  selectedDayBackgroundColor: COLORS.primary,
                  todayTextColor: COLORS.accent,
                  arrowColor: COLORS.secondary,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
              <View style={styles.occupiedContainer}>
                {occupiedRestaurants.length > 0 ? (
                  <>
                    <Text style={styles.modalText}>
                      На этот день уже заняты следующие рестораны:
                    </Text>
                    {occupiedRestaurants.map((restaurant) => (
                      <View key={restaurant.id} style={styles.occupiedItem}>
                        <Icon name="restaurant" size={18} color={COLORS.error} />
                        <Text style={styles.occupiedText}>{restaurant.name}</Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.modalText}>В этот день нет занятых ресторанов</Text>
                )}
              </View>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal> */}

<Modal
  animationType="slide"
  transparent={true}
  visible={showCalendarModal2}
  onRequestClose={() => setShowCalendarModal2(false)}
>
  <View style={styles.modalOverlay}>
    <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Просмотр календаря</Text>
          <TouchableOpacity onPress={() => setShowCalendarModal2(false)}>
            <Icon name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalSubtitle}>Выберите дату для проверки:</Text>
        <Calendar
          current={selectedDate.toISOString().split('T')[0]}
          onDayPress={(day) => {
            const dateString = day.dateString;
            console.log('Выбрана дата:', dateString, 'Данные blockedDays:', blockedDays[dateString]);
            setSelectedDate(new Date(day.timestamp));
            const occupied = blockedDays[dateString]
              ? blockedDays[dateString].dots.map((entry) => ({
                  id: entry.restaurantId,
                  name: entry.restaurantName,
                }))
              : [];
            console.log('Занятые рестораны:', occupied);
            setOccupiedRestaurants(occupied);
          }}
          minDate={new Date().toISOString().split('T')[0]}
          markedDates={Object.keys(blockedDays).reduce((acc, date) => {
            acc[date] = {
              marked: true,
              dotColor: blockedDays[date].dots[0]?.color || '#CCCCCC', // Для single dot
              dots: blockedDays[date].dots.map((dot) => ({
                key: dot.restaurantId.toString(),
                color: dot.color,
                selectedDotColor: dot.color,
              })),
            };
            return acc;
          }, {})}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            todayTextColor: COLORS.accent,
            arrowColor: COLORS.secondary,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
            dotColor: COLORS.primary, // Общий цвет точек, если не указан
            selectedDotColor: COLORS.primary,
          }}
          style={styles.calendar}
        />
        <View style={styles.occupiedContainer}>
          {occupiedRestaurants.length > 0 ? (
            <>
              <Text style={styles.modalText}>
                На этот день уже заняты следующие рестораны:
              </Text>
              {occupiedRestaurants.map((restaurant) => (
                <View key={restaurant.id} style={styles.occupiedItem}>
                  <Icon name="restaurant" size={18} color={COLORS.error} />
                  <Text style={styles.occupiedText}>{restaurant.name}</Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.modalText}>В этот день нет занятых ресторанов</Text>
          )}
        </View>
      </ScrollView>
    </Animatable.View>
  </View>
</Modal>





    </LinearGradient>
  );

  const renderClientContent = () => (
    // <LinearGradient
    //   colors={['#F1EBDD', '#897066']}
    //   start={{ x: 0, y: 1 }}
    //   end={{ x: 0, y: 0 }}
    //   style={styles.splashContainer}
    // >
    //   <TouchableOpacity
    //     style={styles.iconButton}
    //     onPress={() => setAddItemModalVisible(true)}
    //     disabled={!budget}
    //   >
    //     <Icon name="add" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
    //   </TouchableOpacity>
    //   <Image
    //     source={require('../../assets/footer.png')}
    //     style={styles.topPatternContainer}
    //   />
    //   <TouchableOpacity
    //     style={styles.backButton}
    //     onPress={() => navigation.goBack()}
    //   >
    //     <AntDesign name="left" size={24} color="black" />
    //   </TouchableOpacity>
    //   <View style={styles.headerContainer}></View>
    //   <View style={styles.logoContainer}>
    //     <Image
    //       source={require('../../assets/kazanRevert.png')}
    //       style={styles.potIcon}
    //       resizeMode="contain"
    //     />
    //   </View>
    //   <View style={styles.listContainer}>
    //     <View style={styles.categoryGrid}>
    //       <FlatList
    //         data={paginatedCategories}
    //         renderItem={renderPage}
    //         keyExtractor={(item, index) => `page-${index}`}
    //         horizontal
    //         pagingEnabled
    //         showsHorizontalScrollIndicator={false}
    //         onScroll={handleScroll}
    //         scrollEventThrottle={16}
    //         style={styles.paginationList}
    //       />
    //       {paginatedCategories.length > 1 && (
    //         <View style={styles.paginationDots}>
    //           {paginatedCategories.map((_, index) => (
    //             <Image
    //               key={index}
    //               source={
    //                 currentPage === index
    //                   ? require('../../assets/dotOn.png')
    //                   : require('../../assets/dotOff.png')
    //               }
    //               style={styles.dotImage}
    //               resizeMode="contain"
    //             />
    //           ))}
    //         </View>
    //       )}
    //     </View>
    //   </View>
    //   <View style={styles.bottomContainer}>
    //     <TouchableOpacity style={styles.nextButton} onPress={handleProceed}>
    //       <Image
    //         source={require('../../assets/next.png')}
    //         style={styles.potIcon3}
    //         resizeMode="contain"
    //       />
    //     </TouchableOpacity>
    //   </View>
    // </LinearGradient>

        <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.splashContainer}
    >
        <TouchableOpacity
  style={styles.iconButton}
  onPress={() => setAddItemModalVisible(true)}
  disabled={!budget}
>
  <Icon name="add" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
</TouchableOpacity>


      <Image
        source={require('../../assets/footer.png')}
        style={styles.topPatternContainer}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}></View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/kazanRevert.png')}
          style={styles.potIcon}
          resizeMode="contain"
        />
      </View>

     

  <View style={styles.listContainer}>
          <View style={styles.categoryGrid}>
            <FlatList
              data={paginatedCategories}
              renderItem={renderPage}
              keyExtractor={(item, index) => `page-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.paginationList}
            />
            {paginatedCategories.length > 1 && (
              <View style={styles.paginationDots}>
                {paginatedCategories.map((_, index) => (
                  <Image
                    key={index}
                    source={
                      currentPage === index
                        ? require('../../assets/dotOn.png') // Укажите путь к изображению активной точки
                        : require('../../assets/dotOff.png') // Укажите путь к изображению неактивной точки
                    }
                    style={styles.dotImage}
                    resizeMode="contain"
                  />
                ))}
              </View>
            )}
          </View>
        </View>



      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleProceed}>
          <Image
            source={require('../../assets/next.png')}
            style={styles.potIcon3}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
   
    <SafeAreaView style={styles.container}>{renderAdminContent()}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  splashContainer: {
    flex: 1,
    position: 'relative',
  },
  topPatternContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    zIndex: 1,
    resizeMode: 'cover',
    opacity: 0.8,
  },
  backButton: {
    marginTop: '10%',
    marginLeft: '2%',
    padding: 10,
    zIndex: 3,
  },
  headerContainer: {
    paddingHorizontal: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    zIndex: 2,
  },
  potIcon: {
    width: 150,
    height: 150,
  },
  potIcon3: {
    width: 120,
    height: 120,
    zIndex: 2,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  categoryGrid: {
    flex: 1,
    paddingVertical: 10,
  },
  pageContainer: {
    width: Dimensions.get('window').width - 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: '33.33%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  paginationList: {
    flexGrow: 0,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 2,
  },
  dotImage: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 3,
  },
  nextButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    zIndex: 3,
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 3,
  },
  supplierContainer: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#F7FAFC',
  },
  picker: {
    height: 150,
    width: '100%',
    color: COLORS.textPrimary,
  },
  modalActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalActionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  calendar: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginBottom: 20,
    overflow: 'hidden',
  },
  occupiedContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF8F5',
    borderRadius: 10,
  },
  occupiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  occupiedText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});


