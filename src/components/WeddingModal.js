import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import CalendarView from './CalendarView';
import { COLORS } from '../constants/colors';

const WeddingModal = ({
  visible,
  onClose,
  weddingName,
  setWeddingName,
  weddingDate,
  setWeddingDate,
  showDatePicker,
  setShowDatePicker,
  filteredData,
  blockedDays,
  onSubmit,
  onDateChange,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.title}>Создание мероприятия "Свадьба"</Text>
              <TouchableOpacity onPress={onClose}>
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

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-today" size={20} color={COLORS.secondary} style={styles.buttonIcon} />
              <Text style={styles.dateButtonText}>
                {weddingDate.toLocaleDateString('ru-RU') || 'Выберите дату свадьбы'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <CalendarView
                current={weddingDate}
                onDayPress={onDateChange}
                minDate={new Date()}
                markedDates={{
                  ...blockedDays,
                  [weddingDate.toISOString().split('T')[0]]: {
                    selected: true,
                    selectedColor: blockedDays[weddingDate.toISOString().split('T')[0]]
                      ? blockedDays[weddingDate.toISOString().split('T')[0]].dotColor
                      : COLORS.primary,
                  },
                }}
              />
            )}

            <Text style={styles.subtitle}>Выбранные элементы:</Text>
            <View style={styles.itemsContainer}>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
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
                            return `${item.name} (${item.cuisine}) - ${item.totalCost || item.averageCost} тг`;
                          case 'clothing':
                            return `${item.itemName} (${item.storeName}) - ${item.totalCost || item.cost} тг`;
                          case 'tamada':
                            return `${item.name} - ${item.totalCost || item.cost} тг`;
                          case 'program':
                            return `${item.teamName} - ${item.totalCost || item.cost} тг`;
                          case 'traditionalGift':
                            return `${item.itemName} (${item.salonName || 'Не указано'}) - ${item.totalCost || item.cost} тг`;
                          case 'flowers':
                            return `${item.flowerName} (${item.flowerType}) - ${item.totalCost || item.cost} тг`;
                          case 'cake':
                            return `${item.name} (${item.cakeType}) - ${item.totalCost || item.cost} тг`;
                          case 'alcohol':
                            return `${item.alcoholName} (${item.category}) - ${item.totalCost || item.cost} тг`;
                          case 'transport':
                            return `${item.carName} (${item.brand}) - ${item.totalCost || item.cost} тг`;
                          case 'goods':
                            return `${item.item_name} - ${item.totalCost || item.cost} тг`;
                          default:
                            return 'Неизвестный элемент';
                        }
                      })()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItems}>Выберите элементы для свадьбы</Text>
              )}
            </View>

            <View style={styles.totalContainer}>
              <Icon name="attach-money" size={20} color={COLORS.accent} style={styles.totalIcon} />
              <Text style={styles.totalText}>
                Общая стоимость:{' '}
                {filteredData.reduce((sum, item) => sum + (item.totalCost || item.cost || 0), 0)} тг
              </Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onSubmit}
              >
                <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.modalButtonText}>Создать свадьбу</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Icon name="close" size={20} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.modalButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: '#F7FAFC',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  itemsContainer: {
    backgroundColor: '#FFF8F5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  noItems: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalIcon: {
    marginRight: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.textSecondary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default WeddingModal;