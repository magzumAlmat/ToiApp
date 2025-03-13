import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { Video } from "expo-av"; // Импортируем Video из expo-av
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const BASE_URL = "http://localhost:6666"; // Замените на ваш реальный IP-адрес сервера

  const fetchFiles = async () => {
    console.log("Starting fetchFiles...");
    console.log(`Item type: ${item.type}, Item ID: ${item.id}`);
    console.log(`Request URL: ${BASE_URL}/api/${item.type}/${item.id}/files`);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/${item.type}/${item.id}/files`
      );
      console.log("Fetch successful. Response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data, null, 2));
      setFiles(response.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      console.error("Error details:", err.response ? err.response.data : err);
      setError("Ошибка загрузки файлов: " + err.message);
    } finally {
      console.log("Fetch completed. Loading set to false.");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered. Fetching files...");
    fetchFiles();
  }, []);

  const renderFileItem = ({ item: file }) => {
    const fileUrl = `${BASE_URL}/${file.path}`;
    console.log(`Rendering file: ${file.id}`);
    console.log(`File name: ${file.name}, MIME type: ${file.mimetype}`);
    console.log(`File URL: ${fileUrl}`);

    if (file.mimetype.startsWith("image/")) {
      console.log("Rendering as image...");
      return (
        <Image
          source={{ uri: fileUrl }}
          style={styles.media}
          resizeMode="cover"
          onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          onLoad={() => console.log(`Image loaded: ${fileUrl}`)}
        />
      );
    } else if (file.mimetype === "video/mp4") {
      console.log("Rendering as video...");
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: fileUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
            onError={(e) => console.log("Video load error:", e)}
            onLoad={() => console.log(`Video loaded: ${fileUrl}`)}
            onPlaybackStatusUpdate={(status) =>
              console.log("Video playback status:", status)
            }
          />
        </View>
      );
    } else {
      console.log("Unsupported file type.");
      return <Text style={styles.detail}>Неподдерживаемый формат: {file.mimetype}</Text>;
    }
  };

  console.log("Rendering DetailsScreen...");
  console.log(`Current state - Loading: ${loading}, Error: ${error}, Files: ${files.length}`);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          console.log("Back button pressed.");
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{item.name || "Без названия"}</Text>
      <Text style={styles.detail}>Тип: {item.type}</Text>
      <Text style={styles.detail}>
        Стоимость: {(item.cost || item.averageCost || 0)} ₸
      </Text>

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

      <Text style={styles.subtitle}>Фото и видео:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : files.length > 0 ? (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(file) => {
            console.log(`Key extractor for file: ${file.id}`);
            return file.id;
          }}
          horizontal
          style={styles.mediaList}
        />
      ) : (
        <Text style={styles.detail}>Файлы отсутствуют</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  detail: { fontSize: 16, marginBottom: 10 },
  mediaList: { marginTop: 10 },
  media: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 5,
  },
  error: { fontSize: 16, color: "red", marginTop: 10 },
  videoContainer: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default DetailsScreen;