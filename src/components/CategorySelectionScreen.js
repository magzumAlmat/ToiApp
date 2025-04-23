import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#FF6F61',
  secondary: '#4A90E2',
  background: '#FDFDFD',
  card: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#718096',
  accent: '#FBBF24',
  shadow: 'rgba(0, 0, 0, 0.3)',
  error: '#FF0000',
  white: '#FFFFFF',
  buttonGradientStart: '#D3C5B7',
  buttonGradientEnd: '#A68A6E',
};

const initialCategories = [
  'Ведущие',
  'Кейтеринг',
  'Алкоголь',
  'Музыка',
  'Ювелирные изделия',
  'Тойбастар',
  'Свадебные салоны',
  'Транспорт',
];

const CategorySelectionScreen = ({ navigation }) => {
  const [activeCategories, setActiveCategories] = useState(
    initialCategories.reduce((acc, category) => {
      acc[category] = true; // По умолчанию все категории активны
      return acc;
    }, {})
  );

  const toggleCategory = (category) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleProceed = () => {
    const selectedCategories = Object.keys(activeCategories).filter(
      (category) => activeCategories[category]
    );
    if (selectedCategories.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну категорию.');
      return;
    }
    // Переходим на CreateEventScreen, передавая выбранные категории
    navigation.navigate('CreateEvent', { selectedCategories });
  };

  const renderCategory = (category) => {
    const isActive = activeCategories[category];
    return (
      <TouchableOpacity
        style={[styles.categoryButton, !isActive && styles.categoryButtonInactive]}
        onPress={() => toggleCategory(category)}
      >
        <LinearGradient
          colors={
            isActive
              ? [COLORS.buttonGradientStart, COLORS.buttonGradientEnd]
              : ['#E0E0E0', '#B0B0B0']
          }
          style={styles.categoryButtonGradient}
        >
          <Text style={[styles.categoryText, !isActive && styles.categoryTextInactive]}>
            {category}
          </Text>
          <Icon
            name={isActive ? 'check-circle' : 'radio-button-unchecked'}
            size={20}
            color={isActive ? COLORS.white : COLORS.textSecondary}
            style={styles.categoryIcon}
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#F1EBDD', '#897066']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.splashContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Выберите категории</Text>
        </View>

        <View style={styles.logoContainer}>
          <Text style={styles.instructionText}>
            Нажмите на категорию, чтобы активировать или деактивировать её
          </Text>
        </View>

        <View style={styles.listContainer}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoryGrid}
          >
            {initialCategories.map((category) => (
              <View key={category} style={styles.categoryItem}>
                {renderCategory(category)}
              </View>
            ))}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleProceed} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Продолжить</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashContainer: { flex: 1 },
  headerContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '33.33%',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryButtonInactive: {
    opacity: 0.7,
  },
  categoryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5A4032',
    borderRadius: 100,
    padding: 10,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextInactive: {
    color: COLORS.textSecondary,
  },
  categoryIcon: {
    marginTop: 5,
  },
  bottomPadding: {
    height: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default CategorySelectionScreen;