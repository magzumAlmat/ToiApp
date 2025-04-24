// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   SafeAreaView,
//   ScrollView,ImageBackground
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AntDesign from '@expo/vector-icons/AntDesign';
// const COLORS = {
//   primary: '#FF6F61',
//   white: '#FFFFFF',
// };

// const BeforeHomeScreen = ({ navigation, route }) => {
//   // Отладочный лог для проверки navigation и route
//   console.log('BeforeHomeScreen navigation:', navigation);
//   console.log('BeforeHomeScreen route.params:', route?.params);

//   // Получаем переданные категории
//   const selectedCategories = route?.params?.selectedCategories || [];

//   // Базовый список категорий
//   const defaultCategories = [
//     // 'Ведущие',
//     // 'Ресторан',
//     // 'Алкоголь',
//     // 'Музыка',
//     // 'Ювелирные изделия',
//     // 'Тойбастар',
//     // 'Свадебные салоны',
//     // 'Транспорт',

//     'Ресторан',
//     'Ведущий',
//     'Шоу программа',
//     'Свадебный салон',
//     'Прокат авто',
  
//     'Традиционные подарки',
//     'Ювелирные изделия',
  
//     'Торты',
//     'Алкоголь',
//     'Торты',
//       'Продукты',
//       'Фото видео съемка',
//     'Оформление',
//     'Прочее',
//     'Добавить',
//   ];

//   // Инициализируем состояние activeCategories на основе переданных категорий
//   const [activeCategories, setActiveCategories] = useState(() => {
//     const initialCategories = {};
//     selectedCategories.forEach((category) => {
//       if (defaultCategories.includes(category)) {
//         initialCategories[category] = true;
//       }
//     });
//     return initialCategories;
//   });

//   const [budget, setBudget] = useState('');
//   const [guestCount, setGuestCount] = useState('');

//   // Формируем список категорий для отображения
//   const categories = [...new Set([...defaultCategories, ...selectedCategories])];

//   const handleCategoryPress = (category) => {
//     if (category === 'Добавить') {
//       return;
//     }
//     setActiveCategories((prev) => ({
//       ...prev,
//       [category]: !prev[category],
//     }));
//   };

//   const selectedCategoriesList = Object.keys(activeCategories).filter(
//     (category) => activeCategories[category]
//   );

//   const handleBudgetChange = (value) => {
//     const filteredValue = value.replace(/[^0-9]/g, '');
//     setBudget(filteredValue);
//   };

//   const handleGuestCountChange = (value) => {
//     const filteredValue = value.replace(/[^0-9]/g, '');
//     setGuestCount(filteredValue);
//   };

//   const handleProceed = () => {
//     if (selectedCategoriesList.length === 0) {
//       alert('Пожалуйста, выберите хотя бы одну категорию.');
//       return;
//     }
//     navigation.navigate('Authenticated', {
//       screen: 'Home',
//       params: { selectedCategories: selectedCategoriesList },
//     });
//   };

//   const renderCategory = (item) => {
//     const isActive = activeCategories[item];

//     if (item === 'Добавить') {
//       return (
//         <TouchableOpacity style={styles.categoryButton}>
//           <LinearGradient
//             colors={['#D3C5B7', '#A68A6E']}
//             style={styles.categoryButtonGradient}
//           >
//             <Icon name="add" size={24} color={COLORS.white} />
//             <Text style={styles.categoryText}>Добавить</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       );
//     }

//     return (
//       <TouchableOpacity
//         style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
//         onPress={() => handleCategoryPress(item)}
//       >
//         <LinearGradient
//           colors={['#D3C5B7', '#A68A6E']}
//           style={styles.categoryButtonGradient}
//         >
//           <Text style={styles.categoryText}>{item}</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     );
//   };

//   return (
    
