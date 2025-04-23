// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import {
//   View,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Dimensions,
//   FlatList,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useDispatch, useSelector } from 'react-redux';
// import api from '../api/api';
// import * as Animatable from 'react-native-animatable';
// import { Calendar } from 'react-native-calendars';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// const COLORS = {
//   primary: '#FF6F61',
//   secondary: '#4A90E2',
//   background: '#FDFDFD',
//   card: '#FFFFFF',
//   textPrimary: '#2D3748',
//   textSecondary: '#718096',
//   accent: '#FBBF24',
//   shadow: 'rgba(0, 0, 0, 0.3)',
//   error: '#FF0000',
//   white: '#FFFFFF',
//   buttonGradientStart: '#D3C5B7',
//   buttonGradientEnd: '#A68A6E',
// };

// const typeOrder = {
//   restaurant: 1,
//   clothing: 2,
//   tamada: 3,
//   program: 4,
//   traditionalGift: 5,
//   flowers: 6,
//   transport: 7,
//   cake: 8,
//   alcohol: 9,
//   goods: 10,
// };

// const typesMapping = [
//   { key: 'clothing', costField: 'cost', type: 'clothing', label: 'Одежда' },
//   { key: 'tamada', costField: 'cost', type: 'tamada', label: 'Тамада' },
//   { key: 'programs', costField: 'cost', type: 'program', label: 'Программа' },
//   { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift', label: 'Традиционные подарки' },
//   { key: 'flowers', costField: 'cost', type: 'flowers', label: 'Цветы' },
//   { key: 'cakes', costField: 'cost', type: 'cake', label: 'Торты' },
//   { key: 'alcohol', costField: 'cost', type: 'alcohol', label: 'Алкоголь' },
//   { key: 'transport', costField: 'cost', type: 'transport', label: 'Транспорт' },
//   { key: 'restaurants', costField: 'averageCost', type: 'restaurant', label: 'Ресторан' },
// ];

// const categoryToTypeMap = {
//   'Ведущие': 'tamada',
//   'Кейтеринг': 'restaurant',
//   'Алкоголь': 'alcohol',
//   'Музыка': 'program',
//   'Ювелирные изделия': 'goods',
//   'Тойбастар': 'traditionalGift',
//   'Свадебные салоны': 'clothing',
//   'Транспорт': 'transport',
// };

// // Модальное окно для добавления элементов
// const AddItemModal = ({ visible, onClose, filteredItems, filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem, quantities }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
//   const [selectedDistrict, setSelectedDistrict] = useState('all');
//   const [costRange, setCostRange] = useState('all');

//   const uniqueTypes = useMemo(() => {
//     const types = [
//       { type: 'all', label: 'Все' },
//       ...filteredItems
//         .map((item) => ({
//           type: item.type,
//           label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
//         }))
//         .filter((value, index, self) => self.findIndex((t) => t.type === value.type) === index)
//         .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)),
//     ];
//     return types;
//   }, [filteredItems]);

//   const districts = useMemo(() => ['all', ...new Set(filteredItems.map((item) => String(item.district)).filter(Boolean))], [filteredItems]);

//   const filteredDataMemo = useMemo(() => {
//     let result = filteredItems;
//     if (searchQuery) {
//       result = result.filter((item) =>
//         [
//           item.name,
//           item.itemName,
//           item.flowerName,
//           item.alcoholName,
//           item.carName,
//           item.teamName,
//           item.salonName,
//           item.storeName,
//           item.address,
//           item.phone,
//           item.cuisine,
//           item.category,
//           item.brand,
//           item.gender,
//           item.portfolio,
//           item.cakeType,
//           item.flowerType,
//         ]
//           .filter(Boolean)
//           .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }
//     if (selectedTypeFilter !== 'all') {
//       result = result.filter((item) => item.type === selectedTypeFilter);
//     }
//     if (selectedDistrict !== 'all') {
//       result = result.filter((item) => String(item.district) === selectedDistrict);
//     }
//     if (costRange !== 'all') {
//       result = result.filter((item) => {
//         const cost = item.averageCost || item.cost;
//         if (costRange === '0-10000') return cost <= 10000;
//         if (costRange === '10000-50000') return cost > 10000 && cost <= 50000;
//         if (costRange === '50000+') return cost > 50000;
//         return true;
//       });
//     }
//     return result.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
//   }, [filteredItems, searchQuery, selectedTypeFilter, selectedDistrict, costRange]);

//   const renderAddItem = useCallback(
//     ({ item }) => {
//       const count = filteredData.filter(
//         (selectedItem) => `${selectedItem.type}-${selectedItem.id}` === `${item.type}-${item.id}`
//       ).length;
//       if (item.type === 'goods' && item.category === 'Прочее') return null;
//       const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
//       let title;
//       switch (item.type) {
//         case 'restaurant':
//           title = `Ресторан: ${item.name} (${cost} ₸)`;
//           break;
//         case 'clothing':
//           title = `Одежда: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'flowers':
//           title = `Цветы: ${item.salonName} - ${item.flowerName} (${cost} ₸)`;
//           break;
//         case 'cake':
//           title = `Торты: ${item.name} (${cost} ₸)`;
//           break;
//         case 'alcohol':
//           title = `Алкоголь: ${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
//           break;
//         case 'program':
//           title = `Программа: ${item.teamName} (${cost} ₸)`;
//           break;
//         case 'tamada':
//           title = `Тамада: ${item.name} (${cost} ₸)`;
//           break;
//         case 'traditionalGift':
//           title = `Традиц. подарки: ${item.salonName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'transport':
//           title = `Транспорт: ${item.salonName} - ${item.carName} (${cost} ₸)`;
//           break;
//         case 'goods':
//           title = `Товар: ${item.item_name} (${cost} ₸)`;
//           break;
//         default:
//           title = 'Неизвестный элемент';
//       }
//       return (
//         <View style={styles.addModalItemCard}>
//           <TouchableOpacity style={styles.addModalItemContent} onPress={() => handleAddItem(item)}>
//             <Text style={styles.addModalItemText}>{title}</Text>
//             {count > 0 && (
//               <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.addModalDetailsButton}
//             onPress={() => {
//               setSelectedItem(item);
//               setDetailsModalVisible(true);
//               onClose();
//             }}
//           >
//             <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     },
//     [filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem, onClose]
//   );

//   const closeModal = () => {
//     setSearchQuery('');
//     setSelectedTypeFilter('all');
//     setSelectedDistrict('all');
//     setCostRange('all');
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={closeModal}>
//       <SafeAreaView style={styles.modalOverlay}>
//         <View style={styles.addModalContainer}>
//           <View style={styles.addModalHeader}>
//             <Text style={styles.addModalTitle}>Добавить элемент</Text>
//             <TouchableOpacity style={styles.addModalCloseIcon} onPress={closeModal}>
//               <Icon name="close" size={24} color={COLORS.textSecondary} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.addModalSearchContainer}>
//             <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.addModalSearchIcon} />
//             <TextInput
//               style={styles.addModalSearchInput}
//               placeholder="Поиск по названию..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//             {searchQuery.length > 0 && (
//               <TouchableOpacity style={styles.addModalClearIcon} onPress={() => setSearchQuery('')}>
//                 <Icon name="clear" size={20} color={COLORS.textSecondary} />
//               </TouchableOpacity>
//             )}
//           </View>

//           <ScrollView
//             style={styles.addModalFilterScroll}
//             contentContainerStyle={styles.addModalFilterContainer}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.addModalTypeFilterContainer}>
//               <Text style={styles.addModalFilterLabel}>Тип</Text>
//               <View style={styles.addModalTypeButtons}>
//                 {uniqueTypes.map((typeObj) => (
//                   <TouchableOpacity
//                     key={typeObj.type}
//                     style={[
//                       styles.addModalTypeButton,
//                       selectedTypeFilter === typeObj.type && styles.addModalTypeButtonActive,
//                     ]}
//                     onPress={() => setSelectedTypeFilter(typeObj.type)}
//                   >
//                     <Text
//                       style={[
//                         styles.addModalTypeButtonText,
//                         selectedTypeFilter === typeObj.type && styles.addModalTypeButtonTextActive,
//                       ]}
//                     >
//                       {typeObj.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//             <View style={styles.addModalDistrictFilterContainer}>
//               <Text style={styles.addModalFilterLabel}>Район</Text>
//               <View style={styles.addModalDistrictButtons}>
//                 {districts.map((district) => (
//                   <TouchableOpacity
//                     key={district}
//                     style={[
//                       styles.addModalDistrictButton,
//                       selectedDistrict === district && styles.addModalDistrictButtonActive,
//                     ]}
//                     onPress={() => setSelectedDistrict(district)}
//                   >
//                     <Text
//                       style={[
//                         styles.addModalDistrictButtonText,
//                         selectedDistrict === district && styles.addModalDistrictButtonTextActive,
//                       ]}
//                     >
//                       {district === 'all' ? 'Все' : district}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//             <View style={styles.addModalPriceFilterContainer}>
//               <Text style={styles.addModalFilterLabel}>Цена</Text>
//               <View style={styles.addModalPriceButtons}>
//                 {[
//                   { label: 'Все', value: 'all' },
//                   { label: '0-10k', value: '0-10000' },
//                   { label: '10k-50k', value: '10000-50000' },
//                   { label: '50k+', value: '50000+' },
//                 ].map((option) => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.addModalPriceButton,
//                       costRange === option.value && styles.addModalPriceButtonActive,
//                     ]}
//                     onPress={() => setCostRange(option.value)}
//                   >
//                     <Text
//                       style={[
//                         styles.addModalPriceButtonText,
//                         costRange === option.value && styles.addModalPriceButtonTextActive,
//                       ]}
//                     >
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>

//           <FlatList
//             data={filteredDataMemo}
//             renderItem={renderAddItem}
//             keyExtractor={(item) => `${item.type}-${item.id}`}
//             showsVerticalScrollIndicator={true}
//             style={styles.addModalScrollView}
//             contentContainerStyle={styles.addModalItemList}
//             ListEmptyComponent={
//               <Text style={styles.addModalEmptyText}>Ничего не найдено</Text>
//             }
//           />
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// // Модальное окно для отображения элементов категории
// const CategoryItemsModal = ({
//   visible,
//   onClose,
//   categoryItems,
//   categoryLabel,
//   categoryType,
//   filteredData,
//   handleAddItem,
//   handleRemoveItem,
//   setDetailsModalVisible,
//   setSelectedItem,
//   quantities,
//   setQuantities,
//   budget,
//   setFilteredData,
//   setRemainingBudget,
// }) => {
//   const selectedItems = filteredData.filter((item) => item.type === categoryType);

//   const renderCategoryItem = useCallback(
//     ({ item }) => {
//       const isSelected = selectedItems.some(
//         (selected) => `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
//       );
//       const count = selectedItems.filter(
//         (selected) => `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
//       ).length;
//       const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
//       let title;
//       switch (item.type) {
//         case 'restaurant':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'clothing':
//           title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'flowers':
//           title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
//           break;
//         case 'cake':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'alcohol':
//           title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
//           break;
//         case 'program':
//           title = `${item.teamName} (${cost} ₸)`;
//           break;
//         case 'tamada':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'traditionalGift':
//           title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'transport':
//           title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
//           break;
//         case 'goods':
//           title = `${item.item_name} (${cost} ₸)`;
//           break;
//         default:
//           title = 'Неизвестный элемент';
//       }
//       return (
//         <View style={styles.addModalItemCard}>
//           <TouchableOpacity
//             style={[styles.addModalItemContent, isSelected && styles.disabledItemContent]}
//             onPress={() => !isSelected && handleAddItem(item)}
//             disabled={isSelected}
//           >
//             <Text style={styles.addModalItemText}>{title}</Text>
//             {count > 0 && <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>}
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.addModalDetailsButton}
//             onPress={() => {
//               setSelectedItem(item);
//               setDetailsModalVisible(true);
//               onClose();
//             }}
//           >
//             <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     },
//     [handleAddItem, setDetailsModalVisible, setSelectedItem, onClose, selectedItems]
//   );

