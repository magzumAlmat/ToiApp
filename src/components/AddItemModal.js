import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/colors';

const AddItemModal = ({
  visible,
  setVisible,
  combinedData,
  filteredData,
  handleAddItem,
  searchQuery,
  setSearchQuery,
  selectedTypeFilter,
  setSelectedTypeFilter,
  selectedDistrict,
  setSelectedDistrict,
  costRange,
  setCostRange,
  openModal, // Add openModal prop
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // For debouncing

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

  const allTypes = [
    { type: 'all', label: 'Все' },
    ...combinedData.map((item) => ({
      type: item.type,
      label: typesMapping.find((t) => t.type === item.type)?.label || item.type,
    })),
  ];

  const uniqueTypes = Array.from(new Set(allTypes.map((t) => t.type))).map((type) =>
    allTypes.find((t) => t.type === type)
  );

  const districts = ['all', ...new Set(combinedData.map((item) => item.district).filter(Boolean))];

  const getFilteredData = () => {
    let result = combinedData;

    if (searchQuery) {
      result = result.filter((item) => {
        const fieldsToSearch = [
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
        ].filter(Boolean);

        return fieldsToSearch.some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (selectedTypeFilter !== 'all') {
      result = result.filter((item) => item.type === selectedTypeFilter);
    }

    if (selectedDistrict !== 'all') {
      result = result.filter((item) => item.district === selectedDistrict);
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

    return result;
  };

  const filteredItems = getFilteredData();

  // Debounce function to prevent rapid clicks
  const debounce = (func, delay) => {
    return (...args) => {
      if (isButtonDisabled) return;
      setIsButtonDisabled(true);
      func(...args);
      setTimeout(() => setIsButtonDisabled(false), delay);
    };
  };

  const renderAddItem = ({ item }) => {
    const isSelected = filteredData.some(
      (selectedItem) => `${selectedItem.type}-${selectedItem.id}` === `${item.type}-${item.id}`
    );

    if (isSelected || (item.type === 'goods' && item.category === 'Прочее')) return null;

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
          onPress={debounce(() => handleAddItem(item), 300)}
        >
          <Text style={styles.addModalItemText}>{title}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addModalDetailsButton}
          onPress={debounce(() => openModal('details', { item }), 300)}
        >
          <Text style={styles.addModalDetailsButtonText}>Подробнее</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">

      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.addModalContainer} animation="zoomIn" duration={300}>
          <View style={styles.addModalHeader}>
            <Text style={styles.addModalTitle}>Добавить элемент</Text>
            <TouchableOpacity
              style={styles.addModalCloseIcon}
              onPress={() => {
                setVisible(false);
                setSearchQuery('');
                setSelectedTypeFilter('all');
                setSelectedDistrict('all');
                setCostRange('all');
              }}
            >
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
              <TouchableOpacity
                style={styles.addModalClearIcon}
                onPress={() => setSearchQuery('')}
              >
                <Icon name="clear" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.addModalFilterContainer}>
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
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderAddItem}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={styles.addModalItemList}
            ListEmptyComponent={<Text style={styles.addModalEmptyText}>Ничего не найдено</Text>}
          />
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  addModalContainer: {
    width: '92%',
    maxHeight: '80%',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  addModalCloseIcon: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
  addModalSearchContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  addModalSearchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 36,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  addModalSearchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  addModalClearIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  addModalFilterContainer: {
    marginBottom: 12,
  },
  addModalTypeFilterContainer: {
    marginBottom: 10,
  },
  addModalTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalTypeButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalTypeButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalDistrictFilterContainer: {
    marginBottom: 10,
  },
  addModalDistrictButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalDistrictButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalDistrictButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalDistrictButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalDistrictButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalPriceFilterContainer: {
    marginBottom: 12,
  },
  addModalPriceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  addModalPriceButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  addModalPriceButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  addModalPriceButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalPriceButtonTextActive: {
    color: '#FFFFFF',
  },
  addModalItemList: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  addModalItemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addModalItemContent: {
    flex: 1,
    marginRight: 10,
  },
  addModalItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  addModalDetailsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addModalDetailsButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addModalEmptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default AddItemModal;