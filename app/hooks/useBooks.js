import { useState, useCallback, useEffect } from 'react';
import { loadBooks as loadBooksService, deleteBook as deleteBookService } from "../services/BookManager";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useBooks = () => {
  const [books, setBooks] = useState([]);

  const loadBooks = useCallback(async () => {
    try {
      const storedBooks = await AsyncStorage.getItem('bookMetadata');
      if (storedBooks) {
        const storedBooksParsed = JSON.parse(storedBooks);
        setBooks(storedBooksParsed);
        storedBooksParsed.forEach((book) => {
        });
      } else {
        console.log("NULLNULLNULLNULLNULLNULLNULL")
      }
    } catch (error) {
      console.error("useBooks: Error loading books:", error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const addBook = useCallback(async (newBook) => {
    console.log("adding a new book");
    const updatedBooks = [...books, newBook];
    console.log("storing book inBookMetadata");
    await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
    console.log("Stored book in bookMetadata")
    setBooks(updatedBooks);
    console.log("calling loadBooks");
  }, [books]);

  const updateBookStatus = useCallback(async (uri, status, cfi) => {
    console.log("UPDATING STATUS YEAH!!")
    books.map(book => {console.log(book.title, book.status)})
    const updatedBooks = books.map(book => {
      if (book.uri === uri) {
        return { ...book, status, cfi };
      }
      return book;
    });
    setBooks(updatedBooks);
    await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
    updatedBooks.map((book) => {console.log(book.title,book.status)})
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