//   const renderSelectedItem = useCallback(
//     (item) => {
//       const itemKey = `${item.type}-${item.id}`;
//       const quantity = quantities[itemKey] || '1';
//       const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
//       const parsedQuantityForCalc = quantity === '' ? 1 : parseInt(quantity) || 1;
//       const totalCost = cost * parsedQuantityForCalc;

//       const handleQuantityChange = (value) => {
//         const filteredValue = value.replace(/[^0-9]/g, '');
//         const updatedQuantities = { ...quantities, [itemKey]: filteredValue };
//         setQuantities(updatedQuantities);

//         const quantityForCalc = filteredValue === '' ? 1 : parseInt(filteredValue) || 1;
//         const updatedFilteredData = filteredData.map((dataItem) => {
//           if (`${dataItem.type}-${dataItem.id}` === itemKey) {
//             return { ...dataItem, totalCost: cost * quantityForCalc };
//           }
//           return dataItem;
//         });
//         setFilteredData(updatedFilteredData);

//         const totalSpent = updatedFilteredData.reduce((sum, dataItem) => {
//           const key = `${dataItem.type}-${dataItem.id}`;
//           const itemQuantity = updatedQuantities[key] === '' ? 1 : parseInt(updatedQuantities[key] || '1');
//           const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
//           return sum + itemCost * itemQuantity;
//         }, 0);
//         setRemainingBudget(parseFloat(budget) - totalSpent);
//       };

//       const handleBlur = () => {
//         if (quantities[itemKey] === '') {
//           const updatedQuantities = { ...quantities, [itemKey]: '1' };
//           setQuantities(updatedQuantities);

//           const updatedFilteredData = filteredData.map((dataItem) => {
//             if (`${dataItem.type}-${dataItem.id}` === itemKey) {
//               return { ...dataItem, totalCost: cost * 1 };
//             }
//             return dataItem;
//           });
//           setFilteredData(updatedFilteredData);

//           const totalSpent = updatedFilteredData.reduce((sum, dataItem) => {
//             const key = `${dataItem.type}-${dataItem.id}`;
//             const itemQuantity = updatedQuantities[key] === '' ? 1 : parseInt(updatedQuantities[key] || '1');
//             const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
//             return sum + itemCost * itemQuantity;
//           }, 0);
//           setRemainingBudget(parseFloat(budget) - totalSpent);
//         }
//       };

//       let title;
//       switch (item.type) {
//         case 'restaurant':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'clothing':
//           title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'flowers':
//           title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
//           break;
//         case 'cake':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'alcohol':
//           title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
//           break;
//         case 'program':
//           title = `${item.teamName} (${cost} ₸)`;
//           break;
//         case 'tamada':
//           title = `${item.name} (${cost} ₸)`;
//           break;
//         case 'traditionalGift':
//           title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
//           break;
//         case 'transport':
//           title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
//           break;
//         case 'goods':
//           title = `${item.item_name} (${cost} ₸)`;
//           break;
//         default:
//           title = 'Неизвестный элемент';
//       }

//       return (
//         <View style={[styles.addModalItemCard, styles.selectedItemCard]}>
//           <View style={styles.addModalItemContent}>
//             <Text style={styles.addModalItemText}>Выбрано: {title}</Text>
//             <View style={styles.quantityContainer}>
//               <Text style={styles.quantityLabel}>Количество:</Text>
//               <TextInput
//                 style={styles.quantityInput}
//                 value={quantity}
//                 onChangeText={handleQuantityChange}
//                 onBlur={handleBlur}
//                 keyboardType="numeric"
//                 placeholder="1"
//               />
//               <Text style={styles.totalCostText}>Итого: {totalCost} ₸</Text>
//             </View>
//           </View>
//           <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item)}>
//             <Text style={styles.removeButtonText}>Убрать</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.addModalDetailsButton}
//             onPress={() => {
//               setSelectedItem(item);
//               setDetailsModalVisible(true);
//               onClose();
//             }}
//           >
//             <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     },
//     [
//       quantities,
//       filteredData,
//       budget,
//       handleRemoveItem,
//       setDetailsModalVisible,
//       setSelectedItem,
//       onClose,
//       setQuantities,
//       setFilteredData,
//       setRemainingBudget,
//     ]
//   );

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
//       <SafeAreaView style={styles.modalOverlay}>
//         <View style={styles.addModalContainer}>
//           <View style={styles.addModalHeader}>
//             <Text style={styles.addModalTitle}>{categoryLabel}</Text>
//             <TouchableOpacity style={styles.addModalCloseIcon} onPress={handleClose}>
//               <Icon name="close" size={24} color={COLORS.textSecondary} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView contentContainerStyle={styles.addModalItemList}>
//             {selectedItems.length > 0 && (
//               <View style={styles.selectedItemContainer}>
//                 <Text style={styles.categoryHeader}>Выбранные элементы ({selectedItems.length}):</Text>
//                 {selectedItems.map((item) => (
//                   <View key={`${item.type}-${item.id}`}>{renderSelectedItem(item)}</View>
//                 ))}
//               </View>
//             )}
//             {categoryItems.length > 0 ? (
//               categoryItems.map((item) => (
//                 <View key={`${item.type}-${item.id}`}>{renderCategoryItem({ item })}</View>
//               ))
//             ) : (
//               <Text style={styles.addModalEmptyText}>Элементы не найдены</Text>
//             )}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const CreateEventScreen = ({ navigation,route }) => {
//   const selectedCategories = route?.params?.selectedCategories || [];

//   console.log('Данные с Предыдущего экрана= ',selectedCategories)
//   const dispatch = useDispatch();
//   const { token, user } = useSelector((state) => state.auth);

//   // const categories = [
//   //   'Ведущие',
//   //   'Кейтеринг',
//   //   'Алкоголь',
//   //   'Музыка',
//   //   'Ювелирные изделия',
//   //   'Тойбастар',
//   //   'Свадебные салоны',
//   //   'Транспорт',
//   //   'Добавить',
//   // ];

//   const categories=selectedCategories

//   const [data, setData] = useState({
//     restaurants: [],
//     clothing: [],
//     tamada: [],
//     programs: [],
//     traditionalGifts: [],
//     flowers: [],
//     cakes: [],
//     alcohol: [],
//     transport: [],
//     goods: [],
//   });
//   const [filteredData, setFilteredData] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [budget, setBudget] = useState('');
//   const [guestCount, setGuestCount] = useState('');
//   const [remainingBudget, setRemainingBudget] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [addItemModalVisible, setAddItemModalVisible] = useState(false);
//   const [categoryModalVisible, setCategoryModalVisible] = useState(false);
//   const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
//   const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
//   const [selectedCategoryType, setSelectedCategoryType] = useState('');
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [weddingName, setWeddingName] = useState('');
//   const [weddingDate, setWeddingDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [shouldFilter, setShouldFilter] = useState(false);

//   const scrollViewRef = useRef(null);

//   const fetchData = async () => {
//     if (!token || !user?.id) return;
//     setLoading(true);
//     try {
//       const responses = await Promise.all([
//         api.getRestaurants(),
//         api.getClothing(),
//         api.getTamada(),
//         api.getPrograms(),
//         api.getTraditionalGifts(),
//         api.getFlowers(),
//         api.getCakes(),
//         api.getAlcohol(),
//         api.getTransport(),
//         api.getGoods(token),
//       ]);

//       const userData = responses.map((response) => response.data);

//       const newData = {
//         restaurants: userData[0] || [],
//         clothing: userData[1] || [],
//         tamada: userData[2] || [],
//         programs: userData[3] || [],
//         traditionalGifts: userData[4] || [],
//         flowers: userData[5] || [],
//         cakes: userData[6] || [],
//         alcohol: userData[7] || [],
//         transport: userData[8] || [],
//         goods: userData[9] || [],
//       };
//       setData(newData);
//     } catch (error) {
//       console.error('Ошибка загрузки данных:', error);
//       alert('Ошибка загрузки данных. Попробуйте снова.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) navigation.navigate('Login');
//     else fetchData();
//   }, [token, user, navigation]);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', fetchData);
//     return unsubscribe;
//   }, [navigation, token, user]);

//   const handleBudgetChange = (value) => {
//     const filteredValue = value.replace(/[^0-9]/g, '');
//     if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
//       setBudget(filteredValue);
//       setShouldFilter(true);
//     }
//   };

//   const handleGuestCountChange = (value) => {
//     const filteredValue = value.replace(/[^0-9]/g, '');
//     if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
//       setGuestCount(filteredValue);
//       setShouldFilter(true);
//     }
//   };

//   const filterDataByBudget = useCallback(() => {
//     if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
//       alert('Пожалуйста, введите корректную сумму бюджета');
//       return;
//     }

//     if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
//       alert('Пожалуйста, введите корректное количество гостей');
//       return;
//     }

//     const budgetValue = parseFloat(budget);
//     const guests = parseFloat(guestCount);
//     let remaining = budgetValue;
//     const selectedItems = [];

//     const suitableRestaurants = data.restaurants.filter(
//       (restaurant) => parseFloat(restaurant.capacity) >= guests
//     );

//     if (suitableRestaurants.length === 0) {
//       alert('Нет ресторанов с достаточной вместимостью для указанного количества гостей');
//       return;
//     }

//     const sortedRestaurants = suitableRestaurants
//       .filter((r) => parseFloat(r.averageCost) <= remaining)
//       .sort((a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost));

//     if (sortedRestaurants.length === 0) {
//       alert('Нет ресторанов, подходящих под ваш бюджет');
//       return;
//     }

//     const selectedRestaurant = sortedRestaurants[Math.floor(sortedRestaurants.length / 2)];
//     const restaurantCost = parseFloat(selectedRestaurant.averageCost);
//     selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
//     remaining -= restaurantCost;

//     const types = [
//       { key: 'clothing', costField: 'cost', type: 'clothing' },
//       { key: 'tamada', costField: 'cost', type: 'tamada' },
//       { key: 'programs', costField: 'cost', type: 'program' },
//       { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
//       { key: 'flowers', costField: 'cost', type: 'flowers' },
//       { key: 'cakes', costField: 'cost', type: 'cake' },
//       { key: 'alcohol', costField: 'cost', type: 'alcohol' },
//       { key: 'transport', costField: 'cost', type: 'transport' },
//     ];

//     for (const { key, costField, type } of types) {
//       const items = data[key]
//         .filter((item) => parseFloat(item[costField]) <= remaining)
//         .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));

//       if (items.length > 0) {
//         const maxItemsToSelect = Math.min(2, items.length);
//         for (let i = 0; i < maxItemsToSelect; i++) {
//           const selectedItem = items[i];
//           const cost = parseFloat(selectedItem[costField]);
//           if (cost <= remaining) {
//             selectedItems.push({ ...selectedItem, type, totalCost: cost });
//             remaining -= cost;
//           }
//         }
//       }
//     }

