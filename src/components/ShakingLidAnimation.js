import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const ShakingLidAnimation = () => {
  // Анимация для крышки (тряска)
  const lidOffset = useRef(new Animated.Value(0)).current;
  // Анимация для пара (прозрачность)
  const steamOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация крышки: колебание вверх-вниз
    Animated.loop(
      Animated.sequence([
        Animated.timing(lidOffset, {
          toValue: 5, // Поднимается на 5 пикселей
          duration: 200, // Длительность одного движения
          useNativeDriver: true, // Используем нативный драйвер для лучшей производительности
        }),
        Animated.timing(lidOffset, {
          toValue: 0, // Возвращается в исходное положение
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Анимация пара: появление и исчезновение
    Animated.loop(
      Animated.sequence([
        Animated.timing(steamOpacity, {
          toValue: 1, // Полная видимость
          duration: 1000, // Длительность появления
          useNativeDriver: true,
        }),
        Animated.timing(steamOpacity, {
          toValue: 0, // Полная прозрачность
          duration: 1000, // Длительность исчезновения
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [lidOffset, steamOpacity]);

  return (
    <View style={styles.container}>
      {/* Казан без крышки */}
      <Image
        source={require('../../assets/animation/kazanbezkrishki.png')}
        style={styles.kazan}
        resizeMode="contain"
      />
      {/* Крышка с анимацией тряски */}
      <Animated.View style={[styles.lid, { transform: [{ translateY: lidOffset }] }]}>
        <Image
          source={require('../../assets/animation/krishka.png')}
          style={styles.lidImage}
          resizeMode="contain"
        />
      </Animated.View>
      {/* Пар с анимацией прозрачности */}
      <Animated.View style={[styles.steam, { opacity: steamOpacity }]}>
        <Image
          source={require('../../assets/animation/par.png')}
          style={styles.steamImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  kazan: {
    width: 180,
    height: 120,
    position: 'absolute',
  },
  lid: {
    position: 'absolute',
    top: -20, // Смещение крышки относительно казана
  },
  lidImage: {
    width: 100,
    height: 40,
  },
  steam: {
    position: 'absolute',
    top: -40, // Пар выше крышки
    right: -20, // Смещение вправо
  },
  steamImage: {
    width: 50,
    height: 50,
  },
});

export default ShakingLidAnimation;