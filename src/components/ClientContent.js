import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SwitchSelector from 'react-native-switch-selector';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/colors';

const ClientContent = ({
  data,
  filteredData,
  budget,
  setBudget,
  guestCount,
  setGuestCount,
  remainingBudget,
  loading,
  priceFilter,
  setPriceFilter,
  handleBudgetChange,
  handleGuestCountChange,
  handleQuantityChange,
  handleRemoveItem,
  handleAddItem,
  createEvent,
  user,
  navigation,
  searchQuery,
  setSearchQuery,
  selectedTypeFilter,
  setSelectedTypeFilter,
  selectedDistrict,
  setSelectedDistrict,
  costRange,
  setCostRange,
  selectedItem,
  filterDataByBudget,
  openModal,
  quantities,
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // For debouncing

  // Filter items based on search, type, district, and cost range
  useEffect(() => {
    let items = Object.values(data).flat();
    if (searchQuery) {
      items = items.filter((item) =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedTypeFilter !== 'all') {
      items = items.filter((item) => item.type === selectedTypeFilter);
    }
    if (selectedDistrict !== 'all') {
      items = items.filter((item) => (item.district || '') === selectedDistrict);
    }
    if (costRange !== 'all') {
      items = items.filter((item) => {
        const cost = item.averageCost || item.cost || 0;
        if (costRange === 'low') return cost < 5000;
        if (costRange === 'medium') return cost >= 5000 && cost < 15000;
        return cost >= 15000;
      });
    }
    setFilteredItems(items);
  }, [data, searchQuery, selectedTypeFilter, selectedDistrict, costRange]);

  // Item types for filtering
  const itemTypes = [
    { label: 'Все', value: 'all' },
    { label: 'Рестораны', value: 'restaurants' },
    { label: 'Одежда', value: 'clothing' },
    { label: 'Тамада', value: 'tamada' },
    { label: 'Программы', value: 'programs' },
    { label: 'Традиционные подарки', value: 'traditionalGifts' },
    { label: 'Цветы', value: 'flowers' },
    { label: 'Торты', value: 'cakes' },
    { label: 'Алкоголь', value: 'alcohol' },
    { label: 'Транспорт', value: 'transport' },
    { label: 'Товары', value: 'goods' },
  ];

  // Price filter options
  const priceOptions = [
    { label: 'Минимальная', value: 'min' },
    { label: 'Средняя', value: 'average' },
    { label: 'Максимальная', value: 'max' },
  ];

  // Cost range options
  const costRangeOptions = [
    { label: 'Все', value: 'all' },
    { label: '< 5000', value: 'low' },
    { label: '5000 - 15000', value: 'medium' },
    { label: '> 15000', value: 'high' },
  ];

  // District options
  const districtOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Центр', value: 'center' },
    { label: 'Север', value: 'north' },
    { label: 'Юг', value: 'south' },
  ];

  // Debounce function to prevent rapid clicks
  const debounce = (func, delay) => {
    return (...args) => {
      if (isButtonDisabled) return;
      setIsButtonDisabled(true);
      func(...args);
      setTimeout(() => setIsButtonDisabled(false), delay);
    };
  };

  // Render item in FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={debounce(() => openModal('details', { item }), 300)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name || 'Без названия'}</Text>
        <Text style={styles.itemPrice}>
          {item.averageCost || item.cost || 0} ₽
        </Text>
        <Text style={styles.itemType}>{item.type}</Text>
        {filteredData.some((i) => i.id === item.id && i.type === item.type) && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Количество:</Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantities[`${item.type}-${item.id}`]?.toString() || '1'}
              onChangeText={(value) =>
                handleQuantityChange(`${item.type}-${item.id}`, parseInt(value) || 1)
              }
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(`${item.type}-${item.id}`)}
            >
              <Icon name="delete" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Планирование свадьбы</Text>

      {/* Budget and Guest Count Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Бюджет (₽)"
          keyboardType="numeric"
          value={budget}
          onChangeText={handleBudgetChange}
          placeholderTextColor={COLORS.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Количество гостей"
          keyboardType="numeric"
          value={guestCount}
          onChangeText={handleGuestCountChange}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      {/* Remaining Budget */}
      <Text style={styles.budgetText}>
        Остаток бюджета: {remainingBudget.toFixed(2)} ₽
      </Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по названию..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={COLORS.textSecondary}
      />

      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTypeFilter}
            onValueChange={setSelectedTypeFilter}
            style={styles.picker}
          >
            {itemTypes.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDistrict}
            onValueChange={setSelectedDistrict}
            style={styles.picker}
          >
            {districtOptions.map((district) => (
              <Picker.Item
                key={district.value}
                label={district.label}
                value={district.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={costRange}
            onValueChange={setCostRange}
            style={styles.picker}
          >
            {costRangeOptions.map((range) => (
              <Picker.Item key={range.value} label={range.label} value={range.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Price Filter Switch */}
      <SwitchSelector
        options={priceOptions}
        initial={priceOptions.findIndex((opt) => opt.value === priceFilter)}
        onPress={(value) => setPriceFilter(value)}
        textColor={COLORS.textSecondary}
        selectedColor={COLORS.white}
        buttonColor={COLORS.primary}
        borderColor={COLORS.textSecondary}
        style={styles.switchSelector}
      />

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={filterDataByBudget}
      >
        <Text style={styles.filterButtonText}>Применить фильтры</Text>
      </TouchableOpacity>

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={debounce(() => openModal('addItem'), 300)}
      >
        <Icon name="add" size={20} color={COLORS.white} />
        <Text style={styles.addButtonText}>Добавить элемент</Text>
      </TouchableOpacity>

      {/* Create Event Button */}
      <TouchableOpacity
        style={[
          styles.createEventButton,
          { opacity: filteredData.length === 0 ? 0.5 : 1 },
        ]}
        onPress={createEvent}
        disabled={filteredData.length === 0}
      >
        <Text style={styles.createEventButtonText}>Создать свадьбу</Text>
      </TouchableOpacity>

      {/* Item List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Нет доступных элементов</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  budgetText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
  },
  picker: {
    width: '100%',
    height: 48,
    color: COLORS.textPrimary,
  },
  switchSelector: {
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  createEventButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createEventButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  itemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  quantityInput: {
    width: 60,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  removeButton: {
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClientContent;