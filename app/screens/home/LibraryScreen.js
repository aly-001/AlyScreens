import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import colors from "../../config/colors";
import { useBooks } from "../../hooks/useBooks"; // Change this import to your hooks folder
import BookCoverThumb from "../../components/BookCoverThumb";
import Screen from "../../components/Screen";
import ScreenHeader from "../../components/ScreenHeader";
import layout from "../../config/layout";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LibraryScreen = () => {
  const navigation = useNavigation();
  const { books, addBook, deleteBook } = useBooks(); // Use the hook here

  const handleBookPress = (book) => {
    navigation.navigate("Read", {
      screen: "ReadScreen",
      params: {
        uri: book.uri,
        title: book.title,
        color: book.color,
        status: book.status,
      },
    });
  };

  const handleLongPress = (book) => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteBook(book.uri);
              Alert.alert("Success", "Book deleted successfully");
            } catch (error) {
              console.error("Failed to delete book:", error);
              Alert.alert("Error", "Failed to delete book");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const getRandomColor = () => {
    const bookColors = [
      "#D15A6C", "#708eb9", "#83947c", "#447a83", "#2ac0ec",
      "#697cea", "#c47b57", "#92926d", "#53aaac", "#C9A795",
      "#9cb9d1", "#9dc5b2", "#C59DB0", "#94b87b", "#A07BB8",
      "#ae898a", "#89AEAD", "#d2c6b9"
    ];
  
    const existingColors = books.map(book => book.color);
    const availableColors = bookColors.filter(color => !existingColors.includes(color));
  
    if (availableColors.length === 0) {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    } else {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      return availableColors[randomIndex];
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/epub+zip",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const sourceUri = result.assets[0].uri;
        const originalName = result.assets[0].name;
        const bookDir = FileSystem.documentDirectory + "books/";
        const destinationUri = bookDir + originalName;

        await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });
        
        const fileInfo = await FileSystem.getInfoAsync(destinationUri);
        if (!fileInfo.exists) {
          throw new Error("Failed to copy file to document directory");
        }

        const newBook = {
          uri: destinationUri,
          name: originalName,
          title: originalName.replace(".epub", ""),
          subtitle: "Unknown Author",
          color: getRandomColor(),
          status: 0,
        };
        const added = await addBook(newBook);
        if (added) {
          Alert.alert("Success", "EPUB file stored successfully");
        }
      } else {
        console.log("LibraryScreen: No file selected");
      }
    } catch (error) {
      console.error("LibraryScreen: Error uploading file:", error);
      Alert.alert("Error", "Failed to store EPUB file");
    }
  };

  return (
    <View style={styles.superContainer}>
      <Screen>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ScreenHeader text="Library" />
          </View>

          <View style={styles.booksContainerWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.booksContainer}>
                {books.map((book) => (
                  <TouchableOpacity
                    key={book.name}
                    onPress={() => handleBookPress(book)}
                    onLongPress={() => handleLongPress(book)}
                    delayLongPress={500}
                    style={styles.bookWrapper}
                  >
                    <BookCoverThumb
                      title={book.title}
                      subtitle={book.subtitle}
                      color={book.color}
                      status={book.status}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleUpload} style={styles.button}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>PDF support is coming soon!</Text> 
              <Text style={styles.footerText}>Currently only EPUBs work. Please ensure any file conversions comply with applicable copyright laws and terms of use.</Text>
            </View>
          </View>
        </View>
      </Screen>
    </View>
  );
};

const styles = StyleSheet.create({
  superContainer: {

    flex: 1,
    backgroundColor: colors.homeScreenBackground,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  booksContainerWrapper: {
    height: layout.margins.libraryScreen.maxScrollViewHeight,
  },
  scrollContent: {
    padding: 10,
    paddingVertical: 30,
  },
  booksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  bookWrapper: {
    margin: 5,
  },
  footerContainer: {
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'dodgerblue',
  },
  footerTextContainer: {
    paddingHorizontal: 45,
    marginTop: 10,
  },
  footerText: {
    opacity: 0.5,
  },
});

export default LibraryScreen;