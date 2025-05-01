import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
} from "react-native";


import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  primary: "#FF6F61",
  secondary: "#4A90E2",
  background: "#FDFDFD",
  card: "#FFFFFF",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  accent: "#FBBF24",
  shadow: "rgba(0, 0, 0, 0.3)",
  error: "#FF0000",
  white: "#FFFFFF",
  buttonGradientStart: "#D3C5B7",
  buttonGradientEnd: "#A68A6E",
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
  jewelry: 11,
};

const typesMapping = [
  { key: "clothing", costField: "cost", type: "clothing", label: "Одежда" },
  { key: "tamada", costField: "cost", type: "tamada", label: "Тамада" },
  { key: "programs", costField: "cost", type: "program", label: "Программа" },
  {
    key: "traditionalGifts",
    costField: "cost",
    type: "traditionalGift",
    label: "Традиционные подарки",
  },
  { key: "flowers", costField: "cost", type: "flowers", label: "Цветы" },
  { key: "cakes", costField: "cost", type: "cake", label: "Торты" },
  { key: "alcohol", costField: "cost", type: "alcohol", label: "Алкоголь" },
  {
    key: "transport",
    costField: "cost",
    type: "transport",
    label: "Транспорт",
  },
  {
    key: "restaurants",
    costField: "averageCost",
    type: "restaurant",
    label: "Ресторан",
  },
  {
    key: "jewelry",
    costField: "cost",
    type: "jewelry",
    label: "Ювелирные изделия",
  },

];

const categoryToTypeMap = {
  'Ведущий': "tamada",
  'Ресторан': "restaurant",
  'Алкоголь': "alcohol",
  'Шоу программа': "program",
  'Ювелирные изделия': "jewelry",
  'Традиционные подарки': "traditionalGift",
  'Свадебный салон': "clothing",
  'Прокат авто': "transport",
  'Торты': "cake",
  'Цветы':'flowers'
  // 'Фото видео съемка':''
  // 'Оформление'
  // 'Продукты'
  // 'Прочее'
};

const typeToCategoryMap = Object.fromEntries(
  Object.entries(categoryToTypeMap).map(([category, type]) => [type, category])
);

