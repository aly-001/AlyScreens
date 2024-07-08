import React, { createContext, useState, useContext, useCallback } from 'react';
import { loadBooks as loadBooksService } from "../services/BookLoader";
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

  return (
    <BooksContext.Provider value={{ books, setBooks, loadBooks, addBook }}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);
