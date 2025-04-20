import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';
import { COLORS } from '../constants/colors';

const ItemCard = ({
  item,
  user,
  quantities,
  handleQuantityChange,
  handleRemoveItem,
  handleEditItem,
  confirmDeleteItem,
  navigation,
}) => {
  const itemKey = `${item.type}-${item.id}`;
  const quantity = quantities[itemKey] || '1';
  const cost = item.type === 'restaurant' ? item.averageCost : item.cost;
  const totalCost = item.totalCost || cost;

  const renderContent = () => {
    switch (item.type) {
      case 'restaurant':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ресторан - {item.name}</Text>
            <Text style={styles.cardDetail}>Вместимость: {item.capacity}</Text>
            <Text style={styles.cardDetail}>Средний чек: {item.averageCost} ₸</Text>
          </View>
        );
      case 'clothing':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Одежда - {item.storeName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'flowers':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Салон цветов - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Цветы: {item.flowerName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'cake':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Кондитерская - {item.name}</Text>
            <Text style={styles.cardDetail}>Тип торта: {item.cakeType}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'alcohol':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Алкогольный магазин - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Напиток: {item.alcoholName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'program':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Программа - {item.teamName}</Text>
            <Text style={styles.cardDetail}>Тип: {item.type}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'tamada':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Тамада - {item.name}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'traditionalGift':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Традиционные подарки - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Товар: {item.itemName}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'transport':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Транспорт - {item.salonName}</Text>
            <Text style={styles.cardDetail}>Авто: {item.carName} Марка: {item.brand}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      case 'goods':
        return (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Товар - {item.item_name}</Text>
            <Text style={styles.cardDetail}>Стоимость: {item.cost} ₸</Text>
          </View>
        );
      default:
        return <Text style={styles.cardTitle}>Неизвестный тип: {item.type}</Text>;
    }
  };

  return (
    <View style={styles.card}>
      {renderContent()}
      {user?.roleId === 3 && (
        <>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(itemKey)}
          >
            <Icon name="close" size={20} color={COLORS.error} />
          </TouchableOpacity>
          <View style={styles.cardFooter}>
            <TextInput
              style={styles.quantityInput}
              placeholder="Кол-во"
              value={quantities[itemKey] || ''}
              onChangeText={(value) => handleQuantityChange(itemKey, value)}
              keyboardType="numeric"
            />
            <Text style={styles.totalCost}>Итого: {totalCost} ₸</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('Details', { item })}
            >
              <Button style={styles.detailsButtonText}>Подробнее</Button>
            </TouchableOpacity>
          </View>
        </>
      )}
      {user?.roleId === 2 && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => handleEditItem(item.id, item.type)}>
            <Icon name="edit" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteItem(item.id, item.type)}>
            <Icon name="delete" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  totalCost: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  detailsButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
});

export default ItemCard;