import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const BudgetInput = ({ budget, setBudget, guestCount, setGuestCount, handleBudgetChange, handleGuestCountChange }) => {
  return (
    <View style={styles.budgetContainer}>
      <Text style={styles.budgetTitle}>Ваш бюджет</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.budgetInput, styles.inputInline]}
          placeholder="Сумма (₸)"
          value={budget}
          onChangeText={handleBudgetChange}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />
        <TextInput
          style={[styles.budgetInput, styles.inputInline]}
          placeholder="Гостей"
          value={guestCount}
          onChangeText={handleGuestCountChange}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  budgetContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: '#F7FAFC',
  },
  inputInline: {
    flex: 1,
  },
});

export default BudgetInput;