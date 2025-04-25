import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SwitchSelector from 'react-native-switch-selector';
import ItemCard from './ItemCard';
import BudgetModal from './BudgetModal';
import AddItemModal from './AddItemModal';
import { COLORS } from '../constants/colors';

const ClientContent = ({
  user,
  data,
  filteredData,
  budget,
  guestCount,
  remainingBudget,
  loading,
  priceFilter,
  setPriceFilter,
  budgetModalVisible,
  setBudgetModalVisible,
  addItemModalVisible,
  setAddItemModalVisible,
  handleBudgetChange,
  handleGuestCountChange,
  filterDataByBudget,
  handleQuantityChange,
  handleAddItem,
  handleRemoveItem,
  navigation,
  quantities,
}) => {
  const sortedFilteredData = [...filteredData].sort((a, b) => {
    const typeOrder = {
      restaurant: 1,
      clothing: 2,
      tamada: 3,
      program: 4,
      traditionalGift: 5,
      flowers: 6,
      transport: 7,
    };
    return (typeOrder[a.type] || 8) - (typeOrder[b.type] || 8);
  });

  const combinedData = [
    ...data.restaurants.map((item) => ({ ...item, type: 'restaurant' })),
    ...data.clothing.map((item) => ({ ...item, type: 'clothing' })),
    ...data.tamada.map((item) => ({ ...item, type: 'tamada' })),
    ...data.programs.map((item) => ({ ...item, type: 'program' })),
    ...data.traditionalGifts.map((item) => ({ ...item, type: 'traditionalGift' })),
    ...data.flowers.map((item) => ({ ...item, type: 'flowers' })),
    ...data.cakes.map((item) => ({ ...item, type: 'cake' })),
    ...data.alcohol.map((item) => ({ ...item, type: 'alcohol' })),
    ...data.transport.map((item) => ({ ...item, type: 'transport' })),
    ...data.goods.map((item) => ({ ...item, type: 'goods' })),
  ].filter((item) => item.type !== 'goods' || item.category !== 'Прочее');

  return (
    <View style={styles.clientContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setBudgetModalVisible(true)}
        >
          <Icon name="attach-money" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setAddItemModalVisible(true)}
          disabled={!budget}
        >
          <Icon name="add" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('WeddingModal')}
          disabled={!budget}
        >
          <Icon name="event" size={24} color={!budget ? COLORS.textSecondary : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      {budget && (
        <SwitchSelector
          options={[
            { label: 'Мин', value: 'min' },
            { label: 'Сред', value: 'average' },
            { label: 'Макс', value: 'max' },
          ]}
          initial={1}
          onPress={(value) => setPriceFilter(value)}
          buttonColor={COLORS.primary}
          backgroundColor={COLORS.background}
          textColor={COLORS.textSecondary}
          selectedTextStyle={{ color: '#FFFFFF' }}
          style={styles.switchSelector}
        />
      )}

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        budget={budget}
        guestCount={guestCount}
        onBudgetChange={handleBudgetChange}
        onGuestCountChange={handleGuestCountChange}
        onApply={filterDataByBudget}
      />

      <AddItemModal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        data={data}
        onAddItem={handleAddItem}
        filteredData={filteredData}
      />

      {budget && (
        <>
          <Text style={styles.sectionTitle}>
            {filteredData.length > 0 ? `Рекомендации (${budget} ₸)` : 'Все объекты'}
          </Text>
          {filteredData.length > 0 && (
            <Text style={[styles.budgetInfo, remainingBudget < 0 && styles.budgetError]}>
              Остаток: {remainingBudget} ₸
            </Text>
          )}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : filteredData.length > 0 ? (
            <FlatList
              data={sortedFilteredData}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  quantities={quantities}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                  user={user}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : combinedData.length > 0 ? (
            <FlatList
              data={combinedData}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  quantities={quantities}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                  user={user}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.emptyText}>Нет данных для отображения</Text>
          )}
        </>
      )}

      {!budget && (
        <View style={styles.noBudgetContainer}>
          <Icon name="attach-money" size={48} color={COLORS.textSecondary} />
          <Text style={styles.noBudgetText}>Пожалуйста, задайте бюджет для отображения записей</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  clientContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  budgetInfo: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
  },
  budgetError: {
    color: COLORS.error,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  noBudgetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBudgetText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  switchSelector: {
    marginBottom: 20,
  },
});

export default ClientContent;