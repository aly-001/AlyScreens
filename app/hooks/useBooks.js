import { useState, useCallback, useEffect } from 'react';
import { loadBooks as loadBooksService, deleteBook as deleteBookService } from "../services/BookManager";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [bookStatus, setBookStatus] = useState(0);
  

  const loadBooks = useCallback(async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('bookMetadata');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      } else {
        const initialBooks = await loadBooksService();
        setBooks(initialBooks);
        await AsyncStorage.setItem('bookMetadata', JSON.stringify(initialBooks));
      }
    } catch (error) {
      console.error("useBooks: Error loading books:", error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = useCallback(async (newBook) => {
    try {
      const currentBooks = await AsyncStorage.getItem('bookMetadata');
      let updatedBooks = [];
      if (currentBooks) {
        updatedBooks = JSON.parse(currentBooks);
      }
      // Check if the book already exists
      const bookExists = updatedBooks.some(book => book.uri === newBook.uri);
      
      if (bookExists) {
        Alert.alert(
          "Duplicate Book",
          "This book is already in your library.",
          [{ text: "OK" }]
        );
        return false;
      }
      updatedBooks.push(newBook);
      await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
      return true;
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to add the book to your library. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  }, []);

  const updateBookStatus = useCallback(async (uri, status, cfi) => {
    console.log(`useBooks: Updating status for book ${uri} to ${status}`);
    setBookStatus(status);
    const updatedBooks = books.map(book => {
      if (book.uri === uri) {
        return { ...book, status, cfi };
      }
      return book;
    });
    setBooks(updatedBooks);
    try {
      await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("useBooks: Error saving updated book status to AsyncStorage:", error);
    }
  }, [books]);

  const getBookStatus = useCallback((uri) => {
    console.log(`useBooks: Getting status for book ${uri}`);
    const book = books.find(book => book.uri === uri);
    console.log("Status is", book ? book.status : 0);
    return book ? { status: book.status } : { status: 0 };
  }, [books]);

  const deleteBook = useCallback(async (uri) => {
    console.log(`useBooks: Deleting book ${uri}`);
    try {
      await deleteBookService(uri, setBooks);
      const updatedBooks = books.filter(book => book.uri !== uri);
      await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
      console.log("useBooks: Saved updated books (after deletion) to AsyncStorage");
    } catch (error) {
      console.error("useBooks: Error deleting book:", error);
      throw error;
    }
  }, [books]);

  // New function to get a book by its URI
  const getBookByUri = useCallback((uri) => {
    return books.find(book => book.uri === uri) || null;
  }, [books]);

  return { 
    books, 
    setBooks, 
    loadBooks, 
    addBook, 
    deleteBook, 
    updateBookStatus, 
    getBookStatus,
    getBookByUri,
  };
};