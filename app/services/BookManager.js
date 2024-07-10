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

export const deleteBook = async (uri, setBooks) => {
  try {
    // Get current book metadata
    const bookMetadata = await AsyncStorage.getItem("bookMetadata");
    if (!bookMetadata) {
      throw new Error("No book metadata found");
    }

    let books = JSON.parse(bookMetadata);

    // Find the book with the given URI
    const bookIndex = books.findIndex(book => book.uri === uri);
    if (bookIndex === -1) {
      throw new Error("Book not found");
    }

    // Delete the file from the file system
    await FileSystem.deleteAsync(uri, { idempotent: true });

    // Remove the book from the metadata
    books.splice(bookIndex, 1);

    // Update AsyncStorage
    await AsyncStorage.setItem("bookMetadata", JSON.stringify(books));

    // Update state
    setBooks(books);

    console.log(`Book deleted successfully: ${uri}`);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error; // Re-throw the error so the caller can handle it
  }
};