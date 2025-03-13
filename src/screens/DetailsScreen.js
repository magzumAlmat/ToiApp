import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DetailsScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name || "Без названия"}</Text>
      <Text style={styles.detail}>Тип: {item.type}</Text>
      <Text style={styles.detail}>
        Стоимость: {(item.cost || item.averageCost || 0)} ₸
      </Text>
      {/* Добавьте дополнительные поля в зависимости от типа */}
      {item.type === "restaurant" && (
        <>
          <Text style={styles.detail}>Вместимость: {item.capacity}</Text>
          <Text style={styles.detail}>Кухня: {item.cuisine}</Text>
          <Text style={styles.detail}>Адрес: {item.address}</Text>
          <Text style={styles.detail}>Телефон: {item.phone}</Text>
          <Text style={styles.detail}>Район: {item.district}</Text>
        </>
      )}
      {item.type === "clothing" && (
        <>
          <Text style={styles.detail}>Магазин: {item.storeName}</Text>
          <Text style={styles.detail}>Адрес: {item.address}</Text>
          <Text style={styles.detail}>Телефон: {item.phone}</Text>
          <Text style={styles.detail}>Район: {item.district}</Text>
          <Text style={styles.detail}>Пол: {item.gender}</Text>
          <Text style={styles.detail}>Название товара: {item.itemName}</Text>
        </>
      )}
      {/* Добавьте другие типы по аналогии */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  detail: { fontSize: 16, marginBottom: 10 },
});

export default DetailsScreen;