// Модальное окно для добавления элементов
const AddItemModal = ({
  visible,
  onClose,
  filteredItems,
  filteredData,
  handleAddItem,
  setDetailsModalVisible,
  setSelectedItem,
  quantities,
  updateCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [costRange, setCostRange] = useState("all");

  const uniqueTypes = useMemo(() => {
    const types = [
      { type: "all", label: "Все" },
      ...filteredItems
        .map((item) => ({
          type: item.type,
          label:
            typesMapping.find((t) => t.type === item.type)?.label || item.type,
        }))
        .filter(
          (value, index, self) =>
            self.findIndex((t) => t.type === value.type) === index
        )
        .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)),
    ];
    return types;
  }, [filteredItems]);

  const districts = useMemo(
    () => [
      "all",
      ...new Set(
        filteredItems.map((item) => String(item.district)).filter(Boolean)
      ),
    ],
    [filteredItems]
  );

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
          item.material,
          item.type,
        ]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }
    if (selectedTypeFilter !== "all") {
      result = result.filter((item) => item.type === selectedTypeFilter);
    }
    if (selectedDistrict !== "all") {
      result = result.filter(
        (item) => String(item.district) === selectedDistrict
      );
    }
    if (costRange !== "all") {
      result = result.filter((item) => {
        const cost = item.averageCost || item.cost;
        if (costRange === "0-10000") return cost <= 10000;
        if (costRange === "10000-50000") return cost > 10000 && cost <= 50000;
        if (costRange === "50000+") return cost > 50000;
        return true;
      });
    }
    return result.sort(
      (a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)
    );
  }, [
    filteredItems,
    searchQuery,
    selectedTypeFilter,
    selectedDistrict,
    costRange,
  ]);

  const renderAddItem = useCallback(
    ({ item }) => {
      const count = filteredData.filter(
        (selectedItem) =>
          `${selectedItem.type}-${selectedItem.id}` ===
          `${item.type}-${item.id}`
      ).length;
      if (item.type === "goods" && item.category === "Прочее") return null;
      const cost = item.type === "restaurant" ? item.averageCost : item.cost;
      let title;
      switch (item.type) {
        case "restaurant":
          title = `Ресторан: ${item.name} (${cost} ₸)`;
          break;
        case "clothing":
          title = `Одежда: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        case "flowers":
          title = `Цветы: ${item.salonName} - ${item.flowerName} (${cost} ₸)`;
          break;
        case "cake":
          title = `Торты: ${item.name} (${cost} ₸)`;
          break;
        case "alcohol":
          title = `Алкоголь: ${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
          break;
        case "program":
          title = `Программа: ${item.teamName} (${cost} ₸)`;
          break;
        case "tamada":
          title = `Тамада: ${item.name} (${cost} ₸)`;
          break;
        case "traditionalGift":
          title = `Традиц. подарки: ${item.salonName} - ${item.itemName} (${cost} ₸)`;
          break;
        case "transport":
          title = `Транспорт: ${item.salonName} - ${item.carName} (${cost} ₸)`;
          break;
        case "goods":
          title = `Товар: ${item.item_name} (${cost} ₸)`;
          break;
        case "jewelry":
          title = `Ювелирные изделия: ${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        default:
          title = "Неизвестный элемент";
      }
      return (
        <View style={styles.addModalItemCard}>
          <TouchableOpacity
            style={styles.addModalItemContent}
            onPress={() => {
              handleAddItem(item);
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
    [
      filteredData,
      handleAddItem,
      setDetailsModalVisible,
      setSelectedItem,
      onClose,
      updateCategories,
    ]
  );

  const closeModal = () => {
    setSearchQuery("");
    setSelectedTypeFilter("all");
    setSelectedDistrict("all");
    setCostRange("all");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.addModalContainer}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>Добавить элемент</Text>
            <TouchableOpacity
              style={styles.addModalCloseIcon}
              onPress={closeModal}
            >
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.addModalSearchContainer}>
            <Icon
              name="search"
              size={20}
              color={COLORS.textSecondary}
              style={styles.addModalSearchIcon}
            />
            <TextInput
              style={styles.addModalSearchInput}
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.addModalClearIcon}
                onPress={() => setSearchQuery("")}
              >
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
                      selectedTypeFilter === typeObj.type &&
                        styles.addModalTypeButtonActive,
                    ]}
                    onPress={() => setSelectedTypeFilter(typeObj.type)}
                  >
                    <Text
                      style={[
                        styles.addModalTypeButtonText,
                        selectedTypeFilter === typeObj.type &&
                          styles.addModalTypeButtonTextActive,
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
                      selectedDistrict === district &&
                        styles.addModalDistrictButtonActive,
                    ]}
                    onPress={() => setSelectedDistrict(district)}
                  >
                    <Text
                      style={[
                        styles.addModalDistrictButtonText,
                        selectedDistrict === district &&
                          styles.addModalDistrictButtonTextActive,
                      ]}
                    >
                      {district === "all" ? "Все" : district}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.addModalPriceFilterContainer}>
              <Text style={styles.addModalFilterLabel}>Цена</Text>
              <View style={styles.addModalPriceButtons}>
                {[
                  { label: "Все", value: "all" },
                  { label: "0-10k", value: "0-10000" },
                  { label: "10k-50k", value: "10000-50000" },
                  { label: "50k+", value: "50000+" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.addModalPriceButton,
                      costRange === option.value &&
                        styles.addModalPriceButtonActive,
                    ]}
                    onPress={() => setCostRange(option.value)}
                  >
                    <Text
                      style={[
                        styles.addModalPriceButtonText,
                        costRange === option.value &&
                          styles.addModalPriceButtonTextActive,
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

// Компонент для отображения выбранного элемента
const SelectedItem = ({
  item,
  quantities,
  setQuantities,
  filteredData,
  setFilteredData,
  budget,
  setRemainingBudget,
  handleRemoveItem,
  setDetailsModalVisible,
  setSelectedItem,
  onClose,
  guestCount: initialGuestCount,
  setGuestCount,
}) => {
  const itemKey = `${item.type}-${item.id}`;
  const [inputQuantity, setInputQuantity] = useState(quantities[itemKey] || "1");
  const [inputGuestCount, setInputGuestCount] = useState(initialGuestCount?.toString() || "1");
  const isSelected = !!quantities[itemKey];

  useEffect(() => {
    setInputQuantity(quantities[itemKey] || "1");
  }, [quantities[itemKey]]);

  useEffect(() => {
    setInputGuestCount(initialGuestCount?.toString() || "1");
  }, [initialGuestCount]);

  const cost = item.type === "restaurant" ? item.averageCost : item.cost;
  const parsedGuestCount = parseInt(inputGuestCount, 10) || 1;
  const parsedQuantity = parseInt(inputQuantity, 10) || 1;

  const totalCost =
    item.type === "restaurant" ? cost * parsedGuestCount : cost * parsedQuantity;

  const syncQuantity = (value, guestCountValue = inputGuestCount) => {
    let newQuantity = value === "" ? "1" : value;
    let quantityForCalc = parseInt(newQuantity, 10) || 1;
    let parsedGuestCount = parseInt(guestCountValue, 10) || 1;

    if (item.type === "restaurant" && parsedGuestCount > 0) {
      if (parsedGuestCount > item.capacity) {
        parsedGuestCount = item.capacity;
        guestCountValue = parsedGuestCount.toString();
        setInputGuestCount(guestCountValue);
        if (setGuestCount) {
          setGuestCount(parsedGuestCount);
        }
        alert(
          "Вместимость превышена",
          `Максимальная вместимость ресторана: ${item.capacity} гостей.`
        );
      }
    }

    setInputQuantity(newQuantity);

    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [itemKey]: newQuantity };

      const updatedFilteredData = filteredData.map((dataItem) => {
        if (`${dataItem.type}-${dataItem.id}` === itemKey) {
          const itemTotalCost =
            dataItem.type === "restaurant"
              ? dataItem.averageCost * parsedGuestCount
              : dataItem.cost * quantityForCalc;
          return { ...dataItem, totalCost: itemTotalCost };
        }
        return dataItem;
      });
      setFilteredData(updatedFilteredData);

      const totalSpent = updatedFilteredData.reduce((sum, dataItem) => {
        const key = `${dataItem.type}-${dataItem.id}`;
        const itemQuantity =
          dataItem.type === "restaurant"
            ? parseInt(guestCountValue, 10) || 1
            : parseInt(updatedQuantities[key], 10) || 1;
        const itemCost =
          dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
        return sum + itemCost * itemQuantity;
      }, 0);
      setRemainingBudget(parseFloat(budget) - totalSpent);

      return updatedQuantities;
    });
  };

  const handleAddItem = () => {
    syncQuantity("1");
  };

  const handleQuantityChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, "");
    setInputQuantity(filteredValue);
  };

  const handleGuestCountChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, "");
    setInputGuestCount (filteredValue);
    if (setGuestCount) {
      setGuestCount(filteredValue === "" ? 1 : parseInt(filteredValue, 10));
    }
  };

  const incrementQuantity = () => {
    const currentQuantity = parseInt(inputQuantity, 10) || 1;
    const newQuantity = (currentQuantity + 1).toString();
    syncQuantity(newQuantity);
  };

  const decrementQuantity = () => {
    const currentQuantity = parseInt(inputQuantity, 10) || 1;
    if (currentQuantity > 1) {
      const newQuantity = (currentQuantity - 1).toString();
      syncQuantity(newQuantity);
    }
  };

  const incrementGuestCount = () => {
    const currentGuestCount = parseInt(inputGuestCount, 10) || 1;
    const newGuestCount = (currentGuestCount + 1).toString();
    setInputGuestCount(newGuestCount);
    if (setGuestCount) {
      setGuestCount(parseInt(newGuestCount, 10));
    }
    syncQuantity(inputQuantity, newGuestCount);
  };

  const decrementGuestCount = () => {
    const currentGuestCount = parseInt(inputGuestCount, 10) || 1;
    if (currentGuestCount > 1) {
      const newGuestCount = (currentGuestCount - 1).toString();
      setInputGuestCount(newGuestCount);
      if (setGuestCount) {
        setGuestCount(parseInt(newGuestCount, 10));
      }
      syncQuantity(inputQuantity, newGuestCount);
    }
  };

  const handleBlur = () => {
    if (inputQuantity === "" || !inputQuantity) {
      setInputQuantity("1");
      syncQuantity("1");
    } else {
      syncQuantity(inputQuantity);
    }
  };

  const handleGuestCountBlur = () => {
    if (inputGuestCount === "" || !inputGuestCount) {
      setInputGuestCount("1");
      if (setGuestCount) {
        setGuestCount(1);
      }
      syncQuantity(inputQuantity, "1");
    } else {
      syncQuantity(inputQuantity, inputGuestCount);
    }
  };

  let title;
  switch (item.type) {
    case "restaurant":
      title = `${item.name} (${cost} ₸/гость, Вместимость: ${item.capacity})`;
      break;
    case "clothing":
      title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
      break;
    case "flowers":
      title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
      break;
    case "cake":
      title = `${item.name} (${cost} ₸)`;
      break;
    case "alcohol":
      title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
      break;
    case "program":
      title = `${item.teamName} (${cost} ₸)`;
      break;
    case "tamada":
      title = `${item.name} (${cost} ₸)`;
      break;
    case "traditionalGift":
      title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
      break;
    case "transport":
      title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
      break;
    case "goods":
      title = `${item.item_name} (${cost} ₸)`;
      break;
    case "jewelry":
      title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
      break;
    default:
      title = "Неизвестный элемент";
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.actions}>
          {!isSelected && (
            <TouchableOpacity style={styles.actionButton} onPress={handleAddItem}>
              <Icon name="plus-circle" size={24} color="#26A69A" />
            </TouchableOpacity>
          )}
           <TouchableOpacity
              style={styles.quantityButton}
            onPress={() => handleRemoveItem(item)}
            >


           <Icon2 name="trash-can" size={18} color="#0000000" />
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSelectedItem(item);
              setDetailsModalVisible(true);
              onClose();
            }}
            
          >
             
            <Icon2 name="magnify" size={24} color="#0288D1" />
          </TouchableOpacity>
        </View>
      </View>
      {isSelected && (
        <>
          {item.type === "restaurant" ? (
         <View style={styles.controlRow}>
         <Text style={styles.label}>Гостей</Text>
         <View style={styles.quantityContainer}>
           <TouchableOpacity
             style={styles.quantityButton}
             onPress={decrementGuestCount}
           >
             <Icon2 name="minus" size={18} color="#0288D1" />
           </TouchableOpacity>
           <TextInput
             style={styles.input}
             value={inputGuestCount}
             onChangeText={handleGuestCountChange}
             onBlur={handleGuestCountBlur}
             keyboardType="numeric"
             placeholder="1"
             placeholderTextColor="#B0BEC5"
             textAlign="center"
           />
           <TouchableOpacity
             style={styles.quantityButton}
             onPress={incrementGuestCount}
           >
             <Icon2 name="plus" size={18} color="#0288D1" />
           </TouchableOpacity>
         </View>
         <Text style={styles.totalCost}>
           {totalCost.toLocaleString()} ₸
         </Text>
       </View>

          ) : (
            <>
            <View style={styles.controlRow}>
              <Text style={styles.label}>Количество  </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Icon2 name="minus" size={18} color="#0288D1" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={inputQuantity}
                  onChangeText={handleQuantityChange}
                  onBlur={handleBlur}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor="#B0BEC5"
                  textAlign="center"
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Icon2 name="plus" size={18} color="#0288D1" />
                </TouchableOpacity>
              </View>
             

             


            </View>
            <View style={styles.totalCost}>
             <Text >
               {totalCost.toLocaleString()} ₸
             </Text>
             </View>
</>
            
          )}
           
        </>
      )}
    </View>
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
  guestCount, // Новый проп
}) => {
  const selectedItems = filteredData
    .filter((item) => item.type === categoryType)
    .sort((a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11));

  const sortedCategoryItems = [...categoryItems].sort((a, b) => {
    return (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11);
  });

  const renderCategoryItem = useCallback(
    ({ item }) => {
      const isSelected = selectedItems.some(
        (selected) =>
          `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
      );
      const count = selectedItems.filter(
        (selected) =>
          `${selected.type}-${selected.id}` === `${item.type}-${item.id}`
      ).length;
      const cost = item.type === "restaurant" ? item.averageCost : item.cost;
      let title;
      switch (item.type) {
        case "restaurant":
          title = `${item.name} (${cost} ₸)`;
          break;
        case "clothing":
          title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        case "flowers":
          title = `${item.salonName} - ${item.flowerName} (${cost} ₸)`;
          break;
        case "cake":
          title = `${item.name} (${cost} ₸)`;
          break;
        case "alcohol":
          title = `${item.salonName} - ${item.alcoholName} (${cost} ₸)`;
          break;
        case "program":
          title = `${item.teamName} (${cost} ₸)`;
          break;
        case "tamada":
          title = `${item.name} (${cost} ₸)`;
          break;
        case "traditionalGift":
          title = `${item.salonName} - ${item.itemName} (${cost} ₸)`;
          break;
        case "transport":
          title = `${item.salonName} - ${item.carName} (${cost} ₸)`;
          break;
        case "goods":
          title = `${item.item_name} (${cost} ₸)`;
          break;
        case "jewelry":
          title = `${item.storeName} - ${item.itemName} (${cost} ₸)`;
          break;
        default:
          title = "Неизвестный элемент";
      }
      return (
        // <View style={styles.addModalItemCard}>
        //   <TouchableOpacity
        //     style={[
        //       styles.addModalItemContent,
        //       isSelected && styles.disabledItemContent,
        //     ]}
        //     onPress={() => {
        //       if (!isSelected) {
        //         // Проверка capacity перед добавлением
        //         if (item.type === "restaurant" && guestCount) {
        //           const totalGuests = parseInt(guestCount, 10);
        //           if (totalGuests > item.capacity) {
        //             alert(
        //               `Этот ресторан не может вместить ${totalGuests} гостей. Максимальная вместимость: ${item.capacity}.`
        //             );
        //             return;
        //           }
        //         }
        //         handleAddItem(item);
        //         const category = typeToCategoryMap[item.type];
        //         if (category) {
        //           updateCategories(category);
        //         }
        //       }
        //     }}
        //     disabled={isSelected}
        //   >
        //     <Text style={styles.addModalItemText}>{title}</Text>
        //     {count > 0 && (
        //       <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>
        //     )}
        //   </TouchableOpacity>

        //   <TouchableOpacity
        //      style={styles.actionButton}
        //     onPress={() => {
        //       setSelectedItem(item);
        //       setDetailsModalVisible(true);
        //       onClose();
        //     }}
        //   >
        //         <Icon2 name="magnify" size={24} color="#0288D1" />
        //   </TouchableOpacity>

        // </View>

        <View style={styles.addModalItemCard}>
        <View style={[styles.addModalItemContent, isSelected && styles.disabledItemContent]}>

        <TouchableOpacity
            style={[
              styles.addModalItemContent,
              isSelected && styles.disabledItemContent,
            ]}
            onPress={() => {
              if (!isSelected) {
                // Проверка capacity перед добавлением
                if (item.type === "restaurant" && guestCount) {
                  const totalGuests = parseInt(guestCount, 10);
                  if (totalGuests > item.capacity) {
                    alert(
                      `Этот ресторан не может вместить ${totalGuests} гостей. Максимальная вместимость: ${item.capacity}.`
                    );
                    return;
                  }
                }
                handleAddItem(item);
                const category = typeToCategoryMap[item.type];
                if (category) {
                  updateCategories(category);
                }
              }
            }}
            disabled={isSelected}
          >
            
          <Text style={styles.addModalItemText} numberOfLines={1} ellipsizeMode="tail">
          <Icon2 name="plus" size={24} color="#0288D1" style={{marginTop:'50%'}} />
            {title}
          </Text>
          
          {count > 0 && (
            <Text style={styles.addModalItemCount}>Добавлено: {count}</Text>
          )}



</TouchableOpacity>


        </View>
        <View style={styles.actions}>
          {/* <TouchableOpacity
            style={[styles.actionButton, isSelected && styles.disabledActionButton]}
            onPress={handleSelectItem}
            disabled={isSelected}
          >
            <Icon name="plus-circle" size={24} color={isSelected ? "#B0BEC5" : "#26A69A"} />
          </TouchableOpacity> */}



       


          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSelectedItem(item);
              setDetailsModalVisible(true);
              onClose();
            }}
          >
            <Icon2 name="magnify" size={24} color="#0288D1" />
          </TouchableOpacity>
        </View>
      </View>
      );
    },
    [
      handleAddItem,
      setDetailsModalVisible,
      setSelectedItem,
      onClose,
      selectedItems,
      updateCategories,
      guestCount, // Добавляем в зависимости
    ]
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.addModalContainer}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>{categoryLabel}</Text>
            <TouchableOpacity
              style={styles.addModalCloseIcon}
              onPress={handleClose}
            >
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.addModalItemList}>
            {selectedItems.length > 0 && (
              <View style={styles.selectedItemContainer}>
                <Text style={styles.categoryHeader}>
                  Выбранные элементы ({selectedItems.length}):
                </Text>
                {selectedItems.map((item) => (
                  <SelectedItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    quantities={quantities}
                    setQuantities={setQuantities}
                    filteredData={filteredData}
                    setFilteredData={setFilteredData}
                    budget={budget}
                    setRemainingBudget={setRemainingBudget}
                    handleRemoveItem={handleRemoveItem}
                    setDetailsModalVisible={setDetailsModalVisible}
                    setSelectedItem={setSelectedItem}
                    onClose={onClose}
                    guestCount={guestCount} // Передаем guestCount
                  />
              
                ))}
              </View>
            )}
            {sortedCategoryItems.length > 0 ? (
              sortedCategoryItems.map((item) => (
                <View key={`${item.type}-${item.id}`}>
                  {renderCategoryItem({ item })}
                </View>
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

// Главный экран

const CreateEventScreen = ({ navigation, route }) => {
  
  const selectedCategories = route?.params?.selectedCategories || [];

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState(selectedCategories);
  const [disabledCategories, setDisabledCategories] = useState([]);
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
    jewelry: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [weddingName, setWeddingName] = useState("");
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shouldFilter, setShouldFilter] = useState(false);
const [blockedDays, setBlockedDays] = useState({});
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const updateCategories = useCallback((newCategory) => {
    setCategories((prevCategories) => {
      if (!prevCategories.includes(newCategory)) {
        return [...prevCategories, newCategory];
      }
      return prevCategories;
    });
  }, []);

  // const handleRemoveCategory = useCallback(
  //   (category) => {
  //     setDisabledCategories((prev) => {
  //       if (prev.includes(category)) {
  //         return prev.filter((cat) => cat !== category);
  //       } else {
  //         const type = categoryToTypeMap[category];
  //         if (type) {
  //           setFilteredData((prevData) =>
  //             prevData.filter((item) => item.type !== type)
  //           );
  //         }
  //         return [...prev, category];
  //       }
  //     });

  //     setFilteredData((prevData) => {
  //       const totalSpent = prevData.reduce((sum, dataItem) => {
  //         const key = `${dataItem.type}-${dataItem.id}`;
  //         const itemQuantity =
  //           dataItem.type === "restaurant"
  //             ? parseInt(guestCount, 10) || 1
  //             : parseInt(quantities[key] || "1");
  //         const itemCost =
  //           dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
  //         return sum + itemCost * itemQuantity;
  //       }, 0);
  //       setRemainingBudget(parseFloat(budget) - totalSpent);
  //       return prevData;
  //     });
  //   },
  //   [quantities, budget, guestCount]
  // );

  const handleRemoveCategory = useCallback(
    (category) => {
      setDisabledCategories((prev) => {
        if (prev.includes(category)) {
          // Разблокировка категории
          const updatedDisabledCategories = prev.filter((cat) => cat !== category);
          const type = categoryToTypeMap[category];
          if (type) {
            // Получаем элементы для разблокированной категории
            const itemsToAdd = combinedData.filter((item) => item.type === type);
  
            // Фильтруем элементы с учётом бюджета и количества гостей
            let remaining = parseFloat(budget) || 0;
            const currentTotalSpent = filteredData.reduce((sum, dataItem) => {
              const key = `${dataItem.type}-${dataItem.id}`;
              const itemQuantity =
                dataItem.type === "restaurant"
                  ? parseInt(guestCount, 10) || 1
                  : parseInt(quantities[key] || "1");
              const itemCost =
                dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
              return sum + itemCost * itemQuantity;
            }, 0);
            remaining -= currentTotalSpent;
  
            const filteredItemsToAdd = itemsToAdd
              .filter((item) => {
                const cost = item.type === "restaurant" ? item.averageCost : item.cost;
                const effectiveQuantity =
                  item.type === "restaurant" ? parseInt(guestCount, 10) || 1 : 1;
                const totalCost = cost * effectiveQuantity;
                return totalCost <= remaining;
              })
              .sort((a, b) => {
                const costA = a.type === "restaurant" ? a.averageCost : a.cost;
                const costB = b.type === "restaurant" ? b.averageCost : b.cost;
                return costA - costB;
              });
  
            // Добавляем не более 2 элементов из категории
            const maxItemsToSelect = Math.min(2, filteredItemsToAdd.length);
            const selectedItemsToAdd = [];
            for (let i = 0; i < maxItemsToSelect; i++) {
              const selectedItem = filteredItemsToAdd[i];
              if (selectedItem) {
                const cost =
                  selectedItem.type === "restaurant" ? selectedItem.averageCost : selectedItem.cost;
                const effectiveQuantity =
                  selectedItem.type === "restaurant" ? parseInt(guestCount, 10) || 1 : 1;
                const totalCost = cost * effectiveQuantity;
                selectedItemsToAdd.push({ ...selectedItem, totalCost });
                remaining -= totalCost;
              }
            }
  
            // Обновляем filteredData, добавляя новые элементы
            setFilteredData((prevData) => {
              const updatedData = [...prevData, ...selectedItemsToAdd].sort(
                (a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)
              );
  
              // Обновляем quantities для новых элементов
              setQuantities((prevQuantities) => ({
                ...prevQuantities,
                ...selectedItemsToAdd.reduce((acc, item) => {
                  const itemKey = `${item.type}-${item.id}`;
                  return { ...acc, [itemKey]: "1" };
                }, {}),
              }));
  
              // Пересчитываем оставшийся бюджет
              const totalSpent = updatedData.reduce((sum, dataItem) => {
                const key = `${dataItem.type}-${dataItem.id}`;
                const itemQuantity =
                  dataItem.type === "restaurant"
                    ? parseInt(guestCount, 10) || 1
                    : parseInt(quantities[key] || "1");
                const itemCost =
                  dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
                return sum + itemCost * itemQuantity;
              }, 0);
              setRemainingBudget(parseFloat(budget) - totalSpent);
  
              return updatedData;
            });
  
          }
          return updatedDisabledCategories;
        } else {
          // Блокировка категории
          const type = categoryToTypeMap[category];
          if (type) {
            setFilteredData((prevData) =>
              prevData.filter((item) => item.type !== type)
            );
          }
          setFilteredData((prevData) => {
            const totalSpent = prevData.reduce((sum, dataItem) => {
              const key = `${dataItem.type}-${dataItem.id}`;
              const itemQuantity =
                dataItem.type === "restaurant"
                  ? parseInt(guestCount, 10) || 1
                  : parseInt(quantities[key] || "1");
              const itemCost =
                dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
              return sum + itemCost * itemQuantity;
            }, 0);
            setRemainingBudget(parseFloat(budget) - totalSpent);
            return prevData;
          });
          return [...prev, category];
        }
      });
    },
    [quantities, budget, guestCount, combinedData]
  );


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
        api.getTJewelry(),
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
        jewelry: userData[10] || [],
      };
      
      console.log('JEWELRY=  ',newData[10])
      setData(newData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      alert("Ошибка загрузки данных. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigation.navigate("Login");
    else fetchData();
  }, [token, user, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchData);
    return unsubscribe;
  }, [navigation, token, user]);

  const handleBudgetChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, "");
    if (filteredValue === "" || parseFloat(filteredValue) >= 0) {
      setBudget(filteredValue);
      setShouldFilter(true);
    }
  };

  const handleGuestCountChange = (value) => {
    const filteredValue = value.replace(/[^0-9]/g, "");
    if (filteredValue === "" || parseFloat(filteredValue) >= 0) {
      setGuestCount(filteredValue);
      setShouldFilter(true);
    }
  };


  // const filterDataByBudget = useCallback(() => {

  //   console.log('filterDataByBudget  Стартанул')
  //   setIsLoading(true);
  //   if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
  //     alert("Пожалуйста, введите корректную сумму бюджета");
  //     return;
  //   }
  
  //   if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
  //     alert("Пожалуйста, введите корректное количество гостей");
  //     return;
  //   }
  
  //   const budgetValue = parseFloat(budget);
  //   const guests = parseFloat(guestCount);
  //   let remaining = budgetValue;
  //   const selectedItems = [];
  
  //   // Получаем все активные категории (не отключённые)
  //   const allowedTypes = categories
  //     .filter((category) => !disabledCategories.includes(category))
  //     .map((category) => categoryToTypeMap[category])
  //     .filter((type) => type);
  
  //   // Определяем все типы, которые нужно обработать
  //   const typesToProcess = [
  //     { key: "restaurants", costField: "averageCost", type: "restaurant" },
  //     { key: "clothing", costField: "cost", type: "clothing" },
  //     { key: "tamada", costField: "cost", type: "tamada" },
  //     { key: "programs", costField: "cost", type: "program" },
  //     { key: "traditionalGifts", costField: "cost", type: "traditionalGift" },
  //     { key: "flowers", costField: "cost", type: "flowers" },
  //     { key: "cakes", costField: "cost", type: "cake" },
  //     { key: "alcohol", costField: "cost", type: "alcohol" },
  //     { key: "transport", costField: "cost", type: "transport" },
  //     { key: "jewelry", costField: "cost", type: "jewelry" },
  //   ].filter(({ type }) => allowedTypes.includes(type));
  
  //   // Обрабатываем каждый тип
  //   for (const { key, costField, type } of typesToProcess) {
  //     let items = data[key];
  
  //     // Специальная обработка для ресторанов
  //     if (type === "restaurant") {
  //       items = items.filter(
  //         (restaurant) => parseFloat(restaurant.capacity) >= guests
  //       );
  
  //       if (items.length === 0) {
  //         alert(
  //           "Нет ресторанов с достаточной вместимостью для указанного количества гостей"
  //         );
  //         continue; // Пропускаем категорию, если нет подходящих ресторанов
  //       }
  
  //       // Учитываем стоимость ресторана на основе количества гостей
  //       const sortedItems = items
  //         .filter((item) => parseFloat(item[costField]) * guests <= remaining)
  //         .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));
  
  //       if (sortedItems.length === 0) {
  //         alert(`Нет ресторанов, подходящих под ваш бюджет (${remaining} тг)`);
  //         continue;
  //       }
  
  //       const selectedItem = sortedItems[Math.floor(sortedItems.length / 2)];
  //       const itemCost = parseFloat(selectedItem[costField]) * guests;
  //       selectedItems.push({
  //         ...selectedItem,
  //         type,
  //         totalCost: itemCost,
  //       });
  //       remaining -= itemCost;
  //     } else {
  //       // Обработка остальных категорий
  //       const sortedItems = items
  //         .filter((item) => parseFloat(item[costField]) <= remaining)
  //         .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));
  
  //       if (sortedItems.length > 0) {
  //         const maxItemsToSelect = Math.min(2, sortedItems.length); // Максимум 2 элемента на категорию
  //         for (let i = 0; i < maxItemsToSelect; i++) {
  //           const selectedItem = sortedItems[i];
  //           if (selectedItem) {
  //             const cost = parseFloat(selectedItem[costField]);
  //             if (cost <= remaining) {
  //               selectedItems.push({ ...selectedItem, type, totalCost: cost });
  //               remaining -= cost;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  
  //   if (selectedItems.length === 0) {
  //     alert("Нет элементов, подходящих под ваш бюджет и количество гостей");
  //     return;
  //   }
  
  //   const sortedSelectedItems = [...selectedItems].sort((a, b) => {
  //     return (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11);
  //   });
  
  //   setFilteredData(sortedSelectedItems);
  //   setRemainingBudget(remaining);
  //   setQuantities(
  //     sortedSelectedItems.reduce((acc, item) => {
  //       const itemKey = `${item.type}-${item.id}`;
  //       return { ...acc, [itemKey]: "1" };
  //     }, {})
  //   );
  // }, [budget, guestCount, data, categories, disabledCategories]);
  const filterDataByBudget = useCallback(() => {
    console.log('filterDataByBudget Стартанул');
    setIsLoading(true); // Показываем лоадер

    // Задержка на 1 секунду для демонстрации лоадера
    setTimeout(() => {
      if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
        alert('Пожалуйста, введите корректную сумму бюджета');
        setIsLoading(false);
        return;
      }

      if (!guestCount || isNaN(guestCount) || parseFloat(guestCount) <= 0) {
        alert('Пожалуйста, введите корректное количество гостей');
        setIsLoading(false);
        return;
      }

      const budgetValue = parseFloat(budget);
      const guests = parseFloat(guestCount);
      let remaining = budgetValue;
      const selectedItems = [];

      // Получаем все активные категории (не отключённые)
      const allowedTypes = categories
        .filter((category) => !disabledCategories.includes(category))
        .map((category) => categoryToTypeMap[category])
        .filter((type) => type);

      // Определяем все типы, которые нужно обработать
      const typesToProcess = [
        { key: 'restaurants', costField: 'averageCost', type: 'restaurant' },
        { key: 'clothing', costField: 'cost', type: 'clothing' },
        { key: 'tamada', costField: 'cost', type: 'tamada' },
        { key: 'programs', costField: 'cost', type: 'program' },
        { key: 'traditionalGifts', costField: 'cost', type: 'traditionalGift' },
        { key: 'flowers', costField: 'cost', type: 'flowers' },
        { key: 'cakes', costField: 'cost', type: 'cake' },
        { key: 'alcohol', costField: 'cost', type: 'alcohol' },
        { key: 'transport', costField: 'cost', type: 'transport' },
        { key: 'jewelry', costField: 'cost', type: 'jewelry' },
      ].filter(({ type }) => allowedTypes.includes(type));

      // Обрабатываем каждый тип
      for (const { key, costField, type } of typesToProcess) {
        let items = data[key] || [];

        // Специальная обработка для ресторанов
        if (type === 'restaurant') {
          items = items.filter(
            (restaurant) => parseFloat(restaurant.capacity) >= guests
          );

          if (items.length === 0) {
            alert(
              'Нет ресторанов с достаточной вместимостью для указанного количества гостей'
            );
            continue;
          }

          // Учитываем стоимость ресторана на основе количества гостей
          const sortedItems = items
            .filter((item) => parseFloat(item[costField]) * guests <= remaining)
            .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));

          if (sortedItems.length === 0) {
            alert(`Нет ресторанов, подходящих под ваш бюджет (${remaining} тг)`);
            continue;
          }

          const selectedItem = sortedItems[Math.floor(sortedItems.length / 2)];
          const itemCost = parseFloat(selectedItem[costField]) * guests;
          selectedItems.push({
            ...selectedItem,
            type,
            totalCost: itemCost,
          });
          remaining -= itemCost;
        } else {
          // Обработка остальных категорий
          const sortedItems = items
            .filter((item) => parseFloat(item[costField]) <= remaining)
            .sort((a, b) => parseFloat(a[costField]) - parseFloat(b[costField]));

          if (sortedItems.length > 0) {
            const maxItemsToSelect = Math.min(2, sortedItems.length);
            for (let i = 0; i < maxItemsToSelect; i++) {
              const selectedItem = sortedItems[i];
              if (selectedItem) {
                const cost = parseFloat(selectedItem[costField]);
                if (cost <= remaining) {
                  selectedItems.push({ ...selectedItem, type, totalCost: cost });
                  remaining -= cost;
                }
              }
            }
          }
        }
      }

      if (selectedItems.length === 0) {
        alert('Нет элементов, подходящих под ваш бюджет и количество гостей');
        setIsLoading(false);
        return;
      }

      const sortedSelectedItems = [...selectedItems].sort((a, b) => {
        return (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11);
      });

      setFilteredData(sortedSelectedItems);
      setRemainingBudget(remaining);
      setQuantities(
        sortedSelectedItems.reduce((acc, item) => {
          const itemKey = `${item.type}-${item.id}`;
          return { ...acc, [itemKey]: '1' };
        }, {})
      );

      setIsLoading(false); // Скрываем лоадер
    }, 200); // Задержка 1 секунда
  }, [budget, guestCount, data, categories, disabledCategories]);






  useEffect(() => {
    if (
      shouldFilter &&
      budget &&
      guestCount &&
      !isNaN(parseFloat(budget)) &&
      !isNaN(parseFloat(guestCount))
    ) {
      filterDataByBudget();
      setShouldFilter(false);
    }
  }, [budget, guestCount, filterDataByBudget, shouldFilter]);

  const handleAddItem = useCallback(
    (item) => {
      const itemKey = `${item.type}-${item.id}`;
      const cost = item.type === "restaurant" ? item.averageCost : item.cost;

      // Проверка количества гостей перед добавлением ресторана
      if (item.type === "restaurant" && !guestCount) {
        alert("Пожалуйста, укажите количество гостей перед добавлением ресторана.");
        return;
      }

      // Проверка capacity для ресторанов
      if (item.type === "restaurant" && guestCount) {
        const totalGuests = parseInt(guestCount, 10);
        if (totalGuests > item.capacity) {
          alert(
            `Этот ресторан не может вместить ${totalGuests} гостей. Максимальная вместимость: ${item.capacity}.`
          );
          return;
        }
      }

      setFilteredData((prev) => {
        const existingItemIndex = prev.findIndex(
          (i) => `${i.type}-${i.id}` === itemKey
        );
        let updatedData;
        let newQuantity;

        if (existingItemIndex !== -1) {
          const currentQuantity =
            quantities[itemKey] === "" ? "1" : quantities[itemKey] || "1";
          newQuantity = (parseInt(currentQuantity) + 1).toString();

          // Для ресторанов не увеличиваем количество, так как используется guestCount
          if (item.type === "restaurant") {
            alert("Вы можете выбрать только один ресторан.");
            return prev;
          }

          updatedData = [...prev];
          updatedData[existingItemIndex] = {
            ...updatedData[existingItemIndex],
            totalCost: cost * parseInt(newQuantity),
          };
        } else {
          newQuantity = "1";
          const effectiveQuantity =
            item.type === "restaurant" ? parseInt(guestCount, 10) || 1 : 1;
          const totalCost = cost * effectiveQuantity;
          const newItem = { ...item, totalCost };
          updatedData = [...prev, newItem];
        }

        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [itemKey]: newQuantity,
        }));

        const totalSpent = updatedData.reduce((sum, dataItem) => {
          const key = `${dataItem.type}-${dataItem.id}`;
          const itemQuantity =
            dataItem.type === "restaurant"
              ? parseInt(guestCount, 10) || 1
              : parseInt(quantities[key] || "1");
          const itemCost =
            dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);

        setRemainingBudget(parseFloat(budget) - totalSpent);
        return updatedData.sort(
          (a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)
        );
      });

      setCategoryModalVisible(false);
    },
    [quantities, budget, guestCount, setCategoryModalVisible]
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
          const itemQuantity =
            dataItem.type === "restaurant"
              ? parseInt(guestCount, 10) || 1
              : parseInt(quantities[key] || "1");
          const itemCost =
            dataItem.type === "restaurant" ? dataItem.averageCost : dataItem.cost;
          return sum + itemCost * itemQuantity;
        }, 0);

        setRemainingBudget(parseFloat(budget) - totalSpent);
        return updatedData.sort(
          (a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)
        );
      });
    },
    [quantities, budget, guestCount]
  );

  const calculateTotalCost = () => {
    return filteredData.reduce((sum, item) => {
      const quantity = parseInt(quantities[`${item.type}-${item.id}`] || "1");
      const cost = item.type === "restaurant" ? item.averageCost : item.cost;
      const effectiveQuantity =
        item.type === "restaurant" ? parseInt(guestCount, 10) || 1 : quantity;
      return sum + cost * effectiveQuantity;
    }, 0);
  };

  useEffect(() => {
    fetchAllBlockedDays();
  }, []);

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

        });
      });
      console.log('Сформированные blockedDays:', blockedDays);
      setBlockedDays(blockedDays);
    } catch (error) {
      console.error('Ошибка загрузки заблокированных дней:', error.message);
    }
  };


  // const handleSubmit = async () => {
  //   if (!weddingName.trim()) {
  //     alert("Пожалуйста, укажите название свадьбы");
  //     return;
  //   }
  //   if (!filteredData.length) {
  //     alert("Пожалуйста, выберите хотя бы один элемент для свадьбы");
  //     return;
  //   }
  //   if (!user?.id || !token) {
  //     alert("Ошибка авторизации. Пожалуйста, войдите в систему.");
  //     navigation.navigate("Login");
  //     return;
  //   }

  //   const dateString = weddingDate.toISOString().split("T")[0];
  //   const weddingData = {
  //     name: weddingName.trim(),
  //     date: dateString,
  //     host_id: user.id,
  //     items: filteredData.map((item) => {
  //       const quantity = parseInt(quantities[`${item.type}-${item.id}`] || "1");
  //       const effectiveQuantity =
  //         item.type === "restaurant" ? parseInt(guestCount, 10) || 1 : quantity;
  //       const cost = item.type === "restaurant" ? item.averageCost : item.cost;
  //       return {
  //         id: item.id,
  //         type: item.type,
  //         quantity: effectiveQuantity,
  //         totalCost: cost * effectiveQuantity,
  //       };
  //     }),
  //   };

  //   try {
  //     await api.createWedding(weddingData, token);
  //     alert("Свадьба успешно создана!");
  //     setModalVisible(false);
  //     setWeddingName("");
  //     setWeddingDate(new Date());
  //     setShowDatePicker(false);
  //     setFilteredData([]);
  //     setQuantities({});
  //     setBudget("");
  //     setGuestCount("");
  //     setRemainingBudget(0);
  //   } catch (error) {
  //     console.error("Ошибка при создании свадьбы:", error);
  //     alert("Ошибка: " + (error.response?.data?.error || error.message));
  //   }
  // };


  const handleSubmit = async () => {
    // Валидация базовых полей
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
  
    // Формирование строки даты
    const dateString = weddingDate.toISOString().split('T')[0];
  
    // Проверка, есть ли ресторан в filteredData
    const restaurantItem = filteredData.find((item) => item.type === 'restaurant');
    if (restaurantItem) {
      // Проверка, заблокирована ли дата для этого ресторана
      if (blockedDays[dateString]) {
        const isRestaurantBlocked = blockedDays[dateString].dots.some(
          (dot) => dot.restaurantId === restaurantItem.id
        );
        if (isRestaurantBlocked) {
          alert(
            ` Дата ${dateString} уже забронирована для ресторана ${restaurantItem.name}. Пожалуйста, выберите другую дату.`
          );
          return;
        }
      }
    }
  
    // Формирование данных для отправки
    const weddingData = {
      name: weddingName.trim(),
      date: dateString,
      host_id: user.id,
      items: filteredData.map((item) => {
        const quantity = parseInt(quantities[`${item.type}-${item.id}`] || '1');
        const effectiveQuantity =
          item.type === 'restaurant' ? parseInt(guestCount, 10) || 1 : quantity;
        const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
        return {
          id: item.id,
          type: item.type,
          quantity: effectiveQuantity,
          totalCost: cost * effectiveQuantity,
        };
      }),
    };
  
    // Отправка данных на сервер
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
      ...data.restaurants.map((item) => ({ ...item, type: "restaurant" })),
      ...data.clothing.map((item) => ({ ...item, type: "clothing" })),
      ...data.tamada.map((item) => ({ ...item, type: "tamada" })),
      ...data.programs.map((item) => ({ ...item, type: "program" })),
      ...data.traditionalGifts.map((item) => ({
        ...item,
        type: "traditionalGift",
      })),
      ...data.flowers.map((item) => ({ ...item, type: "flowers" })),
      ...data.cakes.map((item) => ({ ...item, type: "cake" })),
      ...data.alcohol.map((item) => ({ ...item, type: "alcohol" })),
      ...data.transport.map((item) => ({ ...item, type: "transport" })),
      ...data.goods.map((item) => ({ ...item, type: "goods" })),
      ...data.jewelry.map((item) => ({ ...item, type: "jewelry" })),
    ].filter((item) => item.type !== "goods" || item.category !== "Прочее");
    return dataArray.sort(
      (a, b) => (typeOrder[a.type] || 11) - (typeOrder[b.type] || 11)
    );
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
    setSelectedCategoryLabel("");
    setSelectedCategoryType("");
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const typeA = categoryToTypeMap[a];
    const typeB = categoryToTypeMap[b];
    return (typeOrder[typeA] || 11) - (typeOrder[typeB] || 11);
  });

  // const renderCategory = (item) => {
  //   if (item === "Добавить") {
  //     return (
  //       <View style={styles.categoryRow}>
         
  //         <TouchableOpacity
  //               style={styles.categoryButton}
  //               onPress={() => setAddItemModalVisible(true)}
  //             >
  //                 <LinearGradient
  //                   colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
  //                   style={styles.categoryButtonGradient}
  //                 >
  //                   <View style={{ flexDirection: "row", alignItems: "center" }}>
  //                     {/* <Icon
  //                       name="add"
  //                       size={20}
  //                       color={COLORS.white}
  //                       style={{ marginRight: 0 }} // Убираем marginRight, так как текста больше нет
  //                     /> */}
  //                     <Text style={styles.categoryPlusText}>+</Text>
  //                   </View>
  //                 </LinearGradient>
  //               </TouchableOpacity>
  //       </View>
  //     );
  //   }

  //   const isDisabled = disabledCategories.includes(item);

  //   return (
  //     <View style={styles.categoryRow}>
  //       <TouchableOpacity
  //         style={styles.removeCategoryButton}
  //         onPress={() => handleRemoveCategory(item)}
  //       >
  //         <Icon
  //           name={isDisabled ? "add-circle" : "remove-circle"}
  //           size={20}
  //           color={isDisabled ? COLORS.primary : COLORS.error}
  //         />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={[styles.categoryButton, isDisabled && styles.disabledCategoryButton]}
  //         onPress={() => {
  //           if (!isDisabled) {
  //             handleCategoryPress(item);
  //           }
  //         }}
  //         disabled={isDisabled}
  //       >
  //         <LinearGradient
  //           colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
  //           style={styles.categoryButtonGradient}
  //         >
  //           <View style={{ flexDirection: "row", alignItems: "center" }}>
  //             <Icon
  //               name={
  //                 item === "Ресторан"
  //                   ? "restaurant"
  //                   : item === "Прокат авто"
  //                   ? "directions-car"
  //                   : item === "Фото-видео съёмка"
  //                   ? "camera-alt"
  //                   : item === "Ведущий"
  //                   ? "mic"
  //                   : item === "Традиционные подарки"
  //                   ? "card-giftcard"
  //                   : item === "Свадебный салон"
  //                   ? "store"
  //                   : item === "Алкоголь"
  //                   ? "local-drink"
  //                   : item === "Ювелирные изделия"
  //                   ? "diamond"
  //                   : item === "Торты"
  //                   ? "cake"
  //                   : "category"
  //               }
  //               size={20}
  //               color={COLORS.white}
  //               style={{ marginRight: 10 }}
  //             />
  //             <Text style={styles.categoryText}>{item}</Text>
  //           </View>
  //         </LinearGradient>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };







  const renderCategory = (item) => {
    if (item === "Добавить") {
      return (
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setAddItemModalVisible(true)}
          >
            <LinearGradient
              colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
              style={styles.categoryButtonGradient}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.categoryPlusText}>+</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  
    const isDisabled = disabledCategories.includes(item);
  

 
  // 'Шоу программа': "program",
 
  // 'Традиционные подарки': "traditionalGift",
 

 


    // Маппинг категорий на изображения для активного и неактивного состояния
    const categoryIcons = {
     "Цветы": {
        on: require("../../assets/cvetyOn.png"),
        off: require("../../assets/cvetyOff.png"),
      },
      "Прокат авто": {
        on: require("../../assets/prokatAvtoOn.png"),
        off: require("../../assets/prokatAutooff.png"),
      },
      "Шоу программа": {
        on: require("../../assets/show.png"),
        off: require("../../assets/showTurnOff.png"),
      },
      "Ресторан": {
        on: require("../../assets/restaurantOn.png"),
        off: require("../../assets/restaurantTurnOff.png"),
      },
     
      "Ведущий": {
        on: require("../../assets/vedushieOn.png"),
        off: require("../../assets/vedushieOff.png"),
      },
      // "Традиционные подарки": {
      //   on: require("../assets/icons/giftOn.png"),
      //   off: require("../assets/icons/giftOff.png"),
      // },
      "Свадебный салон": {
        on: require("../../assets/svadebnyisalon.png"),
        off: require("../../assets/svadeblyisalonOff.png"),
      },
      "Алкоголь": {
        on: require("../../assets/alcoholOn.png"),
        off: require("../../assets/alcoholOff.png"),
      },
      "Ювелирные изделия": {
        on: require("../../assets/uvizdeliyaOn.png"),
        off: require("../../assets/uvIzdeliyaOff.png"),
      },
      "Торты": {
        on: require("../../assets/torty.png"),
        off: require("../../assets/tortyTurnOff.png"),
      },
      // Добавьте другие категории, если нужно
    };
  
    // Иконка для категории внутри кнопки
    const categoryIcon = categoryIcons[item]?.on || require("../../assets/join.png"); // Иконка по умолчанию, если не найдена
  
    return (
      <View style={styles.categoryRow}>
        <TouchableOpacity
          style={styles.removeCategoryButton}
          onPress={() => handleRemoveCategory(item)}
        >
          <Image
            source={isDisabled ? categoryIcons[item]?.on : categoryIcons[item]?.off}
            style={{ width: 60, height: 70 }} // Настройте размер под ваши нужды
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, isDisabled && styles.disabledCategoryButton]}
          onPress={() => {
            if (!isDisabled) {
              handleCategoryPress(item);
            }
          }}
          disabled={isDisabled}
        >
          <LinearGradient
            colors={[COLORS.buttonGradientStart, COLORS.buttonGradientEnd]}
            style={styles.categoryButtonGradient}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <Image
                source={categoryIcon}
                style={{ width: 20, height: 20, marginRight: 10 }} // Настройте размер и отступ
              /> */}
               <Icon
                name={
                  item === "Ресторан"
                    ? "restaurant"
                    : item === "Прокат авто"
                    ? "directions-car"
                    : item === "Фото-видео съёмка"
                    ? "camera-alt"
                    : item === "Ведущий"
                    ? "mic"
                    : item === "Традиционные подарки"
                    ? "card-giftcard"
                    : item === "Свадебный салон"
                    ? "store"
                    : item === "Алкоголь"
                    ? "local-drink"
                    : item === "Ювелирные изделия"
                    ? "diamond"
                    : item === "Торты"
                    ? "cake"
                    : "category"
                }
                size={20}
                color={COLORS.white}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.categoryText}>{item}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };









  const handleGoBack = () => {
    navigation.navigate("BeforeHomeScreen", {
      selectedCategories: categories,
    });
  };

  return (
    <>
      <LinearGradient
        colors={["#F1EBDD", "#897066"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.splashContainer}
      >

        <TouchableOpacity
          style={{ marginTop: "15%", marginLeft: "2%" }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/kazanRevert.png")}
            style={styles.potIcon}
            resizeMode="contain"
          />
        </View>

 <Image
        source={require('../../assets/footer.png')}
        style={styles.topPatternContainer}
      />

        <View style={styles.headerContainer}>
          <View style={styles.categoryItem2}>{renderCategory("Добавить")}</View>
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
            <TouchableOpacity />
          </View>

          <Modal
          animationType="fade"
          transparent={true}
          visible={isLoading}
          onRequestClose={() => {}} // Блокируем закрытие
        >
          <View style={styles.loaderOverlay}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Загрузка...</Text>
            </View>
          </View>
        </Modal>


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
                {sortedCategories.map((item, index) => (
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require("../../assets/next.png")}
              style={styles.potIcon3}
              resizeMode="contain"
            />
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
          guestCount={guestCount}
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
            <Animatable.View
              style={styles.detailsModalContainer}
              animation="zoomIn"
              duration={300}
            >
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
                      case "restaurant":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Ресторан
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Название: {selectedItem.name}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Вместимость: {selectedItem.capacity}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Кухня: {selectedItem.cuisine}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Средний чек: {selectedItem.averageCost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address || "Не указан"}
                            </Text>
                          </>
                        );
                      case "clothing":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Одежда
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Магазин: {selectedItem.storeName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Товар: {selectedItem.itemName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Пол: {selectedItem.gender}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "flowers":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Цветы
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Салон: {selectedItem.salonName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Цветы: {selectedItem.flowerName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Тип цветов: {selectedItem.flowerType}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "cake":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Торты
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Название: {selectedItem.name}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Тип торта: {selectedItem.cakeType}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "alcohol":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Алкоголь
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Салон: {selectedItem.salonName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Напиток: {selectedItem.alcoholName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Категория: {selectedItem.category}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "program":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Программа
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Команда: {selectedItem.teamName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Тип программы: {selectedItem.type}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                          </>
                        );
                      case "tamada":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Тамада
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Имя: {selectedItem.name}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Портфолио: {selectedItem.portfolio}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                          </>
                        );
                      case "traditionalGift":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Традиционные подарки
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Салон: {selectedItem.salonName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Товар: {selectedItem.itemName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Тип: {selectedItem.type}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "transport":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Транспорт
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Салон: {selectedItem.salonName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Авто: {selectedItem.carName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Марка: {selectedItem.brand}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Цвет: {selectedItem.color}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Телефон: {selectedItem.phone}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Район: {selectedItem.district}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Адрес: {selectedItem.address}
                            </Text>
                          </>
                        );
                      case "goods":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Товар
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Название: {selectedItem.item_name}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Описание: {selectedItem.description || "Не указано"}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                          </>
                        );
                      case "jewelry":
                        return (
                          <>
                            <Text style={styles.detailsModalText}>
                              Тип: Ювелирные изделия
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Магазин: {selectedItem.storeName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Товар: {selectedItem.itemName}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Материал: {selectedItem.material}
                            </Text>
                            <Text style={styles.detailsModalText}>
                              Стоимость: {selectedItem.cost} ₸
                            </Text>
                          </>
                        );
                      default:
                        return (
                          <Text style={styles.detailsModalText}>
                            Неизвестный тип
                          </Text>
                        );
                    }
                  })()}
                </View>
              ) : (
                <Text style={styles.detailsModalText}>
                  Нет данных для отображения
                </Text>
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
    setWeddingName("");
    setWeddingDate(new Date());
    setShowDatePicker(false);
  }}
>
  <SafeAreaView style={styles.modalOverlay}>
    <Animatable.View
      style={styles.modalContent}
      animation="zoomIn"
      duration={300}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            Создание мероприятия "Свадьба"
          </Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              setWeddingName("");
              setWeddingDate(new Date());
              setShowDatePicker(false);
            }}
          >
            <Icon name="close" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Icon
            name="event-note"
            size={20}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Имя свадьбы (например, Свадьба Ивана и Марии)"
            value={weddingName}
            onChangeText={setWeddingName}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon
            name="calendar-today"
            size={20}
            color={COLORS.secondary}
            style={styles.buttonIcon}
          />
          <Text style={styles.dateButtonText}>
            {weddingDate.toLocaleDateString("ru-RU") || "Выберите дату свадьбы"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <Calendar
            style={styles.calendar}
            current={weddingDate.toISOString().split("T")[0]}
            onDayPress={onDateChange}
            minDate={new Date().toISOString().split("T")[0]}
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
              .sort(
                ([typeA], [typeB]) =>
                  (typeOrder[typeA] || 11) - (typeOrder[typeB] || 11)
              )
              .map(([type, items]) => (
                <View key={type}>
                  <Text style={styles.categoryHeader}>
                    {typesMapping.find((t) => t.type === type)?.label || type} (
                    {items.length})
                  </Text>
                  {items.map((item) => {
                    const quantity = parseInt(
                      quantities[`${item.type}-${item.id}`] || "1"
                    );
                    const cost =
                      item.type === "restaurant" ? item.averageCost : item.cost;
                    const effectiveQuantity =
                      item.type === "restaurant"
                        ? parseInt(guestCount, 10) || 1
                        : quantity;
                    const totalItemCost = cost * effectiveQuantity;
                    return (
                      <View
                        key={`${item.type}-${item.id}`}
                        style={styles.itemContainer}
                      >
                        <Icon
                          name={
                            item.type === "restaurant"
                              ? "restaurant"
                              : item.type === "clothing"
                              ? "store"
                              : item.type === "tamada"
                              ? "mic"
                              : item.type === "program"
                              ? "event"
                              : item.type === "traditionalGift"
                              ? "card-giftcard"
                              : item.type === "flowers"
                              ? "local-florist"
                              : item.type === "cake"
                              ? "cake"
                              : item.type === "alcohol"
                              ? "local-drink"
                              : item.type === "transport"
                              ? "directions-car"
                              : item.type === "jewelry"
                              ? "diamond"
                              : "shopping-bag"
                          }
                          size={18}
                          color={COLORS.primary}
                          style={styles.itemIcon}
                        />
                        <Text style={styles.itemText}>
                          {(() => {
                            switch (item.type) {
                              case "restaurant":
                                return `${item.name} (${item.cuisine}) - ${cost} тг x ${effectiveQuantity} гостей = ${totalItemCost} тг`;
                              case "clothing":
                                return `${item.itemName} (${item.storeName}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "tamada":
                                return `${item.name} - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "program":
                                return `${item.teamName} - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "traditionalGift":
                                return `${item.itemName} (${
                                  item.salonName || "Не указано"
                                }) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`; // Fixed typo here
                              case "flowers":
                                return `${item.flowerName} (${item.flowerType}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "cake":
                                return `${item.name} (${item.cakeType}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "alcohol":
                                return `${item.alcoholName} (${item.category}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "transport":
                                return `${item.carName} (${item.brand}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "goods":
                                return `${item.item_name} - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              case "jewelry":
                                return `${item.itemName} (${item.storeName}) - ${cost} тг x ${effectiveQuantity} = ${totalItemCost} тг`;
                              default:
                                return "Неизвестный элемент";
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
          <Text style={styles.totalText}>
            Общая стоимость: {calculateTotalCost().toLocaleString("ru-RU")} тг
          </Text>
        </View>

        <Text style={styles.totalText}>
          {filteredData.length > 0
            ? `Ваш бюджет (${parseFloat(budget).toLocaleString("ru-RU")} ₸)`
            : " "}
        </Text>

        {filteredData.length > 0 && (
          <Text
            style={[styles.budgetInfo, remainingBudget < 0 && styles.budgetError]}
          >
            Остаток: {remainingBudget.toLocaleString("ru-RU")} ₸{" "}
            {remainingBudget < 0 && "(превышение)"}
          </Text>
        )}
        <Text></Text>

        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={handleSubmit}
          >
            <Icon
              name="check"
              size={20}
              color={COLORS.white}
              style={styles.buttonIcon}
            />
            <Text style={styles.modalButtonText}>Создать свадьбу</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animatable.View>
  </SafeAreaView>
</Modal>
      </LinearGradient>
    </>
  );
};



const styles = StyleSheet.create({

  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Полупрозрачный фон
  },
  loaderContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },


  topPatternContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20%',
    zIndex: 1,
    resizeMode: 'cover',
    opacity: 0.8,
    marginBottom:'10$'
  },
  categoryButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 2,
    width: 20, // Уменьшаем ширину кнопки, так как теперь только "+"
    
  },
  categoryButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5A4032",
    borderRadius: 10,
  },
  categoryPlusText: {
    fontSize: 24, // Увеличиваем размер символа "+"
    color: COLORS.white,
    fontWeight: "bold",
  },
  // Удаляем или оставляем categoryText, если он используется в других местах
  categoryText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  disabledCategoryButton: {
    opacity: 0.5,
  },
  splashContainer: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetContainer: { flexDirection: "row", alignItems: "center" },
  budgetInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    width: 120,
    fontSize: 16,
  },
  guestInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 80,
    fontSize: 16,
  },
  logoContainer: { alignItems: "center", marginVertical: 20, marginTop: "0%" },
  potIcon: { width: 150, height: 150 },
  potIcon3: { width: 70, height: 70,zIndex:3 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  scrollView: { flex: 1 },
  categoryGrid: {
    flexDirection: "column",
    alignItems: "center",
  },
  categoryItem: {
    width: "100%",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryItem2: {
    width: "35%",
    // padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // categoryRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   width: "100%",
  //   marginVertical: 0,

  // },
  // removeCategoryButton: {
  //   padding: 0,
  //   marginRight: 10,
  //   marginTop:20
  // },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  removeCategoryButton: {
    marginRight: 10,
  },
  
  categoryButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5A4032",
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  bottomPadding: { height: 20 },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
    zIndex:5,
    marginBottom:'20%'
  },
  nextButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginVertical: 5,
    alignItems: "center",
    zIndex:6,
  },
  nextButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },


  
  addModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: "90%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addModalTitle: { fontSize: 20, fontWeight: "600", color: COLORS.textPrimary },
  addModalCloseIcon: { padding: 5 },
  addModalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  addModalSearchIcon: { marginRight: 10 },
  addModalSearchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addModalClearIcon: { padding: 5 },
  addModalFilterScroll: { maxHeight: SCREEN_HEIGHT * 0.2, marginBottom: 15 },
  addModalFilterContainer: { paddingBottom: 10 },
  addModalFilterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  addModalTypeFilterContainer: { marginBottom: 15 },
  addModalTypeButtons: { flexDirection: "row", flexWrap: "wrap" },
  addModalTypeButton: {
    backgroundColor: "#F7F7F7",
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
  addModalDistrictButtons: { flexDirection: "row", flexWrap: "wrap" },
  addModalDistrictButton: {
    backgroundColor: "#F7F7F7",
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
  addModalPriceButtons: { flexDirection: "row", flexWrap: "wrap" },
  addModalPriceButton: {
    backgroundColor: "#F7F7F7",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addModalItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 12,
  },
  disabledItemContent: {
    opacity: 0.6,
  },
  addModalItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  addModalItemCount: {
    fontSize: 13,
    fontWeight: "400",
    color: "#4B5563",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    marginLeft: 8,
  },
  disabledActionButton: {
    backgroundColor: "#F1F5F9",
    opacity: 0.6,
  },



card: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 20,
  marginVertical: 12,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 5,
},
header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16,
},
titleText: {
  fontSize: 17,
  fontWeight: "600",
  color: "#1A1A1A",
  flex: 1,
  lineHeight: 24,
},
actions: {
  flexDirection: "row",
  alignItems: "center",
},
actionButton: {
  padding: 10,
  borderRadius: 10,
  backgroundColor: "#F1F5F9",
  marginLeft: 8,
},
controlRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
  paddingHorizontal: 4,
},
label: {
  fontSize: 15,
  fontWeight: "500",
  color: "#4B5563",
  marginRight: 12,
},
quantityContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F8FAFC",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  paddingHorizontal: 4,
  flex: 1,
},
quantityButton: {

  padding: 10,
  paddingHorizontal: 12,
},
input: {
  width: 56,
  height: 40,
  fontSize: 15,
  fontWeight: "500",
  color: "#1A1A1A",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  marginHorizontal: 4,
},
totalCost: {
  flexDirection: "start",
  alignItems: "center",
  fontSize: 15,
  fontWeight: "600",
  color: "#26A69A",
  marginLeft: 12,
},



controlRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
label: {
  fontSize: 15,
  fontWeight: "500",
  color: "#4B5563",
},

quantityButton: {
  padding: 12,
},
input: {
  width: 50,
  height: 44,
  fontSize: 15,
  fontWeight: "500",
  color: "#1A1A1A",
  textAlign: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  marginHorizontal: 4,
},
totalCost: {
  fontSize: 15,
  fontWeight: "600",
  color: "#26A69A",
},


  selectedItemCard: { backgroundColor: "#E6F0FA" },
  addModalItemContent: { flex:1,
    paddingRight: 10,
  },
  disabledItemContent: { opacity: 0.5 },
  addModalItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  addModalItemCount: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 10,
  },
  addModalDetailsButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addModalDetailsButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
  },
  addModalEmptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },
  selectedItemContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  // quantityContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginTop: 10,
  // },
  quantityLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  quantityInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  totalCostText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: COLORS.error,
    // paddingVertical: 8,
    // paddingHorizontal: 75,
    borderRadius: 10,
    // marginLeft:'40%'
  },
  removeButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
  },
  detailsModalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: "90%",
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  detailsModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  detailsModalCloseIcon: { padding: 5 },
  detailsModalContent: {
    marginBottom: 20,
  },
  detailsModalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: "90%",
    maxHeight: SCREEN_HEIGHT * 0.8,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  buttonIcon: { marginRight: 10 },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemIcon: { marginRight: 10 },
  itemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  noItems: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  totalContainer: {
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  budgetInfo: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  budgetError: {
    color: COLORS.error,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default CreateEventScreen;