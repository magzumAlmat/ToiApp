import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/colors';

const DetailsModal = ({ visible, onClose, item }) => {
  if (!item) return null;

  const renderDetails = () => {
    const cost = item.averageCost || item.cost;
    let details = [];

    switch (item.type) {
      case 'restaurant':
        details = [
          { label: 'Название', value: item.name },
          { label: 'Кухня', value: item.cuisine },
          { label: 'Вместимость', value: item.capacity },
          { label: 'Средний чек', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Район', value: item.district },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'clothing':
        details = [
          { label: 'Магазин', value: item.storeName },
          { label: 'Товар', value: item.itemName },
          { label: 'Пол', value: item.gender },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'flowers':
        details = [
          { label: 'Салон', value: item.salonName },
          { label: 'Цветы', value: item.flowerName },
          { label: 'Тип', value: item.flowerType },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'cake':
        details = [
          { label: 'Кондитерская', value: item.name },
          { label: 'Тип торта', value: item.cakeType },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'alcohol':
        details = [
          { label: 'Магазин', value: item.salonName },
          { label: 'Напиток', value: item.alcoholName },
          { label: 'Категория', value: item.category },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'program':
        details = [
          { label: 'Команда', value: item.teamName },
          { label: 'Тип программы', value: item.type },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Портфолио', value: item.portfolio },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'tamada':
        details = [
          { label: 'Имя', value: item.name },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Портфолио', value: item.portfolio },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'traditionalGift':
        details = [
          { label: 'Салон', value: item.salonName },
          { label: 'Товар', value: item.itemName },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'transport':
        details = [
          { label: 'Салон', value: item.salonName },
          { label: 'Автомобиль', value: item.carName },
          { label: 'Марка', value: item.brand },
          { label: 'Стоимость', value: `${cost} ₸` },
          { label: 'Адрес', value: item.address },
          { label: 'Телефон', value: item.phone },
        ];
        break;
      case 'goods':
        details = [
          { label: 'Название', value: item.item_name },
          { label: 'Категория', value: item.category },
          { label: 'Стоимость', value: `${cost} ₸` },
        ];
        break;
      default:
        details = [{ label: 'Тип', value: 'Неизвестный элемент' }];
    }

    return details
      .filter(({ value }) => value && value !== 'null')
      .map(({ label, value }, index) => (
        <View key={index} style={styles.detailRow}>
          <Text style={styles.detailLabel}>{label}:</Text>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      ));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Подробности</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderDetails()}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DetailsModal;