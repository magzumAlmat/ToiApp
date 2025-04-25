import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/colors';

const AdminContent = ({
  data,
  selectedRestaurant,
  setSelectedRestaurant,
  selectedDate,
  setSelectedDate,
  tempRestaurantId,
  setTempRestaurantId,
  showRestaurantModal,
  setShowRestaurantModal,
  showCalendarModal,
  setShowCalendarModal,
  showCalendarModal2,
  setShowCalendarModal2,
  blockedDays,
  occupiedRestaurants,
  setOccupiedRestaurants,
  blockRestaurantDay,
  handleSelectRestaurant,
}) => {
  const handleBlockDay = async () => {
    if (!selectedRestaurant) {
      alert('Пожалуйста, выберите ресторан');
      return;
    }

    await blockRestaurantDay(selectedRestaurant.id, selectedDate);
    setShowCalendarModal(false);
  };

  return (
    <View style={styles.supplierContainer}>
      <Text style={styles.title}>Панель менеджера</Text>
      <View style={styles.infoCard}>
        <Icon name="restaurant" size={24} color={COLORS.primary} style={styles.infoIcon} />
        <Text style={styles.subtitle}>
          {selectedRestaurant ? `Выбран ресторан: ${selectedRestaurant.name}` : 'Ресторан не выбран'}
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Icon name="event" size={24} color={COLORS.secondary} style={styles.infoIcon} />
        <Text style={styles.dateText}>
          Выбранная дата: {selectedDate.toLocaleDateString('ru-RU')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setShowRestaurantModal(true)}
      >
        <Icon name="calendar-today" size={20} color={COLORS.white} style={styles.buttonIcon} />
        <Text style={styles.actionButtonText}>Выбрать дату для бронирования</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showRestaurantModal}
        onRequestClose={() => setShowRestaurantModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Выбор ресторана</Text>
                <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите ресторан:</Text>
              {data?.restaurants?.length > 0 ? (
                <>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={tempRestaurantId}
                      onValueChange={(itemValue) => setTempRestaurantId(itemValue)}
                      style={styles.picker}
                      dropdownIconColor={COLORS.textPrimary}
                    >
                      <Picker.Item label="Выберите ресторан" value={null} />
                      {data.restaurants.map((item) => (
                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                      ))}
                    </Picker>
                  </View>
                  <TouchableOpacity
                    style={styles.modalActionButton}
                    onPress={handleSelectRestaurant}
                  >
                    <Icon name="check" size={20} color={COLORS.white} style={styles.buttonIcon} />
                    <Text style={styles.modalActionButtonText}>Выбрать ресторан</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.modalText}>Рестораны не найдены</Text>
              )}
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendarModal}
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Выбор даты</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите дату:</Text>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={{
                  [selectedDate.toISOString().split('T')[0]]: {
                    selected: true,
                    selectedColor: COLORS.primary,
                  },
                }}
                theme={{
                  selectedDayBackgroundColor: COLORS.primary,
                  todayTextColor: COLORS.accent,
                  arrowColor: COLORS.secondary,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={handleBlockDay}
              >
                <Icon name="lock" size={20} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.modalActionButtonText}>Забронировать</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setShowCalendarModal2(true)}
      >
        <Icon name="visibility" size={20} color={COLORS.white} style={styles.buttonIcon} />
        <Text style={styles.actionButtonText}>Просмотр календаря</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendarModal2}
        onRequestClose={() => setShowCalendarModal2(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View style={styles.modalContent} animation="fadeInUp" duration={300}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Просмотр календаря</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal2(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите дату для проверки:</Text>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => {
                  const dateString = day.dateString;
                  setSelectedDate(new Date(day.timestamp));
                  const occupied = blockedDays[dateString]
                    ? blockedDays[dateString].dots.map((entry) => ({
                        id: entry.restaurantId,
                        name: entry.restaurantName,
                      }))
                    : [];
                  setOccupiedRestaurants(occupied);
                }}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={Object.keys(blockedDays).reduce((acc, date) => {
                  acc[date] = {
                    marked: true,
                    dots: blockedDays[date].dots.map((dot) => ({
                      key: dot.restaurantId.toString(),
                      color: dot.color,
                    })),
                  };
                  return acc;
                }, {})}
                markingType={'multi-dot'}
                theme={{
                  selectedDayBackgroundColor: COLORS.primary,
                  todayTextColor: COLORS.accent,
                  arrowColor: COLORS.secondary,
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
              />
              <View style={styles.occupiedContainer}>
                {occupiedRestaurants.length > 0 ? (
                  <>
                    <Text style={styles.modalText}>
                      На этот день уже заняты следующие рестораны:
                    </Text>
                    {occupiedRestaurants.map((restaurant) => (
                      <View key={restaurant.id} style={styles.occupiedItem}>
                        <Icon name="restaurant" size={18} color={COLORS.error} />
                        <Text style={styles.occupiedText}>{restaurant.name}</Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.modalText}>В этот день нет занятых ресторанов</Text>
                )}
              </View>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,

    elevation: 2,
  },
  infoIcon: {
    marginRight: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
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
  scrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#F7FAFC',
  },
  picker: {
    height: 150,
    width: '100%',
    color: COLORS.textPrimary,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  calendar: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginBottom: 20,
    overflow: 'hidden',
  },
  occupiedContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF8F5',
    borderRadius: 10,
  },
  occupiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  occupiedText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});

export default AdminContent;