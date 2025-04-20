import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/colors';

const WeddingModal = ({
  visible,
  setVisible,
  weddingName,
  setWeddingName,
  weddingDate,
  setWeddingDate,
  showDatePicker,
  setShowDatePicker,
  filteredData,
  blockedDays,
  handleSubmit,
  resetWeddingModal,
  onDateChange,
}) => {
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS until user confirms
    if (selectedDate) {
      onDateChange({ timestamp: selectedDate.getTime() });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setVisible(false);
        resetWeddingModal();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Создать свадьбу</Text>
          <TextInput
            style={styles.input}
            placeholder="Название свадьбы"
            value={weddingName}
            onChangeText={setWeddingName}
            placeholderTextColor={COLORS.textSecondary}
          />
          <Button
            title={`Дата: ${weddingDate.toLocaleDateString('ru-RU')}`}
            onPress={() => setShowDatePicker(true)}
            color={COLORS.primary}
          />
          {showDatePicker && (
            <DateTimePicker
              value={weddingDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          <Text style={styles.itemsTitle}>Выбранные элементы:</Text>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <Text key={`${item.type}-${item.id}`} style={styles.itemText}>
                {item.name || 'Без названия'} ({item.type})
              </Text>
            ))
          ) : (
            <Text style={styles.noItemsText}>Нет выбранных элементов</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button
              title="Создать"
              onPress={handleSubmit}
              color={COLORS.primary}
            />
            <Button
              title="Отмена"
              onPress={() => {
                setVisible(false);
                resetWeddingModal();
              }}
              color={COLORS.secondary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
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
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: COLORS.textPrimary,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  noItemsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default WeddingModal;