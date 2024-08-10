import React, { createContext, useState, useContext, useCallback } from 'react';
import { loadBooks as loadBooksService, deleteBook as deleteBookService } from "../services/BookManager";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const loadBooks = useCallback(() => {
    loadBooksService(setBooks);
  }, []);

  const addBook = useCallback(async (newBook) => {
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
  }, [books]);

  const updateBookStatus = useCallback(async (uri, status, cfi) => {
    const updatedBooks = books.map(book => {
      if (book.uri === uri) {
        return { ...book, status, cfi };
      }
      return book;
    });
    setBooks(updatedBooks);
    await AsyncStorage.setItem('bookMetadata', JSON.stringify(updatedBooks));
  }, [books]);

  const getBookStatus = useCallback((uri) => {
    const book = books.find(book => book.uri === uri);
    return book ? { status: book.status } : { status: 0};
  }
  , [books]);

  const deleteBook = useCallback(async (uri) => {
    try {
      await deleteBookService(uri, setBooks);
    } catch (error) {
      console.error("Error deleting book in context:", error);
      throw error; // Re-throw the error so the component can handle it
    }
  }, []);

  return (
    <BooksContext.Provider value={{ books, setBooks, loadBooks, addBook, deleteBook, updateBookStatus, getBookStatus }}>
      {children}
    </BooksContext.Provider>
  );
};


export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};