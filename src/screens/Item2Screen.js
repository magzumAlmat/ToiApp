// screens/Item1Screen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Item2Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пункт 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});