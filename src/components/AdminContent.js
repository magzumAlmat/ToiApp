
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import * as ExpoCalendar from 'expo-calendar';
import { COLORS } from '../constants/colors';
import api from '../api/api';

const AdminContent = ({
  data,
  blockedDays,
  setBlockedDays,
  showRestaurantModal,
  setShowRestaurantModal,
  showCalendarModal,
  setShowCalendarModal,
  showCalendarModal2,
  setShowCalendarModal2,
  tempRestaurantId,
  setTempRestaurantId,
  selectedRestaurant,
  setSelectedRestaurant,
  selectedDate,
  setSelectedDate,
  occupiedRestaurants,
  setOccupiedRestaurants,
}) => {
  // Fetch blocked days for restaurants
  useEffect(() => {
    const fetchBlockedDays = async () => {
      try {
        const response = await api.getBlockedDays();
        const blocked = {};
        response.data.forEach((block) => {
          const date = new Date(block.date).toISOString().split('T')[0];
          blocked[date] = {
            marked: true,
            dotColor: COLORS.error,
            restaurantId: block.restaurantId,
          };
        });
        setBlockedDays(blocked);
      } catch (error) {
        console.error('Ошибка получения заблокированных дней:', error);
      }
    };
    fetchBlockedDays();
  }, []);

  // Block a restaurant day
  const blockRestaurantDay = async (restaurantId, date) => {
    try {
      const response = await api.addDataBlockToRestaurant(restaurantId, date);
      alert('Успешно поставлена бронь', response.data.message);
      setBlockedDays((prev) => ({
        ...prev,
        [date.toISOString().split('T')[0]]: {
          marked: true,
          dotColor: COLORS.error,
          restaurantId: restaurantId,
        },
      }));
    } catch (error) {
      console.error('Ошибка блокировки:', error);
      alert('В этот день у данного ресторана уже стоит бронь');
    }
  };

  // Handle blocking a day
  const handleBlockDay = async () => {
    if (!selectedRestaurant) {
      alert('Пожалуйста, выберите ресторан');
      return;
    }

    try {
      const defaultCalendar = await ExpoCalendar.getDefaultCalendarAsync();
      await ExpoCalendar.createEventAsync(defaultCalendar.id, {
        title: `Забронирован день для ${selectedRestaurant.name}`,
        startDate: selectedDate,
        endDate: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
        allDay: true,
        notes: `Ресторан ${selectedRestaurant.name} забронирован менеджером`,
        availability: 'busy',
      });

      await blockRestaurantDay(selectedRestaurant.id, selectedDate);
      setShowCalendarModal(false);
      setSelectedRestaurant(null);
      setTempRestaurantId(null);
    } catch (error) {
      console.error('Ошибка создания события в календаре:', error);
      alert('Ошибка при бронировании');
    }
  };

  // Handle restaurant selection
  const handleSelectRestaurant = () => {
    const restaurantId = Number(tempRestaurantId);
    const restaurant = data?.restaurants?.find((r) => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setShowRestaurantModal(false);
      setShowCalendarModal(true);
    } else {
      alert('Пожалуйста, выберите действительный ресторан');
    }
  };

  // Handle viewing blocked restaurants
  const handleViewBlockedRestaurants = async (day) => {
    try {
      const response = await api.getBlockedDays();
      const blockedOnDate = response.data.filter(
        (block) => new Date(block.date).toISOString().split('T')[0] === day.dateString
      );
      const restaurantIds = blockedOnDate.map((block) => block.restaurantId);
      const restaurants = data.restaurants.filter((r) => restaurantIds.includes(r.id));
      setOccupiedRestaurants(restaurants);
      setShowCalendarModal2(true);
    } catch (error) {
      console.error('Ошибка получения заблокированных ресторанов:', error);
      alert('Ошибка при загрузке данных');
    }
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

      <TouchableOpacity
        style={[styles.actionButton, styles.viewBlockedButton]}
        onPress={() => setShowCalendarModal2(true)}
      >
        <Icon name="event-busy" size={20} color={COLORS.white} style={styles.buttonIcon} />
        <Text style={styles.actionButtonText}>Посмотреть заблокированные даты</Text>
      </TouchableOpacity>

      {/* Modal for selecting restaurant */}
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

      {/* Modal for selecting date to block */}
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
              <Text style={styles.modalSubtitle}>Выберите дату для бронирования:</Text>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={{
                  ...blockedDays,
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

      {/* Modal for viewing blocked dates */}
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
                <Text style={styles.modalTitle}>Заблокированные даты</Text>
                <TouchableOpacity onPress={() => setShowCalendarModal2(false)}>
                  <Icon name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>Выберите дату для просмотра забронированных ресторанов:</Text>
              <Calendar
                current={new Date().toISOString().split('T')[0]}
                onDayPress={handleViewBlockedRestaurants}
                minDate={new Date().toISOString().split('T')[0]}
                markedDates={blockedDays}
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
              {occupiedRestaurants.length > 0 && (
                <View style={styles.occupiedRestaurantsContainer}>
                  <Text style={styles.modalSubtitle}>Забронированные рестораны:</Text>
                  {occupiedRestaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.occupiedRestaurantItem}>
                      <Icon name="restaurant" size={18} color={COLORS.primary} style={styles.itemIcon} />
                      <Text style={styles.occupiedRestaurantText}>{restaurant.name}</Text>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={[styles.modalActionButton, styles.closeButton]}
                onPress={() => setShowCalendarModal2(false)}
              >
                <Icon name="close" size={20} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.modalActionButtonText}>Закрыть</Text>
              </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewBlockedButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonIcon: {
    marginRight: 8,
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
    borderRadius: 16,
    maxHeight: '80%',
    padding: 20,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#F7FAFC',
  },
  picker: {
    width: '100%',
    height: 48,
    color: COLORS.textPrimary,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    backgroundColor: COLORS.textSecondary,
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  occupiedRestaurantsContainer: {
    marginTop: 12,
  },
  occupiedRestaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemIcon: {
    marginRight: 10,
  },
  occupiedRestaurantText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});

export default AdminContent;
