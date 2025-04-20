import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const BudgetInput = ({
  budget,
  guestCount,
  onBudgetChange,
  onGuestCountChange,
  onApply,
}) => {
  return (
    <Animatable.View animation="fadeInDown" style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Общий бюджет</Text>
          <View style={styles.inputField}>
            <Icon name="attach-money" size={24} color="#8B5A2B" style={styles.inputIcon} />
            <TextInput
              style={styles.budgetInput}
              placeholder="Бюджет (₸)"
              value={budget}
              onChangeText={onBudgetChange}
              keyboardType="numeric"
              placeholderTextColor="#8B5A2B"
            />
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Количество гостей</Text>
          <View style={styles.inputField}>
            <Icon name="people" size={24} color="#8B5A2B" style={styles.inputIcon} />
            <TextInput
              style={styles.budgetInput}
              placeholder="Гостей"
              value={guestCount}
              onChangeText={onGuestCountChange}
              keyboardType="numeric"
              placeholderTextColor="#8B5A2B"
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.applyButton} onPress={onApply}>
        <View style={styles.applyButtonView}>
          <Text style={styles.applyButtonText}>Поиск</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },
  applyButton: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginRight: 8,
  },
  applyButtonView: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default BudgetInput;