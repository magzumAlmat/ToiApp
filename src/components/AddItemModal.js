import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const AddItemModal = ({
  visible,
  onClose,
  data,
  filteredData,
  onAddItem,
  onDetailsPress,
  searchQuery,
  setSearchQuery,
  selectedTypeFilter,
  setSelectedTypeFilter,
  selectedDistrict,
  setSelectedDistrict,
  costRange,
  setCostRange,
}) => {
  const [filteredItems, setFilteredItems] = useState([]);

  // Функция для фильтрации данных
  const filterItems = () => {
    let items = [];
    // Собираем все элементы из data
    Object.keys(data).forEach((key) => {
      items = [...items, ...data[key].map((item) => ({ ...item, type: key }))];
    });

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      items = items.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по типу
    if (selectedTypeFilter !== 'all') {
      items = items.filter((item) => item.type === selectedTypeFilter);
    }

    // Фильтрация по району
    if (selectedDistrict !== 'all') {
      items = items.filter((item) => item.district === selectedDistrict);
    }

    // Фильтрация по диапазону цен
    if (costRange !== 'all') {
      const [min, max] = costRange.split('-').map(Number);
      items = items.filter((item) => item.cost >= min && item.cost <= max);
    }

    setFilteredItems(items);
  };

  // Автоматическая фильтрация при изменении фильтров
  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedTypeFilter, selectedDistrict, costRange, data]);

  // Рендеринг элемента списка
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.name}</Text>
      <Text>Cost: {item.cost}</Text>
      <TouchableOpacity onPress={() => onAddItem(item)}>
        <Text style={styles.addButton}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDetailsPress(item)}>
        <Text style={styles.detailsButton}>Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
        />
        {/* Поля для выбора фильтров */}
        <View style={styles.filterContainer}>
          <Text>Type:</Text>
          <TouchableOpacity
            onPress={() => setSelectedTypeFilter('all')}
            style={selectedTypeFilter === 'all' ? styles.selectedFilter : styles.filter}
          >
            <Text>All</Text>
          </TouchableOpacity>
          {Object.keys(data).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedTypeFilter(type)}
              style={selectedTypeFilter === type ? styles.selectedFilter : styles.filter}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterContainer}>
          <Text>District:</Text>
          <TouchableOpacity
            onPress={() => setSelectedDistrict('all')}
            style={selectedDistrict === 'all' ? styles.selectedFilter : styles.filter}
          >
            <Text>All</Text>
          </TouchableOpacity>
          {/* Предполагаемые районы */}
          {['District1', 'District2'].map((district) => (
            <TouchableOpacity
              key={district}
              onPress={() => setSelectedDistrict(district)}
              style={selectedDistrict === district ? styles.selectedFilter : styles.filter}
            >
              <Text>{district}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterContainer}>
          <Text>Cost Range:</Text>
          <TouchableOpacity
            onPress={() => setCostRange('all')}
            style={costRange === 'all' ? styles.selectedFilter : styles.filter}
          >
            <Text>All</Text>
          </TouchableOpacity>
          {['0-100', '100-500', '500-1000'].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setCostRange(range)}
              style={costRange === range ? styles.selectedFilter : styles.filter}
            >
              <Text>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          ListEmptyComponent={<Text>No items found</Text>}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#8B5A2B',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filter: {
    padding: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#8B5A2B',
    borderRadius: 4,
  },
  selectedFilter: {
    padding: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#8B5A2B',
    borderRadius: 4,
    backgroundColor: '#8B5A2B',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#8B5A2B',
  },
  addButton: {
    color: '#8B5A2B',
    fontWeight: 'bold',
  },
  detailsButton: {
    color: '#8B5A2B',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#8B5A2B',
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default AddItemModal;