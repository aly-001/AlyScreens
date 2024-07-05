import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F38181",
    "#A8D8EA",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const loadBooks = async (setBooks) => {
  try {
    const bookMetadata = await AsyncStorage.getItem("bookMetadata");
    if (bookMetadata) {
      setBooks(JSON.parse(bookMetadata));
    } else {
      const bookDir = FileSystem.documentDirectory + "books/";
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
      const bookFiles = await FileSystem.readDirectoryAsync(bookDir);
      const bookList = bookFiles.map((file) => ({
        uri: bookDir + file,
        name: file,
        title: file.replace(".epub", ""),
        subtitle: "Unknown Author",
        color: getRandomColor(),
        status: 0,
      }));
      setBooks(bookList);
      await AsyncStorage.setItem("bookMetadata", JSON.stringify(bookList));
    }
  } catch (error) {
    console.error("Error loading books:", error);
  }
};