//       <LinearGradient
//         colors={['#F1EBDD', '#897066']}
//         start={{ x: 0, y: 1 }}
//         end={{ x: 0, y: 0 }}
//         style={styles.splashContainer}
//       >
//       <TouchableOpacity
//       style={{marginTop:'15%',marginLeft:'2%'}}
//       onPress={() => navigation.goBack()}
//     >
//       {/* <Icon name="chevron-back-outline" size={24} color={COLORS.white} /> */}
//       <AntDesign name="left" size={24} color="black" />
//     </TouchableOpacity>

//         <View style={styles.headerContainer}>
//           {/* <TouchableOpacity style={styles.headerButton}>
//             <Text style={styles.headerText}>Свадьба</Text>
//             <Icon name="arrow-drop-down" size={24} color="#FFF" />
//           </TouchableOpacity> */}
//           {/* <View style={styles.budgetContainer}>
//             <TextInput
//               style={styles.budgetInput}
//               placeholder="Бюджет (т)"
//               value={budget}
//               onChangeText={handleBudgetChange}
//               keyboardType="numeric"
//               placeholderTextColor="#FFF"
//             />
//             <TextInput
//               style={styles.guestInput}
//               placeholder="Гостей"
//               value={guestCount}
//               onChangeText={handleGuestCountChange}
//               keyboardType="numeric"
//               placeholderTextColor="#FFF"
//             />
//           </View> */}
//         </View>

//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/kazanRevert.png')}
//             style={styles.potIcon}
//             resizeMode="contain"
//           />
//         </View>

//         <View style={styles.listContainer}>

          
//           <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//             <View style={styles.categoryGrid}>
//               {categories.map((item, index) => (
//                 <View key={index} style={styles.categoryItem}>
//                   {renderCategory(item)}
//                 </View>
//               ))}
//             </View>
//             <View style={styles.bottomPadding} />
//           </ScrollView>
//         </View>

//         <View style={styles.bottomContainer}>
//           <TouchableOpacity style={styles.nextButton} onPress={handleProceed}>
//               <Image
//                         source={require("../../assets/next.png")}
//                         style={styles.potIcon3}
//                         resizeMode="contain"
//                       />
//           </TouchableOpacity>
//         </View>

//         {/* {selectedCategoriesList.length > 0 && (
//           <View style={styles.selectedCategoriesContainer}>
//             <Text style={styles.selectedCategoriesTitle}>Выбранные категории:</Text>
//             <Text style={styles.selectedCategoriesText}>
//               {selectedCategoriesList.join(', ')}
//             </Text>
//           </View>
//         )} */}

//          <Image
//                 source={require('../../assets/footer.png')}
//                 style={styles.topPatternContainer}
//                 imageStyle={styles.topPatternImage}
//               />
//       </LinearGradient>

//   );
// };

// const styles = StyleSheet.create({
//   splashContainer: { flex: 1 ,position: "relative",},
//   headerContainer: {
//     paddingHorizontal: 20,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',

//   },
//   headerButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerText: { fontSize: 18, color: '#FFF', fontWeight: '600' },
//   budgetContainer: { flexDirection: 'row', alignItems: 'center' },
//   budgetInput: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: '#FFF',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     width: 120,
//     fontSize: 16,
//   },
//   guestInput: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: '#FFF',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     width: 80,
//     fontSize: 16,
//   },
//   logoContainer: { alignItems: 'center', marginVertical: 20 },
//   potIcon: { width: 150, height: 150 },
//   potIcon3: { width: 120, height: 120,zIndex:2, },
//   listContainer: { flex: 1, paddingHorizontal: 20 },
//   scrollView: { flex: 1 },
//   categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   categoryItem: { width: '33.33%', padding: 5, alignItems: 'center', justifyContent: 'center' },
//   categoryButton: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 100,
//     overflow: 'hidden',
//     shadowColor: 'rgba(0, 0, 0, 0.3)',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   activeCategoryButton: {
//     borderWidth: 3,
//     borderColor: COLORS.primary,
//   },
//   categoryButtonGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#5A4032',
//     borderRadius: 100,
//   },
//   categoryText: {
//     fontSize: 16,
//     color: COLORS.white,
//     fontWeight: '600',
//     textAlign: 'center',
//     paddingHorizontal: 10,
//   },
//   bottomPadding: { height: 20 },
//   bottomContainer: { paddingHorizontal: 20, paddingBottom: 20,zIndex:3 },
//   nextButton: {