//     setFilteredData(selectedItems);
//     setRemainingBudget(remaining);
//     setQuantities(
//       selectedItems.reduce((acc, item) => {
//         const itemKey = `${item.type}-${item.id}`;
//         return { ...acc, [itemKey]: '1' };
//       }, {})
//     );
//   }, [budget, guestCount, data]);

//   useEffect(() => {
//     if (shouldFilter && budget && guestCount && !isNaN(parseFloat(budget)) && !isNaN(parseFloat(guestCount))) {
//       filterDataByBudget();
//       setShouldFilter(false);
//     }
//   }, [budget, guestCount, filterDataByBudget, shouldFilter]);

//   const handleAddItem = useCallback(
//     (item) => {
//       const itemKey = `${item.type}-${item.id}`;
//       const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
  
//       setFilteredData((prev) => {
//         const existingItemIndex = prev.findIndex((i) => `${i.type}-${i.id}` === itemKey);
//         let updatedData;
//         let newQuantity;
  
//         if (existingItemIndex !== -1) {
//           const currentQuantity = quantities[itemKey] === '' ? '1' : quantities[itemKey] || '1';
//           newQuantity = (parseInt(currentQuantity) + 1).toString();
//           updatedData = [...prev];
//           updatedData[existingItemIndex] = {
//             ...updatedData[existingItemIndex],
//             totalCost: cost * parseInt(newQuantity),
//           };
//         } else {
//           newQuantity = '1';
//           const newItem = { ...item, totalCost: cost };
//           updatedData = [...prev, newItem];
//         }
  
//         setQuantities((prevQuantities) => ({
//           ...prevQuantities,
//           [itemKey]: newQuantity,
//         }));
  
//         const totalSpent = updatedData.reduce((sum, dataItem) => {
//           const key = `${dataItem.type}-${dataItem.id}`;
//           const itemQuantity = quantities[key] === '' ? 1 : parseInt(quantities[key] || '1');
//           const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
//           return sum + itemCost * itemQuantity;
//         }, 0);
  
//         setRemainingBudget(parseFloat(budget) - totalSpent);
//         return updatedData;
//       });
  
//       setCategoryModalVisible(false);
//     },
//     [quantities, budget, setCategoryModalVisible]
//   );

//   const handleRemoveItem = useCallback(
//     (item) => {
//       const itemKey = `${item.type}-${item.id}`;

//       setFilteredData((prev) => {
//         const updatedData = prev.filter((i) => `${i.type}-${i.id}` !== itemKey);

//         setQuantities((prevQuantities) => {
//           const updatedQuantities = { ...prevQuantities };
//           delete updatedQuantities[itemKey];
//           return updatedQuantities;
//         });

//         const totalSpent = updatedData.reduce((sum, dataItem) => {
//           const key = `${dataItem.type}-${dataItem.id}`;
//           const itemQuantity = parseInt(quantities[key] || '1');
//           const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
//           return sum + itemCost * itemQuantity;
//         }, 0);

//         setRemainingBudget(parseFloat(budget) - totalSpent);
//         return updatedData;
//       });
//     },
//     [quantities, budget]
//   );

//   const handleSubmit = async () => {
//     if (!weddingName.trim()) {
//       alert('Пожалуйста, укажите название свадьбы');
//       return;
//     }
//     if (!filteredData.length) {
//       alert('Пожалуйста, выберите хотя бы один элемент для свадьбы');
//       return;
//     }
//     if (!user?.id || !token) {
//       alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
//       navigation.navigate('Login');
//       return;
//     }

//     const dateString = weddingDate.toISOString().split('T')[0];
//     const weddingData = {
//       name: weddingName.trim(),
//       date: dateString,
//       host_id: user.id,
//       items: filteredData.map((item) => ({
//         id: item.id,
//         type: item.type,
//         quantity: parseInt(quantities[`${item.type}-${item.id}`] || '1'),
//         totalCost:
//           parseFloat(item.totalCost || (item.type === 'restaurant' ? item.averageCost : item.cost)) *
//           parseInt(quantities[`${item.type}-${item.id}`] || '1'),
//       })),
//     };

//     try {
//       await api.createWedding(weddingData, token);
//       alert('Свадьба успешно создана!');
//       setModalVisible(false);
//       setWeddingName('');
//       setWeddingDate(new Date());
//       setShowDatePicker(false);
//       setFilteredData([]);
//       setQuantities({});
//       setBudget('');
//       setGuestCount('');
//       setRemainingBudget(0);
//     } catch (error) {
//       console.error('Ошибка при создании свадьбы:', error);
//       alert('Ошибка: ' + (error.response?.data?.error || error.message));
//     }
//   };

//   const onDateChange = (day) => {
//     setWeddingDate(new Date(day.timestamp));
//     setShowDatePicker(false);
//   };

//   const combinedData = useMemo(() => {
//     const dataArray = [
//       ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
//       ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
//       ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
//       ...data.programs.map((item) => ({ ...item, type: 'program' })),
//       ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
//       ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
//       ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
//       ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
//       ...data.transport.map((item) => ({ ...item, type: 'transport' })),
//       ...data.goods.map((item) => ({ ...item, type: 'goods' })),
//     ].filter((item) => item.type !== 'goods' || item.category !== 'Прочее');
//     return dataArray.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
//   }, [data]);

//   const handleCategoryPress = (category) => {
//     const type = categoryToTypeMap[category];
//     if (!type) return;
//     const items = combinedData.filter((item) => item.type === type);
//     setSelectedCategoryItems(items);
//     setSelectedCategoryLabel(category);
//     setSelectedCategoryType(type);
//     setCategoryModalVisible(true);
//   };

//   const handleCloseCategoryModal = () => {
//     setCategoryModalVisible(false);
//     setSelectedCategoryItems([]);
//     setSelectedCategoryLabel('');
//     setSelectedCategoryType('');
//   };

//   const calculateTotalCost = () => {
//     return filteredData.reduce((sum, item) => {
//       const quantity = parseInt(quantities[`${item.type}-${item.id}`] || '1');
//       const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
//       return sum + cost * quantity;
//     }, 0);
//   };

//   const renderCategory = (item) => {
//     if (item === 'Добавить') {
//       return (
//         <TouchableOpacity style={styles.categoryButton} onPress={() => setAddItemModalVisible(true)}>
//           <LinearGradient
//             colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
//             style={styles.categoryButtonGradient}
//           >
//             <Icon name="add" size={24} color={COLORS.white} />
//             <Text style={styles.categoryText}>Добавить</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       );
//     }
//     return (
//       <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress(item)}>
//         <LinearGradient
//           colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
//           style={styles.categoryButtonGradient}
//         >
//           <Text style={styles.categoryText}>{item}</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     );
//   };

//   const handleGoBack = () => {
//     // Передаём обновлённый список категорий обратно
//     navigation.navigate('BeforeHomeScreen', {
//       selectedCategories: categories,
//     });
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <LinearGradient
//         colors={['#F1EBDD', '#897066']}
//         start={{ x: 0, y: 1 }}
//         end={{ x: 0, y: 0 }}
//         style={styles.splashContainer}
//       >
//         <View style={styles.headerContainer}>
//           <TouchableOpacity style={styles.headerButton}>
//             <Text style={styles.headerText}>Свадьба</Text>
//             <Icon name="arrow-drop-down" size={24} color="#FFF" />
//           </TouchableOpacity>
//           <View style={styles.budgetContainer}>
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
//           </View>
//         </View>

//         <View style={styles.logoContainer}>
//           <Image
//             source={require('../../assets/kazanRevert.png')}
//             style={styles.potIcon}
//             resizeMode="contain"
//           />
//         </View>

//         <View style={styles.listContainer}>
//           {loading ? (
//             <ActivityIndicator size="large" color={COLORS.primary} />
//           ) : (
//             <ScrollView
//               ref={scrollViewRef}
//               style={styles.scrollView}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.categoryGrid}>
//                 {categories.map((item, index) => (
//                   <View key={index} style={styles.categoryItem}>
//                     {renderCategory(item)}
//                   </View>
//                 ))}
//               </View>
//               <View style={styles.bottomPadding} />
//             </ScrollView>
//           )}
//         </View>



//         <View style={styles.bottomContainer}>
//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nextButton}>
//             <Text style={styles.nextButtonText}>Далее</Text>
//           </TouchableOpacity>
//          <TouchableOpacity
//             style={styles.nextButton}
//             onPress={handleGoBack}
//           >
//             <Text style={styles.nextButtonText}>Назад</Text>
//           </TouchableOpacity>
//         </View>




//         <AddItemModal
//           visible={addItemModalVisible}
//           onClose={() => setAddItemModalVisible(false)}
//           filteredItems={combinedData}
//           filteredData={filteredData}
//           handleAddItem={handleAddItem}
//           setDetailsModalVisible={setDetailsModalVisible}
//           setSelectedItem={setSelectedItem}
//           quantities={quantities}
//         />

//         <CategoryItemsModal
//           visible={categoryModalVisible}
//           onClose={handleCloseCategoryModal}
//           categoryItems={selectedCategoryItems}
//           categoryLabel={selectedCategoryLabel}
//           categoryType={selectedCategoryType}
//           filteredData={filteredData}
//           handleAddItem={handleAddItem}
//           handleRemoveItem={handleRemoveItem}
//           setDetailsModalVisible={setDetailsModalVisible}
//           setSelectedItem={setSelectedItem}
//           quantities={quantities}
//           setQuantities={setQuantities}
//           budget={budget}
//           setFilteredData={setFilteredData}
//           setRemainingBudget={setRemainingBudget}
//         />

