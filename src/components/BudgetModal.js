import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/colors';

const BudgetModal = ({ visible, onClose, budget, guestCount, onBudgetChange, onGuestCountChange, onApply }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.modalOverlay}>
        <Animatable.View style={styles.modalContent} animation="zoomIn" duration={300}>
          <Text style={styles.modalTitle}>Ваш бюджет</Text>
          <TextInput
            style={styles.budgetInput}
            placeholder="Введите сумму (₸)"
            value={budget}
            onChangeText={onBudgetChange}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecondary}
          />
          <TextInput
            style={styles.budgetInput}
            placeholder="Количество гостей"
            value={guestCount}
            onChangeText={onGuestCountChange}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textSecondary}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onApply}
            >
              <Text style={styles.modalButtonText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </SafeAreaView>
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
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  budgetInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
    backgroundColor: '#F7FAFC',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
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
    color: '#FFFFFF',
  },
});

export default BudgetModal;