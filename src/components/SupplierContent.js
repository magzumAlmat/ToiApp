import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ItemList from './ItemList';
import DeleteModal from './DeleteModal';
import NewGoodModal from './NewGoodModal';
import { COLORS } from '../constants/colors';

const SupplierContent = ({
  data,
  user,
  loading,
  onEditItem,
  onDeleteItem,
  newGoodModalVisible,
  setNewGoodModalVisible,
  newGoodName,
  setNewGoodName,
  newGoodCost,
  setNewGoodCost,
  onCreateGood,
  deleteModalVisible,
  setDeleteModalVisible,
  itemToDelete,
  onConfirmDelete,
}) => {
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
  ].filter((item) => item.supplier_id === user.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.supplierContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Загрузка данных...</Text>
          </View>
        ) : combinedData.length > 0 ? (
          <ItemList
            data={combinedData}
            quantities={{}}
            onQuantityChange={() => {}}
            onRemoveItem={() => {}}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
            onDetailsPress={() => {}}
            userRoleId={user.roleId}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="business" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>У вас пока нет объектов</Text>
          </View>
        )}
        <DeleteModal
          visible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            itemToDelete(null);
          }}
          onConfirm={onConfirmDelete}
        />
        <NewGoodModal
          visible={newGoodModalVisible}
          onClose={() => setNewGoodModalVisible(false)}
          newGoodName={newGoodName}
          setNewGoodName={setNewGoodName}
          newGoodCost={newGoodCost}
          setNewGoodCost={setNewGoodCost}
          onCreate={onCreateGood}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  supplierContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SupplierContent;