//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   nextButtonText: { fontSize: 18, color: COLORS.white, fontWeight: '600' },
//   selectedCategoriesContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//   },
//   selectedCategoriesTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF',
//     marginBottom: 5,
//   },
//   selectedCategoriesText: {
//     fontSize: 14,
//     color: '#FFF',
//   },



//   topPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     width: '100%',
//     height: '20%',
//     zIndex: 1,
//     marginTop: '180%',
//   },
//   topPatternImage: {
//     width: '100%',
//     height: '100%',
   
//   },

  
// });

// export default BeforeHomeScreen;





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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const COLORS = {
  primary: '#FF6F61',
  white: '#FFFFFF',
};

const BeforeHomeScreen = ({ navigation, route }) => {
  // Отладочный лог для проверки navigation и route
  console.log('BeforeHomeScreen navigation:', navigation);
  console.log('BeforeHomeScreen route.params:', route?.params);

  // Получаем переданные категории
  const selectedCategories = route?.params?.selectedCategories || [];

  // Базовый список категорий
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
    'Продукты',
    'Фото видео съемка',
    'Оформление',
    'Прочее',
    'Добавить',
  ];

  // Инициализируем состояние activeCategories на основе переданных категорий
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
  const [currentPage, setCurrentPage] = useState(0); // Текущая страница пагинации

  // Формируем список категорий для отображения
  const categories = [...new Set([...defaultCategories, ...selectedCategories])];

  // Разделяем категории на страницы по 9 элементов
  const ITEMS_PER_PAGE = 9;
  const paginatedCategories = [];
  for (let i = 0; i < categories.length; i += ITEMS_PER_PAGE) {
    paginatedCategories.push(categories.slice(i, i + ITEMS_PER_PAGE));
  }

  // Обработчик прокрутки для обновления текущей страницы
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
            <Text style={styles.categoryText}>Добавить</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
        onPress={() => handleCategoryPress(item)}
      >
        <LinearGradient
          colors={['#D3C5B7', '#A68A6E']}
          style={styles.categoryButtonGradient}
        >
          <Text style={styles.categoryText}>{item}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Рендеринг страницы категорий
  const renderPage = ({ item }) => (
    <View style={styles.pageContainer}>
      {item.map((category, index) => (
        <View key={index} style={styles.categoryItem}>
          {renderCategory(category)}
        </View>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#F1EBDD', '#897066']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.splashContainer}
    >
      {/* ImageBackground на втором плане */}
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

      <View style={styles.headerContainer}>
        {/* Пустой headerContainer, если не нужен */}
      </View>

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
          {/* Индикаторы пагинации */}
          {paginatedCategories.length > 1 && (
            <View style={styles.paginationDots}>
              {paginatedCategories.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentPage === index ? styles.activeDot : styles.inactiveDot,
                  ]}
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
};

const styles = StyleSheet.create({
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
    marginTop: '15%',
    marginLeft: '2%',
    padding: 10,
    zIndex: 3,
  },
  headerContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  budgetInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    width: 120,
    fontSize: 16,
    zIndex: 2,
  },
  guestInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 80,
    fontSize: 16,
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
    width: Dimensions.get('window').width - 40, // Ширина страницы (учитываем paddingHorizontal: 20)
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
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  activeCategoryButton: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  categoryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5A4032',
    borderRadius: 100,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
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
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomPadding: {
    height: 20,
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
  },
  nextButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
  },
  selectedCategoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 2,
  },
  selectedCategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 5,
  },
  selectedCategoriesText: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default BeforeHomeScreen;