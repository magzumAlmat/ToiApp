import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Div, ThemeProvider, Image, Button } from 'react-native-magnus';
import { LogOut, Mail, Key, User } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login');
    }
  }, [token, navigation]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Div flex={1} bg="gray100">
          {/* Хедер с градиентом и анимацией */}
          <Animated.View entering={FadeInUp.duration(600)}>
            <Div
              bg="blue600"
              p="2xl"
              pb="4xl"
              roundedBottom="3xl"
              shadow="sm"
              shadowColor="gray900"
            >
              <Div row justifyContent="center" alignItems="center">
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }} // Замените на аватар пользователя
                  h={50}
                  w={50}
                  rounded="circle"
                  mr="md"
                />
                <Text fontSize="4xl" fontWeight="bold" color="white" textAlign="center">
                  Добро пожаловать!
                </Text>
              </Div>
              <Text
                fontSize="lg"
                color="blue200"
                textAlign="center"
                mt="sm"
                fontWeight="600"
              >
                {user?.roleId === 2 ? 'Поставщик' : 'Клиент'}
              </Text>
            </Div>
          </Animated.View>

          {/* Контент с карточкой */}
          <Div flex={1} justifyContent="center" px="lg">
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={{ marginTop: -30 }}
            >
              <Div
                bg="white"
                rounded="2xl"
                p="xl"
                shadow="md"
                shadowColor="gray400"
                w="100%"
              >
                {/* Информация о пользователе */}
                {user && (
                  <Div row alignItems="center" mb="lg">
                    <Mail size={24} color="#4B5563" mr="md" />
                    <Text fontSize="lg" color="gray700" fontWeight="500">
                      {user.email}
                    </Text>
                  </Div>
                )}
                {token ? (
                  <Div row alignItems="center" mb="xl">
                    <Key size={24} color="#4B5563" mr="md" />
                    <Text fontSize="lg" color="gray700" fontWeight="500">
                      {token.substring(0, 20)}...
                    </Text>
                  </Div>
                ) : (
                  <Text fontSize="lg" color="red500" mb="xl" textAlign="center">
                    Токен отсутствует
                  </Text>
                )}

                {/* Кнопка выхода */}
                <Button
                  block
                  bg="red600"
                  rounded="lg"
                  py="md"
                  shadow="sm"
                  shadowColor="gray900"
                  onPress={handleLogout}
                  prefix={<LogOut size={20} color="white" mr="sm" />}
                  fontSize="lg"
                  fontWeight="bold"
                  color="white"
                  underlayColor="red700"
                >
                  Выйти
                </Button>
              </Div>
            </Animated.View>
          </Div>
        </Div>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}