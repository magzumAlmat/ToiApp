import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  Card,
  Button as PaperButton,
  Appbar,
  Caption,
  Title,
  Paragraph,
} from "react-native-paper";

const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Для хранения выбранного изображения
  const navigation = useNavigation();

   const BASE_URL = process.env.EXPO_PUBLIC_API_baseURL;
  //const BASE_URL= 'https://26d8-85-117-96-82.ngrok-free.app';

  const fetchFiles = async () => {
    console.log("Starting fetchFiles...");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/${item.type}/${item.id}/files`
      );
      console.log('RD',response.data)
      setFiles(response.data);
    } catch (err) {
      setError("Ошибка загрузки файлов: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const renderFileItem = ({ item: file }) => {
    const fileUrl = `${BASE_URL}/${file.path}`;
    console.log('fileUrl',fileUrl)

    if (file.mimetype.startsWith("image/")) {
      return (
        <Card style={styles.card}>
          <TouchableOpacity onPress={() => setSelectedImage(fileUrl)}>
            <Image source={{ uri: fileUrl }} style={styles.media} />
          </TouchableOpacity>
          <Card.Content>
            <Caption style={styles.caption}>{file.name}</Caption>
          </Card.Content>
        </Card>
      );
    } else if (file.mimetype === "video/mp4") {
      return (
        <Card style={styles.card}>
          <Video
            source={{ uri: fileUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <Card.Content>
            <Caption style={styles.caption}>{file.name}</Caption>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>Неподдерживаемый формат: {file.mimetype}</Paragraph>
          </Card.Content>
        </Card>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        {/* <Appbar.Content title="Детали" /> */}
      </Appbar.Header>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Item Details */}
        <Card style={styles.itemCard}>
          <Card.Cover source={{ uri: `${BASE_URL}/${files[0]?.path}` }} />
          <Card.Content>
            <Title style={styles.title}>{item.name || "Без названия"}</Title>
            <Paragraph style={styles.detail}>Тип: {item.type}</Paragraph>
            <Paragraph style={styles.detail}>
              Стоимость: {(item.cost || item.averageCost || 0)} ₸
            </Paragraph>
            {item.type === "restaurant" && (
              <>
                <Paragraph style={styles.detail}>
                  Вместимость: {item.capacity}
                </Paragraph>
                <Paragraph style={styles.detail}>Кухня: {item.cuisine}</Paragraph>
                <Paragraph style={styles.detail}>Адрес: {item.address}</Paragraph>
                <Paragraph style={styles.detail}>Телефон: {item.phone}</Paragraph>
                <Paragraph style={styles.detail}>Район: {item.district}</Paragraph>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Media Section */}
        <View style={styles.mediaSection}>
          <Title style={styles.subtitle}>Фото и видео:</Title>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : files.length > 0 ? (
            <FlatList
              data={files}
              renderItem={renderFileItem}
              keyExtractor={(file) => file.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaList}
            />
          ) : (
            <Paragraph style={styles.detail}>Файлы отсутствуют</Paragraph>
          )}
        </View>
      </ScrollView>

      {/* Modal for Zoomed Image */}
      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f5f5f5",
    width:'100%'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 2,
  },
  mediaSection: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    width: 200,
    marginRight: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  media: {
    width: "100%",
    height: 200,
  },
  video: {
    width: "100%",
    height: 200,
  },
  caption: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  error: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
  },
  mediaList: {
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default DetailsScreen;