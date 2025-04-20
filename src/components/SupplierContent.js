import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/colors';

const SupplierContent = ({
  user,
  data,
  loading,
  handleDeleteItem,
  newGoodName,
  setNewGoodName,
  newGoodCost,
  setNewGoodCost,
  handleCreateGood,
  confirmDeleteItem,
  openModal,
  ...props
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // For debouncing

  // Debounce function to prevent rapid clicks
  const debounce = (func, delay) => {
    return (...args) => {
      if (isButtonDisabled) return;
      setIsButtonDisabled(true);
      func(...args);
      setTimeout(() => setIsButtonDisabled(false), delay);
    };
  };

  const keyExtractor = (item, index) => {
    if (!item.id || !item.type) {
      console.warn('Item missing id or type:', item);
      return `${item.type || 'unknown'}-${item.id || index}`;
    }
    return `${item.type}-${item.id}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name || item.item_name || 'Без названия'}</Text>
      <Text style={styles.itemCost}>
        Стоимость: {item.averageCost || item.cost || 0} ₽
      </Text>
      <Button
        title="Удалить"
        onPress={debounce(() => confirmDeleteItem(item.id, item.type), 300)}
        color={COLORS.danger}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loading} />
      ) : (
        <>
          <Button
            title="Создать товар"
            onPress={debounce(() => openModal('newGood'), 300)}
            color={COLORS.primary}
          />
          <FlatList
            data={data.goods}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Нет товаров для отображения</Text>
            }
            initialNumToRender={10}
            windowSize={5}
          />
        </>
      )}
      {/* Модальное окно для удаления */}
      <Modal
        visible={props.deleteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => openModal(null)} // Close modal using openModal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение удаления</Text>
            <Text>Вы уверены, что хотите удалить этот элемент?</Text>
            {props.itemToDelete && (
              <Text>
                {props.itemToDelete.name || props.itemToDelete.item_name || 'Элемент'}
              </Text>
            )}
            <View style={styles.modalButtons}>
              <Button
                title="Удалить"
                onPress={debounce(handleDeleteItem, 300)}
                color={COLORS.danger}
              />
              <Button
                title="Отмена"
                onPress={debounce(() => openModal(null), 300)}
                color={COLORS.secondary}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Модальное окно для создания товара */}
      <Modal
        visible={props.newGoodModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => openModal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Создать новый товар</Text>
            <TextInput
              style={styles.input}
              placeholder="Название товара"
              value={newGoodName}
              onChangeText={setNewGoodName}
              placeholderTextColor={COLORS.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Стоимость"
              value={newGoodCost}
              onChangeText={setNewGoodCost}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Создать"
                onPress={debounce(handleCreateGood, 300)}
                color={COLORS.primary}
              />
              <Button
                title="Отмена"
                onPress={debounce(() => openModal(null), 300)}
                color={COLORS.secondary}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  itemCost: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.card, // Changed to COLORS.card for consistency
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: COLORS.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default SupplierContent;