//         <Modal
//           visible={detailsModalVisible}
//           transparent
//           animationType="fade"
//           onRequestClose={() => {
//             setDetailsModalVisible(false);
//             setSelectedItem(null);
//           }}
//         >
//           <SafeAreaView style={styles.modalOverlay}>
//             <Animatable.View style={styles.detailsModalContainer} animation="zoomIn" duration={300}>
//               <View style={styles.detailsModalHeader}>
//                 <Text style={styles.detailsModalTitle}>Подробности</Text>
//                 <TouchableOpacity
//                   style={styles.detailsModalCloseIcon}
//                   onPress={() => {
//                     setDetailsModalVisible(false);
//                     setSelectedItem(null);
//                   }}
//                 >
//                   <Icon name="close" size={24} color={COLORS.textSecondary} />
//                 </TouchableOpacity>
//               </View>
//               {selectedItem ? (
//                 <View style={styles.detailsModalContent}>
//                   {(() => {
//                     switch (selectedItem.type) {
//                       case 'restaurant':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Ресторан</Text>
//                             <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
//                             <Text style={styles.detailsModalText}>Вместимость: {selectedItem.capacity}</Text>
//                             <Text style={styles.detailsModalText}>Кухня: {selectedItem.cuisine}</Text>
//                             <Text style={styles.detailsModalText}>Средний чек: {selectedItem.averageCost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address || 'Не указан'}</Text>
//                           </>
//                         );
//                       case 'clothing':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Одежда</Text>
//                             <Text style={styles.detailsModalText}>Магазин: {selectedItem.storeName}</Text>
//                             <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
//                             <Text style={styles.detailsModalText}>Пол: {selectedItem.gender}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'flowers':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Цветы</Text>
//                             <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
//                             <Text style={styles.detailsModalText}>Цветы: {selectedItem.flowerName}</Text>
//                             <Text style={styles.detailsModalText}>Тип цветов: {selectedItem.flowerType}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'cake':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Торты</Text>
//                             <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
//                             <Text style={styles.detailsModalText}>Тип торта: {selectedItem.cakeType}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'alcohol':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Алкоголь</Text>
//                             <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
//                             <Text style={styles.detailsModalText}>Напиток: {selectedItem.alcoholName}</Text>
//                             <Text style={styles.detailsModalText}>Категория: {selectedItem.category}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'program':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Программа</Text>
//                             <Text style={styles.detailsModalText}>Команда: {selectedItem.teamName}</Text>
//                             <Text style={styles.detailsModalText}>Тип программы: {selectedItem.type}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                           </>
//                         );
//                       case 'tamada':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Тамада</Text>
//                             <Text style={styles.detailsModalText}>Имя: {selectedItem.name}</Text>
//                             <Text style={styles.detailsModalText}>Портфолио: {selectedItem.portfolio}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                           </>
//                         );
//                       case 'traditionalGift':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Традиционные подарки</Text>
//                             <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
//                             <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
//                             <Text style={styles.detailsModalText}>Тип: {selectedItem.type}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'transport':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Транспорт</Text>
//                             <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
//                             <Text style={styles.detailsModalText}>Авто: {selectedItem.carName}</Text>
//                             <Text style={styles.detailsModalText}>Марка: {selectedItem.brand}</Text>
//                             <Text style={styles.detailsModalText}>Цвет: {selectedItem.color}</Text>
//                             <Text style={styles.detailsModalText}>Телефон: {selectedItem.phone}</Text>
//                             <Text style={styles.detailsModalText}>Район: {selectedItem.district}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                             <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
//                           </>
//                         );
//                       case 'goods':
//                         return (
//                           <>
//                             <Text style={styles.detailsModalText}>Тип: Товар</Text>
//                             <Text style={styles.detailsModalText}>Название: {selectedItem.item_name}</Text>
//                             <Text style={styles.detailsModalText}>Описание: {selectedItem.description || 'Не указано'}</Text>
//                             <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
//                           </>
//                         );
//                       default:
//                         return <Text style={styles.detailsModalText}>Неизвестный тип</Text>;
//                     }
//                   })()}
//                 </View>
//               ) : (
//                 <Text style={styles.detailsModalText}>Нет данных для отображения</Text>
//               )}
//             </Animatable.View>
//           </SafeAreaView>
//         </Modal>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             setModalVisible(false);
//             setWeddingName('');
//             setWeddingDate(new Date());
//             setShowDatePicker(false);
//           }}
//         >
//           <SafeAreaView style={styles.modalOverlay}>
//             <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
//               <ScrollView contentContainerStyle={styles.scrollViewContent}>
//                 <View style={styles.modalHeader}>
//                   <Text style={styles.modalTitle}>Создание мероприятия "Свадьба"</Text>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setModalVisible(false);
//                       setWeddingName('');
//                       setWeddingDate(new Date());
//                       setShowDatePicker(false);
//                     }}
//                   >
//                     <Icon name="close" size={24} color={COLORS.textSecondary} />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.inputContainer}>
//                   <Icon name="event-note" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
//                     value={weddingName}
//                     onChangeText={setWeddingName}
//                     placeholderTextColor={COLORS.textSecondary}
//                   />
//                 </View>
//                 <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
//                   <Icon name="calendar-today" size={20} color={COLORS.secondary} style={styles.buttonIcon} />
//                   <Text style={styles.dateButtonText}>
//                     {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
//                   </Text>
//                 </TouchableOpacity>
//                 {showDatePicker && (
//                   <Calendar
//                     style={styles.calendar}
//                     current={weddingDate.toISOString().split('T')[0]}
//                     onDayPress={onDateChange}
//                     minDate={new Date().toISOString().split('T')[0]}
//                     theme={{
//                       selectedDayBackgroundColor: COLORS.primary,
//                       todayTextColor: COLORS.accent,
//                       arrowColor: COLORS.secondary,
//                       textDayFontSize: 16,
//                       textMonthFontSize: 18,
//                       textDayHeaderFontSize: 14,
//                     }}
//                   />
//                 )}
//                 <Text style={styles.subtitle}>Выбранные элементы:</Text>
//                 <View style={styles.itemsContainer}>
//                   {filteredData.length > 0 ? (
//                     Object.entries(
//                       filteredData.reduce((acc, item) => {
//                         const type = item.type;
//                         if (!acc[type]) acc[type] = [];
//                         acc[type].push(item);
//                         return acc;
//                       }, {})
//                     )
//                       .sort(([typeA], [typeB]) => (typeOrder[typeA] || 11) - (typeOrder[typeB] || 11))
//                       .map(([type, items]) => (
//                         <View key={type}>
//                           <Text style={styles.categoryHeader}>
//                             {typesMapping.find((t) => t.type === type)?.label || type} ({items.length})
//                           </Text>
//                           {items.map((item) => {
//                             const quantity = parseInt(quantities[`${item.type}-${item.id}`] || '1');
//                             const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
//                             const totalItemCost = cost * quantity;
//                             return (
//                               <View key={`${item.type}-${item.id}`} style={styles.itemContainer}>
//                                 <Icon
//                                   name={
//                                     item.type === 'restaurant'
//                                       ? 'restaurant'
//                                       : item.type === 'clothing'
//                                       ? 'store'
//                                       : item.type === 'tamada'
//                                       ? 'mic'
//                                       : item.type === 'program'
//                                       ? 'event'
//                                       : item.type === 'traditionalGift'
//                                       ? 'card-giftcard'
//                                       : item.type === 'flowers'
//                                       ? 'local-florist'
//                                       : item.type === 'cake'
//                                       ? 'cake'
//                                       : item.type === 'alcohol'
//                                       ? 'local-drink'
//                                       : item.type === 'transport'
//                                       ? 'directions-car'
//                                       : 'shopping-bag'
//                                   }
//                                   size={18}
//                                   color={COLORS.primary}
//                                   style={styles.itemIcon}
//                                 />
//                                 <Text style={styles.itemText}>
//                                   {(() => {
//                                     switch (item.type) {
//                                       case 'restaurant':
//                                         return `${item.name} (${item.cuisine}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'clothing':
//                                         return `${item.itemName} (${item.storeName}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'tamada':
//                                         return `${item.name} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'program':
//                                         return `${item.teamName} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'traditionalGift':
//                                         return `${item.itemName} (${item.salonName || 'Не указано'}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'flowers':
//                                         return `${item.flowerName} (${item.flowerType}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'cake':
//                                         return `${item.name} (${item.cakeType}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'alcohol':
//                                         return `${item.alcoholName} (${item.category}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'transport':
//                                         return `${item.carName} (${item.brand}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       case 'goods':
//                                         return `${item.item_name} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
//                                       default:
//                                         return 'Неизвестный элемент';
//                                     }
//                                   })()}
//                                 </Text>
//                               </View>
//                             );
//                           })}
//                         </View>
//                       ))
//                   ) : (
//                     <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
//                   )}
//                 </View>
//                 <View style={styles.totalContainer}>
//                   <Icon name="attach-money" size={20} color={COLORS.accent} style={styles.totalIcon} />
//                   <Text style={styles.totalText}>Общая стоимость: {calculateTotalCost()} тг</Text>
//                 </View>
//                 <View style={styles.modalButtonContainer}>
//                   <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleSubmit}>
//                     <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                     <Text style={styles.modalButtonText}>Создать свадьбу</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => {
//                       setModalVisible(false);
//                       setWeddingName('');
//                       setWeddingDate(new Date());
//                       setShowDatePicker(false);
//                     }}
//                   >
//                     <Icon name="close" size={20} color={COLORS.white} style={styles.buttonIcon} />
//                     <Text style={styles.modalButtonText}>Закрыть</Text>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </Animatable.View>
//           </SafeAreaView>
//         </Modal>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   splashContainer: { flex: 1 },
//   headerContainer: {
//     paddingHorizontal: 20,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
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
//   listContainer: { flex: 1, paddingHorizontal: 20 },
//   scrollView: { flex: 1 },
//   categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   categoryItem: { width: '33.33%', padding: 5, alignItems: 'center', justifyContent: 'center' },
//   categoryButton: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 100,
//     overflow: 'hidden',
//     shadowColor: COLORS.shadow,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.5,
//     shadowRadius: 8,
//     elevation: 5,
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
//   bottomContainer: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: 'transparent' },
//   nextButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   nextButtonText: { fontSize: 18, color: COLORS.white, fontWeight: '600' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
//   addModalContainer: {
//     backgroundColor: COLORS.card,
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: SCREEN_HEIGHT * 0.8,
//     padding: 20,
//     shadowColor: COLORS.shadow,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//     flex: 1,
//   },
//   addModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   addModalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
//   addModalCloseIcon: { padding: 5 },
//   addModalSearchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F7F7F7',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//   },
//   addModalSearchIcon: { marginRight: 10 },
//   addModalSearchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary },
//   addModalClearIcon: { padding: 5 },
//   addModalFilterScroll: { maxHeight: SCREEN_HEIGHT * 0.2, marginBottom: 15 },
//   addModalFilterContainer: { paddingBottom: 10 },
//   addModalFilterLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
//   addModalTypeFilterContainer: { marginBottom: 15 },
//   addModalTypeButtons: { flexDirection: 'row', flexWrap: 'wrap' },
//   addModalTypeButton: {
//     backgroundColor: '#F7F7F7',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   addModalTypeButtonActive: { backgroundColor: COLORS.primary },
//   addModalTypeButtonText: { fontSize: 14, color: COLORS.textPrimary },
//   addModalTypeButtonTextActive: { color: COLORS.white },
//   addModalDistrictFilterContainer: { marginBottom: 15 },
//   addModalDistrictButtons: { flexDirection: 'row', flexWrap: 'wrap' },
//   addModalDistrictButton: {
//     backgroundColor: '#F7F7F7',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   addModalDistrictButtonActive: { backgroundColor: COLORS.primary },
//   addModalDistrictButtonText: { fontSize: 14, color: COLORS.textPrimary },
//   addModalDistrictButtonTextActive: { color: COLORS.white },
//   addModalPriceFilterContainer: { marginBottom: 15 },
//   addModalPriceButtons: { flexDirection: 'row', flexWrap: 'wrap' },
//   addModalPriceButton: {
//     backgroundColor: '#F7F7F7',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   addModalPriceButtonActive: { backgroundColor: COLORS.primary },
//   addModalPriceButtonText: { fontSize: 14, color: COLORS.textPrimary },
//   addModalPriceButtonTextActive: { color: COLORS.white },
//   addModalScrollView: { flex: 1, minHeight: 100 },
//   addModalItemList: { paddingBottom: 20, flexGrow: 1 },
//   addModalItemCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F7F7F7',
//     borderRadius: 10,
//     marginBottom: 10,
//     padding: 10,
//   },
//   selectedItemCard: { backgroundColor: '#E6F0FA' },
//   addModalItemContent: { flex: 1 },
//   disabledItemContent: { opacity: 0.5 },
//   addModalItemText: { fontSize: 14, color: COLORS.textPrimary },
//   addModalItemCount: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
//   addModalDetailsButton: {
//     backgroundColor: COLORS.secondary,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   addModalDetailsButtonText: { fontSize: 12, color: COLORS.white },
//   addModalEmptyText: { fontSize: 14, textAlign: 'center', marginTop: 20 },
// selectedItemContainer: { marginBottom: 20 },
// quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
// quantityLabel: { fontSize: 12, color: COLORS.textSecondary, marginRight: 5 },
// quantityInput: {
// width: 50,
// padding: 5,
// borderWidth: 1,
// borderColor: COLORS.textSecondary,
// borderRadius: 5,
// fontSize: 12,
// color: COLORS.textPrimary,
// marginRight: 10,
// },
// totalCostText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
// removeButton: {
// backgroundColor: COLORS.error,
// paddingVertical: 6,
// paddingHorizontal: 12,
// borderRadius: 8,
// marginRight: 10,
// },
// removeButtonText: { fontSize: 12, color: COLORS.white },
// modalContent: {
// backgroundColor: COLORS.card,
// borderRadius: 20,
// width: '90%',
// maxHeight: SCREEN_HEIGHT * 0.8,
// padding: 20,
// shadowColor: COLORS.shadow,
// shadowOffset: { width: 0, height: 5 },
// shadowOpacity: 0.3,
// shadowRadius: 10,
// elevation: 5,
// },
// scrollViewContent: { paddingBottom: 20 },
// modalHeader: {
// flexDirection: 'row',
// justifyContent: 'space-between',
// alignItems: 'center',
// marginBottom: 20,
// },
// modalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
// inputContainer: {
// flexDirection: 'row',
// alignItems: 'center',
// backgroundColor: '#F7F7F7',
// borderRadius: 10,
// paddingHorizontal: 15,
// marginBottom: 15,
// },
// inputIcon: { marginRight: 10 },
// input: { flex: 1, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary },
// dateButton: {
// flexDirection: 'row',
// alignItems: 'center',
// backgroundColor: '#F7F7F7',
// paddingVertical: 12,
// paddingHorizontal: 15,
// borderRadius: 10,
// marginBottom: 15,
// },
// buttonIcon: { marginRight: 10 },
// dateButtonText: { fontSize: 16, color: COLORS.textPrimary },
// calendar: { marginBottom: 15, borderRadius: 10, elevation: 2 },
// subtitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
// itemsContainer: { marginBottom: 20 },
// categoryHeader: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary, marginVertical: 10 },
// itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
// itemIcon: { marginRight: 10 },
// itemText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },
// noItems: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
// totalContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
// totalIcon: { marginRight: 10 },
// totalText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
// modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
// modalButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
// confirmButton: { backgroundColor: COLORS.primary },
// cancelButton: { backgroundColor: COLORS.error },
// modalButtonText: { fontSize: 16, color: COLORS.white, fontWeight: '600' },
// detailsModalContainer: {
// backgroundColor: COLORS.card,
// borderRadius: 20,
// width: '90%',
// padding: 20,
// shadowColor: COLORS.shadow,
// shadowOffset: { width: 0, height: 5 },
// shadowOpacity: 0.3,
// shadowRadius: 10,
// elevation: 5,
// },
// detailsModalHeader: {
// flexDirection: 'row',
// justifyContent: 'space-between',
// alignItems: 'center',
// marginBottom: 15,
// },
// detailsModalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
// detailsModalCloseIcon: { padding: 5 },
// detailsModalContent: { marginBottom: 20 },
// detailsModalText: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 8 },
// });

