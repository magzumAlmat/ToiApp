import React from 'react';
import { StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../constants/colors';

const CalendarView = ({
  current,
  onDayPress,
  minDate,
  markedDates,
  markingType = 'dot',
}) => {
  return (
    <Calendar
      style={styles.calendar}
      current={current ? current.toISOString().split('T')[0] : undefined}
      minDate={minDate ? minDate.toISOString().split('T')[0] : undefined}
      onDayPress={onDayPress}
      markedDates={markedDates}
      markingType={markingType}
      theme={{
        calendarBackground: COLORS.card,
        textSectionTitleColor: COLORS.textPrimary,
        selectedDayBackgroundColor: COLORS.primary,
        selectedDayTextColor: COLORS.white,
        todayTextColor: COLORS.accent,
        dayTextColor: COLORS.textPrimary,
        textDisabledColor: COLORS.textSecondary,
        dotColor: COLORS.primary,
        selectedDotColor: COLORS.white,
        arrowColor: COLORS.secondary,
        monthTextColor: COLORS.textPrimary,
        textDayFontWeight: '400',
        textMonthFontWeight: '600',
        textDayHeaderFontWeight: '500',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
      }}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CalendarView;