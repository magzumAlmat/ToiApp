import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/colors';

const DetailsModal = ({ visible, setVisible, selectedItem }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.detailsModalContainer} animation="zoomIn" duration={300}>
          <View style={styles.detailsModalHeader}>
            <Text style={styles.detailsModalTitle}>Подробности</Text>
            <TouchableOpacity
              style={styles.detailsModalCloseIcon}
              onPress={() => setVisible(false)}
            >
              <Icon name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          {selectedItem && (
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
          )}
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
  detailsModalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  detailsModalCloseIcon: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
  detailsModalContent: {
    paddingVertical: 8,
  },
  detailsModalText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
});

export default DetailsModal;