// export default CreateEventScreen;



import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const typeOrder = {
  restaurant: 1,
  clothing: 2,
  tamada: 3,
  program: 4,
  traditionalGift: 5,
  flowers: 6,
  transport: 7,
  cake: 8,
  alcohol: 9,
  goods: 10,
};

const typesMapping = [
  { key: 'clothing', costField: 'cost', type: 'clothing', label: 'Одежда' },
  { key: 'tamada', costField: 'cost', type: 'tamada', label: 'Тамада' },
  { key: 'programs', costField: 'cost', type: 'program', label: 'Программа' },
  { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift', label: 'Традиционные подарки' },
  { key: 'flowers', costField: 'cost', type: 'flowers', label: 'Цветы' },
  { key: 'cakes', costField: 'cost', type: 'cake', label: 'Торты' },
  { key: 'alcohol', costField: 'cost', type: 'alcohol', label: 'Алкоголь' },
  { key: 'transport', costField: 'cost', type: 'transport', label: 'Транспорт' },
  { key: 'restaurants', costField: 'averageCost', type: 'restaurant', label: 'Ресторан' },
];

const categoryToTypeMap = {
  'Ведущие': 'tamada',
  'Кейтеринг': 'restaurant',
  'Алкоголь': 'alcohol',
  'Музыка': 'program',
  'Ювелирные изделия': 'none',
  'Тойбастар': 'traditionalGift',
  'Свадебные салоны': 'clothing',
  'Транспорт': 'transport',
  // 'Добавить':'функциональная кнопка'

};

// Обратное отображение type в категорию
const typeToCategoryMap = Object.fromEntries(
  Object.entries(categoryToTypeMap).map(([category, type]) => [type, category])
);

// Модальное окно для добавления элементов
const AddItemModal = ({ visible, onClose, filteredItems, filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem, quantities, updateCategories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [costRange, setCostRange] = useState('all');

  const uniqueTypes = useMemo(() => {
    const types = [
      { type: 'all', label: 'Все' },
      ...filteredItems
        .map((item) => ({
          type: item.type,
          label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
        }))
        .filter((value, index, self) => self.findIndex((t) => t.type === value.type) === index)
        .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)),
    ];
    return types;
  }, [filteredItems]);

  const districts = useMemo(() => ['all', ...new Set(filteredItems.map((item) => String(item.district)).filter(Boolean))], [filteredItems]);

  const filteredDataMemo = useMemo(() => {
    let result = filteredItems;
    if (searchQuery) {
      result = result.filter((item) =>
        [
          item.name,
          item.itemName,
          item.flowerName,
          item.alcoholName,
          item.carName,
          item.teamName,
          item.salonName,
          item.storeName,
          item.address,
          item.phone,
          item.cuisine,
          item.category,
          item.brand,
          item.gender,
          item.portfolio,
          item.cakeType,
          item.flowerType,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedTypeFilter !== 'all') {
      result = result.filter((item) => item.type === selectedTypeFilter);
    }
    if (selectedDistrict !== 'all') {
      result = result.filter((item) => String(item.district) === selectedDistrict);
    }
    if (costRange !== 'all') {
      result = result.filter((item) => {
        const cost = item.averageCost || item.cost;
        if (costRange === '0-10000') return cost <= 10000;
        if (costRange === '10000-50000') return cost > 10000 && cost <= 50000;
        if (costRange === '50000+') return cost > 50000;
        return true;
      });
    }
    return result.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
  }, [filteredItems, searchQuery, selectedTypeFilter, selectedDistrict, costRange]);

  const renderAddItem = useCallback(
    ({ item }) => {
      const count = filteredData.filter(
        (selectedItem) => `${selectedItem.type}-${selectedItem.id}` === `${item.type}-${item.id}`
      ).length;
      if (item.type === 'goods' && item.category === 'Прочее') return null;
      const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
      let title;
      switch (item.type) {
        case 'restaurant':
          title = `Ресторан: ${item.name} (${cost} ₸)`;
          break;
        case 'clothing':
          title = `Одежда: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        case 'flowers':
          title = `Цветы: ${item.salonName} - ${item.flowerName} (${cost} ₸)`;
          break;
        case 'cake':
          title = `Торты: ${item.name} (${cost} ₸)`;
          break;
        case 'alcohol':
          title = `Алкоголь: ${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
          break;
        case 'program':
          title = `Программа: ${item.teamName} (${cost} ₸)`;
          break;
        case 'tamada':
          title = `Тамада: ${item.name} (${cost} ₸)`;
          break;
        case 'traditionalGift':
          title = `Традиц. подарки: ${item.salonName} - ${item.itemName} (${cost} ₸)`;
          break;
        case 'transport':
          title = `Транспорт: ${item.salonName} - ${item.carName} (${cost} ₸)`;
          break;
        case 'goods':
          title = `Товар: ${item.item_name} (${cost} ₸)`;
          break;
        default:
          title = 'Неизвестный элемент';
      }
      return (
        <View style={styles.addModalItemCard}>
          <TouchableOpacity
            style={styles.addModalItemContent}
            onPress={() => {
              handleAddItem(item);
              // Добавляем категорию в список, если её ещё нет
              const category = typeToCategoryMap[item.type];
              if (category) {
                updateCategories(category);
              }
            }}
          >
            <Text style={styles.addModalItemText}>{title}</Text>
            {count > 0 && (
              <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addModalDetailsButton}
            onPress={() => {
              setSelectedItem(item);
              setDetailsModalVisible(true);
              onClose();
            }}
          >
            <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [filteredData, handleAddItem, setDetailsModalVisible, setSelectedItem, onClose, updateCategories]
  );

  const closeModal = () => {
    setSearchQuery('');
    setSelectedTypeFilter('all');
    setSelectedDistrict('all');
    setCostRange('all');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.addModalContainer}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>Добавить элемент</Text>
            <TouchableOpacity style={styles.addModalCloseIcon} onPress={closeModal}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.addModalSearchContainer}>
            <Icon name="search" size={20} color={COLORS.textSecondary} style={styles.addModalSearchIcon} />
            <TextInput
              style={styles.addModalSearchInput}
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.addModalClearIcon} onPress={() => setSearchQuery('')}>
                <Icon name="clear" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.addModalFilterScroll}
            contentContainerStyle={styles.addModalFilterContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.addModalTypeFilterContainer}>
              <Text style={styles.addModalFilterLabel}>Тип</Text>
              <View style={styles.addModalTypeButtons}>
                {uniqueTypes.map((typeObj) => (
                  <TouchableOpacity
                    key={typeObj.type}
                    style={[
                      styles.addModalTypeButton,
                      selectedTypeFilter === typeObj.type && styles.addModalTypeButtonActive,
                    ]}
                    onPress={() => setSelectedTypeFilter(typeObj.type)}
                  >
                    <Text
                      style={[
                        styles.addModalTypeButtonText,
                        selectedTypeFilter === typeObj.type && styles.addModalTypeButtonTextActive,
                      ]}
                    >
                      {typeObj.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.addModalDistrictFilterContainer}>
              <Text style={styles.addModalFilterLabel}>Район</Text>
              <View style={styles.addModalDistrictButtons}>
                {districts.map((district) => (
                  <TouchableOpacity
                    key={district}
                    style={[
                      styles.addModalDistrictButton,
                      selectedDistrict === district && styles.addModalDistrictButtonActive,
                    ]}
                    onPress={() => setSelectedDistrict(district)}
                  >
                    <Text
                      style={[
                        styles.addModalDistrictButtonText,
                        selectedDistrict === district && styles.addModalDistrictButtonTextActive,
                      ]}
                    >
                      {district === 'all' ? 'Все' : district}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.addModalPriceFilterContainer}>
              <Text style={styles.addModalFilterLabel}>Цена</Text>
              <View style={styles.addModalPriceButtons}>
                {[
                  { label: 'Все', value: 'all' },
                  { label: '0-10k', value: '0-10000' },
                  { label: '10k-50k', value: '10000-50000' },
                  { label: '50k+', value: '50000+' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.addModalPriceButton,
                      costRange === option.value && styles.addModalPriceButtonActive,
                    ]}
                    onPress={() => setCostRange(option.value)}
                  >
                    <Text
                      style={[
                        styles.addModalPriceButtonText,
                        costRange === option.value && styles.addModalPriceButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <FlatList
            data={filteredDataMemo}
            renderItem={renderAddItem}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            showsVerticalScrollIndicator={true}
            style={styles.addModalScrollView}
            contentContainerStyle={styles.addModalItemList}
            ListEmptyComponent={
              <Text style={styles.addModalEmptyText}>Ничего не найдено</Text>
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Модальное окно для отображения элементов категории
const CategoryItemsModal = ({
  visible,
  onClose,
  categoryItems,
  categoryLabel,
  categoryType,
  filteredData,
  handleAddItem,
  handleRemoveItem,
  setDetailsModalVisible,
  setSelectedItem,
  quantities,
  setQuantities,
  budget,
  setFilteredData,
  setRemainingBudget,
  updateCategories,
}) => {
  const selectedItems = filteredData.filter((item) => item.type === categoryType);

  const renderCategoryItem = useCallback(
    ({ item }) => {
      const isSelected = selectedItems.some(
        (selected) => `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
      );
      const count = selectedItems.filter(
        (selected) => `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
      ).length;
      const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
      let title;
      switch (item.type) {
        case 'restaurant':
          title = `${item.name} (${cost} ₸)`;
          break;
        case 'clothing':
          title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        case 'flowers':
          title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
          break;
        case 'cake':
          title = `${item.name} (${cost} ₸)`;
          break;
        case 'alcohol':
          title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
          break;
        case 'program':
          title = `${item.teamName} (${cost} ₸)`;
          break;
        case 'tamada':
          title = `${item.name} (${cost} ₸)`;
          break;
        case 'traditionalGift':
          title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
          break;
        case 'transport':
          title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
          break;
        case 'goods':
          title = `${item.item_name} (${cost} ₸)`;
          break;
        default:
          title = 'Неизвестный элемент';
      }
      return (
        <View style={styles.addModalItemCard}>
          <TouchableOpacity
            style={[styles.addModalItemContent, isSelected && styles.disabledItemContent]}
            onPress={() => {
              if (!isSelected) {
                handleAddItem(item);
                const category = typeToCategoryMap[item.type];
                if (category) {
                  updateCategories(category);
                }
              }
            }}
            disabled={isSelected}
          >
            <Text style={styles.addModalItemText}>{title}</Text>
            {count > 0 && <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addModalDetailsButton}
            onPress={() => {
              setSelectedItem(item);
              setDetailsModalVisible(true);
              onClose();
            }}
          >
            <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [handleAddItem, setDetailsModalVisible, setSelectedItem, onClose, selectedItems, updateCategories]
  );

  const renderSelectedItem = useCallback(
    (item) => {
      const itemKey = `${item.type}-${item.id}`;
      const quantity = quantities[itemKey] || '1';
      const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
      const parsedQuantityForCalc = quantity === '' ? 1 : parseInt(quantity) || 1;
      const totalCost = cost * parsedQuantityForCalc;

      const handleQuantityChange = (value) => {
        const filteredValue = value.replace(/[^0-9]/g, '');
        const updatedQuantities = { ...quantities, [itemKey]: filteredValue };
        setQuantities(updatedQuantities);

        const quantityForCalc = filteredValue === '' ? 1 : parseInt(filteredValue) || 1;
        const updatedFilteredData = filteredData.map((dataItem) => {
          if (`${dataItem.type}-${dataItem.id}` === itemKey) {
            return { ...dataItem, totalCost: cost * quantityForCalc };
          }
          return dataItem;
        });
        setFilteredData(updatedFilteredData);

        const totalSpent = updatedFilteredData.reduce((sum, dataItem) => {
          const key = `${dataItem.type}-${dataItem.id}`;
          const itemQuantity = updatedQuantities[key] === '' ? 1 : parseInt(updatedQuantities[key] || '1');
          const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);
        setRemainingBudget(parseFloat(budget) - totalSpent);
      };

      const handleBlur = () => {
        if (quantities[itemKey] === '') {
          const updatedQuantities = { ...quantities, [itemKey]: '1' };
          setQuantities(updatedQuantities);

          const updatedFilteredData = filteredData.map((dataItem) => {
            if (`${dataItem.type}-${dataItem.id}` === itemKey) {
              return { ...dataItem, totalCost: cost * 1 };
            }
            return dataItem;
          });
        setFilteredData(updatedFilteredData);

        const totalSpent = updatedFilteredData.reduce((sum, dataItem) => {
          const key = `${dataItem.type}-${dataItem.id}`;
          const itemQuantity = updatedQuantities[key] === '' ? 1 : parseInt(updatedQuantities[key] || '1');
          const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);
        setRemainingBudget(parseFloat(budget) - totalSpent);
      }
    };

    let title;
    switch (item.type) {
      case 'restaurant':
        title = `${item.name} (${cost} ₸)`;
        break;
      case 'clothing':
        title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
        break;
      case 'flowers':
        title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
        break;
      case 'cake':
        title = `${item.name} (${cost} ₸)`;
        break;
      case 'alcohol':
        title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
        break;
      case 'program':
        title = `${item.teamName} (${cost} ₸)`;
        break;
      case 'tamada':
        title = `${item.name} (${cost} ₸)`;
        break;
      case 'traditionalGift':
        title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
        break;
      case 'transport':
        title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
        break;
      case 'goods':
        title = `${item.item_name} (${cost} ₸)`;
        break;
      default:
        title = 'Неизвестный элемент';
    }

    return (
      <View style={[styles.addModalItemCard, styles.selectedItemCard]}>
        <View style={styles.addModalItemContent}>
          <Text style={styles.addModalItemText}>Выбрано: {title}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Количество:</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={handleQuantityChange}
              onBlur={handleBlur}
              keyboardType="numeric"
              placeholder="1"
            />
            <Text style={styles.totalCostText}>Итого: {totalCost} ₸</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item)}>
          <Text style={styles.removeButtonkowymText}>Убрать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addModalDetailsButton}
          onPress={() => {
            setSelectedItem(item);
            setDetailsModalVisible(true);
            onClose();
          }}
        >
          <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
        </TouchableOpacity>
      </View>
    );
  },
  [
    quantities,
    filteredData,
    budget,
    handleRemoveItem,
    setDetailsModalVisible,
    setSelectedItem,
    onClose,
    setQuantities,
    setFilteredData,
    setRemainingBudget,
  ]
);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.addModalContainer}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>{categoryLabel}</Text>
            <TouchableOpacity style={styles.addModalCloseIcon} onPress={handleClose}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.addModalItemList}>
            {selectedItems.length > 0 && (
              <View style={styles.selectedItemContainer}>
                <Text style={styles.categoryHeader}>Выбранные элементы ({selectedItems.length}):</Text>
                {selectedItems.map((item) => (
                  <View key={`${item.type}-${item.id}`}>{renderSelectedItem(item)}</View>
                ))}
              </View>
            )}
            {categoryItems.length > 0 ? (
              categoryItems.map((item) => (
                <View key={`${item.type}-${item.id}`}>{renderCategoryItem({ item })}</View>
              ))
            ) : (
              <Text style={styles.addModalEmptyText}>Элементы не найдены</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const CreateEventScreen = ({ navigation, route }) => {
  const selectedCategories = route?.params?.selectedCategories || [];
  console.log('Данные с Предыдущего экрана=', selectedCategories);

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  // Состояние для категорий, которое может обновляться
  const [categories, setCategories] = useState(selectedCategories);

  const [data, setData] = useState({
    restaurants: [],
    clothing: [],
    tamada: [],
    programs: [],
    traditionalGifts: [],
    flowers: [],
    cakes: [],
    alcohol: [],
    transport: [],
    goods: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState('');
  const [selectedCategoryType, setSelectedCategoryType] = useState('');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [weddingName, setWeddingName] = useState('');
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shouldFilter, setShouldFilter] = useState(false);

  const scrollViewRef = useRef(null);

  // Функция для обновления списка категорий
  const updateCategories = useCallback((newCategory) => {
    setCategories((prevCategories) => {
      if (!prevCategories.includes(newCategory)) {
        return [...prevCategories, newCategory];
      }
      return prevCategories;
    });
  }, []);

  const fetchData = async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    try {
      const responses = await Promise.all([
        api.getRestaurants(),
        api.getClothing(),
        api.getTamada(),
        api.getPrograms(),
        api.getTraditionalGifts(),
        api.getFlowers(),
        api.getCakes(),
        api.getAlcohol(),
        api.getTransport(),
        api.getGoods(token),
      ]);

      const userData = responses.map((response) => response.data);

      const newData = {
        restaurants: userData[0] || [],
        clothing: userData[1] || [],
        tamada: userData[2] || [],
        programs: userData[3] || [],
        traditionalGifts: userData[4] || [],
        flowers: userData[5] || [],
        cakes: userData[6] || [],
        alcohol: userData[7] || [],
        transport: userData[8] || [],
        goods: userData[9] || [],
      };
      setData(newData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Ошибка загрузки данных. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigation.navigate('Login');
    else fetchData();
  }, [token, user, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation, token, user]);

  const handleBudgetChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setBudget(filteredValue);
      setShouldFilter(true);
    }
  };

  const handleGuestCountChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, '');
    if (filteredValue === '' || parseFloat(filteredValue) >= 0) {
      setGuestCount(filteredValue);
      setShouldFilter(true);
    }
  };

  const filterDataByBudget = useCallback(() => {
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      alert('Пожалуйста, введите корректную сумму бюджета');
      return;
    }

    if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
      alert('Пожалуйста, введите корректное количество гостей');
      return;
    }

    const budgetValue = parseFloat(budget);
    const guests = parseFloat(guestCount);
    let remaining = budgetValue;
    const selectedItems = [];

    const suitableRestaurants = data.restaurants.filter(
      (restaurant) => parseFloat(restaurant.capacity) >= guests
    );

    if (suitableRestaurants.length === 0) {
      alert('Нет ресторанов с достаточной вместимостью для указанного количества гостей');
      return;
    }

    const sortedRestaurants = suitableRestaurants
      .filter((r) => parseFloat(r.averageCost) <= remaining)
      .sort((a, b) => parseFloat(a.averageCost) - parseFloat(b.averageCost));

    if (sortedRestaurants.length === 0) {
      alert('Нет ресторанов, подходящих под ваш бюджет');
      return;
    }

    const selectedRestaurant = sortedRestaurants[Math.floor(sortedRestaurants.length / 2)];
    const restaurantCost = parseFloat(selectedRestaurant.averageCost);
    selectedItems.push({ ...selectedRestaurant, type: 'restaurant', totalCost: restaurantCost });
    remaining -= restaurantCost;

    const types = [
      { key: 'clothing', costField: 'cost', type: 'clothing' },
      { key: 'tamada', costField: 'cost', type: 'tamada' },
      { key: 'programs', costField: 'cost', type: 'program' },
      { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
      { key: 'flowers', costField: 'cost', type: 'flowers' },
      { key: 'cakes', costField: 'cost', type: 'cake' },
      { key: 'alcohol', costField: 'cost', type: 'alcohol' },
      { key: 'transport', costField: 'cost', type: 'transport' },
    ];

    for (const { key, costField, type } of types) {
      const items = data[key]
        .filter((item) => parseFloat(item[costField]) <= remaining)
        .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));

      if (items.length > 0) {
        const maxItemsToSelect = Math.min(2, items.length);
        for (let i = 0; i < maxItemsToSelect; i++) {
          const selectedItem = items[i];
          const cost = parseFloat(selectedItem[costField]);
          if (cost <= remaining) {
            selectedItems.push({ ...selectedItem, type, totalCost: cost });
            remaining -= cost;
          }
        }
      }
    }

    setFilteredData(selectedItems);
    setRemainingBudget(remaining);
    setQuantities(
      selectedItems.reduce((acc, item) => {
        const itemKey = `${item.type}-${item.id}`;
        return { ...acc, [itemKey]: '1' };
      }, {})
    );
  }, [budget, guestCount, data]);

  useEffect(() => {
    if (shouldFilter && budget && guestCount && !isNaN(parseFloat(budget)) && !isNaN(parseFloat(guestCount))) {
      filterDataByBudget();
      setShouldFilter(false);
    }
  }, [budget, guestCount, filterDataByBudget, shouldFilter]);

  const handleAddItem = useCallback(
    (item) => {
      const itemKey = `${item.type}-${item.id}`;
      const cost = item.type === 'restaurant' ? item.averageCost : item.cost;

      setFilteredData((prev) => {
        const existingItemIndex = prev.findIndex((i) => `${i.type}-${i.id}` === itemKey);
        let updatedData;
        let newQuantity;

        if (existingItemIndex !== -1) {
          const currentQuantity = quantities[itemKey] === '' ? '1' : quantities[itemKey] || '1';
          newQuantity = (parseInt(currentQuantity) + 1).toString();
          updatedData = [...prev];
          updatedData[existingItemIndex] = {
            ...updatedData[existingItemIndex],
            totalCost: cost * parseInt(newQuantity),
          };
        } else {
          newQuantity = '1';
          const newItem = { ...item, totalCost: cost };
          updatedData = [...prev, newItem];
        }

        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [itemKey]: newQuantity,
        }));

        const totalSpent = updatedData.reduce((sum, dataItem) => {
          const key = `${dataItem.type}-${dataItem.id}`;
          const itemQuantity = quantities[key] === '' ? 1 : parseInt(quantities[key] || '1');
          const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);

        setRemainingBudget(parseFloat(budget) - totalSpent);
        return updatedData;
      });

      setCategoryModalVisible(false);
    },
    [quantities, budget, setCategoryModalVisible]
  );

  const handleRemoveItem = useCallback(
    (item) => {
      const itemKey = `${item.type}-${item.id}`;

      setFilteredData((prev) => {
        const updatedData = prev.filter((i) => `${i.type}-${i.id}` !== itemKey);

        setQuantities((prevQuantities) => {
          const updatedQuantities = { ...prevQuantities };
          delete updatedQuantities[itemKey];
          return updatedQuantities;
        });

        const totalSpent = updatedData.reduce((sum, dataItem) => {
          const key = `${dataItem.type}-${dataItem.id}`;
          const itemQuantity = parseInt(quantities[key] || '1');
          const itemCost = dataItem.type === 'restaurant' ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);

        setRemainingBudget(parseFloat(budget) - totalSpent);
        return updatedData;
      });
    },
    [quantities, budget]
  );

  const handleSubmit = async () => {
    if (!weddingName.trim()) {
      alert('Пожалуйста, укажите название свадьбы');
      return;
    }
    if (!filteredData.length) {
      alert('Пожалуйста, выберите хотя бы один элемент для свадьбы');
      return;
    }
    if (!user?.id || !token) {
      alert('Ошибка авторизации. Пожалуйста, войдите в систему.');
      navigation.navigate('Login');
      return;
    }

    const dateString = weddingDate.toISOString().split('T')[0];
    const weddingData = {
      name: weddingName.trim(),
      date: dateString,
      host_id: user.id,
      items: filteredData.map((item) => ({
        id: item.id,
        type: item.type,
        quantity: parseInt(quantities[`${item.type}-${item.id}`] || '1'),
        totalCost:
          parseFloat(item.totalCost || (item.type === 'restaurant' ? item.averageCost : item.cost)) *
          parseInt(quantities[`${item.type}-${item.id}`] || '1'),
      })),
    };

    try {
      await api.createWedding(weddingData, token);
      alert('Свадьба успешно создана!');
      setModalVisible(false);
      setWeddingName('');
      setWeddingDate(new Date());
      setShowDatePicker(false);
      setFilteredData([]);
      setQuantities({});
      setBudget('');
      setGuestCount('');
      setRemainingBudget(0);
    } catch (error) {
      console.error('Ошибка при создании свадьбы:', error);
      alert('Ошибка: ' + (error.response?.data?.error || error.message));
    }
  };

  const onDateChange = (day) => {
    setWeddingDate(new Date(day.timestamp));
    setShowDatePicker(false);
  };

  const combinedData = useMemo(() => {
    const dataArray = [
      ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
      ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
      ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
      ...data.programs.map((item) => ({ ...item, type: 'program' })),
      ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
      ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
      ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
      ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
      ...data.transport.map((item) => ({ ...item, type: 'transport' })),
      ...data.goods.map((item) => ({ ...item, type: 'goods' })),
    ].filter((item) => item.type !== 'goods' || item.category !== 'Прочее');
    return dataArray.sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));
  }, [data]);

  const handleCategoryPress = (category) => {
    const type = categoryToTypeMap[category];
    if (!type) return;
    const items = combinedData.filter((item) => item.type === type);
    setSelectedCategoryItems(items);
    setSelectedCategoryLabel(category);
    setSelectedCategoryType(type);
    setCategoryModalVisible(true);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalVisible(false);
    setSelectedCategoryItems([]);
    setSelectedCategoryLabel('');
    setSelectedCategoryType('');
  };

  const calculateTotalCost = () => {
    return filteredData.reduce((sum, item) => {
      const quantity = parseInt(quantities[`${item.type}-${item.id}`] || '1');
      const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
      return sum + cost * quantity;
    }, 0);
  };

  // const renderCategory = (item) => {
  //   if (item === 'Добавить') {
  //     return (
  //       <TouchableOpacity style={styles.categoryButton} onPress={() => setAddItemModalVisible(true)}>
  //         <LinearGradient
  //           colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
  //           style={styles.categoryButtonGradient}
  //         >
  //           <Icon name="add" size={24} color={COLORS.white} />
  //           <Text style={styles.categoryText}>Добавить</Text>
  //         </LinearGradient>
  //       </TouchableOpacity>
  //     );
  //   }
  //   return (
  //     <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress(item)}>
  //       <LinearGradient
  //         colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
  //         style={styles.categoryButtonGradient}
  //       >
  //         <Text style={styles.categoryText}>{item}</Text>
  //       </LinearGradient>
  //     </TouchableOpacity>
  //   );
  // };

  // Функция для возврата на предыдущий экран с передачей данных
  
  const renderCategory = (item) => {
    if (item === 'Добавить') {
      return (
        <TouchableOpacity style={styles.categoryButton} onPress={() => setAddItemModalVisible(true)}>
          <LinearGradient
            colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
            style={styles.categoryButtonGradient}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="add" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
              <Text style={styles.categoryText}>Добавить</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.categoryButton} onPress={() => handleCategoryPress(item)}>
        <LinearGradient
          colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
          style={styles.categoryButtonGradient}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Add an icon based on the category */}
            <Icon
              name={
                item === 'Ресторан' ? 'restaurant' :
                item === 'Прокат авто' ? 'directions-car' :
                item === 'Фото-видео съёмка' ? 'camera-alt' :
                item === 'Ведущие' ? 'mic' :
                item === 'Турыбек Кабота' ? 'card-giftcard' :
                item === 'Свадебные салоны' ? 'store' :
                item === 'Алкоголь' ? 'local-drink' :
                item === 'Ювелирные изделия' ? 'diamond' :
                'category'
              }
              size={20}
              color={COLORS.white}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.categoryText}>{item}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };



  const handleGoBack = () => {
    // Передаём обновлённый список категорий обратно
    navigation.navigate('BeforeHomeScreen', {
      selectedCategories: categories,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#F1EBDD', '#897066']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.splashContainer}
      >
        <View style={styles.headerContainer}>
          {/* <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerText}>Свадьба</Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity> */}
          <View style={styles.budgetContainer}>
            <TextInput
              style={styles.budgetInput}
              placeholder="Бюджет (т)"
              value={budget}
              onChangeText={handleBudgetChange}
              keyboardType="numeric"
              placeholderTextColor="#FFF"
            />
            <TextInput
              style={styles.guestInput}
              placeholder="Гостей"
              value={guestCount}
              onChangeText={handleGuestCountChange}
              keyboardType="numeric"
              placeholderTextColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/kazanRevert.png')}
            style={styles.potIcon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
           <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.categoryGrid}>
                  {categories.map((item, index) => (
                    <View key={index} style={styles.categoryItem}>
                      {renderCategory(item)}
                    </View>
                  ))}
                </View>
                <View style={styles.bottomPadding} />
              </ScrollView>
          )}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Далее</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleGoBack}
          >
            <Text style={styles.nextButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>

        <AddItemModal
          visible={addItemModalVisible}
          onClose={() => setAddItemModalVisible(false)}
          filteredItems={combinedData}
          filteredData={filteredData}
          handleAddItem={handleAddItem}
          setDetailsModalVisible={setDetailsModalVisible}
          setSelectedItem={setSelectedItem}
          quantities={quantities}
          updateCategories={updateCategories}
        />

        <CategoryItemsModal
          visible={categoryModalVisible}
          onClose={handleCloseCategoryModal}
          categoryItems={selectedCategoryItems}
          categoryLabel={selectedCategoryLabel}
          categoryType={selectedCategoryType}
          filteredData={filteredData}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          setDetailsModalVisible={setDetailsModalVisible}
          setSelectedItem={setSelectedItem}
          quantities={quantities}
          setQuantities={setQuantities}
          budget={budget}
          setFilteredData={setFilteredData}
          setRemainingBudget={setRemainingBudget}
          updateCategories={updateCategories}
        />

        <Modal
          visible={detailsModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setDetailsModalVisible(false);
            setSelectedItem(null);
          }}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <Animatable.View style={styles.detailsModalContainer} animation="zoomIn" duration={300}>
              <View style={styles.detailsModalHeader}>
                <Text style={styles.detailsModalTitle}>Подробности</Text>
                <TouchableOpacity
                  style={styles.detailsModalCloseIcon}
                  onPress={() => {
                    setDetailsModalVisible(false);
                    setSelectedItem(null);
                  }}
                >
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              {selectedItem ? (
                <View style={styles.detailsModalContent}>
                  {(() => {
                    switch (selectedItem.type) {
                      case 'restaurant':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Ресторан</Text>
                            <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
                            <Text style={styles.detailsModalText}>Вместимость: {selectedItem.capacity}</Text>
                            <Text style={styles.detailsModalText}>Кухня: {selectedItem.cuisine}</Text>
                            <Text style={styles.detailsModalText}>Средний чек: {selectedItem.averageCost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address || 'Не указан'}</Text>
                          </>
                        );
                      case 'clothing':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Одежда</Text>
                            <Text style={styles.detailsModalText}>Магазин: {selectedItem.storeName}</Text>
                            <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
                            <Text style={styles.detailsModalText}>Пол: {selectedItem.gender}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'flowers':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Цветы</Text>
                            <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                            <Text style={styles.detailsModalText}>Цветы: {selectedItem.flowerName}</Text>
                            <Text style={styles.detailsModalText}>Тип цветов: {selectedItem.flowerType}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'cake':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Торты</Text>
                            <Text style={styles.detailsModalText}>Название: {selectedItem.name}</Text>
                            <Text style={styles.detailsModalText}>Тип торта: {selectedItem.cakeType}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'alcohol':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Алкоголь</Text>
                            <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                            <Text style={styles.detailsModalText}>Напиток: {selectedItem.alcoholName}</Text>
                            <Text style={styles.detailsModalText}>Категория: {selectedItem.category}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'program':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Программа</Text>
                            <Text style={styles.detailsModalText}>Команда: {selectedItem.teamName}</Text>
                            <Text style={styles.detailsModalText}>Тип программы: {selectedItem.type}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          </>
                        );
                      case 'tamada':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Тамада</Text>
                            <Text style={styles.detailsModalText}>Имя: {selectedItem.name}</Text>
                            <Text style={styles.detailsModalText}>Портфолио: {selectedItem.portfolio}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          </>
                        );
                      case 'traditionalGift':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Традиционные подарки</Text>
                            <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                            <Text style={styles.detailsModalText}>Товар: {selectedItem.itemName}</Text>
                            <Text style={styles.detailsModalText}>Тип: {selectedItem.type}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'transport':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Транспорт</Text>
                            <Text style={styles.detailsModalText}>Салон: {selectedItem.salonName}</Text>
                            <Text style={styles.detailsModalText}>Авто: {selectedItem.carName}</Text>
                            <Text style={styles.detailsModalText}>Марка: {selectedItem.brand}</Text>
                            <Text style={styles.detailsModalText}>Цвет: {selectedItem.color}</Text>
                            <Text style={styles.detailsModalText}>Телефон: {selectedItem.phone}</Text>
                            <Text style={styles.detailsModalText}>Район: {selectedItem.district}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                            <Text style={styles.detailsModalText}>Адрес: {selectedItem.address}</Text>
                          </>
                        );
                      case 'goods':
                        return (
                          <>
                            <Text style={styles.detailsModalText}>Тип: Товар</Text>
                            <Text style={styles.detailsModalText}>Название: {selectedItem.item_name}</Text>
                            <Text style={styles.detailsModalText}>Описание: {selectedItem.description || 'Не указано'}</Text>
                            <Text style={styles.detailsModalText}>Стоимость: {selectedItem.cost} ₸</Text>
                          </>
                        );
                      default:
                        return <Text style={styles.detailsModalText}>Неизвестный тип</Text>;
                    }
                  })()}
                </View>
              ) : (
                <Text style={styles.detailsModalText}>Нет данных для отображения</Text>
              )}
            </Animatable.View>
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setWeddingName('');
            setWeddingDate(new Date());
            setShowDatePicker(false);
          }}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Создание мероприятия "Свадьба"</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setWeddingName('');
                      setWeddingDate(new Date());
                      setShowDatePicker(false);
                    }}
                  >
                    <Icon name="close" size={24} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <Icon name="event-note" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
                    value={weddingName}
                    onChangeText={setWeddingName}
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar-today" size={20} color={COLORS.secondary} style={styles.buttonIcon} />
                  <Text style={styles.dateButtonText}>
                    {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <Calendar
                    style={styles.calendar}
                    current={weddingDate.toISOString().split('T')[0]}
                    onDayPress={onDateChange}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                      selectedDayBackgroundColor: COLORS.primary,
                      todayTextColor: COLORS.accent,
                      arrowColor: COLORS.secondary,
                      textDayFontSize: 16,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 14,
                    }}
                  />
                )}
                <Text style={styles.subtitle}>Выбранные элементы:</Text>
                <View style={styles.itemsContainer}>
                  {filteredData.length > 0 ? (
                    Object.entries(
                      filteredData.reduce((acc, item) => {
                        const type = item.type;
                        if (!acc[type]) acc[type] = [];
                        acc[type].push(item);
                        return acc;
                      }, {})
                    )
                      .sort(([typeA], [typeB]) => (typeOrder[typeA] || 11) - (typeOrder[typeB] || 11))
                      .map(([type, items]) => (
                        <View key={type}>
                          <Text style={styles.categoryHeader}>
                            {typesMapping.find((t) => t.type === type)?.label || type} ({items.length})
                          </Text>
                          {items.map((item) => {
                            const quantity = parseInt(quantities[`${item.type}-${item.id}`] || '1');
                            const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
                            const totalItemCost = cost * quantity;
                            return (
                              <View key={`${item.type}-${item.id}`} style={styles.itemContainer}>
                                <Icon
                                  name={
                                    item.type === 'restaurant'
                                      ? 'restaurant'
                                      : item.type === 'clothing'
                                      ? 'store'
                                      : item.type === 'tamada'
                                      ? 'mic'
                                      : item.type === 'program'
                                      ? 'event'
                                      : item.type === 'traditionalGift'
                                      ? 'card-giftcard'
                                      : item.type === 'flowers'
                                      ? 'local-florist'
                                      : item.type === 'cake'
                                      ? 'cake'
                                      : item.type === 'alcohol'
                                      ? 'local-drink'
                                      : item.type === 'transport'
                                      ? 'directions-car'
                                      : 'shopping-bag'
                                  }
                                  size={18}
                                  color={COLORS.primary}
                                  style={styles.itemIcon}
                                />
                                <Text style={styles.itemText}>
                                  {(() => {
                                    switch (item.type) {
                                      case 'restaurant':
                                        return `${item.name} (${item.cuisine}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'clothing':
                                        return `${item.itemName} (${item.storeName}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'tamada':
                                        return `${item.name} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'program':
                                        return `${item.teamName} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'traditionalGift':
                                        return `${item.itemName} (${item.salonName || 'Не указано'}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'flowers':
                                        return `${item.flowerName} (${item.flowerType}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'cake':
                                        return `${item.name} (${item.cakeType}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'alcohol':
                                        return `${item.alcoholName} (${item.category}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'transport':
                                        return `${item.carName} (${item.brand}) - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      case 'goods':
                                        return `${item.item_name} - ${cost} тг x ${quantity} = ${totalItemCost} тг`;
                                      default:
                                        return 'Неизвестный элемент';
                                    }
                                  })()}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      ))
                  ) : (
                    <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
                  )}
                </View>
                <View style={styles.totalContainer}>
                  <Icon name="attach-money" size={20} color={COLORS.accent} style={styles.totalIcon} />
                  <Text style={styles.totalText}>Общая стоимость: {calculateTotalCost()} тг</Text>
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleSubmit}>
                    <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                    <Text style={styles.modalButtonText}>Создать свадьбу</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
                      setWeddingName('');
                      setWeddingDate(new Date());
                      setShowDatePicker(false);
                    }}
                  >
                    <Icon name="close" size={20} color={COLORS.white} style={styles.buttonIcon} />
                    <Text style={styles.modalButtonText}>Закрыть</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animatable.View>
          </SafeAreaView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashContainer: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: { fontSize: 18, color: '#FFF', fontWeight: '600' },
  budgetContainer: { flexDirection: 'row', alignItems: 'center' },
  budgetInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    width: 120,
    fontSize: 16,
  },
  guestInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 80,
    fontSize: 16,
  },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  potIcon: { width: 150, height: 150 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  scrollView: { flex: 1 },
  categoryGrid: {
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center', // Center items horizontally
  },

  // Update categoryItem to take full width
  categoryItem: {
    width: '100%', // Full width for each item
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Update categoryButton to be rectangular and full-width
  categoryButton: {
    width: '100%', // Full width
    height: 50, // Fixed height for list items
    borderRadius: 10, // Smaller border radius for a rectangular look
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 5, // Add some vertical spacing between buttons
  },

  // Update categoryButtonGradient to match the new shape
  categoryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5A4032',
    borderRadius: 10, // Match the border radius
  },

  // Update categoryText to fit the new layout
  categoryText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  bottomPadding: { height: 20 },
  bottomContainer: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: 'transparent' },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5, // Добавляем небольшой отступ между кнопками
  },
  nextButtonText: { fontSize: 18, color: COLORS.white, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  addModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: '90%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addModalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
  addModalCloseIcon: { padding: 5 },
  addModalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  addModalSearchIcon: { marginRight: 10 },
  addModalSearchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary },
  addModalClearIcon: { padding: 5 },
  addModalFilterScroll: { maxHeight: SCREEN_HEIGHT * 0.2, marginBottom: 15 },
  addModalFilterContainer: { paddingBottom: 10 },
  addModalFilterLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
  addModalTypeFilterContainer: { marginBottom: 15 },
  addModalTypeButtons: { flexDirection: 'row', flexWrap: 'wrap' },
  addModalTypeButton: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  addModalTypeButtonActive: { backgroundColor: COLORS.primary },
  addModalTypeButtonText: { fontSize: 14, color: COLORS.textPrimary },
  addModalTypeButtonTextActive: { color: COLORS.white },
  addModalDistrictFilterContainer: { marginBottom: 15 },
  addModalDistrictButtons: { flexDirection: 'row', flexWrap: 'wrap' },
  addModalDistrictButton: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  addModalDistrictButtonActive: { backgroundColor: COLORS.primary },
  addModalDistrictButtonText: { fontSize: 14, color: COLORS.textPrimary },
  addModalDistrictButtonTextActive: { color: COLORS.white },
  addModalPriceFilterContainer: { marginBottom: 15 },
  addModalPriceButtons: { flexDirection: 'row', flexWrap: 'wrap' },
  addModalPriceButton: {
    backgroundColor: '#F7F7F7',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  addModalPriceButtonActive: { backgroundColor: COLORS.primary },
  addModalPriceButtonText: { fontSize: 14, color: COLORS.textPrimary },
  addModalPriceButtonTextActive: { color: COLORS.white },
  addModalScrollView: { flex: 1, minHeight: 100 },
  addModalItemList: { paddingBottom: 20, flexGrow: 1 },
  addModalItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  selectedItemCard: { backgroundColor: '#E6F0FA' },
  addModalItemContent: { flex: 1 },
  disabledItemContent: { opacity: 0.5 },
  addModalItemText: { fontSize: 14, color: COLORS.textPrimary },
  addModalItemCount: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  addModalDetailsButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addModalDetailsButtonText: { fontSize: 12, color: COLORS.white },
  addModalEmptyText: { fontSize: 14, textAlign: 'center', marginTop: 20 },
  selectedItemContainer: { marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  quantityLabel: { fontSize: 12, color: COLORS.textSecondary, marginRight: 5 },
  quantityInput: {
    width: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 5,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  totalCostText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  removeButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  removeButtonText: { fontSize: 12, color: COLORS.white },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: '90%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollViewContent: { paddingBottom: 20 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 10, fontSize: 16, color: COLORS.textPrimary },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonIcon: { marginRight: 10 },
  dateButtonText: { fontSize: 16, color: COLORS.textPrimary },
  calendar: { marginBottom: 15, borderRadius: 10, elevation: 2 },
  subtitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
  itemsContainer: { marginBottom: 20 },
  categoryHeader: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary, marginVertical: 10 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemIcon: { marginRight: 10 },
  itemText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },
  noItems: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  totalContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  totalIcon: { marginRight: 10 },
  totalText: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  confirmButton: { backgroundColor: COLORS.primary },
  cancelButton: { backgroundColor: COLORS.error },
  modalButtonText: { fontSize: 16, color: COLORS.white, fontWeight: '600' },
  detailsModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsModalTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textPrimary },
  detailsModalCloseIcon: { padding: 5 },
  detailsModalContent: { marginBottom: 20 },
  detailsModalText: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 8 },
});

export default CreateEventScreen;